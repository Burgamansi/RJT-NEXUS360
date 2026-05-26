export const commercialImportSchemas = {
  commercialWorkbook: {
    source: "Indicadores Comerciais 2026.xlsx",
    requiredColumns: [
      "Cliente",
      "Produto",
      "Tipo Big Bag",
      "Faturamento",
      "Quantidade",
      "Margem",
      "Periodicidade",
      "Canal",
      "Status Pedido",
    ],
    optionalColumns: ["Orcamento", "Pedido", "Terceiros", "Data Pedido", "Data Entrega", "Representante", "Regiao"],
    moduleUse: "Receita analytics, customer ranking, sales pipeline, recurrence and commercial tables",
  },
} as const;

