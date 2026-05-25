export interface ColumnDefinition {
  key: string;
  label: string;
  required: boolean;
  synonyms: string[];
}

export interface SpreadsheetTemplate {
  id: string;
  name: string;
  domain: string;
  type: string;
  columns: ColumnDefinition[];
}

export const spreadsheetTemplates: SpreadsheetTemplate[] = [
  {
    id: "finance-dre",
    name: "Financeiro (DRE)",
    domain: "finance",
    type: "dre",
    columns: [
      { key: "revenue", label: "Receita/Faturamento", required: true, synonyms: ["receita", "faturamento", "vendas", "venda", "revenue", "gross_revenue"] },
      { key: "expenses", label: "Despesas/Custos", required: true, synonyms: ["despesa", "despesas", "custo", "custos", "expenses", "costs", "spending"] },
      { key: "profit", label: "Lucro Líquido", required: true, synonyms: ["lucro", "lucro_liquido", "profit", "net_profit", "resultado"] },
      { key: "period", label: "Período (YYYY-MM)", required: true, synonyms: ["periodo", "mes", "data", "period", "month", "date"] },
      { key: "ebitda", label: "EBITDA", required: false, synonyms: ["ebitda", "laida"] },
    ]
  },
  {
    id: "rh-absenteeism",
    name: "RH (Absenteísmo)",
    domain: "rh",
    type: "absenteeism",
    columns: [
      { key: "employee_id", label: "ID Funcionário", required: true, synonyms: ["funcionario", "colaborador", "id", "matricula", "employee", "employee_id"] },
      { key: "absence_hours", label: "Horas de Ausência", required: true, synonyms: ["horas", "ausencia", "falta", "hours", "absence_hours"] },
      { key: "absence_type", label: "Tipo de Ausência", required: true, synonyms: ["tipo", "categoria", "type", "absence_type", "motivo"] },
      { key: "date", label: "Data", required: true, synonyms: ["data", "dia", "date", "day"] },
    ]
  },
  {
    id: "operations-production",
    name: "Operações (Produção)",
    domain: "operations",
    type: "production",
    columns: [
      { key: "product_id", label: "ID Produto", required: true, synonyms: ["produto", "item", "sku", "product", "product_id"] },
      { key: "quantity", label: "Quantidade", required: true, synonyms: ["quantidade", "produzido", "quantity", "qty", "amount"] },
      { key: "efficiency", label: "Eficiência (%)", required: true, synonyms: ["eficiencia", "performance", "efficiency"] },
      { key: "date", label: "Data", required: true, synonyms: ["data", "dia", "date", "day"] },
    ]
  }
];

export const templateService = {
  getTemplateByDomain(domain: string): SpreadsheetTemplate | undefined {
    return spreadsheetTemplates.find(t => t.domain === domain);
  },

  getTemplateById(id: string): SpreadsheetTemplate | undefined {
    return spreadsheetTemplates.find(t => t.id === id);
  },

  suggestMapping(headers: string[], template: SpreadsheetTemplate): Record<string, string> {
    const mapping: Record<string, string> = {};
    const normalizedHeaders = headers.map(h => h.toLowerCase().trim());

    for (const col of template.columns) {
      // Try exact match first
      let foundIndex = normalizedHeaders.indexOf(col.key.toLowerCase());
      
      // Try label match
      if (foundIndex === -1) {
        foundIndex = normalizedHeaders.indexOf(col.label.toLowerCase());
      }

      // Try synonyms
      if (foundIndex === -1) {
        for (const synonym of col.synonyms) {
          foundIndex = normalizedHeaders.findIndex(h => h.includes(synonym.toLowerCase()));
          if (foundIndex !== -1) break;
        }
      }

      if (foundIndex !== -1) {
        mapping[col.key] = headers[foundIndex];
      }
    }

    return mapping;
  },

  downloadTemplate(templateId: string) {
    const template = this.getTemplateById(templateId);
    if (!template) return;

    const headers = template.columns.map(c => c.label).join(",");
    const blob = new Blob([headers], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `modelo_${template.id}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
};
