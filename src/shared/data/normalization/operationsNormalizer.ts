import type { ProductionRecord } from "../../../features/operations-analytics/data/operationsTypes";
import { includesNormalized, readNumber, readText, validateRequired } from "./parsers";
import type { FieldAliases, NormalizationResult, SpreadsheetRow } from "./types";

const requiredAliases: FieldAliases = {
  productionOrder: ["Ordem Producao", "Ordem Produção"],
  line: ["Linha"],
  machine: ["Maquina", "Máquina"],
  plannedUnits: ["Unidades Planejadas"],
  producedUnits: ["Unidades Produzidas"],
};

export function normalizeProductionLinhas(rows: SpreadsheetRow[]): NormalizationResult<ProductionRecord> {
  const issues = rows.flatMap((row, index) => validateRequired(row, index, requiredAliases));
  const records = rows.map((row): ProductionRecord => {
    const status = readText(row, ["Status"], "running");

    return {
      productionOrder: readText(row, requiredAliases.productionOrder),
      line: readText(row, requiredAliases.line),
      machine: readText(row, requiredAliases.machine),
      plannedUnits: readNumber(row, requiredAliases.plannedUnits),
      producedUnits: readNumber(row, requiredAliases.producedUnits),
      scrapUnits: readNumber(row, ["Refugo"], 0),
      plannedMinutes: readNumber(row, ["Minutos Planejados"], 0),
      downtimeMinutes: readNumber(row, ["Minutos Parada"], 0),
      cycleEfficiency: readNumber(row, ["Eficiencia Ciclo", "Eficiência Ciclo"], 0),
      status: includesNormalized(status, ["released", "liberado"]) ? "released" : includesNormalized(status, ["watch", "monitorar"]) ? "watch" : includesNormalized(status, ["bottleneck", "gargalo"]) ? "bottleneck" : "running",
    };
  });

  return { records, issues };
}

