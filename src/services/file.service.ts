import { parseExcel } from "../parsers/excel.parser.js";
import { parseCSV } from "../parsers/csv.parser.js";
import { detectDomainAndType } from "../detectors/domain.detector.js";
import { uploadRepository, dataRepository } from "../repositories/index.js";
import { normalizeFinance } from "../normalizers/finance.normalizer.js";
import { normalizeRH } from "../normalizers/rh.normalizer.js";
import { normalizeOperations } from "../normalizers/operations.normalizer.js";
import { generateFinanceMetrics } from "../metrics/finance.metrics.js";
import { generateRHMetrics } from "../metrics/rh.metrics.js";
import { generateOperationsMetrics } from "../metrics/operations.metrics.js";

export const fileService = {
  async handleUpload(file: Express.Multer.File, companyId: string) {
    if (!file) throw new Error("No file provided");
    if (!companyId) throw new Error("Missing companyId");

    const isExcel = file.originalname.endsWith(".xlsx") || file.originalname.endsWith(".xls");
    const isCSV = file.originalname.endsWith(".csv");

    if (!isExcel && !isCSV) {
      throw new Error("Unsupported file extension. Use .xlsx, .xls, or .csv");
    }

    const data = isExcel ? await parseExcel(file.buffer) : await parseCSV(file.buffer);
    
    if (!data || data.length === 0) {
      throw new Error("The uploaded file is empty");
    }

    const headers = Object.keys(data[0]);
    const detection = detectDomainAndType(data);
    
    const uploadId = await uploadRepository.create({
      companyId,
      filename: file.originalname,
      originalName: file.originalname,
      domain: detection.domain,
      type: detection.type,
      status: "uploaded"
    });

    const isDev = process.env.NODE_ENV !== "production";
    if (isDev) {
      console.log(`[DEV LOG] companyId: ${companyId}`);
      console.log(`[DEV LOG] detected spreadsheet type: ${detection.type} (domain: ${detection.domain})`);
      console.log(`[DEV LOG] extracted row count: ${data.length}`);
      console.log(`[DEV LOG] uploadId: ${uploadId}`);
    }

    let rawRowsSaved = 0;
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      if (Object.values(row).every(v => v === null || v === undefined || v === "")) continue;
      await dataRepository.saveRawData(uploadId, companyId, i, row);
      rawRowsSaved++;
    }

    if (rawRowsSaved === 0) {
      throw new Error("O arquivo enviado não contém linhas de dados válidas.");
    }

    return { 
      success: true,
      uploadId, 
      fileName: file.originalname, 
      detectedDomain: detection.domain, 
      detectedType: detection.type, 
      confidence: detection.confidence,
      mapping: detection.mapping,
      missingRequired: detection.missingRequired,
      rowsRead: data.length,
      rawRowsSaved,
      headers
    };
  },

  async processUpload(uploadId: string, companyId: string, mapping?: Record<string, string>, overrideDomain?: string, overrideType?: string) {
    const isDev = process.env.NODE_ENV !== "production";
    if (!companyId) {
      throw new Error("companyId é obrigatório para processar o upload.");
    }
    
    // Recupera o upload garantindo o filtro do companyId no banco
    const upload = await uploadRepository.findById(uploadId, companyId) as any;
    if (isDev) {
      console.log(`[DEV LOG] upload encontrado? ${!!upload}`);
    }
    if (!upload) throw new Error("Upload não encontrado ou acesso não autorizado.");

    // Validação cruzada explícita de segurança
    if (upload.company_id !== companyId) {
      throw new Error("Acesso não autorizado ao recurso deste tenant.");
    }

    const domain = overrideDomain || upload.domain;
    const type = overrideType || upload.type;

    const rawData = await dataRepository.getRawByUpload(uploadId, companyId);
    if (isDev) {
      console.log(`[DEV LOG] raw_data encontrado? ${rawData && rawData.length > 0} (count: ${rawData?.length})`);
    }
    
    let normalizedRowsSaved = 0;
    for (const raw of rawData) {
      const row = raw.payload;
      
      // Apply mapping if provided
      let mappedRow = row;
      if (mapping) {
        mappedRow = {};
        for (const [internalKey, fileKey] of Object.entries(mapping)) {
          mappedRow[internalKey] = row[fileKey];
        }
      }

      let normalized = null;
      try {
        if (domain === "finance") normalized = normalizeFinance(mappedRow);
        else if (domain === "rh") normalized = normalizeRH(mappedRow);
        else if (domain === "operations") normalized = normalizeOperations(mappedRow);
      } catch (err) {
        console.error(`Normalization error:`, err);
      }

      if (normalized) {
        await dataRepository.saveNormalized(
          uploadId, 
          companyId, 
          domain, 
          type, 
          normalized.referenceDate, 
          normalized
        );
        normalizedRowsSaved++;
      }
    }

    const normalizedData = await dataRepository.getNormalizedByUpload(uploadId, companyId);
    if (isDev) {
      console.log(`[DEV LOG] normalized_data encontrado? ${normalizedData && normalizedData.length > 0} (count: ${normalizedData?.length})`);
    }
    
    if (normalizedData.length === 0) {
      return { 
        success: true, 
        uploadId, 
        domain, 
        type, 
        normalizedRowsProcessed: 0, 
        metricsGenerated: [] 
      };
    }

    // Safety: delete old metrics for this upload context
    await dataRepository.deleteMetricsByUpload(uploadId, companyId);

    let metricsGenerated: any[] = [];
    if (domain === "finance") {
      metricsGenerated = generateFinanceMetrics(normalizedData, uploadId);
    } else if (domain === "rh") {
      metricsGenerated = generateRHMetrics(normalizedData, uploadId);
    } else if (domain === "operations") {
      metricsGenerated = generateOperationsMetrics(normalizedData, uploadId);
    }

    if (isDev) {
      console.log(`[DEV LOG] generated metrics count: ${metricsGenerated.length}`);
    }

    // Save metrics
    for (const metric of metricsGenerated) {
      await dataRepository.saveMetrics(
        domain,
        metric.metricName,
        metric.value,
        metric.period,
        companyId,
        { uploadId, type, recordCount: normalizedData.length }
      );
    }

    await uploadRepository.updateStatus(uploadId, "processed", companyId);

    return { 
      success: true, 
      uploadId, 
      domain, 
      type, 
      normalizedRowsProcessed: normalizedData.length, 
      metricsGenerated 
    };
  }
};
