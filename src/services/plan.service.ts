import { companyRepository, userRepository, uploadRepository } from "../repositories/index.js";

export type PlanAction = "upload" | "create_user" | "export_pdf" | "export_ppt";

export async function checkPlanLimit(companyId: string, action: PlanAction): Promise<{ allowed: boolean; message?: string }> {
  const company = await companyRepository.findById(companyId) as any;
  if (!company) return { allowed: false, message: "Empresa não encontrada." };

  // Check plan status
  if (company.plan_status === "vencido") {
    return { allowed: false, message: "Plano vencido. Faça upgrade para continuar." };
  }

  // Check expiration for trial
  if (company.plan_status === "trial" && company.plan_end_date) {
    if (new Date(company.plan_end_date) < new Date()) {
      return { allowed: false, message: "Período de teste expirado. Faça upgrade para continuar." };
    }
  }

  const features = company.features || [];

  switch (action) {
    case "upload":
      const stats = await uploadRepository.getUsageStats(companyId);
      if (stats.total_uploads >= company.max_uploads) {
        return { allowed: false, message: "Limite de uploads do plano atingido. Faça upgrade para continuar." };
      }
      return { allowed: true };

    case "create_user":
      const userCount = await userRepository.countByCompany(companyId);
      if (userCount >= company.max_users) {
        return { allowed: false, message: "Limite de usuários do plano atingido. Faça upgrade para continuar." };
      }
      return { allowed: true };

    case "export_pdf":
      if (!features.includes("export_pdf")) {
        return { allowed: false, message: "Exportação PDF não inclusa no seu plano atual. Faça upgrade para liberar." };
      }
      return { allowed: true };

    case "export_ppt":
      if (!features.includes("export_ppt")) {
        return { allowed: false, message: "Exportação PPT não inclusa no seu plano atual. Faça upgrade para liberar." };
      }
      return { allowed: true };

    default:
      return { allowed: true };
  }
}
