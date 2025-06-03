import { useState, useEffect } from "react";
import "./App.css";
import { replace, Route, Routes, useNavigate, Navigate, Outlet } from "react-router-dom";
import Layout from "./components/global/layout/Layout";

import Login from "./components/global/login/Login";
import Signup from "./components/global/signup/Signup";
import axios from "axios";
import Dashboard from "./pages/dashboard/Dashboard";
import PendingPage from "./pages/pending/PendingPage";
import CompletedPage from "./pages/completed/CompletedPage";
import Profile from "./components/global/profile/Profile";

function App() {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(() => {
        const stored = localStorage.getItem("currentUser");
        return stored ? JSON.parse(stored) : null;
    });
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            axios
                .get("http://localhost:4000/api/user/me", {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((res) => {
                    if (res.data && res.data.user) {
                        setCurrentUser({
                            ...res.data.user,
                            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                res.data.user.name || "User"
                            )}&background=random`,
                        });
                    }
                })
                .catch(() => {
                    localStorage.removeItem("token");
                    setCurrentUser(null);
                    navigate("/login", { replace: true });
                });
        }
    }, [navigate]);

    const handleAuthSubmit = (data) => {
        // Save token if present
        if (data.token) {
            localStorage.setItem("token", data.token);
        }
        const user = {
            email: data.email,
            name: data.name || "User",
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                data.name || "User"
            )}&background=random`,
        };
        setCurrentUser(user);
        navigate("/", { replace: true });
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setCurrentUser(null);
        navigate("/login", { replace: true });
    };
    const ProtectedLayout = () => (
        <Layout user={currentUser} onLogout={handleLogout}>
            <Outlet />
        </Layout>
    );

    return (
        <>
            <Routes>
                <Route
                    path="/login"
                    element={
                        <div className="fixed inset-0 flex items-center justify-center bg-purple-100 bg-opacity-50">
                            <Login
                                onSubmit={handleAuthSubmit}
                                onSwitchMode={() => navigate("/signup")}
                            />
                        </div>
                    }
                />
                <Route
                    path="/signup"
                    element={
                        <div className="fixed inset-0 flex items-center justify-center bg-purple-100 bg-opacity-50">
                            <Signup
                                onSubmit={handleAuthSubmit}
                                onSwitchMode={() => navigate("/login")}
                            />
                        </div>
                    }
                />
                {/* <Route
                    path="/"
                    element={
                        <Layout user={currentUser} onLogout={handleLogout} />
                    }
                /> */}

                <Route
                    element={
                        currentUser ? (
                            <ProtectedLayout />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                >
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/pending" element={<PendingPage />} />
                    <Route path="/complete" element={<CompletedPage />} />
                    <Route path="/profile" element={<Profile user={currentUser} setCurrentUser={setCurrentUser} onLogout={handleLogout} />} />
                </Route>
                <Route
                    path="*"
                    element={
                        <Navigate to={currentUser ? "/" : "/login"} replace />
                    }
                />
            </Routes>
        </>
    );
}

export default App;
