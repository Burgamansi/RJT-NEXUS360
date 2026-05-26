import { NavLink } from "react-router-dom";

const topLinks = [
  { label: "Painel", to: "/dashboard" },
  { label: "Orçamento", to: "/budget" },
  { label: "Financeiro", to: "/financial" },
  { label: "Comercial", to: "/commercial" },
  { label: "Importação", to: "/data-import" },
  { label: "Pessoas", to: "/hr" },
  { label: "Estoque", to: "/inventory" },
  { label: "Operações", to: "/operations" },
  { label: "Compras", to: "/purchasing" },
];

export function TopBar() {
  return (
    <header className="sticky top-0 z-50 flex h-[72px] w-full items-center justify-between border-b border-outline-variant bg-white px-margin-mobile shadow-sm md:px-margin-desktop">
      <div className="flex min-w-0 items-center gap-4">
        <div aria-label="Logotipo RJT" className="brand-mark h-10 w-10 shrink-0 rounded-md border border-outline-variant bg-white" role="img" />
        <h1 className="truncate text-lg font-bold text-primary md:text-xl">
          RJT <span className="text-secondary">Nexus360</span>
        </h1>
      </div>

      <nav className="hidden items-center gap-1 xl:flex">
        {topLinks.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive ? "bg-surface-container text-primary" : "text-on-surface-variant hover:bg-surface-container-low hover:text-primary"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <div className="hidden flex-col items-end sm:flex">
          <span className="text-[10px] font-bold text-outline">STATUS DO SISTEMA</span>
          <div className="flex items-center gap-2">
            <span className="pulse-ring h-2 w-2 rounded-full bg-status-success" />
            <span className="font-data-mono text-[12px] text-primary">SINCRONIZADO</span>
          </div>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-outline-variant bg-surface-container text-sm font-bold text-primary">
          RJ
        </div>
      </div>
    </header>
  );
}


