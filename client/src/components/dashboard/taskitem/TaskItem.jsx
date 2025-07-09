import React, { useEffect, useState } from "react";
import {
    getPriorityBadgeColor,
    TI_CLASSES,
    getPriorityColor,
    BUTTONCLASSES,
    MENU_OPTIONS,
} from "../../../assets/dummy";
import TaskModal from "../taskmodal/TaskModal";
import { CheckCircle2, MoreVertical, Calendar, Clock } from "lucide-react";
import axios from "axios";
import { isToday, format } from "date-fns";

const API_BASE = "https://dodeck-the-task-manager-backend.onrender.com/api/tasks";

const TaskItem = ({
    task,
    onRefresh,
    onLogout,
    showCompletedCheckbox = true,
}) => {
    const [showMenu, setShowMenu] = useState(false);
    const [isCompleted, setIsCompleted] = useState(
        [true, 1, "yes"].includes(
            typeof task.completed === "string"
                ? task.completed.toLowerCase()
                : task.completed
        )
    );
    const [showEditModal, setShowEditModal] = useState(false);
    const [subtasks, setSubtasks] = useState(task.subtasks || []);

    useEffect(() => {
        setIsCompleted(
            [true, 1, "yes"].includes(
                typeof task.completed === "string"
                    ? task.completed.toLowerCase()
                    : task.completed
            )
        );
    }, [task.completed]);

    const getAuthHeaders = () => {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No auth token found in localStorage");

        return {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        };
    };

    const borderColor = isCompleted
        ? "border-green-500"
        : getPriorityColor(task.priority).split(" ")[0];

    const progress = subtasks.length
        ? (subtasks.filter((st) => st.completed).length / subtasks.length) * 100
        : 0;

    const handleComplete = async () => {
        const newStatus = !isCompleted ? "Yes" : "No";
        try {
            await axios.put(
                `${API_BASE}/${task._id}/gp`,
                {
                    completed: newStatus,
                },
                {
                    headers: getAuthHeaders(),
                }
            );
            setIsCompleted(!isCompleted);
            onRefresh?.();
        } catch (err) {
            console.error(err);
            if (err.response?.status === 401) {
                onLogout?.();
            } else {
                alert("Failed to update task status");
            }
        }
    };

    const handleAction = (action) => {
        setShowMenu(false);
        if (action === "edit") setShowEditModal(true);
        if (action === "delete") handleDelete();
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${API_BASE}/${task._id}/gp`, {
                headers: getAuthHeaders(),
            });
            onRefresh?.();
        } catch (err) {
            console.error(err);
            if (err.response?.status === 401) {
                onLogout?.();
            } else {
                alert("Failed to delete task");
            }
        }
    };

    const handleSave = async (updatedTask) => {
        try {
            const payload = (({
                title,
                description,
                priority,
                dueDate,
                completed,
            }) => ({ title, description, priority, dueDate, completed }))(
                updatedTask
            );
            await axios.put(`${API_BASE}/${task._id}/gp`, payload, {
                headers: getAuthHeaders(),
            });
            setShowEditModal(false);
            onRefresh?.();
        } catch (err) {
            console.error(err);
            if (err.response?.status === 401) {
                onLogout?.();
            } else {
                alert("Failed to update task");
            }
        }
    };

    return (
        <div className={`${TI_CLASSES.wrapper} ${borderColor} `}>
            <div className={TI_CLASSES.leftContainer}>
                {showCompletedCheckbox && (
                    <button
                        onClick={handleComplete}
                        className={`${TI_CLASSES.completeBtn} ${
                            isCompleted ? "text-green-500" : "text-gray-300"
                        }`}
                    >
                        <CheckCircle2
                            size={18}
                            className={`${TI_CLASSES.checkboxIconBase} ${
                                isCompleted ? "fill-green-500" : ""
                            }`}
                        />
                    </button>
                )}
                <div className=" flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                        <h3
                            className={`${TI_CLASSES.titleBase} ${
                                isCompleted
                                    ? "line-through text-gray-500"
                                    : " text-gray-800"
                            }`}
                        >
                            {task.title}
                        </h3>
                        <span
                            className={`${
                                TI_CLASSES.priorityBadge
                            } ${getPriorityBadgeColor(task.priority)}`}
                        >
                            {task.priority}
                        </span>
                    </div>
                    {task.description && (
                        <p className={TI_CLASSES.description}>
                            {task.description}
                        </p>
                    )}
                </div>
            </div>
            <div>
                <div className={TI_CLASSES.rightContainer}>
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className={TI_CLASSES.menuButton}
                        >
                            <MoreVertical
                                className="w-4 h-4 sm:w-5 sm:-5"
                                size={18}
                            />
                        </button>
                        {showMenu && (
                            <div className={TI_CLASSES.menuDropdown}>
                                {MENU_OPTIONS.map((opt) => (
                                    <button
                                        key={opt.action}
                                        onClick={() => handleAction(opt.action)}
                                        className="w-full p-5 cursor- pointer sm:px-4 py-2 text-left text-s sm:text-sm hover: bg-purple-50 flex items-center gap-2 transition-colors duration-200"
                                    >
                                        {opt.icon}
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <div
                        className={`${TI_CLASSES.dateRow} ${
                            task.dueDate && isToday(new Date(task.dueDate))
                                ? "text-fuchsia-600"
                                : "text-gray-500"
                        }`}
                    >
                        <Calendar className="w-3.5 h-3.5" />
                        {task.dueDate
                            ? isToday(new Date(task.dueDate))
                                ? "Today"
                                : format(new Date(task.dueDate), "MMM dd")
                            : "-"}
                    </div>

                    <div className={TI_CLASSES.createdRow}>
                        <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        {task.createdAt
                            ? `Created ${format(
                                  new Date(task.createdAt),
                                  "MMM dd"
                              )}`
                            : "No date"}
                    </div>
                </div>
            </div>
            <TaskModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                taskToEdit={task}
                onSave={handleSave}
            />
        </div>
    );
};

export default TaskItem;
