import { parseNumeric, normalizeDate, trimString } from "../utils/normalization.js";

export function normalizeOperations(row: any) {
  const keys = Object.keys(row);
  
  // Find reference date
  const dateKey = keys.find(k => k.toLowerCase().includes("data") || k.toLowerCase().includes("periodo") || k.toLowerCase().includes("date"));
  const referenceDate = dateKey ? normalizeDate(row[dateKey]) : new Date().toISOString().split("T")[0];

  // Map fields
  const machineKey = keys.find(k => ["maquina", "machine", "equipamento"].some(kw => k.toLowerCase().includes(kw)));
  const operatorKey = keys.find(k => ["operador", "operator", "funcionario"].some(kw => k.toLowerCase().includes(kw)));
  const quantityKey = keys.find(k => ["quantidade", "producao", "quantity", "produced"].some(kw => k.toLowerCase().includes(kw)));
  const efficiencyKey = keys.find(k => ["eficiencia", "efficiency"].some(kw => k.toLowerCase().includes(kw)));

  return {
    referenceDate,
    domain: "operations",
    type: "production",
    data: {
      machine: machineKey ? trimString(row[machineKey]) : null,
      operator: operatorKey ? trimString(row[operatorKey]) : null,
      quantityProduced: quantityKey ? parseNumeric(row[quantityKey]) : null,
      efficiency: efficiencyKey ? parseNumeric(row[efficiencyKey]) : null
    }
  };
}
