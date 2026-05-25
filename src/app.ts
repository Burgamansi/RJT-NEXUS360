import express from "express";
import apiRoutes from "./routes/api.routes.js";
import reportRoutes from "./routes/report.routes.js";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import auditRoutes from "./routes/audit.routes.js";
import { attachAuthContext } from "./config/auth.js";

const app = express();

app.use(express.json());
app.use(attachAuthContext);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api", apiRoutes);
app.use("/api", reportRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/audit", auditRoutes);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Ocorreu um erro interno no servidor."
  });
});

export default app;
