import { Router, Request, Response, NextFunction } from "express";
import { adminController } from "../controllers/admin.controller.js";

const router = Router();

const isProdEnv = (): boolean => {
  try {
    if (import.meta.env && import.meta.env.PROD) {
      return true;
    }
  } catch (e) {}
  
  try {
    if (typeof process !== "undefined" && process.env.NODE_ENV === "production") {
      return true;
    }
  } catch (e) {}
  
  return false;
};

// Middleware to check if user is admin_master
const isAdminMaster = (req: Request, res: Response, next: NextFunction) => {
  const role = req.headers["x-user-role"];
  const companyId = req.query.companyId || req.body.companyId;

  // Em produção, NUNCA aceitar bypasses mockados de desenvolvimento
  if (isProdEnv()) {
    return res.status(403).json({ 
      error: "Acesso negado. Os cabeçalhos de desenvolvimento ('x-user-role') são bloqueados em produção." 
    });
  }

  // Allow demo_company to bypass for visualization, or if role is admin_master (DEV ONLY)
  if (role === "admin_master" || companyId === "demo_company") {
    return next();
  }
  
  return res.status(403).json({ error: "Acesso negado. Apenas administradores master podem acessar esta área." });
};

router.use(isAdminMaster);

router.get("/companies", adminController.listCompanies);
router.get("/company/:id", adminController.getCompanyDetails);
router.patch("/company/:id/status", adminController.updateCompanyStatus);
router.get("/company/:id/users", adminController.listCompanyUsers);
router.patch("/user/:id", adminController.updateUser);
router.get("/company/:id/plan", adminController.getCompanyPlan);

export default router;
