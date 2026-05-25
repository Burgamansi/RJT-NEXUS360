import { Router } from "express";
import { authController, companyController } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/onboarding/complete", authController.completeOnboarding);

router.get("/company/:id", companyController.get);
router.put("/company/:id", companyController.update);

export default router;
