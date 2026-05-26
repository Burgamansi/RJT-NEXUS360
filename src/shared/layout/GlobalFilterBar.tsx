import { MaterialIcon } from "../ui/MaterialIcon";

const filters = [
  { icon: "calendar_month", label: "Período", value: "2026" },
  { icon: "factory", label: "Unidade", value: "Todas" },
  { icon: "account_tree", label: "Módulo", value: "Consolidado" },
  { icon: "verified", label: "Dados", value: "Validados" },
];

export function GlobalFilterBar() {
  return (
    <section className="mb-6 flex flex-col gap-3 rounded-lg border border-outline-variant bg-white px-4 py-3 shadow-sm xl:flex-row xl:items-center xl:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-white">
          <MaterialIcon name="tune" className="text-[19px]" />
        </div>
        <div>
          <p className="text-sm font-bold text-primary">Filtros executivos</p>
          <p className="text-xs text-on-surface-variant">Visão industrial brasileira com dados consolidados</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        {filters.map((filter) => (
          <button
            key={filter.label}
            className="flex min-h-11 items-center gap-2 rounded-md border border-outline-variant bg-surface-container-low px-3 text-left transition-colors hover:border-secondary hover:bg-white"
            type="button"
          >
            <MaterialIcon name={filter.icon} className="text-[18px] text-outline" />
            <span className="min-w-0">
              <span className="block text-[10px] font-bold uppercase text-outline">{filter.label}</span>
              <span className="block truncate text-sm font-semibold text-primary">{filter.value}</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
