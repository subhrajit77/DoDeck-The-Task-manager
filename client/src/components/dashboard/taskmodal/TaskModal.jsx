import React, { useState, useEffect, useCallback } from "react";
import {
    baseControlClasses,
    DEFAULT_TASK,
    priorityStyles,
} from "../../../assets/dummy";
import {
    AlignLeft,
    PlusCircle,
    X,
    Flag,
    Calendar,
    CheckCircle,
    Save,
} from "lucide-react";
import { toast } from "react-toastify";

const API_BASE = "http://localhost:4000/api/tasks";

const TaskModal = ({ isOpen, onClose, taskToEdit, onSave, onLogout }) => {
    const [taskData, setTaskData] = useState(DEFAULT_TASK);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const today = new Date().toISOString().split("T")[0];

    useEffect(() => {
        if (!isOpen) return;
        if (taskToEdit) {
            const normalized =
                taskToEdit.completed === "Yes" ||
                taskToEdit.completed === "true"
                    ? "Yes"
                    : "No";
            setTaskData({
                ...DEFAULT_TASK,
                title: taskToEdit.title || "",
                description: taskToEdit.description || "",
                priority: taskToEdit.priority || "Low",
                dueDate: taskToEdit.dueDate
                    ? taskToEdit.dueDate.split("T")[0]
                    : "",
                completed: normalized,
                id: taskToEdit.id,
            });
        } else {
            setTaskData(DEFAULT_TASK);
        }
        setError(null);
    }, [isOpen, taskToEdit]);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setTaskData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }, []);

    const getHeaders = useCallback(() => {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");
        return {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        };
    }, []);

    const handleSubmit = useCallback(
        async (e) => {
            e.preventDefault();
            if (taskData.dueDate < today) {
                setError("Due date cannot be in the past.");
                return;
            }
            setLoading(true);
            setError(null);

            try {
                const isEdit = Boolean(taskData.id);
                const url = isEdit
                    ? `${API_BASE}/${taskData.id}/gp`
                    : `${API_BASE}/gp`;
                const resp = await fetch(url, {
                    method: isEdit ? "PUT" : "POST",
                    headers: getHeaders(),
                    body: JSON.stringify(taskData),
                });

                if (!resp.ok) {
                    if (resp.status === 401) {
                        onLogout?.();
                        const err = await resp.json();
                        throw new Error(err.message || "Failed to save task.");
                    }
                    throw new Error("Failed to saveeeeeeeee task.");
                }
                // const saved = await resp.json();
                // onSave?.(saved);
                // onClose();
                const saved = await resp.json();
                onSave?.(saved);
                toast.success(
                    taskData.id
                        ? "Task updated successfully!"
                        : "Task created successfully!"
                );
                onClose();
            } catch (err) {
                console.error(err);
                setError(err.message || "Unexpected error occurred.");
            } finally {
                setLoading(false);
            }
        },
        [taskData, today, getHeaders, onLogout, onSave, onClose]
    );

    if(!isOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/20 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-50 border border-purple-100 rounded-xl max-w-md-full p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className=" text-2xl font-bold text-gray-800 flex items-center gap-2">
                        {taskData.id ? (
                            <Save className="text-purple-500 w-5 h-5" />
                        ) : (
                            <PlusCircle className="text-purple-500 w-5 h-5" />
                        )}
                        {taskData.id ? "Edit Task" : "Add New Task"}
                    </h2>

                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-purple-100 rounded-lg transition-colors text-gray-500 hover:text-purple-700"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                {/* form to fill details to create tasks */}
                <form onSubmit={handleSubmit} className=" space-y-4">
                    {error && (
                        <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
                            {error}
                        </div>
                    )}
                    <div>
                        <label className=" block text-sm font-medium text-gray-700">
                            Title
                        </label>
                        <div
                            className=" flex items-center border rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-purple-500
                        focus-within:border-purple-500 transition-all duration-200"
                        >
                            <input
                                type="text"
                                name="title"
                                required
                                value={taskData.title}
                                onChange={handleChange}
                                className="w-full focus-outline text-sm"
                                placeholder="Enter task title"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
                            <AlignLeft className="w-4 h-4 text-purple-500" />{" "}
                            Description
                        </label>
                        <textarea
                            name="description"
                            rows="3"
                            value={taskData.description}
                            onChange={handleChange}
                            className={baseControlClasses}
                            placeholder="Add details about your task"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className=" flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
                                <Flag className="w-4 h-4 text-purple-500" />{" "}
                                Priority
                            </label>
                            <select
                                name="priority"
                                value={taskData.priority}
                                onChange={handleChange}
                                className={`${baseControlClasses} ${
                                    priorityStyles[taskData.priority]
                                }`}
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                        <div>
                            <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
                                <Calendar className="w-4 h-4 text-purple-500" />{" "}
                                Due Date
                            </label>
                            <input
                                type="date"
                                name="dueDate"
                                required
                                min={today}
                                value={taskData.dueDate}
                                onChange={handleChange}
                                className={baseControlClasses}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-2">
                            <CheckCircle className="w-4 h-4 text-purple-500" />{" "}
                            Status
                        </label>
                        <div className="flex gap-4">
                            {[
                                { val: "Yes", label: "Completed" },
                                { val: "No", label: "Pending" },
                            ].map((item) => (
                                <label
                                    key={item.val}
                                    className="flex items-center"
                                >
                                    <input
                                        type="radio"
                                        name="completed"
                                        value={item.val}
                                        className="h-4 w-4 text-purple-500 focus:ring-purple-500 border-gray-300 rounded"
                                        checked={
                                            taskData.completed === item.val
                                        }
                                        onChange={handleChange}
                                    />
                                    <span className="ml-2 text-sm text-gray-700">
                                        {item.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-fuchsia-500 to-purple-600 py-2.5 px-4 rounded-lg text-white font-semibold transition-colors"
                    >
                        {loading ? (
                            "Saving..."
                        ) : taskData.id ? (
                            <>
                                <Save className="inline w-4 h-4 mr-2" />
                                Update tasks
                            </>
                        ) : (
                            <>
                                <PlusCircle className="inline w-4 h-4 mr-2" />
                                Create Task
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;
