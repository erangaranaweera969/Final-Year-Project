import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

    const [user, setUser] = useState(null);

    useEffect(() => {
        const verifyToken = async () => {
            const token = Cookies.get("token");
            if (token) {
                try {
                    const res = await axios.get("http://localhost:8000/api/verify-token", {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (res.data.user) {
                        setUser({ name: res.data.user.name });
                    }
                } catch {
                    Cookies.remove("token");
                    setUser(null);
                }
            }
        };

        verifyToken();
    }, []);

    const login = async (email, password) => {
        try {
            const res = await axios.post("http://localhost:8000/api/login", {
                email,
                password,
            });
            const data = res.data;
            if (data.token) {
                Cookies.set("token", data.token, { expires: 7 }); // Store token in cookie for 7 days
                setUser({ name: data.user.name });
            }
            return data;
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    };

    const logout = () => {
        Cookies.remove("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};