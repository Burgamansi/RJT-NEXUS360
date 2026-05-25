import { Router } from "express";
import { reportController } from "../controllers/report.controller.js";
import { checkCompanyStatus } from "../middleware/company.middleware.js";

const router = Router();

router.get("/report-summary", reportController.getSummary);
router.get("/report/:domain/summary", reportController.getSummary);
router.get("/report/:domain/export/pdf", checkCompanyStatus, reportController.exportPDF);
router.get("/report/:domain/export/ppt", checkCompanyStatus, reportController.exportPPT);
router.post("/export/pdf", checkCompanyStatus, reportController.exportPDF);
router.post("/export/ppt", checkCompanyStatus, reportController.exportPPT);

export default router;
