import type { PurchasingRecord } from "../../../features/purchasing-intelligence/data/purchasingTypes";
import { includesNormalized, readDateText, readNullableNumber, readText, validateRequired } from "./parsers";
import type { FieldAliases, NormalizationResult, SpreadsheetRow } from "./types";

const requiredAliases: FieldAliases = {
  supplier: ["Fornecedor"],
  purchaseOrder: ["Pedido Compra", "Pedido de Compra", "PO"],
  category: ["Categoria"],
};

export function normalizePurchasingRows(rows: SpreadsheetRow[]): NormalizationResult<PurchasingRecord> {
  const issues = rows.flatMap((row, index) => validateRequired(row, index, requiredAliases));
  const records = rows.map((row): PurchasingRecord => {
    const contractStatus = readText(row, ["Status Contrato", "Contrato"], "pending");

    return {
      supplier: readText(row, requiredAliases.supplier),
      purchaseOrder: readText(row, requiredAliases.purchaseOrder),
      category: readText(row, requiredAliases.category),
      amount: readNullableNumber(row, ["Valor"]),
      orderDate: readDateText(row, ["Data Pedido"]),
      expectedDelivery: readDateText(row, ["Entrega Prevista"]),
      actualDelivery: readDateText(row, ["Entrega Real"]),
      leadTimeDays: readNullableNumber(row, ["Lead Time Dias", "Lead Time"]),
      qualityIncidents: readNullableNumber(row, ["Incidentes Qualidade", "Incidentes"]),
      contractStatus: includesNormalized(contractStatus, ["active", "ativo"]) ? "active" : includesNormalized(contractStatus, ["watch", "monitorar"]) ? "watch" : includesNormalized(contractStatus, ["risk", "risco"]) ? "risk" : "pending",
    };
  });

  return { records, issues };
}
