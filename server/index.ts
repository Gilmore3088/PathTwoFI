// server/index.ts
import express from "express";
import http from "http";
import path from "path";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import type { ViteDevServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createServer() {
  const app = express();
  const server = http.createServer(app);
  const isProduction = process.env.NODE_ENV === "production";
  const clientRoot = path.resolve(__dirname, "../client");
  const distPublic = path.resolve(__dirname, "../dist/public");
  const indexHtml = path.resolve(clientRoot, "index.html");

  let vite: ViteDevServer | undefined;

  if (!isProduction) {
    // --- DEV: use Vite as middleware so it injects /@vite/client and /@react-refresh
    vite = await (await import("vite")).createServer({
      root: clientRoot,
      server: { middlewareMode: true, hmr: { server } },
      appType: "custom",
    });
    app.use(vite.middlewares);
  } else {
    // --- PROD: serve the built client
    app.use(express.static(distPublic));
  }

  // --- API routes
  app.get("/api/health", (_req, res) => res.json({ ok: true }));

  app.use(async (req, res, next) => {
    if (req.originalUrl.startsWith("/api")) {
      next();
      return;
    }

    if (req.method !== "GET" && req.method !== "HEAD") {
      next();
      return;
    }

    try {
      if (!isProduction && vite) {
        const url = req.originalUrl;
        let template = await fs.readFile(indexHtml, "utf-8");
        template = await vite.transformIndexHtml(url, template);
        res.status(200).setHeader("Content-Type", "text/html").end(template);
        return;
      }

      res.sendFile(path.resolve(distPublic, "index.html"));
    } catch (error) {
      if (vite && error instanceof Error) {
        vite.ssrFixStacktrace(error);
      }
      next(error);
    }
  });

  const PORT = Number(process.env.PORT ?? 5173);
  server.listen(PORT, () => {
    console.log(`[server] listening on http://localhost:${PORT}`);
  });
}

createServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
