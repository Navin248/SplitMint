import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

// 🔐 Attach token automatically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// Auth helpers (optional but clean)
api.login = async ({ email, password }) => {
    const res = await api.post("/auth/login", { email, password });
    return res.data;
};

api.register = async (payload) => {
    const res = await api.post("/auth/register", payload);
    return res.data;
};
