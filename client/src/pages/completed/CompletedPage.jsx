import React, { useState, useMemo } from "react";
import { CT_CLASSES, SORT_OPTIONS } from "../../assets/dummy";
import { useOutletContext } from "react-router-dom";
import { CheckCircle2, Filter } from "lucide-react";
import TaskItem from "../../components/dashboard/taskitem/TaskItem";

const CompletedPage = () => {
    const { tasks, refreshTasks } = useOutletContext();
    const [sortBy, setSortBy] = useState("newest");

    const sortedCompletedTasks = useMemo(() => {
        return tasks
            .filter((task) =>
                [true, 1, "yes"].includes(
                    typeof task.completed === "string"
                        ? task.completed.toLowerCase()
                        : task.completed
                )
            )
            .sort((a, b) => {
                switch (sortBy) {
                    case "newest":
                        return new Date(b.createdAt) - new Date(a.createdAt);
                    case "oldest":
                        return new Date(a.createdAt) - new Date(b.createdAt);
                    case "priority": {
                        const order = { high: 3, medium: 2, low: 1 };
                        return (
                            order[b.priority?.toLowerCase()] -
                            order[a.priority?.toLowerCase()]
                        );
                    }
                    default:
                        return 0;
                }
            });
    }, [tasks, sortBy]);

    return (
        <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="pt-6 pb-4 sm:pt-8 sm:pb-6">
                <div className="max-w-7xl mx-auto">
                    {/* Title Section */}
                    <div className="mb-6 sm:mb-8 mt-10">
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2 mb-2">
                            <CheckCircle2 className="text-purple-500 w-5 h-5 sm:w-6 sm:h-6" />
                            <span className="truncate">Completed Tasks</span>
                        </h1>
                        <p className="text-sm sm:text-base text-gray-500 ml-7">
                            {sortedCompletedTasks.length} task
                            {sortedCompletedTasks.length !== 1 && "s"} marked as completed
                        </p>
                    </div>

                    {/* Sort Controls - Tab Style */}
                    <div className="mb-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            {/* Sort Label */}
                            <div className="flex items-center gap-2 text-gray-700 font-medium">
                                <Filter className="w-4 h-4 text-purple-500" />
                                <span className="text-sm sm:text-base">Sort by:</span>
                            </div>

                            {/* Sort Buttons */}
                            <div className="flex gap-10 bg-gray-100 p-2 rounded-lg">
                                {SORT_OPTIONS.map((opt) => (
                                    <button
                                        key={opt.id}
                                        onClick={() => setSortBy(opt.id)}
                                        className={`flex items-center gap-2 px-4 py-3 rounded-lg text-md sm:text-base font-medium transition-all duration-200 min-w-[80px] justify-center ${
                                            sortBy === opt.id
                                                ? "bg-white text-purple-700 shadow-md border border-purple-200"
                                                : "text-gray-600 hover:text-purple-600 hover:bg-white/50"
                                        }`}
                                    >
                                        <span className="w-4 h-4 sm:w-5 sm:h-5">{opt.icon}</span>
                                        <span className="hidden xs:inline sm:inline">{opt.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tasks List */}
            <div className="max-w-7xl mx-auto pb-6">
                <div className="space-y-3 sm:space-y-4">
                    {sortedCompletedTasks.length === 0 ? (
                        <div className="text-center py-12 sm:py-16 bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
                            </div>
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                                No completed tasks yet!
                            </h3>
                            <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto px-4">
                                Complete tasks will appear here once you mark them as done.
                            </p>
                        </div>
                    ) : (
                        sortedCompletedTasks.map((task) => (
                            <div key={task._id || task.id} className="transform transition-all duration-200 hover:scale-[1.02]">
                                <TaskItem
                                    task={task}
                                    onRefresh={refreshTasks}
                                    showCompletedCheckbox={false}
                                    className="opacity-90 hover:opacity-100 transition-opacity duration-200 ease-in-out"
                                />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default CompletedPage;
