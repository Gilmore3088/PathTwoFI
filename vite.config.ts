// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// ⬇️ Replace with YOUR exact Replit host (the one you pasted from the console)
const PUBLIC_HOST = "124e58bb-b59a-460e-b6f1-5de8cc67e7fd-00-v5rfqdscqnt4.spock.replit.dev";

export default defineConfig({
  plugins: [
    react(),

    // Re-enable later if you want; it can interfere with HMR host detection.
    // (async () => {
    //   if (process.env.NODE_ENV !== "production" && process.env.REPL_ID) {
    //     const { cartographer } = await import("@replit/vite-plugin-cartographer");
    //     return cartographer();
    //   }
    // })() as any,
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
    // Prevent multiple React copies (fixes invalid hook call / null.useState)
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    host: true,
    port: 5173,
    // Hard-pin HMR to your HTTPS host so it never tries ws://localhost:undefined
    hmr: {
      protocol: "wss",
      host: PUBLIC_HOST,
      clientPort: 443,
    },
    fs: { strict: true, deny: ["**/.*"] },
  },
});
