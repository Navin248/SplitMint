const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
        const data = await api.login({ email, password });

        console.log("LOGIN RESPONSE:", data); // 🔍 debug

        if (!data?.token) {
            setError("Login failed: token missing");
            return;
        }

        // ✅ Save token + user
        login(data.user ?? { email }, data.token);

        // ✅ Force redirect AFTER state update
        navigate("/groups", { replace: true });

    } catch (err) {
        console.error(err);
        setError("Login failed. Please try again.");
    }
};
