import { NavLink } from "react-router-dom";
import { primaryNavigation } from "../config/navigation";
import { MaterialIcon } from "../ui/MaterialIcon";

export function Sidebar() {
  return (
    <aside className="sticky top-28 hidden h-[calc(100vh-160px)] w-72 shrink-0 flex-col gap-gutter rounded-xl border border-white/10 bg-primary-container px-6 py-8 shadow-[34px_0_90px_rgba(6,20,45,0.22)] backdrop-blur-2xl lg:flex">
      <div className="mb-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-secondary shadow-lg shadow-secondary/30">
            <img alt="RJT logo" className="h-full w-full object-cover" src="/brand/logo_blue_single.png" />
          </div>
          <div>
            <h2 className="font-headline-lg text-[22px] font-black text-white">Nexus HQ</h2>
            <p className="font-body-sm text-white/55">Global Workspace</p>
          </div>
        </div>
      </div>

      <nav className="flex flex-col gap-2">
        {primaryNavigation.map((item) => (
          <NavLink
            key={`${item.label}-${item.path}`}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 rounded-lg p-3 transition-all duration-200 hover:translate-x-1 hover:bg-white/10 hover:text-white ${
                isActive
                  ? "border border-secondary/60 bg-secondary/20 font-bold text-white shadow-lg shadow-secondary/10"
                  : "text-white/68"
              }`
            }
          >
            <MaterialIcon name={item.icon} />
            <span className="font-label-caps">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto border-t border-white/10 pt-8">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
            <MaterialIcon name="cloud_sync" className="text-sm text-white" />
          </div>
          <div>
            <p className="font-label-caps text-[10px] leading-tight text-white/60">VERSION</p>
            <p className="font-data-mono text-[12px] text-white/80">v3.2.0-Alpha</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
