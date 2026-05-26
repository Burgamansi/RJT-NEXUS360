import { Navigate, Route, Routes } from "react-router-dom";
import { AuthPage } from "../features/auth/AuthPage";
import { ExecutiveDashboardPage } from "../features/executive-dashboard/ExecutiveDashboardPage";
import { FinancialIntelligencePage } from "../features/financial-intelligence/FinancialIntelligencePage";
import { HrAnalyticsPage } from "../features/hr-analytics/HrAnalyticsPage";
import { OperationsAnalyticsPage } from "../features/operations-analytics/OperationsAnalyticsPage";
import { PurchasingIntelligencePage } from "../features/purchasing-intelligence/PurchasingIntelligencePage";
import { AppShell } from "../shared/layout/AppShell";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route element={<AppShell />}>
        <Route path="/dashboard" element={<ExecutiveDashboardPage />} />
        <Route path="/executive" element={<ExecutiveDashboardPage />} />
        <Route path="/financial" element={<FinancialIntelligencePage />} />
        <Route path="/hr" element={<HrAnalyticsPage />} />
        <Route path="/operations" element={<OperationsAnalyticsPage />} />
        <Route path="/purchasing" element={<PurchasingIntelligencePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
