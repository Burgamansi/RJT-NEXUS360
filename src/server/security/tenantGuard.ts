import type { Request } from "express";

/**
 * Tenant Guard — RJT NEXUS360
 * Utilitário de segurança e higienização para isolamento multi-tenant
 */

/**
 * Normaliza e higieniza um ID de empresa/tenant recebido
 * @param input Entrada a ser higienizada
 */
export function normalizeCompanyId(input: any): string | null {
  if (!input || typeof input !== "string") {
    return null;
  }
  
  // Remove espaços em branco nas extremidades
  const sanitized = input.trim();
  
  if (sanitized.length === 0) {
    return null;
  }
  
  // Garante que o ID contém apenas caracteres válidos (letras, números, underlines, traços)
  // para evitar injeções de SQL ou de comandos de sistema
  const isValid = /^[a-zA-Z0-9_\-]+$/.test(sanitized);
  
  return isValid ? sanitized : null;
}

/**
 * Exige a presença de um companyId válido, lançando erro em caso de ausência ou formato incorreto.
 * @param input Entrada contendo o ID do tenant
 */
export function requireCompanyId(input: any): string {
  const normalized = normalizeCompanyId(input);
  
  if (!normalized) {
    const error = new Error("companyId é obrigatório e deve ter formato válido.") as any;
    error.status = 400;
    throw error;
  }
  
  return normalized;
}

/**
 * Garante que a requisição de um tenant pertence estritamente ao escopo autorizado do usuário.
 * @param companyId ID do tenant que está sendo acessado
 * @param userCompanyId ID do tenant atribuído ao usuário autenticado
 */
export function assertTenantScoped(companyId: string, userCompanyId?: string): void {
  if (!companyId) {
    const error = new Error("companyId ausente para validação de escopo de tenant.") as any;
    error.status = 400;
    throw error;
  }
  
  if (userCompanyId && companyId !== userCompanyId) {
    const error = new Error("Acesso não autorizado a este tenant (Cross-Tenant Access Rejection).") as any;
    error.status = 403;
    throw error;
  }
}

/**
 * Extrai de forma segura o ID do Tenant da requisição.
 * Prioriza req.auth.companyId. Em produçao, bloqueia leituras planas do corpo/query.
 * @param req Objeto de requisição do Express
 */
export function getTenantIdFromRequest(req: Request): string {
  const isProduction = process.env.NODE_ENV === "production";

  // 1. Se for DEV/Local, aceita ler da query ou do body com alta prioridade para compatibilidade com mocks do frontend
  if (!isProduction) {
    const fallbackId = req.body?.companyId || req.query?.companyId;
    if (fallbackId) {
      const sanitized = normalizeCompanyId(fallbackId);
      if (sanitized) return sanitized;
    }
  }

  // 2. Prioriza o tenant do contexto de autenticação validado (JWT / mock seguro)
  if (req.auth && req.auth.companyId) {
    return requireCompanyId(req.auth.companyId);
  }
  
  // Em produção, se não houver contexto de tenant atachado por autenticação, rejeita o acesso
  const error = new Error("Acesso negado. Escopo de tenant não identificado no token de autenticação.") as any;
  error.status = 401;
  throw error;
}
