import { ListChecks, Filter, Layout, Plus, Clock } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { layoutClasses, SORT_OPTIONS } from "../../assets/dummy";
import TaskItem from "../../components/dashboard/taskitem/TaskItem";
import TaskModal from "../../components/dashboard/taskmodal/TaskModal";

const API_BASE = "http://localhost:4000/api/tasks";

const PendingPage = () => {
    const { tasks = [], refreshTasks } = useOutletContext();
    const [sortBy, setSortby] = useState("newest");
    const [selectedTask, setSelectedTasks] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const getHeaders = () => {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No auth token found in localStorage");

        return {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        };
    };

    const sortedPendingTasks = useMemo(() => {
        const filtered = tasks.filter(
            (t) =>
                !t.completed ||
                (typeof t.completed === "string" &&
                    t.completed.toLowerCase() === "no")
        );
        return filtered.sort((a, b) => {
            if (sortBy === "newest")
                return new Date(b.createdAt) - new Date(a.createdAt);
            if (sortBy === "oldest")
                return new Date(a.createdAt) - new Date(b.createdAt);
            const order = { high: 3, medium: 2, low: 1 };
            return (
                order[b.priority.toLowerCase()] -
                order[a.priority.toLowerCase()]
            );
        });
    }, [tasks, sortBy]);

    return (
        <div className={layoutClasses.container}>
            <div className="mb-6">
                <div className="flex items justify-right flex-wrap mt-12">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                            <ListChecks className=" text-purple-500" /> Pending
                            Tasks
                        </h1>
                        <p className=" text-gray-500 mt-1 ml-7">
                            {sortedPendingTasks.length} Task
                            {sortedPendingTasks.length !== 1 && "s"} needing
                            your attention
                        </p>
                    </div>
                    <div className="mt-6 md:mt-0 flex flex-col gap-3 bg-white border border-gray-200 rounded-lg px-5 py-4 shadow-sm w-full md:w-auto">
                        <div className="flex items-center gap-2 text-gray-700 font-medium mb-1">
                            <Filter className="w-5 h-5 text-purple-500" />
                            <span className="text-sm">Sort by:</span>
                        </div>
                        <div className="flex gap-2">
                            {SORT_OPTIONS.map((opt) => (
                                <button
                                    key={opt.id}
                                    onClick={() => setSortby(opt.id)}
                                    className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                        sortBy === opt.id
                                            ? "bg-purple-100 text-purple-700"
                                            : "bg-gray-100 text-gray-600 hover:bg-purple-50"
                                    }`}
                                >
                                    {opt.icon}
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div
                className={layoutClasses.addBox}
                onClick={() => setShowModal(true)}
            >
                <div className="flex items-center justify-center gap-3 text-gray-500 group-hover:text-purple-600 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200">
                        <Plus className=" text-purple-500" size={18} />
                    </div>
                    <span className="font-medium">Add New Task</span>
                </div>
            </div>
            <div className="space-y-4">
                {sortedPendingTasks.length === 0 ? (
                    <div className={layoutClasses.emptyState}>
                        <div className="max-w-xs mx-auto py-6 text-center">
                            <div className={layoutClasses.emptyIconbg + " flex items-center justify-center mx-auto mb-4"}>
                                <Clock className="w-8 h-8 text-purple-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                All caught up!
                            </h3>
                            <p className="text-gray-500 text-sm mb-4">
                                No pending tasks. Great Work!
                            </p>
                            <button
                                onClick={() => setShowModal(true)}
                                className={layoutClasses.emptyBtn}
                            >
                                Create New Task
                            </button>
                        </div>
                    </div>
                ) : (
                    sortedPendingTasks.map((task) => (
                        <TaskItem
                            key={task._id || task.id}
                            task={task}
                            showCompletedCheckbox
                            onDelete={() =>
                                handleDeleteTask(task._id || task.id)
                            }
                            onToggleComplete={() =>
                                handleToglleComplete(
                                    task._id || task.id,
                                    t.completed
                                )
                            }
                            onEdit={() => {
                                setSelectedTasks(task);
                                setShowModal(true);
                            }}
                            onRefresh={refreshTasks}
                        />
                    ))
                )}
            </div>

            <TaskModal
                isOpen={!!selectedTask || showModal}
                onClose={() => {
                    setShowModal(false);
                    setSelectedTasks(null);
                    refreshTasks();
                }}
                taskToEdit={selectedTask}
            />
        </div>
    );
};

export default PendingPage;
