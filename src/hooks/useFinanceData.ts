import { useState, useEffect } from "react";
import { apiService } from "../services/api";
import { DEFAULT_TENANT_ID } from "../config/brand";

// ─── Targets (from Indicadores sheet) ─────────────────────────────────────────
export const FINANCE_TARGETS = {
  faturamento:  1_700_000,   // R$ 1.700.000/mês
  cmv_pct:      55,          // 55% do faturamento
  adm_pct:      12.5,        // 12,5% do faturamento
  ebitda_pct:   14,          // 14% do faturamento
} as const;

export interface DREMonth {
  mes: string;
  period: string;
  // Receita
  faturamento: number;
  // Deduções
  impostos: number;
  comissao: number;
  receita_liquida: number;
  // Custo
  cmv: number;
  cmv_pct: number;
  // Lucro Bruto
  lucro_bruto: number;
  lucro_bruto_pct: number;
  // ADM detalhado
  folhaAdm: number;
  financeiro: number;
  outras: number;
  restaurante: number;
  consultoria: number;
  contabilidade: number;
  adm_total: number;
  adm_pct: number;
  // EBITDA
  ebitda: number;
  ebitda_pct: number;
  // Resultado
  result_financeiro: number;
  resultado_liquido: number;
  caixa_final: number;
  // Legado (compatibilidade com DRETable existente)
  margemBruta: number;
  margemBrutaPct: number;
  resultadoLiquido: number;
  // Alertas
  alertCMV: boolean;
  alertEBITDA: boolean;
  alertADM: boolean;
  alertFaturamento: boolean;
}

const MONTH_NAMES = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

export const useFinanceData = (companyId: string = DEFAULT_TENANT_ID, _period?: string) => {
  const [data, setData] = useState<DREMonth[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatBRL = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const dashboard = await apiService.getDashboard("finance", companyId);
        const history = dashboard.history || [];
        const periods = [...new Set(history.map((m: any) => m.period))].sort().slice(-3) as string[];

        const mappedData: DREMonth[] = periods.map(p => {
          const pm = history.filter((m: any) => m.period === p);
          const g = (n: string) => pm.find((m: any) => m.metric_name === n)?.metric_value ?? 0;

          const faturamento     = g("faturamento") || g("revenue");
          const impostos        = g("impostos");
          const comissao        = g("comissao");
          const receita_liquida = g("receita_liquida") || (faturamento - impostos - comissao);
          const cmv             = g("cmv");
          const cmv_pct         = g("cmv_pct") || (faturamento > 0 ? (cmv / faturamento) * 100 : 0);
          const lucro_bruto     = receita_liquida - cmv;
          const lucro_bruto_pct = faturamento > 0 ? (lucro_bruto / faturamento) * 100 : 0;
          const folhaAdm        = g("folhaAdm");
          const financeiro      = g("financeiro");
          const outras          = g("outras");
          const restaurante     = g("restaurante");
          const consultoria     = g("consultoria");
          const contabilidade   = g("contabilidade");
          const adm_total       = g("adm_total") || (folhaAdm + financeiro + outras + restaurante + consultoria + contabilidade);
          const adm_pct         = g("adm_pct") || (faturamento > 0 ? (adm_total / faturamento) * 100 : 0);
          const ebitda          = g("ebitda") || (lucro_bruto - adm_total);
          const ebitda_pct      = g("ebitda_pct") || (faturamento > 0 ? (ebitda / faturamento) * 100 : 0);
          const result_financeiro = g("result_financeiro");
          const resultado_liquido = g("resultado_liquido") || g("resultadoLiquido") || (ebitda + result_financeiro);
          const caixa_final     = g("caixa_final");
          const monthIdx        = parseInt(p.split("-")[1] || "1", 10) - 1;

          return {
            mes: MONTH_NAMES[monthIdx] ?? p,
            period: p,
            faturamento,
            impostos,
            comissao,
            receita_liquida,
            cmv,
            cmv_pct,
            lucro_bruto,
            lucro_bruto_pct,
            folhaAdm,
            financeiro,
            outras,
            restaurante,
            consultoria,
            contabilidade,
            adm_total,
            adm_pct,
            ebitda,
            ebitda_pct,
            result_financeiro,
            resultado_liquido,
            caixa_final,
            // legado
            margemBruta: lucro_bruto,
            margemBrutaPct: lucro_bruto_pct,
            resultadoLiquido: resultado_liquido,
            // alertas automáticos
            alertCMV:         cmv_pct > FINANCE_TARGETS.cmv_pct,
            alertEBITDA:      ebitda_pct < FINANCE_TARGETS.ebitda_pct,
            alertADM:         adm_pct > FINANCE_TARGETS.adm_pct,
            alertFaturamento: faturamento < FINANCE_TARGETS.faturamento,
          };
        });

        setData(mappedData);
      } catch (err: any) {
        console.error("Error loading finance data:", err);
        setError(err.message || "Falha ao carregar dados financeiros.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [companyId]);

  const latest = data[data.length - 1] ?? null;
  const summary = latest ? {
    faturamento:      latest.faturamento,
    cmv_pct:          latest.cmv_pct,
    ebitda_pct:       latest.ebitda_pct,
    adm_pct:          latest.adm_pct,
    caixa_final:      latest.caixa_final,
    hasAlerts:        latest.alertCMV || latest.alertEBITDA || latest.alertADM,
  } : null;

  return { data, loading, error, formatBRL, summary, analysis: null };
};
