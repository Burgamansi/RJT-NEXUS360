export const inventoryImportSchemas = {
  inventoryWorkbook: {
    source: "Estoque 2026.xlsx",
    requiredColumns: [
      "SKU",
      "Categoria",
      "Classe ABC",
      "Estoque Anterior",
      "Estoque Final",
      "Dias Cobertura",
      "Indice Giro",
      "Criticidade",
    ],
    optionalColumns: ["Descricao", "Unidade", "Quantidade", "Custo Medio", "Local", "Ultimo Movimento", "Fornecedor", "Pedido Reposicao"],
    moduleUse: "Stock analytics, ABC curve, inventory control, stock risk and inventory tables",
  },
} as const;
