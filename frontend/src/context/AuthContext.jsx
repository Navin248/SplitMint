import { createContext, useState, useContext, useEffect } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyUser = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const res = await api.get("/me"); // 🔥 Axios + interceptor
                setUser({ id: res.data.userId });
            } catch (err) {
                logout();
            } finally {
                setLoading(false);
            }
        };

        verifyUser();
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
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
