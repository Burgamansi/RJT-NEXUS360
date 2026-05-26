import { Outlet } from "react-router-dom";
import { GlobalFilterBar } from "./GlobalFilterBar";
import { MobileCommandBar } from "./MobileCommandBar";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

export function AppShell() {
  return (
    <div className="min-h-screen bg-background font-body-base text-on-surface">
      <TopBar />
      <div className="mx-auto flex max-w-container-max gap-gutter px-margin-mobile py-6 md:px-margin-desktop">
        <Sidebar />
        <main className="w-full flex-1 overflow-hidden">
          <GlobalFilterBar />
          <Outlet />
        </main>
      </div>
      <MobileCommandBar />
    </div>
  );
}
