export const operationsImportSchemas = {
  productionWorkbook: {
    source: "Operacoes 2026.xlsx",
    requiredColumns: [
      "Ordem Producao",
      "Linha",
      "Maquina",
      "Unidades Planejadas",
      "Unidades Produzidas",
      "Refugo",
      "Minutos Planejados",
      "Minutos Parada",
      "Eficiencia Ciclo",
      "Status",
    ],
    optionalColumns: [
      "Turno",
      "Produto",
      "Operador",
      "Motivo Parada",
      "Data Inicio",
      "Data Fim",
      "Capacidade Nominal",
      "Inspecao Qualidade",
    ],
    moduleUse: "OEE, production trends, downtime, line performance and operations tables",
  },
} as const;
