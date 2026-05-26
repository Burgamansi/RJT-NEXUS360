import type { SpreadsheetCell, SpreadsheetRow } from "../normalization/types";

export type EnterpriseModule = "financial" | "hr" | "purchasing" | "operations";

export type ImportStatus = "queued" | "parsing" | "validating" | "pronto" | "erro";

export type ImportIssue = {
  severity: "info" | "warning" | "erro";
  message: string;
  rowIndex?: number;
  field?: string;
};

export type ColumnMapeamento = Record<string, string>;

export type ImportedDataset = {
  id: string;
  module: EnterpriseModule;
  fileName: string;
  source: "fixture" | "upload";
  status: ImportStatus;
  progress: number;
  rows: SpreadsheetRow[];
  columns: string[];
  mappings: ColumnMapeamento;
  issues: ImportIssue[];
  createdAt: string;
};

export type ParsedSpreadsheet = {
  rows: SpreadsheetRow[];
  columns: string[];
  issues: ImportIssue[];
};

export type ImportCenterState = {
  datasets: ImportedDataset[];
  activeDatasetId: string | null;
};

export type DataPrimitive = Exclude<SpreadsheetCell, Date | undefined>;

