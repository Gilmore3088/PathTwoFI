// server/index.ts
import express from "express";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createServer() {
  const app = express();
  const server = http.createServer(app);

  if (process.env.NODE_ENV !== "production") {
    // --- DEV: use Vite as middleware so it injects /@vite/client and /@react-refresh
    const vite = await (await import("vite")).createServer({
      root: path.resolve(__dirname, "../client"),
      server: { middlewareMode: true, hmr: { server } },
      appType: "custom",
    });
    app.use(vite.middlewares);
  } else {
    // --- PROD: serve the built client
    app.use(express.static(path.resolve(__dirname, "../dist/public")));
  }

  // --- API routes
  app.get("/api/health", (_req, res) => res.json({ ok: true }));

  // (optional) If you have client-side routing, ensure index fallback in prod:
  if (process.env.NODE_ENV === "production") {
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(__dirname, "../dist/public/index.html"));
    });
  }

  const PORT = Number(process.env.PORT ?? 5173);
  server.listen(PORT, () => {
    console.log(`[server] listening on http://localhost:${PORT}`);
  });
}

createServer();
