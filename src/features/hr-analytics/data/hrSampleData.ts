import type { HrAbsenceRecord, HrMonthlyConsolidated, HrTerminationRecord } from "./hrTypes";

export const hrMonthlyConsolidated: HrMonthlyConsolidated[] = [
  {
    month: "Jan",
    headcount: 50,
    workedHours: 10770,
    hires: 6,
    terminations: 4,
    turnoverRate: 10.42,
    turnoverTarget: 6,
    justifiedHours: 638,
    unjustifiedHours: 112,
    delayHours: 36,
  },
  {
    month: "Fev",
    headcount: 52,
    workedHours: 9736,
    hires: 7,
    terminations: 5,
    turnoverRate: 12,
    turnoverTarget: 6,
    justifiedHours: 425,
    unjustifiedHours: 141,
    delayHours: 29,
  },
  {
    month: "Mar",
    headcount: 50,
    workedHours: 9172,
    hires: 9,
    terminations: 11,
    turnoverRate: 19.23,
    turnoverTarget: 6,
    justifiedHours: 453,
    unjustifiedHours: 257,
    delayHours: 56,
  },
];

export const hrTerminationRecords: HrTerminationRecord[] = [
  {
    employee: "VITORIA PEREIRA DA SILVA",
    role: "COSTUREIRA",
    date: "2026-01-29",
    company: "LPL",
    reason: "Comportamento e produtividade",
  },
  {
    employee: "LARISSA SANTOS DE OLIVEIRA",
    role: "ABASTECEDOR DE LINHA DE PRODUCAO",
    date: "2026-02-13",
    company: "RAFCORTE",
    reason: "Baixa produtividade e perfil fora",
  },
  {
    employee: "SABRINA PEREIRA MARQUES",
    role: "ABASTECEDOR DE LINHA DE PRODUCAO",
    date: "2026-03-12",
    company: "RAFCORTE",
    reason: "Solicitou desligamento por salario e beneficios",
  },
];

export const hrAbsenceRecords: HrAbsenceRecord[] = [
  { category: "Falta", month: "Jan", days: 2, employee: "Registro consolidado" },
  { category: "Sem CID", month: "Fev", days: 3, employee: "Registro consolidado" },
  { category: "Gripe", month: "Fev", days: 1, employee: "Registro consolidado" },
  { category: "Declaracao de comparecimento", month: "Mar", days: 2, employee: "Registro consolidado" },
  { category: "Odontologico", month: "Mar", days: 1, employee: "Registro consolidado" },
  { category: "Dores musculares", month: "Mar", days: 2, employee: "Registro consolidado" },
];
