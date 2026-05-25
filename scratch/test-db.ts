import { db } from "../src/config/db.js";

async function run() {
  const companyId = "uniao_bag";
  
  const faturamento = await db.execute({
    sql: "SELECT COUNT(*) as cnt FROM faturamento WHERE company_id = ?",
    args: [companyId]
  });
  console.log("faturamento count for uniao_bag:", faturamento.rows[0]);

  const custos = await db.execute({
    sql: "SELECT COUNT(*) as cnt FROM custos WHERE company_id = ?",
    args: [companyId]
  });
  console.log("custos count for uniao_bag:", custos.rows[0]);

  const hr = await db.execute({
    sql: "SELECT COUNT(*) as cnt FROM hr_indicators WHERE company_id = ?",
    args: [companyId]
  });
  console.log("hr_indicators count for uniao_bag:", hr.rows[0]);

  const metrics = await db.execute({
    sql: "SELECT COUNT(*) as cnt FROM metrics WHERE company_id = ?",
    args: [companyId]
  });
  console.log("metrics count for uniao_bag:", metrics.rows[0]);

  const allMetrics = await db.execute({
    sql: "SELECT * FROM metrics WHERE company_id = ? LIMIT 5",
    args: [companyId]
  });
  console.log("Sample metrics for uniao_bag:", allMetrics.rows);
}

run().catch(console.error);
