import { Navigate, Route, Routes } from "react-router-dom";
import { AuthPage } from "../features/auth/AuthPage";
import { ExecutiveDashboardPage } from "../features/executive-dashboard/ExecutiveDashboardPage";
import { FinancialIntelligencePage } from "../features/financial-intelligence/FinancialIntelligencePage";
import { AppShell } from "../shared/layout/AppShell";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth" replace />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route element={<AppShell />}>
        <Route path="/executive" element={<ExecutiveDashboardPage />} />
        <Route path="/financial" element={<FinancialIntelligencePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/executive" replace />} />
    </Routes>
  );
}
