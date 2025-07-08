import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, LogOut, Settings, ChevronDown, Shuffle, Palette, X } from "lucide-react";
import logo from "../../../assets/brand-logo/logo-do-deck.png";

const Navbar = ({ user = {}, onLogout }) => {
    const menuref = useRef(null);
    const avatarPanelRef = useRef(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [avatarPanelOpen, setAvatarPanelOpen] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [avatarStyle, setAvatarStyle] = useState("animals");
    const navigate = useNavigate();

    // Generate dynamic avatar URL based on user data
    const generateAvatarUrl = (userData, style = "animals") => {
        if (userData.avatar && style === "custom") return userData.avatar;

        const name = userData.name || userData.username || "User";
        const email = userData.email || "";
        const seed = encodeURIComponent(name + email);

        const avatarStyles = {
            animals: [
                `https://api.dicebear.com/7.x/big-ears/svg?seed=${seed}&backgroundColor=c0392b,27ae60,2980b9,8e44ad,f39c12`,
                `https://api.dicebear.com/7.x/big-ears-neutral/svg?seed=${seed}&backgroundColor=gradient`,
                `https://avatars.dicebear.com/api/bottts/${seed}.svg?colors[]=amber&colors[]=blue&colors[]=green`,
            ],
            pixel: [
                `https://api.dicebear.com/7.x/pixel-art/svg?seed=${seed}&backgroundColor=gradient`,
                `https://api.dicebear.com/7.x/pixel-art-neutral/svg?seed=${seed}`,
                `https://avatars.dicebear.com/api/identicon/${seed}.svg?colors[]=green&colors[]=yellow`,
            ],
            characters: [
                `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${seed}`,
                `https://api.dicebear.com/7.x/thumbs/svg?seed=${seed}&backgroundColor=gradient`,
                `https://api.dicebear.com/7.x/shapes/svg?seed=${seed}&backgroundColor=gradient`,
            ],
            robots: [
                `https://robohash.org/${seed}?size=200x200&set=set1&bgset=bg1`,
                `https://robohash.org/${seed}?size=200x200&set=set2&bgset=bg2`,
                `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}&backgroundColor=gradient`,
            ],
            geometric: [
                `https://api.dicebear.com/7.x/identicon/svg?seed=${seed}&backgroundColor=gradient`,
                `https://api.dicebear.com/7.x/shapes/svg?seed=${seed}&backgroundColor=c0392b,27ae60,2980b9,8e44ad,f39c12`,
                `https://avatars.dicebear.com/api/jdenticon/${seed}.svg`,
            ],
            minimal: [
                `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=200&font-size=0.6&rounded=true&bold=true`,
                `https://api.dicebear.com/7.x/initials/svg?seed=${seed}&backgroundColor=gradient`,
                email ? `https://www.gravatar.com/avatar/${btoa(email.toLowerCase())}?s=200&d=identicon` : null,
            ].filter(Boolean),
        };

        const selectedStyle = avatarStyles[style] || avatarStyles.animals;
        const randomIndex = Math.floor(Math.random() * selectedStyle.length);
        return selectedStyle[randomIndex];
    };

    useEffect(() => {
        if (user && (user.name || user.email)) {
            const url = generateAvatarUrl(user, avatarStyle);
            setAvatarUrl(url);
        }
    }, [user, avatarStyle]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuref.current && !menuref.current.contains(event.target)) {
                setMenuOpen(false);
            }
            if (avatarPanelRef.current && !avatarPanelRef.current.contains(event.target)) {
                setAvatarPanelOpen(false);
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

    const handleAvatarError = () => {
        const styles = ["animals", "characters", "robots", "pixel", "geometric", "minimal"];
        const currentIndex = styles.indexOf(avatarStyle);
        const nextStyle = styles[(currentIndex + 1) % styles.length];
        const newUrl = generateAvatarUrl(user, nextStyle);
        setAvatarUrl(newUrl);
        setAvatarStyle(nextStyle);
    };

    const refreshAvatar = () => {
        const styles = ["animals", "characters", "robots", "pixel", "geometric", "minimal"];
        const randomStyle = styles[Math.floor(Math.random() * styles.length)];
        const newUrl = generateAvatarUrl(user, randomStyle);
        setAvatarUrl(newUrl);
        setAvatarStyle(randomStyle);
    };

    const changeAvatarStyle = (style) => {
        setAvatarStyle(style);
        const newUrl = generateAvatarUrl(user, style);
        setAvatarUrl(newUrl);
    };

    return (
        <>
            <header className="sticky top-0 z-50 backdrop-blur-md shadow-sm border-b border-gray-200 font-sans bg-white/90">
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
                            className="h-7 sm:h-12 md:h-16 lg:h-10 transition-transform duration-300 transform group-hover:scale-105"
                        />
                        {/* Brand name - Updated to green/yellow theme */}
                        <span className="hidden xs:block text-lg sm:text-xl md:text-2xl font-extrabold bg-gradient-to-r from-green-500 via-yellow-500 to-lime-500 bg-clip-text text-transparent tracking-wide">
                            TaskFlow
                        </span>
                    </div>

                    {/* Right side */}
                    <div>
                        <nav className="flex items-center gap-2 sm:gap-4">
                            {/* Avatar Style Button */}
                            <button
                                className="hidden sm:block p-2 text-gray-600 hover:text-green-500 transition-colors duration-300 hover:bg-green-50 rounded-full"
                                onClick={() => setAvatarPanelOpen(true)}
                                title="Change Avatar Style"
                            >
                                <Palette className="w-5 h-5 md:w-6 md:h-6" />
                            </button>

                            {/* Settings Button - Hide on mobile */}
                            <button
                                className="hidden sm:block p-2 text-gray-600 hover:text-green-500 transition-colors duration-300 hover:bg-green-50 rounded-full"
                                onClick={() => navigate("/profile")}
                            >
                                <Settings className="w-5 h-5 md:w-6 md:h-6" />
                            </button>

                            {/* User Dropdown */}
                            <div ref={menuref} className="relative">
                                <button
                                    onClick={handleMenuToggle}
                                    className="flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-3 sm:py-2 rounded-full cursor-pointer hover:bg-green-50 transition-colors duration-300 border-transparent hover:border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <div className="relative">
                                        {avatarUrl ? (
                                            <img
                                                src={avatarUrl}
                                                alt="User Avatar"
                                                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full shadow-sm object-cover border-2 border-white ring-2 ring-green-100"
                                                onError={handleAvatarError}
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-yellow-500 text-white font-semibold shadow-md text-sm sm:text-base border-2 border-white">
                                                {user.name?.[0]?.toUpperCase() ||
                                                    user.email?.[0]?.toUpperCase() ||
                                                    "🐨"}
                                            </div>
                                        )}
                                        {/* Online indicator */}
                                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                                    </div>

                                    {/* User info - Hide on mobile */}
                                    <div className="hidden sm:flex flex-col items-start ml-2">
                                        <span className="text-sm font-medium text-gray-800 max-w-24 md:max-w-32 truncate">
                                            {user.name || user.username || "User"}
                                        </span>
                                        <span className="text-xs text-gray-500 max-w-24 md:max-w-32 truncate">
                                            {user.email || "user@example.com"}
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
                                    <ul className="absolute top-12 sm:top-14 right-0 w-52 sm:w-56 bg-white rounded-2xl shadow-xl border border-green-100 z-50 overflow-hidden animate-fadeIn">
                                        {/* Mobile-only: User info */}
                                        <li className="block sm:hidden p-3 border-b border-gray-100">
                                            <div className="flex items-center gap-3">
                                                {avatarUrl ? (
                                                    <img
                                                        src={avatarUrl}
                                                        alt="User Avatar"
                                                        className="w-10 h-10 rounded-full object-cover border-2 border-green-100"
                                                        onError={handleAvatarError}
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-yellow-500 text-white font-semibold">
                                                        🐨
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-sm font-medium text-gray-800">
                                                        {user.name || user.username || "User"}
                                                    </p>
                                                    <p className="text-xs text-gray-500 truncate">
                                                        {user.email || "No email"}
                                                    </p>
                                                </div>
                                            </div>
                                        </li>

                                        {/* Avatar Style - Mobile Only */}
                                        <li className="block sm:hidden p-2">
                                            <button
                                                onClick={() => {
                                                    setMenuOpen(false);
                                                    setAvatarPanelOpen(true);
                                                }}
                                                className="w-full px-4 py-2.5 text-left hover:bg-green-50 text-sm text-gray-700 transition-colors flex items-center gap-3 group rounded-lg"
                                                role="menuitem"
                                            >
                                                <Palette className="w-4 h-4 text-gray-700 group-hover:text-green-600" />
                                                Change Avatar
                                            </button>
                                        </li>

                                        {/* Profile Settings */}
                                        <li className="p-2">
                                            <button
                                                onClick={() => {
                                                    setMenuOpen(false);
                                                    navigate("/profile");
                                                }}
                                                className="w-full px-4 py-2.5 text-left hover:bg-green-50 text-sm text-gray-700 transition-colors flex items-center gap-3 group rounded-lg"
                                                role="menuitem"
                                            >
                                                <Settings className="w-4 h-4 text-gray-700 group-hover:text-green-600" />
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

            {/* Avatar Selection Panel */}
            {avatarPanelOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                    <div
                        ref={avatarPanelRef}
                        className="bg-white rounded-2xl shadow-2xl border border-green-100 w-full max-w-md mx-auto animate-fadeIn"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <Palette className="w-5 h-5 text-green-500" />
                                Choose Avatar Style
                            </h3>
                            <button
                                onClick={() => setAvatarPanelOpen(false)}
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Current Avatar Preview */}
                        <div className="p-4 border-b border-gray-100 text-center">
                            <div className="w-20 h-20 mx-auto mb-3">
                                {avatarUrl ? (
                                    <img
                                        src={avatarUrl}
                                        alt="Current Avatar"
                                        className="w-full h-full rounded-full object-cover border-4 border-green-100"
                                        onError={handleAvatarError}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-yellow-500 text-white text-2xl border-4 border-green-100">
                                        🐨
                                    </div>
                                )}
                            </div>
                            <p className="text-sm text-gray-600">
                                Current: {avatarStyle.charAt(0).toUpperCase() + avatarStyle.slice(1)}
                            </p>
                        </div>

                        {/* Avatar Styles Grid */}
                        <div className="p-4">
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                {/*
                                    Avatar styles data
                                */}
                                {[
                                    { key: "animals", icon: "🐨", name: "Animals", desc: "Cute creatures" },
                                    { key: "robots", icon: "🤖", name: "Robots", desc: "Tech vibes" },
                                    { key: "pixel", icon: "🎮", name: "Pixel Art", desc: "Retro style" },
                                    { key: "characters", icon: "😊", name: "Characters", desc: "Fun faces" },
                                    { key: "geometric", icon: "🔷", name: "Geometric", desc: "Abstract art" },
                                    { key: "minimal", icon: "⚪", name: "Minimal", desc: "Clean & simple" },
                                ].map((style) => (
                                    <button
                                        key={style.key}
                                        onClick={() => changeAvatarStyle(style.key)}
                                        className={`p-3 rounded-xl text-left transition-all duration-200 border-2 ${
                                            avatarStyle === style.key
                                                ? "bg-green-50 border-green-200 shadow-md"
                                                : "bg-gray-50 border-transparent hover:bg-green-50 hover:border-green-100"
                                        }`}
                                    >
                                        <div className="text-2xl mb-2">{style.icon}</div>
                                        <div className="text-sm font-medium text-gray-800">{style.name}</div>
                                        <div className="text-xs text-gray-500">{style.desc}</div>
                                    </button>
                                ))}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                <button
                                    onClick={refreshAvatar}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                                >
                                    <Shuffle className="w-4 h-4" />
                                    Random
                                </button>
                                <button
                                    onClick={() => setAvatarPanelOpen(false)}
                                    className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-yellow-500 text-white rounded-lg hover:from-green-600 hover:to-yellow-600 transition-all text-sm font-medium"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
