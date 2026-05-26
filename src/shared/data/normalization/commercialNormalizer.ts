import type { CommercialRecord } from "../../../features/commercial-intelligence/data/commercialTypes";
import { includesNormalized, readNumber, readText, validateRequired } from "./parsers";
import type { FieldAliases, NormalizationResult, SpreadsheetRow } from "./types";

const requiredAliases: FieldAliases = {
  customer: ["Cliente"],
  productLine: ["Produto", "Tipo Big Bag"],
  revenue: ["Faturamento", "Receita"],
  units: ["Quantidade", "Volume"],
  marginRate: ["Margem"],
};

export function normalizeCommercialLinhas(rows: SpreadsheetRow[]): NormalizationResult<CommercialRecord> {
  const issues = rows.flatMap((row, index) => validateRequired(row, index, requiredAliases));
  const records = rows.map((row): CommercialRecord => {
    const recurrence = readText(row, ["Periodicidade"], "Projeto");
    const status = readText(row, ["Status Pedido", "Status"], "pipeline");

    return {
      customer: readText(row, requiredAliases.customer),
      productLine: readText(row, requiredAliases.productLine),
      revenue: readNumber(row, requiredAliases.revenue),
      units: readNumber(row, requiredAliases.units),
      marginRate: readNumber(row, requiredAliases.marginRate),
      recurrence: includesNormalized(recurrence, ["mensal"]) ? "Mensal" : includesNormalized(recurrence, ["bimestral"]) ? "Bimestral" : includesNormalized(recurrence, ["semestral"]) ? "Semestral" : includesNormalized(recurrence, ["anual"]) ? "Anual" : "Projeto",
      channel: readText(row, ["Canal"], "Direto"),
      status: includesNormalized(status, ["recorrente"]) ? "recorrente" : includesNormalized(status, ["watch", "risco"]) ? "watch" : includesNormalized(status, ["lider", "leader"]) ? "leader" : "pipeline",
    };
  });

  return { records, issues };
}

