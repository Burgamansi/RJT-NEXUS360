import { NavLink } from "react-router-dom";

const topLinks = [
  { label: "DASHBOARD", to: "/dashboard" },
  { label: "BUDGET", to: "/budget" },
  { label: "FINANCIAL", to: "/financial" },
  { label: "COMMERCIAL", to: "/commercial" },
  { label: "IMPORT", to: "/data-import" },
  { label: "HR", to: "/hr" },
  { label: "INVENTORY", to: "/inventory" },
  { label: "OPERATIONS", to: "/operations" },
  { label: "PURCHASING", to: "/purchasing" },
];

export function TopBar() {
  return (
    <header className="sticky top-0 z-50 mx-auto flex h-20 w-full max-w-container-max items-center justify-between border-b border-white/10 bg-primary-container px-margin-mobile shadow-2xl shadow-primary-container/25 backdrop-blur-xl md:px-margin-desktop">
      <div className="flex items-center gap-6">
        <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-lg bg-secondary shadow-lg shadow-secondary/30">
          <img alt="RJT logo" className="h-full w-full object-cover" src="/brand/logo_blue_single.png" />
        </div>
        <h1 className="font-display-xl text-[24px] font-bold text-white md:text-[28px]">
          RJT <span className="text-electric-blue">NEXUS360</span>
        </h1>
      </div>

      <nav className="hidden items-center gap-6 md:flex">
        {topLinks.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              `font-label-caps text-label-caps transition-colors ${
                isActive ? "border-b-2 border-electric-blue pb-1 text-electric-blue" : "text-white/70 hover:text-white"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <div className="hidden flex-col items-end sm:flex">
          <span className="font-label-caps text-[10px] text-white/55">SYSTEM STATUS</span>
          <div className="flex items-center gap-2">
            <span className="pulse-ring h-2 w-2 rounded-full bg-status-success" />
            <span className="font-data-mono text-[12px] text-white">SYNCHRONIZED</span>
          </div>
        </div>
        <div className="h-10 w-10 cursor-pointer overflow-hidden rounded-full border border-primary/10 bg-primary-fixed transition-transform active:scale-95">
          <img
            alt="Director User"
            className="h-full w-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIVCXYD3pfT2wdEBlXyrqdmLMnyk6hBUGOJaFHt9z1RdjvAy_mj--k1JlWzfwZpOyiKj22IRT86JVJ7QAKwiWjXqGt-F3Po-9KRBECa9r0DOCpG-IfaeSCQXsIb4eEANiXnWqB74WCXiENDH0-iF28nvkKRY9YsiJO-5iCAkAJXsC8dyciLhXYoDte5-FFy7j-wfKqsBP5vPVRaeMaxrVVzVxIZG2pXoUVkZeY08RHXpwTQY-y3t0RFLECBI0ArixhYf7Zp4R8m9rY"
          />
        </div>
      </div>
    </header>
  );
}
