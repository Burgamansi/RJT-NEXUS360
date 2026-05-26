import { NavLink } from "react-router-dom";
import { MaterialIcon } from "../ui/MaterialIcon";

const topLinks = [
  { label: "EXECUTIVE HUB", to: "/executive" },
  { label: "FINANCIAL", to: "/financial" },
  { label: "DATA CENTER", to: "/executive" },
];

export function TopBar() {
  return (
    <header className="sticky top-0 z-50 mx-auto flex h-20 w-full max-w-container-max items-center justify-between border-b border-glass-stroke bg-surface/80 px-margin-mobile shadow-2xl shadow-primary-container/5 backdrop-blur-xl md:px-margin-desktop">
      <div className="flex items-center gap-6">
        <MaterialIcon name="grid_view" className="cursor-pointer text-3xl text-primary transition-transform active:scale-95" />
        <h1 className="font-display-xl text-[24px] font-bold tracking-tight text-primary md:text-display-xl">RJT NEXUS360</h1>
      </div>

      <nav className="hidden items-center gap-6 md:flex">
        {topLinks.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              `font-label-caps text-label-caps transition-colors ${
                isActive ? "border-b-2 border-electric-blue pb-1 text-electric-blue" : "text-outline hover:text-on-surface"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <div className="hidden flex-col items-end sm:flex">
          <span className="font-label-caps text-[10px] text-outline">SYSTEM STATUS</span>
          <div className="flex items-center gap-2">
            <span className="pulse-ring h-2 w-2 rounded-full bg-status-success" />
            <span className="font-data-mono text-[12px] text-on-surface">SYNCHRONIZED</span>
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
