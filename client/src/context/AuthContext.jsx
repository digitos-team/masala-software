import React, { createContext, useContext, useState, useEffect } from "react";
import { loginUser as loginApi, logoutUser as logoutApi } from "../api/auth/auth.api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Initialize auth state from localStorage
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        try {
            const data = await loginApi(credentials);
            const { user: loggedInUser, accessToken } = data.data;

            localStorage.setItem("user", JSON.stringify(loggedInUser));
            localStorage.setItem("token", accessToken);
            setUser(loggedInUser);

            return loggedInUser;
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        console.log("AuthContext: logout called");
        try {
            await logoutApi();
            console.log("AuthContext: logoutApi success");
        } catch (error) {
            console.error("Logout API error:", error);
        } finally {
            console.log("AuthContext: clearing local storage");
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            setUser(null);
            // Force redirect just in case
            window.location.href = "/login";
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
