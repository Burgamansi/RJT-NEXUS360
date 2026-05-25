import { Domain, DataType } from "../types/index.js";
import { spreadsheetTemplates } from "../services/template.service.js";

export interface MappingResult {
  domain: Domain;
  type: DataType;
  confidence: number;
  mapping: Record<string, string>;
  missingRequired: string[];
}

export function detectDomainAndType(data: any[]): MappingResult {
  if (!data || data.length === 0) {
    return { domain: "unknown", type: "unknown", confidence: 0, mapping: {}, missingRequired: [] };
  }

  if (data[0] && data[0].__domain && data[0].__type) {
    return {
      domain: data[0].__domain,
      type: data[0].__type,
      confidence: 1.0,
      mapping: {},
      missingRequired: []
    };
  }

  const headers = Object.keys(data[0]);
  const normalizedHeaders = headers.map(h => h.toLowerCase().trim());
  
  let bestMatch: MappingResult = { 
    domain: "unknown", 
    type: "unknown", 
    confidence: 0, 
    mapping: {}, 
    missingRequired: [] 
  };

  for (const template of spreadsheetTemplates) {
    let matchedCount = 0;
    const currentMapping: Record<string, string> = {};
    const missing: string[] = [];

    template.columns.forEach(col => {
      // Try to find a header that matches the column name or any of its synonyms
      const foundHeaderIndex = normalizedHeaders.findIndex(h => 
        h === col.key.toLowerCase() || col.synonyms.some(syn => h.includes(syn.toLowerCase()))
      );

      if (foundHeaderIndex !== -1) {
        currentMapping[col.key] = headers[foundHeaderIndex];
        matchedCount++;
      } else if (col.required) {
        missing.push(col.label);
      }
    });

    const confidence = matchedCount / template.columns.filter(c => c.required).length;

    if (confidence > bestMatch.confidence) {
      bestMatch = {
        domain: template.domain as Domain,
        type: template.type as DataType,
        confidence,
        mapping: currentMapping,
        missingRequired: missing
      };
    }
  }

  return bestMatch;
}
