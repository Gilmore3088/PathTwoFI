import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig(async () => {
  const plugins = [react(), runtimeErrorOverlay()];

  if (process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined) {
    const { cartographer } = await import("@replit/vite-plugin-cartographer");
    plugins.push(cartographer());
  }

  const isReplit = Boolean(process.env.REPL_ID);

  return {
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "client", "src"),
        "@shared": path.resolve(import.meta.dirname, "shared"),
        "@assets": path.resolve(import.meta.dirname, "attached_assets"),
      },
      // ensure single React instance at runtime
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
      hmr: isReplit
        ? {
            protocol: "wss",
            clientPort: 443,
            // If the socket still tries localhost, uncomment the next line and paste your public host
            // host: "YOUR-REPLIT-HOST.spock.replit.dev",
          }
        : { protocol: "ws" },
      fs: { strict: true, deny: ["**/.*"] },
    },
  };
});
