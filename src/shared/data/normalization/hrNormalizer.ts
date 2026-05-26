import type { HrAbsenceRecord, HrMonthlyConsolidated, HrTerminationRecord } from "../../../features/hr-analytics/data/hrTypes";
import { readDateText, readNumber, readText, validateRequired } from "./parsers";
import type { FieldAliases, NormalizationResult, SpreadsheetRow } from "./types";

const consolidatedAliases: FieldAliases = {
  month: ["Mes", "Mês"],
  headcount: ["Total colaboradores"],
  workedHours: ["Horas trabalhadas"],
  hires: ["Contratacoes", "Contratações"],
  terminations: ["Demissoes", "Demissões"],
  turnoverRate: ["Turnover"],
};

export function normalizeHrConsolidatedLinhas(rows: SpreadsheetRow[]): NormalizationResult<HrMonthlyConsolidated> {
  const issues = rows.flatMap((row, index) => validateRequired(row, index, consolidatedAliases));
  const records = rows.map((row): HrMonthlyConsolidated => ({
    month: readText(row, consolidatedAliases.month),
    headcount: readNumber(row, consolidatedAliases.headcount),
    workedHours: readNumber(row, consolidatedAliases.workedHours),
    hires: readNumber(row, consolidatedAliases.hires),
    terminations: readNumber(row, consolidatedAliases.terminations),
    turnoverRate: readNumber(row, consolidatedAliases.turnoverRate),
    turnoverTarget: readNumber(row, ["Meta Turnover-6%", "Meta Turnover"], 6),
    justifiedHours: readNumber(row, ["Justificados"], 0),
    unjustifiedHours: readNumber(row, ["Nao justificados", "Não justificados"], 0),
    delayHours: readNumber(row, ["Atrasos"], 0),
  }));

  return { records, issues };
}

export function normalizeHrAbsenceLinhas(rows: SpreadsheetRow[]): NormalizationResult<HrAbsenceRecord> {
  const required: FieldAliases = { category: ["CID"], month: ["Mes", "Mês"], days: ["QUANTOS DIAS", "Dias"], employee: ["NOME", "Nome"] };
  const issues = rows.flatMap((row, index) => validateRequired(row, index, required));
  const records = rows.map((row): HrAbsenceRecord => ({
    category: readText(row, required.category),
    month: readText(row, required.month),
    days: readNumber(row, required.days),
    employee: readText(row, required.employee),
  }));

  return { records, issues };
}

export function normalizeHrTerminationLinhas(rows: SpreadsheetRow[]): NormalizationResult<HrTerminationRecord> {
  const required: FieldAliases = { employee: ["NOME", "Nome"], role: ["CARGO", "Cargo"], date: ["DATA DE DEMISSAO", "DATA DE DEMISSÃƒO"], company: ["EMPRESA"], reason: ["MOTIVO DESLIGAMENTO"] };
  const issues = rows.flatMap((row, index) => validateRequired(row, index, required));
  const records = rows.map((row): HrTerminationRecord => ({
    employee: readText(row, required.employee),
    role: readText(row, required.role),
    date: readDateText(row, required.date) ?? "",
    company: readText(row, required.company),
    reason: readText(row, required.reason),
  }));

  return { records, issues };
}

