import { UserPlus } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import {
    FIELDS,
    Inputwrapper,
    BUTTONCLASSES,
    MESSAGE_ERROR,
    MESSAGE_SUCCESS,
} from "../../../assets/dummy.jsx";
// import { Icon } from "lucide-react";
const API_URL = "https://dodeck-the-task-manager-backend.onrender.com";
const INITIAL_FORM = {
    name: "",
    email: "",
    password: "",
};

const Signup = ({ onSwitchMode }) => {
    const [formData, setFormData] = useState(INITIAL_FORM);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: "", type: "" });

        try {
            const { data } = await axios.post(
                `${API_URL}/api/user/register`,
                formData
            );
            console.log("Signup Successful");
            setMessage({
                text: "Account created successfully! Please log in",
                type: "success",
            });
            setFormData(INITIAL_FORM);
        } catch (err) {
            console.error("Signup Error:", err);
            setMessage({
                text:
                    err.response?.data?.message ||
                    "An error occurred during signup. Please try again later.",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md w-full bg-white shadow-lg order border-purple-100 rounded-xl p-8">
            <div className=" w-16 h-16 bg-gradient-to-br from bg-fuchsia-500 to-purple-600 rounded-full mx-auto flex items-center justify-center mb-4">
                <UserPlus className="w-8 h-8 text-white " />
            </div>
            <h2 className=" text-2xlfont-bold text-gray-800 flex items-center justify-center">
                {" "}
                Create Account
            </h2>
            <p className="text-gray-500 text-sm mt-1 flex items-center justify-center">
                {" "}
                Join TaskFlow to manage your tasks
            </p>
            {message.text && (
                <div
                    className={`text-center mt-3 ${
                        message.type === "success"
                            ? MESSAGE_SUCCESS
                            : MESSAGE_ERROR
                    }`}
                >
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className=" space-y-4 mt-6">
                {FIELDS.map(({ name, type, placeholder, icon: Icon }) => (
                    <div key={name} className={Inputwrapper} relative>
                        <Icon className="w-6 h-6 mr-2 text-purple-500 relative  " />

                        <input
                            type={type}
                            placeholder={placeholder}
                            value={formData[name]}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    [name]: e.target.value,
                                })
                            }
                            className=" w-full focus:outline-none text-sm text-gray-700"
                            required
                        />
                    </div>
                ))}
                <button
                    type="submit"
                    className={BUTTONCLASSES}
                    disabled={loading}
                >
                    {loading ? (
                        "Creating Account..."
                    ) : (
                        <>
                            <UserPlus className="w-5 h-5 mr-2" /> Create Account
                        </>
                    )}
                </button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-6">
                Already have an account?{" "}
                <button
                    onClick={onSwitchMode}
                    className="text-purple-600 hover:text-purple-700 hover:underline "
                >
                    Login
                </button>
            </p>
        </div>
    );
};

export default Signup;
