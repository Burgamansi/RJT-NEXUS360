import { NavLink } from "react-router-dom";
import { primaryNavigation } from "../config/navigation";
import { MaterialIcon } from "../ui/MaterialIcon";

export function Sidebar() {
  return (
    <aside className="sticky top-24 hidden h-[calc(100vh-128px)] w-64 shrink-0 flex-col rounded-lg border border-outline-variant bg-white px-4 py-5 shadow-sm lg:flex">
      <div className="mb-6 border-b border-outline-variant pb-5">
        <div className="flex items-center gap-3">
          <div aria-label="Logotipo RJT" className="brand-mark h-11 w-11 shrink-0 rounded-md border border-outline-variant bg-white" role="img" />
          <div className="min-w-0">
            <h2 className="truncate text-sm font-bold text-primary">RJT Nexus360</h2>
            <p className="text-xs text-on-surface-variant">Gestão industrial</p>
          </div>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {primaryNavigation.map((item) => (
          <NavLink
            key={`${item.label}-${item.path}`}
            to={item.path}
            className={({ isActive }) =>
              `flex min-h-10 items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-primary text-white"
                  : "text-on-surface-variant hover:bg-surface-container-low hover:text-primary"
              }`
            }
          >
            <MaterialIcon name={item.icon} className="text-[20px]" />
            <span className="truncate font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto border-t border-outline-variant pt-5">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-status-success/10">
            <MaterialIcon name="cloud_sync" className="text-sm text-status-success" />
          </div>
          <div>
            <p className="text-[10px] font-bold leading-tight text-outline">VERSÃO</p>
            <p className="font-data-mono text-[12px] text-on-surface-variant">3.2.0</p>
          </div>
        </div>
      </div>
    </aside>
  );
}


