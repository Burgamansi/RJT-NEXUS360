import { dataRepository } from "../repositories/index.js";

export interface KPI {
  label: string;
  value: number | string;
}

export interface ReportSummary {
  companyId: string;
  domain: string;
  period: string;
  title: string;
  kpis: KPI[];
  insights: string[];
  summary: string;
}

interface MetricRow {
  metric_name: string;
  metric_value: any;
  period: string;
  domain: string;
  company_id: string;
  metadata: any;
}

export const reportSummaryService = {
  async generateSummary(companyId: string, domain: string, period: string): Promise<ReportSummary> {
    const rawMetrics = await dataRepository.getMetrics({ companyId, domain, period });
    const metrics = rawMetrics as unknown as MetricRow[];
    
    const kpis: KPI[] = [];
    const insights: string[] = [];
    let summary = "";
    let title = `Executive ${domain.charAt(0).toUpperCase() + domain.slice(1)} Report`;

    if (metrics.length === 0) {
      return {
        companyId,
        domain,
        period,
        title,
        kpis: [],
        insights: ["No data available for the selected period."],
        summary: "There is insufficient data to generate a detailed executive summary for this period."
      };
    }

    if (domain === "finance") {
      const revenue = Number(metrics.find(m => m.metric_name === "revenue")?.metric_value || 0);
      const expenses = Number(metrics.find(m => m.metric_name === "expenses")?.metric_value || 0);
      const profit = Number(metrics.find(m => m.metric_name === "profit")?.metric_value || 0);
      const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

      kpis.push({ label: "Revenue", value: revenue });
      kpis.push({ label: "Expenses", value: expenses });
      kpis.push({ label: "Profit", value: profit });
      kpis.push({ label: "Margin", value: `${margin.toFixed(1)}%` });

      if (profit > 0) {
        insights.push("The company is profitable in this period.");
        if (margin > 20) insights.push("Healthy profit margin detected (>20%).");
      } else {
        insights.push("The company recorded a loss or break-even in this period.");
      }
      
      summary = `The financial performance for ${period} shows a total revenue of ${revenue.toLocaleString()} with expenses of ${expenses.toLocaleString()}, resulting in a net profit of ${profit.toLocaleString()}.`;
    } 
    else if (domain === "rh") {
      const rate = Number(metrics.find(m => m.metric_name === "absenteeism_rate")?.metric_value || 0);
      const hours = Number(metrics.find(m => m.metric_name === "absence_hours")?.metric_value || 0);
      const events = Number(metrics.find(m => m.metric_name === "absence_events")?.metric_value || 0);

      kpis.push({ label: "Absenteeism Rate", value: `${rate.toFixed(2)}%` });
      kpis.push({ label: "Absence Hours", value: hours });
      kpis.push({ label: "Absence Events", value: events });

      if (rate < 3) {
        insights.push("Absenteeism rate is within healthy industry standards (<3%).");
      } else {
        insights.push("Absenteeism rate is above target levels, suggesting potential operational impact.");
      }
      
      summary = `HR metrics for ${period} indicate an absenteeism rate of ${rate.toFixed(2)}%, with a total of ${hours} hours lost across ${events} recorded events.`;
    }
    else if (domain === "operations") {
      const production = Number(metrics.find(m => m.metric_name === "total_production")?.metric_value || 0);
      const efficiency = Number(metrics.find(m => m.metric_name === "average_efficiency")?.metric_value || 0);
      const events = Number(metrics.find(m => m.metric_name === "production_events")?.metric_value || 0);

      kpis.push({ label: "Total Production", value: production });
      kpis.push({ label: "Average Efficiency", value: `${efficiency.toFixed(1)}%` });
      kpis.push({ label: "Production Events", value: events });

      if (efficiency > 85) {
        insights.push("Operational efficiency is high (>85%).");
      } else {
        insights.push("Efficiency levels indicate room for process optimization.");
      }
      
      summary = `Operations for ${period} achieved a total production volume of ${production} units with an average efficiency of ${efficiency.toFixed(1)}% across ${events} production cycles.`;
    }

    return {
      companyId,
      domain,
      period,
      title,
      kpis,
      insights,
      summary
    };
  }
};
