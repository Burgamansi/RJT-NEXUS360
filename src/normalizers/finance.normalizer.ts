import { parseNumeric, normalizeDate, trimString } from "../utils/normalization.js";

export function normalizeFinance(row: any) {
  const keys = Object.keys(row);
  
  // Find reference date
  const dateKey = keys.find(k => k.toLowerCase().includes("data") || k.toLowerCase().includes("periodo") || k.toLowerCase().includes("date"));
  const referenceDate = dateKey ? normalizeDate(row[dateKey]) : new Date().toISOString().split("T")[0];

  // Map fields based on keywords
  const revenueKey = keys.find(k => ["receita", "faturamento", "revenue"].some(kw => k.toLowerCase().includes(kw)));
  const expensesKey = keys.find(k => ["despesa", "expenses"].some(kw => k.toLowerCase().includes(kw)));
  const costKey = keys.find(k => ["custo", "cost"].some(kw => k.toLowerCase().includes(kw)));
  const profitKey = keys.find(k => ["lucro", "profit"].some(kw => k.toLowerCase().includes(kw)));

  return {
    referenceDate,
    domain: "finance",
    type: "dre",
    data: {
      revenue: revenueKey ? parseNumeric(row[revenueKey]) : null,
      expenses: expensesKey ? parseNumeric(row[expensesKey]) : null,
      cost: costKey ? parseNumeric(row[costKey]) : null,
      profit: profitKey ? parseNumeric(row[profitKey]) : null
    }
  };
}
