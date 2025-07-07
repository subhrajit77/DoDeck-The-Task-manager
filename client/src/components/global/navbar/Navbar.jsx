import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, LogOut, Settings, ChevronDown } from "lucide-react";
import logo from "../../../assets/brand-logo/do-deck-logo.png";

const Navbar = ({ user = {}, onLogout }) => {
    const menuref = useRef(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuref.current && !menuref.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleMenuToggle = () => setMenuOpen((prev) => !prev);

    const handleLogout = () => {
        setMenuOpen(false);
        onLogout();
    };

    return (
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200 font-sans">
            <div className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 md:px-6 max-w-7xl mx-auto">
                {/* Logo and Brand */}
                <div
                    className="flex items-center gap-1 sm:gap-2 cursor-pointer group"
                    onClick={() => navigate("/")}
                >
                    {/* Logo */}
                    <img
                        src={logo}
                        alt="TaskFlow Logo"
                        className="h-10 sm:h-12 md:h-16 lg:h-15 shadow-sm transition-transform duration-300 transform group-hover:scale-105"
                    />
                    {/* Brand name - Hide on very small screens */}
                    <span className="hidden xs:block text-lg sm:text-xl md:text-2xl font-extrabold bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent tracking-wide">
                        TaskFlow
                    </span>
                </div>

                {/* Right side */}
                <div>
                    <nav className="flex items-center gap-2 sm:gap-4">
                        {/* Settings Button - Hide on mobile */}
                        <button
                            className="hidden sm:block p-2 text-gray-600 hover:text-purple-500 transition-colors duration-300 hover:bg-purple-50 rounded-full"
                            onClick={() => navigate("/profile")}
                        >
                            <Settings className="w-5 h-5 md:w-6 md:h-6" />
                        </button>

                        {/* User Dropdown */}
                        <div ref={menuref} className="relative">
                            <button
                                onClick={handleMenuToggle}
                                className="flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-3 sm:py-2 rounded-full cursor-pointer hover:bg-purple-50 transition-colors duration-300 border-transparent hover:border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <div className="relative">
                                    {user.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt="User Avatar"
                                            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full shadow-sm"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white font-semibold shadow-md text-sm sm:text-base">
                                            {user.name?.[0]?.toUpperCase() || "U"}
                                        </div>
                                    )}
                                    {/* Online indicator */}
                                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                                </div>

                                {/* User info - Hide on mobile */}
                                <div className="hidden sm:flex flex-col items-start ml-2">
                                    <span className="text-sm font-medium text-gray-800 max-w-24 md:max-w-32 truncate">
                                        {user.name}
                                    </span>
                                </div>

                                <ChevronDown
                                    className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-500 transition-transform duration-300 ${
                                        menuOpen ? "rotate-180" : ""
                                    }`}
                                />
                            </button>

                            {/* Dropdown Menu */}
                            {menuOpen && (
                                <ul className="absolute top-12 sm:top-14 right-0 w-52 sm:w-56 bg-white rounded-2xl shadow-xl border border-purple-100 z-50 overflow-hidden animate-fadeIn">
                                    {/* Mobile-only: User info */}
                                    <li className="block sm:hidden p-3 border-b border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white font-semibold">
                                                {user.name?.[0]?.toUpperCase() || "U"}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">
                                                    {user.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </li>

                                    {/* Profile Settings */}
                                    <li className="p-2">
                                        <button
                                            onClick={() => {
                                                setMenuOpen(false);
                                                navigate("/profile");
                                            }}
                                            className="w-full px-4 py-2.5 text-left hover:bg-purple-50 text-sm text-gray-700 transition-colors flex items-center gap-3 group rounded-lg"
                                            role="menuitem"
                                        >
                                            <Settings className="w-4 h-4 text-gray-700" />
                                            Profile Settings
                                        </button>
                                    </li>

                                    {/* Logout */}
                                    <li className="p-2">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full px-4 py-2.5 hover:bg-red-50 text-sm text-red-600 flex items-center gap-3 group rounded-lg"
                                            role="menuitem"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            )}
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
