import type { InventoryItem } from "../../../features/inventory-intelligence/data/inventoryTypes";
import { includesNormalized, readNumber, readText, validateRequired } from "./parsers";
import type { FieldAliases, NormalizationResult, SpreadsheetRow } from "./types";

const requiredAliases: FieldAliases = {
  sku: ["SKU", "Codigo", "Código"],
  category: ["Categoria"],
  abcClass: ["Classe ABC"],
  finalValue: ["Estoque Final"],
};

export function normalizeInventoryRows(rows: SpreadsheetRow[]): NormalizationResult<InventoryItem> {
  const issues = rows.flatMap((row, index) => validateRequired(row, index, requiredAliases));
  const records = rows.map((row): InventoryItem => {
    const category = readText(row, requiredAliases.category);
    const abcClass = readText(row, requiredAliases.abcClass);
    const criticality = readText(row, ["Criticidade"], "healthy");

    return {
      sku: readText(row, requiredAliases.sku),
      category: includesNormalized(category, ["processo", "wip"]) ? "Produto em Processo" : includesNormalized(category, ["acabado"]) ? "Material Acabado" : "Materia-prima",
      abcClass: includesNormalized(abcClass, ["sem movimento"]) ? "Sem Movimento" : includesNormalized(abcClass, ["estrategico"]) ? "Estrategico" : includesNormalized(abcClass, ["b"]) ? "B" : includesNormalized(abcClass, ["c"]) ? "C" : "A",
      previousValue: readNumber(row, ["Estoque Anterior"], 0),
      finalValue: readNumber(row, requiredAliases.finalValue),
      stockDays: readNumber(row, ["Dias Cobertura"], 0),
      turnoverIndex: readNumber(row, ["Indice Giro", "Índice Giro"], 0),
      criticality: includesNormalized(criticality, ["watch", "monitorar"]) ? "watch" : includesNormalized(criticality, ["critical", "critico", "crítico"]) ? "critical" : includesNormalized(criticality, ["protected", "protegido"]) ? "protected" : "healthy",
    };
  });

  return { records, issues };
}
