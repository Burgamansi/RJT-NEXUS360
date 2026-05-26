import { NavLink } from "react-router-dom";
import { primaryNavigation } from "../config/navigation";
import { MaterialIcon } from "../ui/MaterialIcon";

export function Sidebar() {
  return (
    <aside className="sticky top-28 hidden h-[calc(100vh-160px)] w-72 shrink-0 flex-col gap-gutter rounded-xl border border-glass-stroke bg-surface-container-lowest/90 px-6 py-8 shadow-[40px_0_80px_rgba(0,0,0,0.05)] backdrop-blur-2xl lg:flex">
      <div className="mb-6">
        <h2 className="font-headline-lg text-headline-lg font-black text-primary">Nexus HQ</h2>
        <p className="font-body-sm text-outline">Global Workspace</p>
      </div>

      <nav className="flex flex-col gap-2">
        {primaryNavigation.map((item) => (
          <NavLink
            key={`${item.label}-${item.path}`}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 rounded-lg p-3 transition-all duration-200 hover:translate-x-1 hover:bg-surface-container-low hover:text-on-surface ${
                isActive
                  ? "border-l-4 border-secondary bg-secondary-container/20 font-bold text-secondary"
                  : "text-outline"
              }`
            }
          >
            <MaterialIcon name={item.icon} />
            <span className="font-label-caps">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto border-t border-glass-stroke pt-8">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-container">
            <MaterialIcon name="cloud_sync" className="text-sm text-white" />
          </div>
          <div>
            <p className="font-label-caps text-[10px] leading-tight">VERSION</p>
            <p className="font-data-mono text-[12px] text-outline">v3.2.0-Alpha</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
