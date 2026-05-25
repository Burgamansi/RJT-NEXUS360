import { Request, Response } from "express";
import { fileService } from "../services/file.service.js";
import { dataRepository } from "../repositories/index.js";
import { db } from "../config/db.js";
import { processSchema, metricsQuerySchema } from "../utils/validation.js";
import { auditService } from "../services/audit.service.js";
import { checkPlanLimit } from "../services/plan.service.js";
import { analyticsService } from "../services/analytics.service.js";
import { getTenantIdFromRequest, normalizeCompanyId } from "../server/security/tenantGuard.js";

/**
 * Safe tenant ID resolution: tries JWT first, falls back to sanitized body/query param.
 * JWT always wins when present. Body/query fallback allows non-authenticated upload routes.
 */
function safeGetTenantId(req: Request): string | null {
  try {
    return getTenantIdFromRequest(req);
  } catch {
    const raw = req.body?.companyId || req.query?.companyId;
    return normalizeCompanyId(raw);
  }
}

export const apiController = {
  async importDetailedData(req: Request, res: Response) {
    const isDev = process.env.NODE_ENV !== "production";
    let companyId = "unknown";
    let fileName = "";
    let fileSize = 0;

    try {
      const { password, type } = req.body;

      if (!req.file) {
        return res.status(400).json({ success: false, error: "No file uploaded" });
      }

      fileName = req.file.originalname;
      fileSize = req.file.size;

      const resolvedId = safeGetTenantId(req);
      if (!resolvedId) {
        return res.status(401).json({
          success: false,
          error: "companyId não identificado. Inclua o header Authorization ou o campo companyId no formulário."
        });
      }
      companyId = resolvedId;

      const result = await analyticsService.importExcelData(req.file.buffer, password, type, companyId);
      res.json(result);
    } catch (error: any) {
      console.error("[IMPORT_ERROR]", {
        message: error.message,
        stack: error.stack,
        companyId,
        fileName,
        fileSize
      });
      res.status(error.status || 500).json({
        success: false,
        error: error.message || "Erro interno no servidor durante o processamento.",
        ...(isDev ? { details: error.stack } : {})
      });
    }
  },

  async recalculate(req: Request, res: Response) {
    try {
      const { period } = req.body;
      const resolvedId = safeGetTenantId(req);
      if (!resolvedId) {
        return res.status(401).json({ success: false, error: "companyId não identificado." });
      }
      const result = await analyticsService.recalculateIndicators(resolvedId, period);
      res.json(result);
    } catch (error: any) {
      res.status(error.status || 500).json({ success: false, error: error.message });
    }
  },

  async upload(req: Request, res: Response) {
    try {
      const companyId = getTenantIdFromRequest(req);
      if (!req.file) return res.status(400).json({ success: false, error: "No file uploaded" });

      const limitCheck = await checkPlanLimit(companyId, "upload");
      if (!limitCheck.allowed) {
        return res.status(403).json({ success: false, error: limitCheck.message });
      }
      
      const result = await fileService.handleUpload(req.file, companyId);
      
      const { userId: bodyUserId } = req.body;
      await auditService.logAction(bodyUserId, companyId, "upload", "data", result.uploadId, { fileName: req.file.originalname });

      res.json(result);
    } catch (error: any) {
      res.status(error.status || 500).json({ success: false, error: error.message });
    }
  },

  async process(req: Request, res: Response) {
    const isDev = process.env.NODE_ENV !== "production";
    const uploadId = req.params?.uploadId;
    if (isDev) {
      console.log(`[DEV LOG] process endpoint hit`);
      console.log(`[DEV LOG] uploadId: ${uploadId}`);
      console.log(`[DEV LOG] companyId recebido (body): ${req.body?.companyId}, (query): ${req.query?.companyId}`);
    }

    try {
      const validated = processSchema.safeParse(req.params);
      if (!validated.success) {
        if (isDev) console.log(`[DEV LOG] ID de upload inválido`);
        return res.status(400).json({ success: false, error: "ID de upload inválido", details: validated.error.format() });
      }
      
      const { mapping, domain, type, userId: bodyUserId } = req.body;
      const companyId = getTenantIdFromRequest(req);
      if (isDev) {
        console.log(`[DEV LOG] companyId validado: ${companyId}`);
      }
      
      const result = await fileService.processUpload(
        validated.data.uploadId, 
        companyId, 
        mapping, 
        domain, 
        type
      );
      
      await auditService.logAction(bodyUserId, companyId, "process", "data", validated.data.uploadId, { domain, type });

      res.json(result);
    } catch (error: any) {
      if (isDev) {
        console.error(`[DEV LOG] erro real capturado:`, error);
      }
      res.status(error.status || 500).json({ success: false, error: error.message });
    }
  },

  async getUploads(req: Request, res: Response) {
    try {
      const companyId = safeGetTenantId(req);
      if (!companyId) return res.status(401).json({ success: false, error: "companyId não identificado." });
      const query = "SELECT * FROM uploads WHERE company_id = ? ORDER BY created_at DESC";
      const result = await db.execute({ sql: query, args: [companyId] });
      res.json(result.rows);
    } catch (error: any) {
      res.status(error.status || 500).json({ success: false, error: error.message });
    }
  },

  async getDashboard(req: Request, res: Response) {
    const isDev = process.env.NODE_ENV !== "production";
    const { domain } = req.params;
    let companyId = "unknown";

    try {
      const resolvedId = safeGetTenantId(req);
      if (!resolvedId) {
        // No tenant context — return empty state instead of 401 so dashboard shows empty UI
        return res.json({ success: true, empty: true, message: "No tenant context. Please log in." });
      }
      companyId = resolvedId;
      
      if (isDev) {
        console.log(`[DEV LOG] endpoint: GET /api/dashboard/${domain}`);
        console.log(`[DEV LOG] companyId: ${companyId}`);
        console.log(`[DEV LOG] domain: ${domain}`);
      }

      const metrics = await dataRepository.getMetrics({ 
        domain: domain as any, 
        companyId: companyId 
      });

      if (isDev) {
        console.log(`[DEV LOG] metrics found: ${metrics.length}`);
      }

      if (metrics.length === 0) {
        return res.json({
          success: true,
          empty: true,
          message: "No processed data found for this dashboard."
        });
      }

      // Return the most recent summary for the dashboard
      const latestSummary = metrics.find((m: any) => m.metric_name === "upload_summary");
      
      res.json({
        domain,
        latestSummary: latestSummary ? (latestSummary as any).metric_value : null,
        history: metrics
      });
    } catch (error: any) {
      if (isDev) {
        console.error(`[DEV LOG] getDashboard error:`, error);
      }
      res.status(error.status || 500).json({ success: false, error: error.message });
    }
  },

  async getMetrics(req: Request, res: Response) {
    try {
      const validated = metricsQuerySchema.safeParse(req.query);
      if (!validated.success) {
        return res.status(400).json({ success: false, error: "Parâmetros de consulta inválidos", details: validated.error.format() });
      }

      const companyId = safeGetTenantId(req);
      if (!companyId) return res.json([]);

      const metrics = await dataRepository.getMetrics({
        ...validated.data,
        companyId
      });
      res.json(metrics);
    } catch (error: any) {
      res.status(error.status || 500).json({ success: false, error: error.message });
    }
  },

  async getReport(req: Request, res: Response) {
    const { domain } = req.params;
    try {
      const companyId = getTenantIdFromRequest(req);
      
      const latestMetrics = await dataRepository.getMetrics({ 
        domain,
        companyId
      });

      if (latestMetrics.length === 0) {
        return res.json({ 
          insights: [
            { type: "info", text: "Nenhum dado disponível para este domínio ainda. Por favor, envie uma planilha." }
          ] 
        });
      }

      // Tentativa de decodificação segura
      let metrics: any = {};
      const firstRow = latestMetrics[0] as any;
      const rawValue = firstRow.value || firstRow.metadata || firstRow.metric_value;
      
      if (rawValue) {
        try {
          metrics = typeof rawValue === "string" ? JSON.parse(rawValue) : rawValue;
        } catch (e) {
          metrics = rawValue;
        }
      }
      
      const insights = [];
      if (domain === "finance") {
        insights.push({ 
          type: "trending_up", 
          text: `A receita atual está em R$ ${((metrics.revenue || metrics.metric_value || 0) / 1000000).toFixed(1)}M. Projeção de alta baseada na velocidade atual.` 
        });
        insights.push({ 
          type: "info", 
          text: `A margem de lucro operacional está estável em ${metrics.revenue ? (((metrics.profit || 0) / metrics.revenue) * 100).toFixed(1) : 0}%.` 
        });
      } else if (domain === "rh") {
        insights.push({ 
          type: "info", 
          text: `A taxa de retenção está saudável em 92%. O quadro de colaboradores ativo é de ${metrics.headcount || metrics.metric_value || 0}.` 
        });
      } else {
        insights.push({ 
          type: "info", 
          text: `A eficiência operacional está no patamar ideal em ${(metrics.efficiency || metrics.metric_value || 0).toFixed(1)}%.` 
        });
      }

      res.json({ insights });
    } catch (error: any) {
      res.status(error.status || 500).json({ success: false, error: error.message });
    }
  }
};
