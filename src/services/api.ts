import { DEMO_METRICS, DEMO_REPORT_SUMMARY, DEMO_INSIGHTS } from "../data/demo-data";

export interface Metric {
  id: number;
  company_id: string;
  domain: string;
  metric_name: string;
  metric_value: number;
  period: string | null;
  metadata: any;
  created_at: string;
}

export interface DashboardResponse {
  domain: string;
  latestSummary: any;
  history: Metric[];
}

export interface Insight {
  type: string;
  text: string;
}

export interface Report {
  insights: Insight[];
}

const DEFAULT_COMPANY_ID = "demo_company";

// Local state simulation
const getStorageKey = (key: string) => `rjt_nexus360_mock_${key}`;

const getMockData = (key: string, defaultValue: any) => {
  const stored = localStorage.getItem(getStorageKey(key));
  return stored ? JSON.parse(stored) : defaultValue;
};

const setMockData = (key: string, value: any) => {
  localStorage.setItem(getStorageKey(key), JSON.stringify(value));
};

// Helper to check if request is for the demo environment
const isDemoRequest = (companyId: string): boolean => companyId === DEFAULT_COMPANY_ID;

// Mapper for Demo Metrics to Metric interface
const mapDemoMetrics = (domain: string, companyId: string): Metric[] => {
  const metrics = (DEMO_METRICS as any)[domain] || [];
  return metrics.map((m: any, idx: number) => ({
    id: idx,
    company_id: companyId,
    domain,
    metric_name: m.name,
    metric_value: m.value,
    period: m.period,
    metadata: {},
    created_at: new Date().toISOString()
  }));
};

export const apiService = {
  async getDashboard(domain: string, companyId: string = DEFAULT_COMPANY_ID): Promise<DashboardResponse> {
    // Se for DEMO, retorna dados estáticos identificados IMEDIATAMENTE (evita 404s em produção)
    if (isDemoRequest(companyId)) {
      console.info(`[DEMO] Carregando dados do dashboard: ${domain}`);
      const history = mapDemoMetrics(domain, companyId);
      
      const periods = [...new Set(history.map(m => m.period))].sort().reverse();
      const latestPeriod = periods[0];
      const latestMetrics = history.filter(m => m.period === latestPeriod);
      const summary: any = {};
      latestMetrics.forEach(m => summary[m.metric_name] = m.metric_value);

      return { domain, latestSummary: summary, history };
    }

    try {
      const response = await fetch(`/api/dashboard/${domain}?companyId=${companyId}`);
      if (response.ok) {
        const data = await response.json();
        if (data && data.empty) {
          return { domain, latestSummary: {}, history: [], empty: true } as any;
        }
        if (data && data.latestSummary) return data;
        // Server returned ok but no summary — treat as empty
        return { domain, latestSummary: {}, history: [], empty: true } as any;
      }
      // Non-2xx (401, 500, etc.) — return empty state, do NOT throw
      // This prevents dashboard crash when API is unavailable or unauthenticated
      console.warn(`[apiService] getDashboard ${domain} returned ${response.status} — showing empty state`);
      return { domain, latestSummary: {}, history: [], empty: true } as any;
    } catch (error: any) {
      // Network error / JSON parse failure — return empty instead of crashing
      console.warn(`[apiService] getDashboard ${domain} network error — showing empty state`, error?.message);
      return { domain, latestSummary: {}, history: [], empty: true } as any;
    }
  },

  async getMetrics(domain?: string, period?: string, companyId: string = DEFAULT_COMPANY_ID): Promise<Metric[]> {
    if (isDemoRequest(companyId)) {
      let metrics = mapDemoMetrics(domain || "finance", companyId);
      if (period) metrics = metrics.filter(m => m.period === period);
      return metrics;
    }

    try {
      const queryParams = new URLSearchParams();
      if (domain) queryParams.append("domain", domain);
      if (period) queryParams.append("period", period);
      if (companyId) queryParams.append("companyId", companyId);
      
      const response = await fetch(`/api/metrics?${queryParams.toString()}`);
      if (response.ok) return await response.json();
      throw new Error("Métricas não encontradas.");
    } catch (error) {
      throw error;
    }
  },

  async getReport(domain: string, companyId: string = DEFAULT_COMPANY_ID): Promise<Report> {
    if (isDemoRequest(companyId)) {
      return { insights: (DEMO_INSIGHTS as any)[domain] || DEMO_INSIGHTS.finance };
    }

    try {
      const response = await fetch(`/api/report/${domain}?companyId=${companyId}`);
      if (response.ok) return await response.json();
      return { insights: [] };
    } catch (error) {
      throw error;
    }
  },

  async uploadFile(file: File, companyId: string = DEFAULT_COMPANY_ID): Promise<any> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("companyId", companyId);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      throw new Error("Falha ao realizar o upload do arquivo.");
    }

    return await response.json();
  },

  async processFile(uploadId: string, mapping?: Record<string, string>, domain?: string, type?: string, companyId?: string): Promise<any> {
    const response = await fetch(`/api/process/${uploadId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mapping, domain, type, companyId })
    });

    if (!response.ok) {
      let errMsg = "Erro ao processar o arquivo no servidor.";
      try {
        const errJson = await response.json();
        if (errJson && errJson.error) {
          errMsg = errJson.error;
        }
      } catch (e) {}
      throw new Error(errMsg);
    }

    return await response.json();
  },

  async getReportSummary(domain: string, period: string, companyId: string = DEFAULT_COMPANY_ID): Promise<any> {
    try {
      const response = await fetch(`/api/report/${domain}/summary?period=${period}&companyId=${companyId}`);
      if (response.ok) return await response.json();

      if (isDemoRequest(companyId)) {
        return (DEMO_REPORT_SUMMARY as any)[domain] || DEMO_REPORT_SUMMARY.finance;
      }

      throw new Error("Sumário executivo não disponível.");
    } catch (error) {
      if (isDemoRequest(companyId)) {
        return (DEMO_REPORT_SUMMARY as any)[domain] || DEMO_REPORT_SUMMARY.finance;
      }
      throw error;
    }
  },

  async exportPDF(domain: string, period: string, companyId: string = DEFAULT_COMPANY_ID): Promise<void> {
    // PDF export would normally be a backend call returning a blob
    const response = await fetch(`/api/report/${domain}/export/pdf?period=${period}&companyId=${companyId}`);
    if (response.ok) {
      const blob = await response.json();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `relatorio_${domain}_${period}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } else {
      throw new Error("Erro ao exportar PDF.");
    }
  },

  async exportPPT(domain: string, period: string, companyId: string = DEFAULT_COMPANY_ID): Promise<void> {
    const response = await fetch(`/api/report/${domain}/export/ppt?period=${period}&companyId=${companyId}`);
    if (response.ok) {
      const blob = await response.json();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `relatorio_${domain}_${period}.pptx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } else {
      throw new Error("Erro ao exportar PPT.");
    }
  },

  async getUploadsHistory(companyId: string = DEFAULT_COMPANY_ID): Promise<any[]> {
    const response = await fetch(`/api/uploads?companyId=${companyId}`);
    if (response.ok) return await response.json();
    
    if (isDemoRequest(companyId)) {
        return [
          {
            id: 1,
            upload_id: "demo_init_1",
            file_name: "faturamento_q1_2026.xlsx",
            company_id: companyId,
            detected_domain: "finance",
            detected_type: "excel",
            status: "processed",
            created_at: "2026-03-01T10:00:00Z",
            rows_read: 450,
            raw_rows_saved: 450,
            normalized_rows_saved: 420
          }
        ];
    }
    return [];
  },

  // Admin Methods (Real API preferred, demo fallback only if demo_company)
  async adminListCompanies(role: string = "admin_master"): Promise<any[]> {
    const response = await fetch("/api/admin/companies", {
      headers: { "x-user-role": role }
    });
    if (response.ok) return await response.json();
    return [];
  },

  async adminGetCompanyDetails(id: string, role: string = "admin_master"): Promise<any> {
    const response = await fetch(`/api/admin/company/${id}`, {
      headers: { "x-user-role": role }
    });
    if (response.ok) return await response.json();
    throw new Error("Empresa não encontrada.");
  },

  async adminUpdateCompanyStatus(id: string, status: string, role: string = "admin_master"): Promise<void> {
    await fetch(`/api/admin/companies/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
  },

  async adminUpdateUser(id: string, data: any, role: string = "admin_master"): Promise<void> {
    await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
  },

  async getAuditLogs(params: any, user: any = { role: "admin_master", companyId: DEFAULT_COMPANY_ID }): Promise<any[]> {
    const response = await fetch("/api/audit/logs", {
      headers: { "x-user-role": user.role }
    });
    if (response.ok) return await response.json();
    return [];
  },

  async getPlanInfo(companyId: string = DEFAULT_COMPANY_ID): Promise<any> {
    const fallback = { planName: "Básico", planStatus: "ativo", planEndDate: null, limits: { maxUsers: 5, maxUploads: 10, features: [] }, usage: { users: 0, uploads: 0 } };
    if (isDemoRequest(companyId)) {
       return fallback;
    }

    try {
      const response = await fetch(`/api/admin/company/${companyId}/plan`);
      if (response.ok) {
        const data = await response.json();
        return { ...fallback, ...data, usage: { ...fallback.usage, ...(data.usage ?? {}) } };
      }
      return fallback;
    } catch (error) {
      return fallback;
    }
  }
};
