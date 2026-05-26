export const hrImportSchemas = {
  consolidatedIndicators: {
    source: "Indicadores RH 2026.xlsm",
    worksheet: "Consolidado",
    requiredColumns: [
      "Mes",
      "Total colaboradores",
      "Horas trabalhadas",
      "Contratacoes",
      "Demissoes",
      "Turnover",
      "Meta Turnover-6%",
      "Justificados",
      "Nao justificados",
      "Atrasos",
    ],
    moduleUse: "KPI row, workforce analytics, turnover and absenteeism trends",
  },
  medicalCertificates: {
    source: "CONTROLE DE ATESTADOS -2026.xlsx",
    worksheet: "Data",
    requiredColumns: ["CID", "Mes", "QUANTOS DIAS", "DATA", "NOME"],
    moduleUse: "Absenteeism center, absence categories and anomaly alerts",
  },
  turnoverRecords: {
    source: "TURNOVER 2026.xlsx",
    worksheetPattern: "Monthly sheets",
    requiredColumns: ["NOME", "CARGO", "DATA DE DEMISSAO", "EMPRESA", "MOTIVO DESLIGAMENTO"],
    moduleUse: "Turnover diagnostics, retention risk and termination table",
  },
} as const;
