import { useMemo } from "react";
import {
  buildFinancialAnalyticsView,
  buildHrAnalyticsView,
  buildOperationsAnalyticsView,
  buildPurchasingAnalyticsView,
} from "./analytics";
import { useLiveImport } from "./LiveImportContext";
import type { EnterpriseModule } from "./types";

const rowsForModule = (datasets: ReturnType<typeof useLiveImport>["datasets"], module: EnterpriseModule) =>
  datasets.filter((dataset) => dataset.module === module && dataset.status === "pronto").flatMap((dataset) => dataset.rows);

export function useFinancialAnalyticsView() {
  const { datasets } = useLiveImport();
  return useMemo(() => buildFinancialAnalyticsView(rowsForModule(datasets, "financial")), [datasets]);
}

export function useHrAnalyticsView() {
  const { datasets } = useLiveImport();
  return useMemo(() => buildHrAnalyticsView(rowsForModule(datasets, "hr")), [datasets]);
}

export function usePurchasingAnalyticsView() {
  const { datasets } = useLiveImport();
  return useMemo(() => buildPurchasingAnalyticsView(rowsForModule(datasets, "purchasing")), [datasets]);
}

export function useOperationsAnalyticsView() {
  const { datasets } = useLiveImport();
  return useMemo(() => buildOperationsAnalyticsView(rowsForModule(datasets, "operations")), [datasets]);
}

