import { db } from "../src/config/db.js";

async function seed() {
  console.log("🌱 Semeando dados para empresa_teste...");

  try {
    // 1. Inserir empresa_teste
    await db.execute({
      sql: "INSERT OR IGNORE INTO companies (id, name, status) VALUES (?, ?, ?)",
      args: ["empresa_teste", "Empresa de Teste Real", "active"]
    });

    // 2. Inserir algumas métricas financeiras
    const periods = ["2026-01", "2026-02", "2026-03"];
    for (const p of periods) {
      await db.execute({
        sql: "INSERT INTO metrics (company_id, domain, metric_name, metric_value, period) VALUES (?, ?, ?, ?, ?)",
        args: ["empresa_teste", "finance", "revenue", 1500000 + (Math.random() * 100000), p]
      });
      await db.execute({
        sql: "INSERT INTO metrics (company_id, domain, metric_name, metric_value, period) VALUES (?, ?, ?, ?, ?)",
        args: ["empresa_teste", "finance", "cmv", 600000, p]
      });
      await db.execute({
        sql: "INSERT INTO metrics (company_id, domain, metric_name, metric_value, period) VALUES (?, ?, ?, ?, ?)",
        args: ["empresa_teste", "rh", "headcount", 150, p]
      });
      await db.execute({
        sql: "INSERT INTO metrics (company_id, domain, metric_name, metric_value, period) VALUES (?, ?, ?, ?, ?)",
        args: ["empresa_teste", "commercial", "revenue", 1200000, p]
      });
      await db.execute({
        sql: "INSERT INTO metrics (company_id, domain, metric_name, metric_value, period) VALUES (?, ?, ?, ?, ?)",
        args: ["empresa_teste", "operations", "total_production", 50000, p]
      });
    }

    console.log("✅ Dados semeados com sucesso para 'empresa_teste'!");
  } catch (err) {
    console.error("❌ Erro ao semear dados:", err);
  }
}

seed();
