import React from "react";
import { useNavigate } from "react-router-dom";
import { Zap } from "lucide-react";

const Navbar = () => {
    const navigate = useNavigate();

    return (
        <div>
            <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200 font-sans">
                <div className="flex items-center justify-between px-4 py-3 md:px-6 max-w-7xl mx-auto">
                    <div
                        className="flex items-center gap-2 cursor-pointer group"
                        onClick={() => navigate("/")}
                    >
                        <div className="relative w-10 h-10 flex items-center rounded-xl bg-gradient-to-br from-fuchsia-500 via-purple-500 to-indigo-500 shadow-lg group-hover: shadow-purple-300/50 group-hover: scale-105 transition-all duration-300">
                            <Zap className="w-9 h-6 text-white" />
                            <div className="absolute -bottom-1 -middle-1 w-3 h-3 bg-white rounded-full shadow-md animate-ping"></div>
                        </div>
                        <span className="text-2xl font-extrabold bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent tracking-wide">
                            MyApp
                        </span>
                    </div>
                </div>
            </header>
        </div>
    );
};

export default Navbar;
