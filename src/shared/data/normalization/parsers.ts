import type { FieldAliases, NormalizationIssue, SpreadsheetCell, SpreadsheetRow } from "./types";

const normalizeKey = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase();

export function readCell(row: SpreadsheetRow, aliases: readonly string[]): SpreadsheetCell {
  const normalizedAliases = new Set(aliases.map(normalizeKey));
  const entry = Object.entries(row).find(([key]) => normalizedAliases.has(normalizeKey(key)));
  return entry?.[1];
}

export function readText(row: SpreadsheetRow, aliases: readonly string[], fallback = "") {
  const value = readCell(row, aliases);

  if (value === null || value === undefined) {
    return fallback;
  }

  return String(value).trim() || fallback;
}

export function readNumber(row: SpreadsheetRow, aliases: readonly string[], fallback = 0) {
  const value = readCell(row, aliases);

  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  const normalized = String(value)
    .replace(/[^\d,.-]/g, "")
    .replace(/\.(?=\d{3}(\D|$))/g, "")
    .replace(",", ".");
  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : fallback;
}

export function readNullableNumber(row: SpreadsheetRow, aliases: readonly string[]) {
  const value = readCell(row, aliases);

  if (value === null || value === undefined || value === "") {
    return null;
  }

  return readNumber(row, aliases, 0);
}

export function readDateText(row: SpreadsheetRow, aliases: readonly string[]) {
  const value = readCell(row, aliases);

  if (value instanceof Date && Number.isFinite(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    excelEpoch.setUTCDate(excelEpoch.getUTCDate() + value);
    return excelEpoch.toISOString().slice(0, 10);
  }

  const text = value === null || value === undefined ? "" : String(value).trim();
  if (!text) {
    return null;
  }

  const brDate = text.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/);
  if (brDate) {
    const [, day, month, rawYear] = brDate;
    const year = rawYear.length === 2 ? `20${rawYear}` : rawYear;
    return `${year.padStart(4, "0")}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  const date = new Date(text);
  return Number.isFinite(date.getTime()) ? date.toISOString().slice(0, 10) : null;
}

export function validateRequired(row: SpreadsheetRow, rowIndex: number, aliases: FieldAliases) {
  const issues: NormalizationIssue[] = [];

  Object.entries(aliases).forEach(([field, fieldAliases]) => {
    const value = readCell(row, fieldAliases);
    if (value === null || value === undefined || value === "") {
      issues.push({ rowIndex, field, message: "Required field is empty or missing." });
    }
  });

  return issues;
}

export function includesNormalized(value: string, candidates: readonly string[]) {
  const normalizedValue = normalizeKey(value);
  return candidates.some((candidate) => normalizedValue.includes(normalizeKey(candidate)));
}
