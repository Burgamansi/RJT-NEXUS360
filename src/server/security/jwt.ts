import crypto from "node:crypto";
import type { JwtPayload } from "../../types/auth.js";

// Segredo JWT robusto alimentado por variável de ambiente com fallback para desenvolvimento
const JWT_SECRET = process.env.JWT_SECRET || "rjt-nexus360-default-ultra-secret-key-2026-governance";

/**
 * Assina e gera um token JWT nativo (HS256)
 * @param payload Dados úteis a serem criptografados e assinados no token
 * @param expiresInSeconds Tempo de expiração do token em segundos (Padrão: 24h = 86400s)
 */
export function signToken(payload: Omit<JwtPayload, "exp">, expiresInSeconds: number = 86400): string {
  const header = { alg: "HS256", typ: "JWT" };
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const fullPayload = { ...payload, exp };
  
  // Codifica cabeçalho e payload para Base64Url
  const base64Header = Buffer.from(JSON.stringify(header)).toString("base64url");
  const base64Payload = Buffer.from(JSON.stringify(fullPayload)).toString("base64url");
  
  const signatureInput = `${base64Header}.${base64Payload}`;
  
  // Cria a assinatura HMAC SHA-256 usando a chave secreta
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(signatureInput)
    .digest("base64url");
    
  return `${signatureInput}.${signature}`;
}

/**
 * Verifica e decodifica um token JWT nativo.
 * Retorna o payload decodificado se o token for íntegro e não estiver expirado, ou null em caso de falha.
 * @param token Token JWT a ser verificado
 */
export function verifyToken(token: string): JwtPayload | null {
  try {
    if (!token) return null;
    
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    
    const [header, payload, signature] = parts;
    const signatureInput = `${header}.${payload}`;
    
    // Valida a assinatura com o segredo local
    const expectedSignature = crypto
      .createHmac("sha256", JWT_SECRET)
      .update(signatureInput)
      .digest("base64url");
      
    if (signature !== expectedSignature) {
      return null;
    }
    
    const decodedPayload = JSON.parse(Buffer.from(payload, "base64url").toString("utf-8")) as JwtPayload;
    
    // Valida o tempo de expiração exp do token
    if (decodedPayload.exp && Date.now() / 1000 > decodedPayload.exp) {
      return null;
    }
    
    return decodedPayload;
  } catch (e) {
    return null;
  }
}
