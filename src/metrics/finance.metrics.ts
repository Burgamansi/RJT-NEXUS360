import { MetricResult } from "../types/index.js";

export function generateFinanceMetrics(data: any[], uploadId: string): MetricResult[] {
  const metrics: MetricResult[] = [];
  
  // Group by period (YYYY-MM)
  const periods = [...new Set(data.map(d => d.reference_date.substring(0, 7)))];

  for (const period of periods) {
    const periodData = data.filter(d => d.reference_date.startsWith(period));
    
    const revenue = periodData.reduce((acc, curr) => acc + (curr.payload.data.revenue || 0), 0);
    const expenses = periodData.reduce((acc, curr) => acc + (curr.payload.data.expenses || 0), 0);
    const cost = periodData.reduce((acc, curr) => acc + (curr.payload.data.cost || 0), 0);
    
    // Profit rule: sum if exists, otherwise calculate
    const profit = periodData.reduce((acc, curr) => {
      if (curr.payload.data.profit !== null && curr.payload.data.profit !== undefined) {
        return acc + curr.payload.data.profit;
      }
      return acc + ((curr.payload.data.revenue || 0) - (curr.payload.data.expenses || 0) - (curr.payload.data.cost || 0));
    }, 0);

    metrics.push({ metricName: "revenue", period, value: revenue });
    metrics.push({ metricName: "expenses", period, value: expenses });
    metrics.push({ metricName: "cost", period, value: cost });
    metrics.push({ metricName: "profit", period, value: profit });
  }

  return metrics;
}
