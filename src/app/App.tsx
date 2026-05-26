import { Navigate, Route, Routes } from "react-router-dom";
import { AuthPage } from "../features/auth/AuthPage";
import { BudgetIntelligencePage } from "../features/budget-intelligence/BudgetIntelligencePage";
import { CommercialIntelligencePage } from "../features/commercial-intelligence/CommercialIntelligencePage";
import { DataImportCenterPage } from "../features/data-import-center/DataImportCenterPage";
import { ExecutiveDashboardPage } from "../features/executive-dashboard/ExecutiveDashboardPage";
import { FinancialIntelligencePage } from "../features/financial-intelligence/FinancialIntelligencePage";
import { HrAnalyticsPage } from "../features/hr-analytics/HrAnalyticsPage";
import { InventoryIntelligencePage } from "../features/inventory-intelligence/InventoryIntelligencePage";
import { OperationsAnalyticsPage } from "../features/operations-analytics/OperationsAnalyticsPage";
import { PurchasingIntelligencePage } from "../features/purchasing-intelligence/PurchasingIntelligencePage";
import { LiveImportProvider } from "../shared/data/liveImport/LiveImportContext";
import { AppShell } from "../shared/layout/AppShell";

export function App() {
  return (
    <LiveImportProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route element={<AppShell />}>
          <Route path="/budget" element={<BudgetIntelligencePage />} />
          <Route path="/dashboard" element={<ExecutiveDashboardPage />} />
          <Route path="/commercial" element={<CommercialIntelligencePage />} />
          <Route path="/data-import" element={<DataImportCenterPage />} />
          <Route path="/executive" element={<ExecutiveDashboardPage />} />
          <Route path="/financial" element={<FinancialIntelligencePage />} />
          <Route path="/hr" element={<HrAnalyticsPage />} />
          <Route path="/inventory" element={<InventoryIntelligencePage />} />
          <Route path="/operations" element={<OperationsAnalyticsPage />} />
          <Route path="/purchasing" element={<PurchasingIntelligencePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </LiveImportProvider>
  );
}
