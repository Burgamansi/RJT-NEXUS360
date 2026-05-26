import { commercialImportSchemas } from "../../features/commercial-intelligence/data/commercialImportSchema";
import { financialImportSchemas } from "../../features/financial-intelligence/data/financialImportSchema";
import { hrImportSchemas } from "../../features/hr-analytics/data/hrImportSchema";
import { inventoryImportSchemas } from "../../features/inventory-intelligence/data/inventoryImportSchema";
import { operationsImportSchemas } from "../../features/operations-analytics/data/operationsImportSchema";
import { purchasingImportSchemas } from "../../features/purchasing-intelligence/data/purchasingImportSchema";

export type ImportModuleStatus = "Ready" | "Template" | "Pending";

export type ImportModuleRegistryItem = {
  module: string;
  source: string;
  formats: string;
  status: ImportModuleStatus;
  readiness: number;
  color: string;
  route: string;
  requiredColumns: readonly string[];
  optionalColumns?: readonly string[];
  moduleUse: string;
};

export const importModuleRegistry: ImportModuleRegistryItem[] = [
  {
    module: "Financeiro / DRE",
    source: financialImportSchemas.dreCost.source,
    formats: "CSV + XLSX",
    status: "Ready",
    readiness: 92,
    color: "bg-primary",
    route: "/financial",
    requiredColumns: financialImportSchemas.dreCost.requiredColumns,
    moduleUse: financialImportSchemas.dreCost.moduleUse,
  },
  {
    module: "RH",
    source: "Indicadores RH 2026.xlsm + atestados + turnover",
    formats: "XLSX + XLSM",
    status: "Ready",
    readiness: 88,
    color: "bg-secondary",
    route: "/hr",
    requiredColumns: hrImportSchemas.consolidatedIndicators.requiredColumns,
    moduleUse: hrImportSchemas.consolidatedIndicators.moduleUse,
  },
  {
    module: "Comercial",
    source: commercialImportSchemas.commercialWorkbook.source,
    formats: "Excel pendente",
    status: "Template",
    readiness: 52,
    color: "bg-secondary-container",
    route: "/commercial",
    requiredColumns: commercialImportSchemas.commercialWorkbook.requiredColumns,
    optionalColumns: commercialImportSchemas.commercialWorkbook.optionalColumns,
    moduleUse: commercialImportSchemas.commercialWorkbook.moduleUse,
  },
  {
    module: "Compras",
    source: purchasingImportSchemas.purchasingWorkbook.source,
    formats: "Excel pendente",
    status: "Template",
    readiness: 38,
    color: "bg-status-critical",
    route: "/purchasing",
    requiredColumns: purchasingImportSchemas.purchasingWorkbook.requiredColumns,
    optionalColumns: purchasingImportSchemas.purchasingWorkbook.optionalColumns,
    moduleUse: purchasingImportSchemas.purchasingWorkbook.moduleUse,
  },
  {
    module: "Operacoes",
    source: operationsImportSchemas.productionWorkbook.source,
    formats: "Excel pendente",
    status: "Template",
    readiness: 44,
    color: "bg-outline",
    route: "/operations",
    requiredColumns: operationsImportSchemas.productionWorkbook.requiredColumns,
    optionalColumns: operationsImportSchemas.productionWorkbook.optionalColumns,
    moduleUse: operationsImportSchemas.productionWorkbook.moduleUse,
  },
  {
    module: "Estoque",
    source: inventoryImportSchemas.inventoryWorkbook.source,
    formats: "Excel pendente",
    status: "Template",
    readiness: 48,
    color: "bg-surface-tint",
    route: "/inventory",
    requiredColumns: inventoryImportSchemas.inventoryWorkbook.requiredColumns,
    optionalColumns: inventoryImportSchemas.inventoryWorkbook.optionalColumns,
    moduleUse: inventoryImportSchemas.inventoryWorkbook.moduleUse,
  },
];

export const importRegistrySummary = {
  readyModules: importModuleRegistry.filter((item) => item.status === "Ready").length,
  targetModules: importModuleRegistry.length,
  mappedColumns: importModuleRegistry.reduce((total, item) => total + item.requiredColumns.length, 0),
  averageReadiness: Math.round(importModuleRegistry.reduce((total, item) => total + item.readiness, 0) / importModuleRegistry.length),
};
