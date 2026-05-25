import { Request, Response } from "express";
import { reportSummaryService } from "../services/report-summary.service.js";
import { exportService } from "../services/export.service.js";
import { auditService } from "../services/audit.service.js";
import { checkPlanLimit } from "../services/plan.service.js";
import { getTenantIdFromRequest } from "../server/security/tenantGuard.js";

export const reportController = {
  async getSummary(req: Request, res: Response) {
    try {
      const companyId = getTenantIdFromRequest(req);
      const domain = req.params.domain || (req.query.domain as string);
      const period = req.query.period as string;

      if (!domain || !period) {
        return res.status(400).json({ success: false, error: "domain e period são obrigatórios." });
      }

      const summary = await reportSummaryService.generateSummary(
        companyId,
        domain,
        period
      );
      res.json(summary);
    } catch (error: any) {
      res.status(error.status || 400).json({ success: false, error: error.message });
    }
  },

  async exportPDF(req: Request, res: Response) {
    try {
      const companyId = getTenantIdFromRequest(req);
      const domain = req.params.domain || (req.query.domain as string) || (req.body.domain as string);
      const period = (req.query.period as string) || (req.body.period as string);
      const userId = (req.query.userId as string) || (req.body.userId as string);

      if (!domain || !period) {
        return res.status(400).json({ success: false, error: "domain e period são obrigatórios." });
      }

      const limitCheck = await checkPlanLimit(companyId, "export_pdf");
      if (!limitCheck.allowed) {
        return res.status(403).json({ success: false, error: limitCheck.message });
      }

      const summary = await reportSummaryService.generateSummary(
        companyId,
        domain,
        period
      );
      
      const buffer = await exportService.generatePDF(summary);
      
      await auditService.logAction(userId || null, companyId, "export_pdf", "report", null, { domain, period });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=report_${domain}_${period}.pdf`);
      res.send(buffer);
    } catch (error: any) {
      res.status(error.status || 400).json({ success: false, error: error.message });
    }
  },

  async exportPPT(req: Request, res: Response) {
    try {
      const companyId = getTenantIdFromRequest(req);
      const domain = req.params.domain || (req.query.domain as string) || (req.body.domain as string);
      const period = (req.query.period as string) || (req.body.period as string);
      const userId = (req.query.userId as string) || (req.body.userId as string);

      if (!domain || !period) {
        return res.status(400).json({ success: false, error: "domain e period são obrigatórios." });
      }

      const limitCheck = await checkPlanLimit(companyId, "export_ppt");
      if (!limitCheck.allowed) {
        return res.status(403).json({ success: false, error: limitCheck.message });
      }

      const summary = await reportSummaryService.generateSummary(
        companyId,
        domain,
        period
      );
      
      const buffer = await exportService.generatePPT(summary);
      
      await auditService.logAction(userId || null, companyId, "export_ppt", "report", null, { domain, period });

      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.presentationml.presentation");
      res.setHeader("Content-Disposition", `attachment; filename=report_${domain}_${period}.pptx`);
      res.send(buffer);
    } catch (error: any) {
      res.status(error.status || 400).json({ success: false, error: error.message });
    }
  }
};
