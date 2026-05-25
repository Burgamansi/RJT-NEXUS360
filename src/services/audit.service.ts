import { auditRepository } from "../repositories/index.js";

export const auditService = {
  async logAction(
    userId: string | null,
    companyId: string | null,
    action: string,
    module: string,
    entityId?: string,
    metadata?: any,
    status: "success" | "error" = "success"
  ) {
    try {
      await auditRepository.create({
        userId,
        companyId,
        action,
        module,
        entityId,
        metadata,
        status
      });
    } catch (error) {
      console.error("Failed to create audit log:", error);
    }
  }
};
