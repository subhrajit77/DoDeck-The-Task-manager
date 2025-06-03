import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
    BACK_BUTTON,
    FULL_BUTTON,
    INPUT_WRAPPER,
    SECTION_WRAPPER,
    personalFields,
} from "../../../assets/dummy";
import { ChevronLeft, UserCircle, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:4000";

const Profile = ({ setCurrentUser, onLogout }) => {
    const [profile, setProfile] = useState({ name: "", email: "" });
    const [passwords, setPasswords] = useState({ current: "", confirm: "" });
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const fetchProfile = async () => {
                try {
                    const { data } = await axios.get(`${API_URL}/api/user/me`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (data.success) {
                        setProfile({
                            name: data.user.name,
                            email: data.user.email,
                        });
                    } else toast.error(data.message);
                } catch {
                    toast.error("Unable to load profile.");
                }
            };
            fetchProfile();
        }
    }, []);

    const saveProfile = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.put(
                ` ${API_URL}/api/user/profile`,
                { name: profile.name, email: profile.email },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (data.success) {
                setCurrentUser((prev) => ({
                    ...prev,
                    name: profile.name,
                    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        profile.name
                    )}&background=random`,
                }));
                toast.success("Profile updated");
            } else toast.error(data.message);
        } catch (err) {
            toast.error(err.response?.data?.message || "Profile update failed");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <ToastContainer position="top-center" autoClose={3000} />
            <div className="max-w-4xl mx-auto p-6">
                <button onClick={() => navigate(-1)} className={BACK_BUTTON}>
                    <ChevronLeft className="w-5 h-5 mr-1" />
                    Back to Dashboard
                </button>
                <div className=" flex items-center gap-4 mb-8">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from bg-fuchsia-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                        {profile.name ? profile.name[0].toUpperCase() : "U"}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Account Settings
                        </h1>
                        <p className="text-gray-500 text-sm">
                            {" "}
                            Manage your profile and security settings
                        </p>
                    </div>
                </div>

                <div className=" grid md:grid-cols-2 gap-8">
                    <section className={SECTION_WRAPPER}>
                        <div className="flex items-center gap-2 mb-6">
                            <UserCircle className=" text-purple-500 w-5 h-5" />
                            <h2 className=" text-xl font-semibold text-gray-700">
                                {" "}
                                Personal Information
                            </h2>
                        </div>
                        {/* personal info name, email */}
                        <form onSubmit={saveProfile} className="space-y-4">
                            {personalFields.map(
                                ({ name, type, placeholder, icon: Icon }) => (
                                    <div key={name} className={INPUT_WRAPPER}>
                                        <Icon className="w-6 h-6 mr-2 text-purple-500 relative  " />

                                        <input
                                            type={type}
                                            placeholder={placeholder}
                                            value={profile[name]}
                                            onChange={(e) =>
                                                setProfile({
                                                    ...profile,
                                                    [name]: e.target.value,
                                                })
                                            }
                                            className=" w-full focus:outline-none text-sm "
                                            required
                                        />
                                    </div>
                                )
                            )}
                            <button className={FULL_BUTTON}>
                                <Save className="w-4 h-4" />Save Changes
                            </button>
                        </form>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Profile;
