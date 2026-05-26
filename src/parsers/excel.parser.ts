// xlsx loaded lazily — avoids esbuild bundling native addon at module init (Vercel ERR_MODULE_NOT_FOUND)
import type * as XlsxType from "xlsx";
let _xlsx: typeof XlsxType;
async function getXlsx(): Promise<typeof XlsxType> {
  if (!_xlsx) {
    const mod = await import("xlsx");
    _xlsx = (mod.default ?? mod) as typeof XlsxType;
  }
  return _xlsx;
}

function parseMonthToPeriod(monthName: string, year: string = "2026"): string {
  const months: Record<string, string> = {
    janeiro: "01", jan: "01",
    fevereiro: "02", fev: "02",
    março: "03", marco: "03", mar: "03", març: "03",
    abril: "04", abr: "04",
    maio: "05", mai: "05",
    junho: "06", jun: "06",
    julho: "07", jul: "07",
    agosto: "08", ago: "08",
    setembro: "09", set: "09",
    outubro: "10", out: "10",
    novembro: "11", nov: "11",
    dezembro: "12", dez: "12"
  };
  
  const normalized = monthName.toLowerCase().trim();
  
  // Check direct month names or substrings
  for (const [key, code] of Object.entries(months)) {
    if (normalized.includes(key)) {
      return `${year}-${code}`;
    }
  }

  // Regex check for YYYY-MM
  const matchYm = normalized.match(/(\d{4})[-\/](\d{2})/);
  if (matchYm) {
    return `${matchYm[1]}-${matchYm[2]}`;
  }

  // Fallback regex check for MM/YYYY
  const matchMy = normalized.match(/(\d{2})[-\/](\d{4})/);
  if (matchMy) {
    return `${matchMy[2]}-${matchMy[1]}`;
  }

  return `${year}-01`;
}

function parseDaysValue(val: any): number {
  if (val === null || val === undefined) return 0;
  const str = String(val).toLowerCase().trim();
  if (str.includes("parcial")) {
    return 0.5;
  }
  const parsed = parseFloat(str.replace(",", "."));
  return isNaN(parsed) ? 0 : parsed;
}

function parseDateValue(val: any): string {
  if (!val) return new Date().toISOString().split("T")[0];
  if (val instanceof Date) {
    return val.toISOString().split("T")[0];
  }
  // Try to parse string dates like DD/MM/YYYY
  const str = String(val).trim();
  const match = str.match(/(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})/);
  if (match) {
    let year = match[3];
    if (year.length === 2) year = "20" + year;
    const month = match[2].padStart(2, "0");
    const day = match[1].padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  return str;
}

/**
 * Dedicated Validation Extractor:
 * Checks standard ZIP/PK signature (0x50, 0x4B, 0x03, 0x04) to cleanly intercept legacy/encrypted/unsupported formats
 */
export function extractFinanceDreValidation(buffer: Buffer): void {
  const isStandardXlsx = buffer.length > 4 && buffer[0] === 0x50 && buffer[1] === 0x4B && buffer[2] === 0x03 && buffer[3] === 0x04;
  if (!isStandardXlsx) {
    const error = new Error("This file is not a standard XLSX workbook. Open it in Excel and save again as Excel Workbook (*.xlsx).") as any;
    error.status = 400;
    throw error;
  }
}

/**
 * Dedicated Extractor: Indicadores RH
 */
export function extractRhIndicators(workbook: XlsxType.WorkBook, sheetNames: string[]): any[] {
  const extractedRows: any[] = [];
  const consolidadoName = sheetNames.find((s: string) => s.toLowerCase().includes("consolidado")) || sheetNames[0];
  const grid = _xlsx.utils.sheet_to_json(workbook.Sheets[consolidadoName], { header: 1 }) as any[][];
  
  // Find header row
  let headerRowIdx = -1;
  for (let r = 0; r < grid.length; r++) {
    const row = grid[r];
    if (!row) continue;
    const isHeader = row.some(cell => {
      if (!cell) return false;
      const str = String(cell).toLowerCase();
      return str.includes("mês") || str.includes("mes") || str.includes("colaboradores");
    });
    if (isHeader) {
      headerRowIdx = r;
      break;
    }
  }

  if (headerRowIdx !== -1) {
    const headers = grid[headerRowIdx].map(h => String(h || "").toLowerCase().trim());
    
    const monthCol = headers.findIndex(h => h.includes("mês") || h.includes("mes") || h.includes("periodo"));
    const headcountCol = headers.findIndex(h => h.includes("total colaboradores") || h.includes("headcount") || h.includes("colaboradores") || h.includes("ativos"));
    const workedHoursCol = headers.findIndex(h => h.includes("trabalhadas") || h.includes("horas"));
    const hiresCol = headers.findIndex(h => h.includes("contratações") || h.includes("contratacoes") || h.includes("admiss"));
    const dismissalsCol = headers.findIndex(h => h.includes("demiss"));
    const turnoverCol = headers.findIndex(h => h === "turnover" || h.includes("rotatividade"));
    const targetCol = headers.findIndex(h => h.includes("meta"));
    const justifiedCol = headers.findIndex(h => h.includes("justificad"));
    const unjustifiedCol = headers.findIndex(h => h.includes("não justificad") || h.includes("nao justificad"));
    const delaysCol = headers.findIndex(h => h.includes("atrasos") || h.includes("atraso"));

    for (let r = headerRowIdx + 1; r < grid.length; r++) {
      const row = grid[r];
      if (!row || !row[monthCol]) continue;
      const monthVal = String(row[monthCol]).trim();
      if (!monthVal || ["total", "média", "media"].some(t => monthVal.toLowerCase().includes(t))) continue;

      const period = parseMonthToPeriod(monthVal);
      
      extractedRows.push({
        __domain: "rh",
        __type: "rh_indicators",
        month: monthVal,
        period,
        headcount: Number(row[headcountCol]) || 0,
        active_employees: Number(row[headcountCol]) || 0,
        worked_hours: Number(row[workedHoursCol]) || 0,
        hires: Number(row[hiresCol]) || 0,
        admissions: Number(row[hiresCol]) || 0,
        dismissals: Number(row[dismissalsCol]) || 0,
        turnover_rate: Number(row[turnoverCol]) || 0,
        turnover: Number(row[turnoverCol]) || 0,
        turnover_target: Number(row[targetCol]) || 0,
        justified_absences: Number(row[justifiedCol]) || 0,
        unjustified_absences: Number(row[unjustifiedCol]) || 0,
        delays: Number(row[delaysCol]) || 0
      });
    }
  }
  return extractedRows;
}

/**
 * Dedicated Extractor: CONTROLE DE ATESTADOS
 */
export function extractAbsenceCertificates(workbook: XlsxType.WorkBook, sheetNames: string[]): any[] {
  const extractedRows: any[] = [];
  for (const sheetName of sheetNames) {
    const grid = _xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 }) as any[][];
    
    let headerRowIdx = -1;
    for (let r = 0; r < grid.length; r++) {
      const row = grid[r];
      if (!row) continue;
      const isHeader = row.some(cell => String(cell || "").toLowerCase().trim() === "cid");
      if (isHeader) {
        headerRowIdx = r;
        break;
      }
    }

    if (headerRowIdx !== -1) {
      const headers = grid[headerRowIdx].map(h => String(h || "").toLowerCase().trim());
      const cidCol = headers.findIndex(h => h === "cid");
      const monthCol = headers.findIndex(h => h.includes("mês") || h.includes("mes"));
      const daysCol = headers.findIndex(h => h.includes("quantos dias") || h.includes("dias") || h.includes("afastamento"));
      const dateCol = headers.findIndex(h => h.includes("data") || h.includes("dia"));
      const nameCol = headers.findIndex(h => h.includes("nome") || h.includes("colaborador") || h.includes("funcionario"));

      for (let r = headerRowIdx + 1; r < grid.length; r++) {
        const row = grid[r];
        if (!row || !row[cidCol]) continue;
        
        const cidVal = String(row[cidCol]).trim();
        if (!cidVal || cidVal.toLowerCase() === "cid") continue;

        extractedRows.push({
          __domain: "rh",
          __type: "absences_certificates",
          cid: cidVal.toUpperCase(),
          month: row[monthCol] ? String(row[monthCol]).trim() : "",
          days: parseDaysValue(row[daysCol]),
          date: parseDateValue(row[dateCol]),
          employee_name: row[nameCol] ? String(row[nameCol]).trim() : "Desconhecido"
        });
      }
    }
  }
  return extractedRows;
}

/**
 * Dedicated Extractor: TURNOVER
 */
export function extractTurnover(workbook: XlsxType.WorkBook, sheetNames: string[]): any[] {
  const extractedRows: any[] = [];
  for (const sheetName of sheetNames) {
    const period = parseMonthToPeriod(sheetName);
    const grid = _xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 }) as any[][];
    
    let currentBlock: "admission" | "dismissal" | null = null;
    let headers: string[] = [];
    let nameCol = -1, roleCol = -1, dateCol = -1, companyCol = -1, reasonCol = -1;

    for (let r = 0; r < grid.length; r++) {
      const row = grid[r];
      if (!row) continue;

      // Check if we entered a new block
      const rowText = row.map(c => String(c || "").toUpperCase()).join(" ");
      if (rowText.includes("ADMISSÃO") || rowText.includes("ADMISSOES") || rowText.includes("PERIODE ADMISSÃO")) {
        currentBlock = "admission";
        headers = [];
        nameCol = -1; roleCol = -1; dateCol = -1; companyCol = -1; reasonCol = -1;
        continue;
      }
      if (rowText.includes("DEMISSÃO") || rowText.includes("DEMISSOES") || rowText.includes("PERIODE DEMISSÃO")) {
        currentBlock = "dismissal";
        headers = [];
        nameCol = -1; roleCol = -1; dateCol = -1; companyCol = -1; reasonCol = -1;
        continue;
      }

      if (currentBlock) {
        // If headers not parsed yet, find header row
        const isHeader = row.some(cell => {
          const str = String(cell || "").toLowerCase().trim();
          return str === "nome" || str === "colaborador" || str === "funcionario";
        });
        
        if (isHeader && headers.length === 0) {
          headers = row.map(h => String(h || "").toLowerCase().trim());
          nameCol = headers.findIndex(h => h === "nome" || h.includes("colaborador") || h.includes("funcionario"));
          roleCol = headers.findIndex(h => h.includes("cargo") || h.includes("função") || h.includes("funcao") || h.includes("role"));
          dateCol = headers.findIndex(h => h.includes("data") || h.includes("dia"));
          companyCol = headers.findIndex(h => h.includes("empresa") || h.includes("filial") || h.includes("unidade"));
          reasonCol = headers.findIndex(h => h.includes("motivo") || h.includes("causa") || h.includes("rescisao"));
          continue;
        }

        if (headers.length > 0 && nameCol !== -1) {
          const nameVal = row[nameCol] ? String(row[nameCol]).trim() : "";
          if (!nameVal || nameVal.toLowerCase() === "nome" || nameVal.toLowerCase().includes("total")) continue;

          extractedRows.push({
            __domain: "rh",
            __type: "turnover",
            month: sheetName,
            movement_type: currentBlock,
            employee_name: nameVal,
            role: roleCol !== -1 && row[roleCol] ? String(row[roleCol]).trim() : "N/A",
            date: dateCol !== -1 ? parseDateValue(row[dateCol]) : period + "-01",
            company: companyCol !== -1 && row[companyCol] ? String(row[companyCol]).trim() : "Principal",
            termination_reason: reasonCol !== -1 && row[reasonCol] ? String(row[reasonCol]).trim() : null
          });
        }
      }
    }
  }
  return extractedRows;
}

export async function parseExcel(buffer: Buffer): Promise<any[]> {
  // Validate standard ZIP/PK signature
  extractFinanceDreValidation(buffer);

  // Ensure xlsx is loaded before helper functions use _xlsx
  await getXlsx();

  let workbook: XlsxType.WorkBook;
  try {
    workbook = _xlsx.read(buffer, { type: "buffer", cellDates: true });
  } catch (err: any) {
    const error = new Error("This file is not a standard XLSX workbook. Open it in Excel and save again as Excel Workbook (*.xlsx).") as any;
    error.status = 400;
    throw error;
  }

  const sheetNames = workbook.SheetNames;
  const isDev = process.env.NODE_ENV !== "production";
  if (isDev) {
    console.log(`[DEV LOG] workbook sheets:`, sheetNames);
  }

  // 1. Spreadsheet Type Detection Logic
  let detectedType: "dre" | "rh_indicators" | "absences_certificates" | "turnover" | "unknown" = "unknown";
  let detectedDomain: "finance" | "rh" | "operations" | "unknown" = "unknown";

  // Check sheet names first
  const hasConsolidado = sheetNames.some((s: string) => s.toLowerCase().includes("consolidado"));
  const hasAbsences = sheetNames.some((s: string) => ["planilha1", "planilha2", "planilha3", "atestados", "ausencias"].includes(s.toLowerCase().trim()));
  const hasMonthlySheets = sheetNames.some((s: string) => ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"].some((m: string) => s.toLowerCase().includes(m)));

  // Inspect sheets and their headers
  let consolidadoSheetName = sheetNames.find((s: string) => s.toLowerCase().includes("consolidado")) || sheetNames[0];
  let mainSheetGrid = _xlsx.utils.sheet_to_json(workbook.Sheets[consolidadoSheetName], { header: 1 }) as any[][];

  // Flat scan for search keywords
  let hasCid = false;
  let hasTurnoverHeader = false;
  let hasWorkedHours = false;
  
  for (const row of mainSheetGrid) {
    if (!row) continue;
    for (const cell of row) {
      if (!cell) continue;
      const val = String(cell).toLowerCase().trim();
      if (val === "cid") hasCid = true;
      if (val.includes("turnover")) hasTurnoverHeader = true;
      if (val.includes("trabalhadas") || val.includes("horas")) hasWorkedHours = true;
    }
  }

  if (hasConsolidado && (hasTurnoverHeader || hasWorkedHours)) {
    detectedType = "rh_indicators";
    detectedDomain = "rh";
  } else if (hasCid) {
    detectedType = "absences_certificates";
    detectedDomain = "rh";
  } else if (hasMonthlySheets && !hasTurnoverHeader) {
    detectedType = "turnover";
    detectedDomain = "rh";
  } else {
    detectedType = "dre";
    detectedDomain = "finance";
  }

  if (isDev) {
    console.log(`[DEV LOG] detected workbook type: ${detectedType}, domain: ${detectedDomain}`);
  }

  // 2. Specialized Extractions
  let extractedRows: any[] = [];

  if (detectedType === "rh_indicators") {
    extractedRows = extractRhIndicators(workbook, sheetNames);
  } else if (detectedType === "absences_certificates") {
    extractedRows = extractAbsenceCertificates(workbook, sheetNames);
  } else if (detectedType === "turnover") {
    extractedRows = extractTurnover(workbook, sheetNames);
  } else {
    // STANDARD / DRE EXTRACTION
    const sheetName = sheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = _xlsx.utils.sheet_to_json(worksheet);
    data.forEach((row: any) => {
      extractedRows.push({
        ...row,
        __domain: "finance",
        __type: "dre"
      });
    });
  }

  if (isDev) {
    console.log(`[DEV LOG] extracted row count: ${extractedRows.length}`);
  }

  return extractedRows;
}
