import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  // 🔥 FIX: allow Railway (and any future domain)
  preview: {
    allowedHosts: "all",
  },
});
