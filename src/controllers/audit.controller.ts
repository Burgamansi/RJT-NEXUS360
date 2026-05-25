import { Request, Response } from "express";
import { auditRepository } from "../repositories/index.js";

export const auditController = {
  async listLogs(req: Request, res: Response) {
    try {
      const { companyId, userId, action, module, status, limit, offset } = req.query;
      const userRole = req.headers["x-user-role"] as string;
      const userCompanyId = req.headers["x-user-company-id"] as string;

      const filters: any = {
        userId: userId as string,
        action: action as string,
        module: module as string,
        status: status as string,
        limit: limit ? parseInt(limit as string) : 100,
        offset: offset ? parseInt(offset as string) : 0
      };

      // Access Control
      if (userRole === "admin_master") {
        filters.companyId = companyId as string;
      } else if (userRole === "admin_empresa") {
        filters.companyId = userCompanyId;
      } else {
        return res.status(403).json({ success: false, error: "Acesso negado" });
      }

      const logs = await auditRepository.find(filters);
      res.json(logs);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};
