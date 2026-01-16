import { createContext, useState, useContext, useEffect } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verify = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const data = await api.getMe(token);
                if (data.userId) {
                    setUser({ id: data.userId });
                } else {
                    throw new Error("Invalid user data");
                }
            } catch (err) {
                console.error("Auth verification failed:", err);
                localStorage.removeItem("token");
                setToken(null);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        verify();
    }, [token]);

    const login = (userData, authToken) => {
        localStorage.setItem("token", authToken);
        setToken(authToken);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
