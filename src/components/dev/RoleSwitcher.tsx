import { APP_ROLES } from "../../types/permissions";
import type { AppRole } from "../../types/permissions";
import { getCurrentRole, setCurrentRole } from "../../config/mockSession";

interface RoleSwitcherProps {
  value: AppRole;
  onChange: (role: AppRole) => void;
}

export function RoleSwitcher({ value, onChange }: RoleSwitcherProps) {
  if (!import.meta.env.DEV) return null;

  return (
    <div className="px-8 pb-4">
      <label className="block text-[10px] font-bold uppercase tracking-widest text-secondary/50 mb-2">
        Perfil dev
      </label>
      <select
        value={value}
        onChange={(event) => {
          const nextRole = event.target.value as AppRole;
          setCurrentRole(nextRole);
          onChange(getCurrentRole());
        }}
        className="w-full rounded-md border border-on-surface-variant/20 bg-surface-container px-3 py-2 text-xs font-bold text-on-surface outline-none focus:border-primary"
      >
        {APP_ROLES.map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </select>
    </div>
  );
}
