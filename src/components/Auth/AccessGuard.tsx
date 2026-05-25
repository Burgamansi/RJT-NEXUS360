import React, { useEffect, useState } from "react";
import { canAccessModule, canPerformAction } from "../../config/modulePermissions";
import { DEV_ROLE_CHANGE_EVENT, getCurrentRole } from "../../config/mockSession";
import type { ModuleAction, SystemModule } from "../../types/modules";
import { RestrictedAccess } from "./RestrictedAccess";

interface AccessGuardProps {
  module: SystemModule;
  action?: ModuleAction;
  children: React.ReactNode;
}

export function AccessGuard({ module, action = "view", children }: AccessGuardProps) {
  const [currentRole, setCurrentRole] = useState(getCurrentRole);

  useEffect(() => {
    const syncRole = () => setCurrentRole(getCurrentRole());
    window.addEventListener(DEV_ROLE_CHANGE_EVENT, syncRole);
    window.addEventListener("storage", syncRole);
    return () => {
      window.removeEventListener(DEV_ROLE_CHANGE_EVENT, syncRole);
      window.removeEventListener("storage", syncRole);
    };
  }, []);

  const allowed = action === "view"
    ? canAccessModule(currentRole, module)
    : canPerformAction(currentRole, module, action);

  if (!allowed) return <RestrictedAccess />;

  return <>{children}</>;
}
