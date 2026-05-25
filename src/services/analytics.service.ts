import type ExcelJS from "exceljs";
// officeCrypto loaded lazily inside importExcelData to avoid esbuild bundling issues
import { db } from "../config/db.js";
import { DEFAULT_TENANT_ID } from "../config/brand.js";
import { fileService } from "./file.service.js";
import { dataRepository } from "../repositories/index.js";
import { generateFinanceMetrics } from "../metrics/finance.metrics.js";
import { generateRHMetrics } from "../metrics/rh.metrics.js";
import { generateOperationsMetrics } from "../metrics/operations.metrics.js";
import { extractFinanceDreValidation } from "../parsers/excel.parser.js";

function cellPeriod(cell: ExcelJS.Cell): string {
  const val = cell.value;
  if (val instanceof Date) {
    return `${val.getFullYear()}-${String(val.getMonth() + 1).padStart(2, "0")}`;
  }
  return cell.text?.trim() ?? "";
}

function cellNumber(cell: ExcelJS.Cell): number {
  const val = cell.value;
  if (val instanceof Date || val === null || val === undefined) return 0;
  const n = Number(val);
  return isNaN(n) ? 0 : n;
}

export const analyticsService = {
  /**
   * Processes the uploaded workbook through the unified real Excel extraction pipeline and persists metrics
   */
  async importExcelData(
    fileBuffer: Buffer,
    password?: string,
    type: "finance" | "hr" = "finance",
    companyId: string = DEFAULT_TENANT_ID
  ) {
    const isDev = process.env.NODE_ENV !== "production";
    if (isDev) {
      console.log(`[DEV LOG] importExcelData hit. companyId: ${companyId}, type: ${type}`);
    }

    let finalBuffer = fileBuffer;

    if (password) {
      console.log(`[analyticsService] Decrypting file...`);
      try {
        const { default: officeCrypto } = await import("officecrypto-tool");
        finalBuffer = await officeCrypto.decrypt(fileBuffer, { password });
      } catch (e) {
        console.warn(`Decryption failed, using original buffer:`, e);
      }
    }

    // 1. Signature validation using the dedicated extractor (PK zip signature check)
    extractFinanceDreValidation(finalBuffer);

    // 2. Invoke our unified fileService to parse, validate, save raw/normalized, and generate metrics
    const filename = type === "finance" ? "finance_import.xlsx" : "rh_import.xlsx";
    const mockFile = {
      originalname: filename,
      buffer: finalBuffer,
      fieldname: "file",
      encoding: "7bit",
      mimetype: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      size: finalBuffer.length
    } as Express.Multer.File;

    const uploadRes = await fileService.handleUpload(mockFile, companyId);
    
    // Now trigger processing of the upload to normalize and persist metrics
    const processRes = await fileService.processUpload(uploadRes.uploadId, companyId);

    if (isDev) {
      console.log(`[DEV LOG] Import processing success. uploadId: ${uploadRes.uploadId}`);
      console.log(`[DEV LOG] Extracted rows: ${uploadRes.rowsRead}`);
      console.log(`[DEV LOG] Generated metrics count: ${processRes.metricsGenerated.length}`);
    }

    return {
      success: true,
      uploadId: uploadRes.uploadId,
      detectedType: uploadRes.detectedType,
      detectedDomain: uploadRes.detectedDomain,
      rowsExtractedCount: uploadRes.rowsRead,
      metricsGeneratedCount: processRes.metricsGenerated.length
    };
  },

  /**
   * Regenerates metrics records from existing normalized_data
   */
  async recalculateIndicators(companyId: string, period?: string) {
    const isDev = process.env.NODE_ENV !== "production";
    if (isDev) {
      console.log(`[analyticsService] Recalculating indicators for companyId: ${companyId}, period: ${period || "all"}`);
    }

    // 1. Fetch normalized data for this company
    let sql = "SELECT * FROM normalized_data WHERE company_id = ?";
    const args: any[] = [companyId];
    if (period) {
      sql += " AND reference_date LIKE ?";
      args.push(`${period}%`);
    }

    const rowsRes = await db.execute({ sql, args });
    if (isDev) {
      console.log(`[DEV LOG] Found ${rowsRes.rows.length} normalized rows to recalculate`);
    }

    if (rowsRes.rows.length === 0) {
      return { success: true, message: "Nenhum dado normalizado encontrado para recalcular.", metricsGeneratedCount: 0 };
    }

    // 2. Map & group rows by upload_id to preserve origin uploads
    const normalizedRows = rowsRes.rows.map((row: any) => ({
      ...row,
      payload: typeof row.payload === "string" ? JSON.parse(row.payload) : row.payload
    }));

    const groups: Record<string, typeof normalizedRows> = {};
    for (const row of normalizedRows) {
      const uId = row.upload_id || "default";
      if (!groups[uId]) groups[uId] = [];
      groups[uId].push(row);
    }

    let totalMetricsCount = 0;

    for (const [uploadId, groupRows] of Object.entries(groups)) {
      const firstRow = groupRows[0];
      const domain = firstRow.domain;
      const type = firstRow.type;

      if (isDev) {
        console.log(`[DEV LOG] Recalculating uploadId: ${uploadId}, domain: ${domain}, type: ${type}`);
      }

      // Safety: clear old metrics for this upload context
      if (uploadId !== "default") {
        await dataRepository.deleteMetricsByUpload(uploadId, companyId);
      }

      let metricsGenerated: any[] = [];
      if (domain === "finance") {
        metricsGenerated = generateFinanceMetrics(groupRows, uploadId);
      } else if (domain === "rh") {
        metricsGenerated = generateRHMetrics(groupRows, uploadId);
      } else if (domain === "operations") {
        metricsGenerated = generateOperationsMetrics(groupRows, uploadId);
      }

      if (isDev) {
        console.log(`[DEV LOG] Generated ${metricsGenerated.length} metrics for uploadId: ${uploadId}`);
      }

      // Save metrics
      for (const metric of metricsGenerated) {
        await dataRepository.saveMetrics(
          domain,
          metric.metricName,
          metric.value,
          metric.period,
          companyId,
          { uploadId, type, recordCount: groupRows.length }
        );
        totalMetricsCount++;
      }
    }

    return {
      success: true,
      message: "Recálculo concluído com sucesso.",
      metricsGeneratedCount: totalMetricsCount
    };
  },

  // Legacy fallback methods (kept for absolute backwards compatibility)
  async processFinanceTabs(workbook: ExcelJS.Workbook, companyId: string) {
    const dreSheet = workbook.getWorksheet("DRE") || workbook.getWorksheet(1);
    const costsSheet = workbook.getWorksheet("Cost") || workbook.getWorksheet(2);

    if (dreSheet) {
      console.log(`[analyticsService] Processing DRE sheet...`);
      const rows: Promise<void>[] = [];
      dreSheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;
        const period = cellPeriod(row.getCell(1));
        const amount = cellNumber(row.getCell(3));
        if (period && amount !== 0) {
          rows.push(
            db.execute({
              sql: "INSERT INTO faturamento (company_id, period, amount, description, category, cost_center) VALUES (?, ?, ?, ?, ?, ?)",
              args: [companyId, period, amount, row.getCell(2).text, row.getCell(4).text, row.getCell(5).text],
            }).then(() => {})
          );
        }
      });
      await Promise.all(rows);
    }

    if (costsSheet) {
      console.log(`[analyticsService] Processing Costs sheet...`);
      const rows: Promise<void>[] = [];
      costsSheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;
        const period = cellPeriod(row.getCell(1));
        const type = row.getCell(2).text?.trim();
        const amount = cellNumber(row.getCell(3));
        if (period && amount !== 0) {
          rows.push(
            db.execute({
              sql: "INSERT INTO custos (company_id, type, period, amount, description, category, cost_center) VALUES (?, ?, ?, ?, ?, ?, ?)",
              args: [companyId, type, period, amount, row.getCell(4).text, row.getCell(5).text, row.getCell(6).text],
            }).then(() => {})
          );
        }
      });
      await Promise.all(rows);
    }
  },

  async processHRTabs(workbook: ExcelJS.Workbook, companyId: string) {
    const hrSheet = workbook.getWorksheet("RH") || workbook.getWorksheet("HR") || workbook.getWorksheet(1);
    if (!hrSheet) {
      console.warn("[analyticsService] No HR sheet found in workbook");
      return;
    }

    console.log(`[analyticsService] Processing HR sheet: "${hrSheet.name}"...`);
    const rows: Promise<void>[] = [];

    hrSheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
      const period = cellPeriod(row.getCell(1));
      const admissions = cellNumber(row.getCell(2));
      const dismissals = cellNumber(row.getCell(3));
      const active = cellNumber(row.getCell(4));
      const absenteeism = cellNumber(row.getCell(5));

      if (period) {
        rows.push(
          db.execute({
            sql: `INSERT INTO hr_indicators (company_id, period, admissions, dismissals, active_employees, absenteeism)
                  VALUES (?, ?, ?, ?, ?, ?)
                  ON CONFLICT(company_id, period) DO UPDATE SET
                  admissions = excluded.admissions,
                  dismissals = excluded.dismissals,
                  active_employees = excluded.active_employees,
                  absenteeism = excluded.absenteeism`,
            args: [companyId, period, admissions, dismissals, active, absenteeism],
          }).then(() => {})
        );
      }
    });

    await Promise.all(rows);
    console.log(`[analyticsService] Inserted/updated ${rows.length} HR rows for company ${companyId}`);
  }
};
