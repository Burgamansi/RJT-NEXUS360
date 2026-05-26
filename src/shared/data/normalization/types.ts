export type SpreadsheetCell = string | number | boolean | Date | null | undefined;
export type SpreadsheetRow = Record<string, SpreadsheetCell>;

export type NormalizationIssue = {
  rowIndex: number;
  field: string;
  message: string;
};

export type NormalizationResult<TRecord> = {
  records: TRecord[];
  issues: NormalizationIssue[];
};

export type FieldAliases = Record<string, readonly string[]>;
