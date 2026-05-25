import { useState, useEffect } from "react";
import { apiService } from "../services/api";

export interface DashboardMetrics {
  totalGrossRevenue: number;
  totalVariableCosts: number;
  contributionMargin: number;
  netRevenue: number;
  netProfit: number;
}

export const useDashboardData = (domain: string, period: string, companyId: string) => {
  const [data, setData] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalGrossRevenue: 0,
    totalVariableCosts: 0,
    contributionMargin: 0,
    netRevenue: 0,
    netProfit: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatBRL = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log(`[useDashboardData] Fetching data for domain: ${domain}, period: ${period}`);
        
        // Fetch metrics from API
        const response = await apiService.getMetrics(domain, period, companyId);
        
        // Em um cenário real, os dados viriam agregados do Turso.
        // Aqui simulamos a agregação conforme solicitado.
        console.log("[useDashboardData] Data returned from database:", response);

        if (!response || response.length === 0) {
          console.warn("[useDashboardData] No data found for the selected period.");
        }

        setData(response);

        // Agregação de valores (Simulada caso o backend ainda não suporte os novos nomes)
        // No futuro, isso deve vir de endpoints específicos como /api/analytics/indicators
        const revenue = response.find(m => m.metric_name === "revenue")?.metric_value || 0;
        const expenses = response.find(m => m.metric_name === "expenses")?.metric_value || 0;
        const variableCosts = response.find(m => m.metric_name === "variable_costs")?.metric_value || (expenses * 0.4); // Mocking if not present
        
        const grossRevenue = revenue;
        const contribMargin = grossRevenue - variableCosts;

        setMetrics({
          totalGrossRevenue: grossRevenue,
          totalVariableCosts: variableCosts,
          contributionMargin: contribMargin,
          netRevenue: grossRevenue * 0.85, // Mocking taxes
          netProfit: (grossRevenue - expenses) * 0.8, // Mocking net
        });

      } catch (err: any) {
        console.error("[useDashboardData] Error fetching dashboard data:", err);
        setError(err.message || "Erro ao carregar dados do dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [domain, period, companyId]);

  return {
    data,
    metrics,
    loading,
    error,
    formatBRL,
  };
};
