import Task from "../models/taskModel.js";

//create a new task
export const createTask = async (req, res) => {
    try {
        const { title, description, priority, dueDate, completed } = req.body;
        const task = new Task({
            title,
            description,
            priority,
            dueDate,
            completed: completed === "Yes" || completed === "true",
            owner: req.user._id,
        });
        const saved = await task.save();
        res.status(201).json({
            status: "success",
            data: {
                task: saved
            },
        });
    } catch (err) {
        res.status(400).json({
            status: "false",
            message: err.message,
        });
    }
};

//get all task for logged in user
export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ owner: req.user.id }).sort({
            createdAt: -1,
        });
        res.json({
            success: true,
            tasks,
        });
    } catch (err) {
        res.status(500).json({
            status: "false",
            message: err.message,
        });
    }
};

// get single task by ID(must belon to particular user)
export const getTaskById = async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            owner: req.user.id,
        });
        if (!task) {
            return res.status(400).json({
                success: false,
                message: "Task not found",
            });
        }
    } catch (err) {
        res.status(500).json({
            status: "false",
            message: err.message,
        });
    }
};

//update a task by ID
export const updateTask = async (req, res) => {
    try {
        const data = { ...req.body };
        if (data.completed !== undefined) {
            data.completed = data.completed === "Yes";
        }

        const updated = await Task.findOneAndUpdate(
            { _id: req.params.id, owner: req.user.id },
            data,
            { new: true, runValidators: true }
        );

        if (!updated)
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        res.json({
            success: true,
            task: updated,
        });
    } catch (err) {
        res.status(400).json({
            status: "false",
            message: err.message,
        });
    }
};

//delete a task function

export const deleteTask = async (req, res) => {
    try {
        const deleted = await Task.findOneAndDelete({
            _id: req.params.id,
            owner: req.user.id,
        });
        if (!deleted)
            return res.status(404).json({
                success: false,
                message: "Task not found or not yours",
            });
        res.json({ success: true, message: "Task deleted succcessfully." });
    } catch (err) {
        res.status(500).json({
            status: "false",
            message: err.message,
        });
    }
};
