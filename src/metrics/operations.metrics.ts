import { MetricResult } from "../types/index.js";

export function generateOperationsMetrics(data: any[], uploadId: string): MetricResult[] {
  const metrics: MetricResult[] = [];
  
  const periods = [...new Set(data.map(d => d.reference_date.substring(0, 7)))];

  for (const period of periods) {
    const periodData = data.filter(d => d.reference_date.startsWith(period));
    
    const total_production = periodData.reduce((acc, curr) => acc + (curr.payload.data.quantityProduced || 0), 0);
    const production_events = periodData.length;
    
    const validEfficiencyRows = periodData.filter(d => d.payload.data.efficiency !== null && d.payload.data.efficiency !== undefined);
    const average_efficiency = validEfficiencyRows.length > 0 
      ? validEfficiencyRows.reduce((acc, curr) => acc + curr.payload.data.efficiency, 0) / validEfficiencyRows.length 
      : 0;

    metrics.push({ metricName: "total_production", period, value: total_production });
    metrics.push({ metricName: "average_efficiency", period, value: average_efficiency });
    metrics.push({ metricName: "production_events", period, value: production_events });
  }

  return metrics;
}
