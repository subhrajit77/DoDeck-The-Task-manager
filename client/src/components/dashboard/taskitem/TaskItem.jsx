import React, { useEffect, useState } from "react";
import {
    getPriorityBadgeColor,
    TI_CLASSES,
    getPriorityColor,
    BUTTONCLASSES,
    MENU_OPTIONS,
} from "../../../assets/dummy";
import { CheckCircle2, MoreVertical } from "lucide-react";
import axios from "axios";

const API_BASE = "http://localhost:4000/api/tasks";

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

    return (
        <div className={`${TI_CLASSES.wrapper} ${borderColor}`}>
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
                                        className="w-full px-3 sm:px-4 py-2 text-left texxt-xs sm:text-sm hover: bg-purple-50 flex items-centergap-2 transition-colors duration-200"
                                    >
                                        {opt.icon}
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskItem;
