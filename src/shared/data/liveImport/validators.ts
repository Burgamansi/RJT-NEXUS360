import type { EnterpriseModule, ImportIssue } from "./types";

const requiredSignals: Record<EnterpriseModule, string[]> = {
  financial: ["valor", "tipo"],
  hr: ["funcionario", "colaborador", "turnover", "admiss", "demiss", "atestado"],
  operations: ["produc", "linha", "maquina", "parada", "eficien"],
  purchasing: ["fornecedor", "pedido", "valor", "categoria", "compra"],
};

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export function inferColumnMapeamentos(columns: string[], module: EnterpriseModule) {
  const normalizedColumns = columns.map((column) => [column, normalize(column)] as const);
  const signals = requiredSignals[module];

  return signals.reduce<Record<string, string>>((mapping, signal) => {
    const found = normalizedColumns.find(([, normalized]) => normalized.includes(signal));
    if (found) {
      mapping[signal] = found[0];
    }
    return mapping;
  }, {});
}

export function validateImport(columns: string[], rowCount: number, module: EnterpriseModule): ImportIssue[] {
  const issues: ImportIssue[] = [];
  const normalizedColumns = columns.map(normalize);
  const signals = requiredSignals[module];
  const matchedSignals = signals.filter((signal) => normalizedColumns.some((column) => column.includes(signal)));

  if (rowCount === 0) {
    issues.push({ severity: "erro", message: "No importable rows found." });
  }

  if (matchedSignals.length === 0) {
    issues.push({
      severity: "warning",
      message: "No obvious module columns detected. Use column mapping before trusting analytics.",
    });
  } else {
    issues.push({
      severity: "info",
      message: `${matchedSignals.length} module signal(s) matched for ${module}.`,
    });
  }

  if (columns.length > 0) {
    issues.push({
      severity: "info",
      message: `${columns.length} columns and ${rowCount} rows pronto for preview and transformation.`,
    });
  }

  return issues;
}

