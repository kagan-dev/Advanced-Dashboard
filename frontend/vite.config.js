import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://uzak.konyasm.gov.tr:15730",
    },
  },
  build: {
    sourcemap: true, // Sourcemap'i aktif eder
  },
});
