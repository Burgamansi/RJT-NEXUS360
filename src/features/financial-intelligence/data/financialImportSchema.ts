export const financialImportSchemas = {
  dreCost: {
    source: "Custo - DRE 2026.csv",
    requiredColumns: [
      "Data Lancamento",
      "Tipo Lancamento",
      "Codigo Custo",
      "Banco/Conta",
      "OP/NF",
      "Fornecedor/Cliente",
      "Valor",
      "Vencimento",
      "Observacoes",
      "Valor Real",
    ],
    moduleUse: "DRE analytics, cash flow center, expense distribution and financial tables",
  },
} as const;
