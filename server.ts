import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import authRoutes from "./src/server/routes/auth.ts";
import businessRoutes from "./src/server/routes/businesses.ts";
import bookingRoutes from "./src/server/routes/bookings.ts";
import staffRoutes from "./src/server/routes/staff.ts";
import inventoryRoutes from "./src/server/routes/inventory.ts";
import posRoutes from "./src/server/routes/pos.ts";
import customerRoutes from "./src/server/routes/customers.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createServer() {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());
  app.set('trust proxy', 1);

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/businesses", businessRoutes);
  app.use("/api/bookings", bookingRoutes);
  app.use("/api/staff", staffRoutes);
  app.use("/api/inventory", inventoryRoutes);
  app.use("/api/pos", posRoutes);
  app.use("/api/customers", customerRoutes);

  // Fallback for API routes to never return HTML
  app.use("/api/*", (req, res) => {
    res.status(404).json({ error: "API route not found" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  return app;
}

const appPromise = createServer();

if (process.env.NODE_ENV !== "test" && !process.env.VERCEL) {
  appPromise.then(app => {
    const PORT = 3000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }).catch((err) => {
    console.error("Failed to start server:", err);
  });
}

export default async (req: any, res: any) => {
  const app = await appPromise;
  return app(req, res);
};
