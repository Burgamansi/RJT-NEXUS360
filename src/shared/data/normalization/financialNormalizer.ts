import type { FinancialEntry } from "../../../features/financial-intelligence/data/financialTypes";
import { includesNormalized, readDateText, readNumber, readText, validateRequired } from "./parsers";
import type { FieldAliases, NormalizationResult, SpreadsheetRow } from "./types";

const requiredAliases: FieldAliases = {
  postingDate: ["Data Lancamento", "Data Lançamento"],
  launchType: ["Tipo Lancamento", "Tipo Lançamento"],
  costCode: ["Codigo Custo", "Código Custo"],
  amount: ["Valor"],
  realizedAmount: ["Valor Real"],
};

export function normalizeFinancialRows(rows: SpreadsheetRow[]): NormalizationResult<FinancialEntry> {
  const issues = rows.flatMap((row, index) => validateRequired(row, index, requiredAliases));
  const records = rows.map((row): FinancialEntry => {
    const launchTypeText = readText(row, requiredAliases.launchType);
    const amount = readNumber(row, ["Valor"]);
    const inferredType = includesNormalized(launchTypeText, ["receita", "entrada"])
      ? "receita"
      : includesNormalized(launchTypeText, ["transferencia"])
        ? "transferencia"
        : includesNormalized(launchTypeText, ["custo"])
          ? "custo"
          : "despesa";

    return {
      postingDate: readDateText(row, requiredAliases.postingDate) ?? "",
      launchType: inferredType,
      costCode: readText(row, requiredAliases.costCode),
      account: readText(row, ["Banco/Conta", "Banco", "Conta"]),
      document: readText(row, ["OP/NF", "NF", "Documento"]),
      party: readText(row, ["Fornecedor/Cliente", "Fornecedor", "Cliente"]),
      amount,
      dueDate: readDateText(row, ["Vencimento", "Data Vencimento"]) ?? "",
      notes: readText(row, ["Observacoes", "Observações", "Obs"]),
      realizedAmount: readNumber(row, ["Valor Real", "Realizado"], amount),
    };
  });

  return { records, issues };
}
