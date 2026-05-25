import { Router } from "express";
import multer from "multer";
import { apiController } from "../controllers/api.controller.js";
import { checkCompanyStatus } from "../middleware/company.middleware.js";

const router = Router();
const storage = multer.memoryStorage();
const memoryUpload = multer({ storage });

router.post("/upload", checkCompanyStatus, memoryUpload.single("file"), apiController.upload);
router.post("/import", memoryUpload.single("file"), apiController.importDetailedData);
router.post("/recalculate", apiController.recalculate);
router.get("/uploads", apiController.getUploads);
router.post("/process/:uploadId", checkCompanyStatus, apiController.process);
router.get("/dashboard/:domain", apiController.getDashboard);
router.get("/metrics", apiController.getMetrics);
router.get("/report/:domain", apiController.getReport);

export default router;
