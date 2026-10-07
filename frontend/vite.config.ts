import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";

const root = process.cwd();

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        home: resolve(root, "index.html"),
        login: resolve(root, "login.html"),
        register: resolve(root, "register.html"),
        todo: resolve(root, "todo.html"),
        create: resolve(root, "create.html"),
        forgotPassword: resolve(root, "forgot-password.html"),
      },
    },
  },
});
