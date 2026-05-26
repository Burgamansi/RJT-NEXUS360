import type { ImportIssue, ParsedSpreadsheet } from "./types";

const normalizeHeader = (header: string, index: number) => {
  const trimmed = header.trim();
  return trimmed || `Column ${index + 1}`;
};

const parseDelimitedLine = (line: string, delimiter: string) => {
  const values: string[] = [];
  let current = "";
  let insideQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === "\"" && insideQuotes && next === "\"") {
      current += "\"";
      index += 1;
      continue;
    }

    if (char === "\"") {
      insideQuotes = !insideQuotes;
      continue;
    }

    if (char === delimiter && !insideQuotes) {
      values.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current.trim());
  return values;
};

const detectDelimiter = (text: string) => {
  const sample = text.split(/\r?\n/).slice(0, 8).join("\n");
  const semicolonCount = (sample.match(/;/g) ?? []).length;
  const commaCount = (sample.match(/,/g) ?? []).length;
  return semicolonCount > commaCount ? ";" : ",";
};

const findHeaderIndex = (lines: string[], delimiter: string) => {
  let bestIndex = 0;
  let bestScore = 0;

  lines.slice(0, 20).forEach((line, index) => {
    const cells = parseDelimitedLine(line, delimiter);
    const filled = cells.filter(Boolean).length;
    if (filled > bestScore) {
      bestScore = filled;
      bestIndex = index;
    }
  });

  return bestIndex;
};

export function parseCsvText(text: string): ParsedSpreadsheet {
  const issues: ImportIssue[] = [];
  const delimiter = detectDelimiter(text);
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);

  if (lines.length < 2) {
    return {
      columns: [],
      issues: [{ severity: "erro", message: "File has no readable rows." }],
      rows: [],
    };
  }

  const headerIndex = findHeaderIndex(lines, delimiter);
  const columns = parseDelimitedLine(lines[headerIndex], delimiter).map(normalizeHeader);
  const rows = lines.slice(headerIndex + 1).map((line, rowOffset) => {
    const cells = parseDelimitedLine(line, delimiter);
    return columns.reduce<Record<string, string>>((row, column, columnIndex) => {
      row[column] = cells[columnIndex] ?? "";
      return row;
    }, { __rowNumber: String(headerIndex + rowOffset + 2) });
  });

  if (headerIndex > 0) {
    issues.push({
      severity: "info",
      message: `Detected header on line ${headerIndex + 1}; skipped ${headerIndex} workbook title line(s).`,
    });
  }

  if (rows.length === 0) {
    issues.push({ severity: "erro", message: "No data records were found after the header row." });
  }

  return { columns, issues, rows };
}

export async function parseUploadedFile(file: File): Promise<ParsedSpreadsheet> {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (extension === "csv" || extension === "txt") {
    return parseCsvText(await file.text());
  }

  return {
    columns: [],
    issues: [
      {
        severity: "erro",
        message: "Excel parsing needs the xlsx package. CSV imports are active; retry package install before XLSX/XLSM validation.",
      },
    ],
    rows: [],
  };
}

