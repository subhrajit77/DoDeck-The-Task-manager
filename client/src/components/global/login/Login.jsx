import { LogIn, User, Eye, EyeOff } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import {
    FIELDS,
    BUTTON_CLASSES,
    INPUTWRAPPER,
} from "../../../assets/dummy.jsx";

const INITIAL_FORM = {
    email: "",
    password: "",
};

const Login = ({ onSubmit, onSwitchMode }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(INITIAL_FORM);
    const [rememberMe, setRememberMe] = useState(false);

    const navigate = useNavigate();
    const url = "https://dodeck-the-task-manager-backend.onrender.com/";

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (token) {
            (async () => {
                try {
                    const { data } = await axios.get(`${url}api/user/me`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (data.success) {
                        onSubmit?.({ token, userId, ...data.user });
                        toast.success(
                            "Session restored successfully! Redirecting..."
                        );
                        navigate("/");
                    } else {
                        localStorage.clear();
                    }
                } catch {
                    localStorage.clear();
                }
            })();
        }
    }, [navigate, onSubmit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!rememberMe) {
            toast.error("Please check the remember me option to proceed");
            return;
        }
        setLoading(true);

        try {
            const { data } = await axios.post(`${url}api/user/login`, formData);
            if (!data.token) {
                throw new Error(data.message || "Login failed");
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("userId", data.user.id);
            setFormData(INITIAL_FORM);
            onSubmit?.({
                token: data.token,
                userId: data.user.id,
                ...data.user,
            });
            toast.success("Login successful! Redirecting...");
            setTimeout(() => {
                navigate("/");
            }, 1000);
        } catch (err) {
            const msg = err.response?.data?.message || err.message;
            toast.error(
                msg || "An error occurred during login. Please try again later."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleSwitchMode = () => {
        toast.dismiss();
        onSwitchMode?.();
    };

    return (
        <div className="max-w-md bg-white w-full shadow-lg border border-purple-100 rounded-xl p-8">
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar
            />
            <div className="mb-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-full mx-auto flex items-center justify-center mb-4">
                    <LogIn className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                    {" "}
                    Welcome Back
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                    Sign in to continue to TaskFlow
                </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                {FIELDS.filter(
                    (f) => f.name === "email" || f.name === "password"
                ).map(({ name, type, placeholder, icon: Icon }) => (
                    <div key={name} className={`${INPUTWRAPPER} relative`}>
                        <Icon className="w-6 h-6 text-purple-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type={
                                name === "password" && showPassword
                                    ? "text"
                                    : type
                            }
                            placeholder={placeholder}
                            value={formData[name]}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    [name]: e.target.value,
                                })
                            }
                            className="w-full pl-10 focus:outline-none text-sm text-gray-700"
                            required
                        />
                        {name === "password" && (
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 ml-2 hover:text-purple-500 transition-colors text-gray-500"
                                onClick={() => setShowPassword((prev) => !prev)}
                                tabIndex={-1}
                            >
                                {showPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        )}
                    </div>
                ))}

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)}
                        className="h-4 w-4 text-purple-500 focus:ring-purple-500 border-gray-300 rounded cursor-pointer"
                        required
                    />
                    <label
                        htmlFor="rememberMe"
                        className="block text-sm text-gray-700 ml-1.5 "
                    >
                        Remember Me
                    </label>

                    <a
                        href="/forgot-password"
                        className="text-purple-500 hover:underline text-sm align-right ml-auto"
                    >
                        Forgot Password?
                    </a>
                </div>
                <button
                    type="submit"
                    className={BUTTON_CLASSES}
                    disabled={loading}
                >
                    {loading ? (
                        "Logging in..."
                    ) : (
                        <>
                            <LogIn className="w-4 h-4" /> Log In
                        </>
                    )}
                </button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-6">
                Don't have an account?{" "}
                <button
                    type="button"
                    className="text-purple-600 hover:text-purple-700 hover:underline font-medium transition-colors cursor-pointer"
                    onClick={handleSwitchMode}
                >
                    Sign Up
                </button>
            </p>
        </div>
    );
};

export default Login;
