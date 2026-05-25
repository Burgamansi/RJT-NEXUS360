import { Router } from "express";
import { auditController } from "../controllers/audit.controller.js";

const router = Router();

router.get("/logs", auditController.listLogs);

export default router;
