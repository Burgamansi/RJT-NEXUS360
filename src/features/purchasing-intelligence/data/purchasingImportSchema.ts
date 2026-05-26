export const purchasingImportSchemas = {
  purchasingWorkbook: {
    source: "Compras 2026.xlsx",
    requiredColumns: [
      "Fornecedor",
      "Pedido Compra",
      "Categoria",
      "Valor",
      "Data Pedido",
      "Entrega Prevista",
      "Entrega Real",
      "Lead Time Dias",
      "Incidentes Qualidade",
      "Status Contrato",
    ],
    optionalColumns: [
      "Condicao Pagamento",
      "Comprador",
      "Centro Custo",
      "Item",
      "Quantidade",
      "Preco Unitario",
      "SLA Entrega",
      "Criticidade",
    ],
    moduleUse: "Procurement analytics, supplier management, lead time monitoring and purchasing tables",
  },
} as const;
