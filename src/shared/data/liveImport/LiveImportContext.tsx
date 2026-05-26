import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { parseCsvText, parseUploadedFile } from "./parsers";
import type { EnterpriseModule, ImportedDataset, ImportIssue } from "./types";
import { inferColumnMapeamentos, validateImport } from "./validators";

const storageKey = "rjt-nexus360-live-imports-v1";

type LiveImportContextValue = {
  datasets: ImportedDataset[];
  activeDataset: ImportedDataset | null;
  activeDatasetId: string | null;
  setActiveDatasetId: (id: string) => void;
  importFile: (file: File, module: EnterpriseModule) => Promise<void>;
  updateMapping: (datasetId: string, field: string, column: string) => void;
  getModuleRows: (module: EnterpriseModule) => ImportedDataset[];
};

const LiveImportContext = createContext<LiveImportContextValue | null>(null);

const createDataset = (
  fileName: string,
  module: EnterpriseModule,
  source: ImportedDataset["source"],
  rows: ImportedDataset["rows"],
  columns: string[],
  issues: ImportIssue[],
): ImportedDataset => ({
  columns,
  createdAt: new Date().toISOString(),
  fileName,
  id: `${module}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  issues: [...issues, ...validateImport(columns, rows.length, module)],
  mappings: inferColumnMapeamentos(columns, module),
  module,
  progress: rows.length > 0 ? 100 : 0,
  rows,
  source,
  status: rows.length > 0 ? "pronto" : "erro",
});

export function LiveImportProvider({ children }: { children: ReactNode }) {
  const [datasets, setDatasets] = useState<ImportedDataset[]>(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      return stored ? (JSON.parse(stored) as ImportedDataset[]) : [];
    } catch {
      return [];
    }
  });
  const [activeDatasetId, setActiveDatasetId] = useState<string | null>(datasets[0]?.id ?? null);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(datasets.slice(0, 12)));
  }, [datasets]);

  useEffect(() => {
    const hasFixture = datasets.some((dataset) => dataset.source === "fixture" && dataset.fileName === "custo-dre-2026.csv");
    if (hasFixture) {
      return;
    }

    let cancelled = false;
    fetch("/data/real-imports/custo-dre-2026.csv")
      .then((response) => (response.ok ? response.text() : Promise.reject(new Error("fixture unavailable"))))
      .then((text) => {
        if (cancelled) {
          return;
        }
        const parsed = parseCsvText(text);
        const dataset = createDataset("custo-dre-2026.csv", "financial", "fixture", parsed.rows, parsed.columns, parsed.issues);
        setDatasets((current) => [dataset, ...current]);
        setActiveDatasetId((current) => current ?? dataset.id);
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [datasets]);

  const importFile = useCallback(async (file: File, module: EnterpriseModule) => {
    const queuedId = `${module}-${Date.now()}`;
    const queuedDataset: ImportedDataset = {
      columns: [],
      createdAt: new Date().toISOString(),
      fileName: file.name,
      id: queuedId,
      issues: [{ severity: "info", message: "Upload accepted. Parsing started." }],
      mappings: {},
      module,
      progress: 24,
      rows: [],
      source: "upload",
      status: "parsing",
    };

    setDatasets((current) => [queuedDataset, ...current]);
    setActiveDatasetId(queuedId);

    const parsed = await parseUploadedFile(file);
    const dataset = createDataset(file.name, module, "upload", parsed.rows, parsed.columns, parsed.issues);
    dataset.id = queuedId;
    setDatasets((current) => current.map((item) => (item.id === queuedId ? dataset : item)));
  }, []);

  const updateMapping = useCallback((datasetId: string, field: string, column: string) => {
    setDatasets((current) =>
      current.map((dataset) =>
        dataset.id === datasetId ? { ...dataset, mappings: { ...dataset.mappings, [field]: column } } : dataset,
      ),
    );
  }, []);

  const getModuleRows = useCallback(
    (module: EnterpriseModule) => datasets.filter((dataset) => dataset.module === module && dataset.status === "pronto"),
    [datasets],
  );

  const activeDataset = useMemo(
    () => datasets.find((dataset) => dataset.id === activeDatasetId) ?? datasets[0] ?? null,
    [activeDatasetId, datasets],
  );

  const value = useMemo(
    () => ({ activeDataset, activeDatasetId, datasets, getModuleRows, importFile, setActiveDatasetId, updateMapping }),
    [activeDataset, activeDatasetId, datasets, getModuleRows, importFile, updateMapping],
  );

  return <LiveImportContext.Provider value={value}>{children}</LiveImportContext.Provider>;
}

export function useLiveImport() {
  const context = useContext(LiveImportContext);
  if (!context) {
    throw new Error("useLiveImport must be used inside LiveImportProvider");
  }
  return context;
}


