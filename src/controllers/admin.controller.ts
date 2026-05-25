import { Request, Response } from "express";
import { companyRepository, userRepository, uploadRepository } from "../repositories/index.js";
import { auditService } from "../services/audit.service.js";

export const adminController = {
  async listCompanies(req: Request, res: Response) {
    try {
      const companies = await companyRepository.findAllWithStats();
      res.json(companies);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async getCompanyDetails(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const company = await companyRepository.findById(id);
      if (!company) return res.status(404).json({ success: false, error: "Empresa não encontrada" });

      const users = await userRepository.findByCompany(id);
      const stats = await uploadRepository.getUsageStats(id);

      res.json({
        company,
        users,
        stats
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async updateCompanyStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!["active", "inactive"].includes(status)) {
        return res.status(400).json({ success: false, error: "Status inválido" });
      }
      await companyRepository.update(id, { status });
      
      const adminId = req.headers["x-user-id"] as string;
      await auditService.logAction(adminId, null, "update_company_status", "admin", id, { status });

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async listCompanyUsers(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const users = await userRepository.findByCompany(id);
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { role, status, name, email } = req.body;
      await userRepository.update(id, { role, status, name, email });
      
      const adminId = req.headers["x-user-id"] as string;
      await auditService.logAction(adminId, null, "update_user", "admin", id, { role, status });

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async getCompanyPlan(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const company = await companyRepository.findById(id) as any;
      if (!company) return res.status(404).json({ success: false, error: "Empresa não encontrada" });

      const stats = await uploadRepository.getUsageStats(id);
      const userCount = await userRepository.countByCompany(id);

      res.json({
        planName: company.plan_name,
        planStatus: company.plan_status,
        planEndDate: company.plan_end_date,
        limits: {
          maxUsers: company.max_users,
          maxUploads: company.max_uploads,
          features: company.features
        },
        usage: {
          users: userCount,
          uploads: stats.total_uploads
        }
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};
