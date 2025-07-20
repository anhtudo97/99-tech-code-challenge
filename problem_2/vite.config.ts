import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from "path";
import svgr from "vite-plugin-svgr"; // Import the plugin

// https://vite.dev/config/
export default defineConfig({
  css: {
    devSourcemap: true,
  },
  plugins: [react(), tailwindcss(), svgr()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
