import dotenv from "dotenv";
import type { Client } from "@libsql/client";

dotenv.config();

// Lazy-initialized: createClient() deferred to initDb() to avoid bundling
// @libsql/client native addon at module load time (causes ERR_MODULE_NOT_FOUND on Vercel).
export let db: Client;

export async function initDb() {
  if (!db) {
    const { createClient } = await import("@libsql/client");
    const url = process.env.TURSO_DATABASE_URL || "file:local.db";
    const authToken = process.env.TURSO_AUTH_TOKEN;
    db = createClient({ url, authToken });
  }

  await db.execute(`
    CREATE TABLE IF NOT EXISTS plans (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      max_users INTEGER NOT NULL,
      max_uploads INTEGER NOT NULL,
      features TEXT, -- JSON
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS companies (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT,
      system_name TEXT,
      primary_color TEXT,
      logo_url TEXT,
      status TEXT DEFAULT 'active',
      plan_id TEXT,
      plan_status TEXT DEFAULT 'trial',
      plan_start_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      plan_end_date DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (plan_id) REFERENCES plans (id)
    );
  `);

  // Migration: Add missing columns to companies table if they don't exist
  const tableInfo = await db.execute("PRAGMA table_info(companies)");
  const columns = (tableInfo.rows as any[]).map(row => row.name);

  const missingColumns = [
    { name: 'slug', type: 'TEXT' },
    { name: 'system_name', type: 'TEXT' },
    { name: 'primary_color', type: 'TEXT' },
    { name: 'logo_url', type: 'TEXT' },
    { name: 'plan_id', type: 'TEXT' },
    { name: 'plan_status', type: "TEXT DEFAULT 'trial'" },
    { name: 'plan_start_date', type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' },
    { name: 'plan_end_date', type: 'DATETIME' }
  ];

  for (const col of missingColumns) {
    if (!columns.includes(col.name)) {
      try {
        await db.execute(`ALTER TABLE companies ADD COLUMN ${col.name} ${col.type}`);
        console.log(`Added missing column ${col.name} to companies table`);
      } catch (err) {
        console.error(`Error adding column ${col.name}:`, err);
      }
    }
  }

  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      company_id TEXT,
      role TEXT DEFAULT 'user',
      status TEXT DEFAULT 'active',
      onboarding_completed INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (company_id) REFERENCES companies (id)
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      company_id TEXT,
      user_id TEXT,
      action TEXT NOT NULL,
      module TEXT NOT NULL,
      entity_id TEXT,
      metadata TEXT,
      status TEXT DEFAULT 'success',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (company_id) REFERENCES companies (id),
      FOREIGN KEY (user_id) REFERENCES users (id)
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS uploads (
      id TEXT PRIMARY KEY,
      company_id TEXT,
      filename TEXT NOT NULL,
      original_name TEXT NOT NULL,
      domain TEXT,
      type TEXT,
      status TEXT DEFAULT 'pending',
      schema_version TEXT,
      validation_errors TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS raw_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      upload_id TEXT NOT NULL,
      company_id TEXT NOT NULL,
      row_index INTEGER NOT NULL,
      payload TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (upload_id) REFERENCES uploads (id)
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS normalized_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      upload_id TEXT NOT NULL,
      company_id TEXT NOT NULL,
      domain TEXT NOT NULL,
      type TEXT NOT NULL,
      reference_date TEXT,
      payload TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (upload_id) REFERENCES uploads (id)
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS metrics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_id TEXT,
      domain TEXT NOT NULL,
      metric_name TEXT NOT NULL,
      metric_value REAL NOT NULL,
      period TEXT,
      metadata TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS faturamento (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_id TEXT,
      period TEXT NOT NULL,
      amount REAL NOT NULL,
      description TEXT,
      category TEXT,
      cost_center TEXT,
      audit_status TEXT DEFAULT 'Pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS custos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_id TEXT,
      type TEXT NOT NULL, -- 'Variable' or 'Fixed'
      period TEXT NOT NULL,
      amount REAL NOT NULL,
      description TEXT,
      category TEXT,
      cost_center TEXT,
      audit_status TEXT DEFAULT 'Pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS hr_indicators (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_id TEXT,
      period TEXT NOT NULL,
      admissions INTEGER DEFAULT 0,
      dismissals INTEGER DEFAULT 0,
      active_employees INTEGER DEFAULT 0,
      absenteeism REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(company_id, period)
    );
  `);

  // Seed default plans if they don't exist
  const plansCount = await db.execute("SELECT COUNT(*) as count FROM plans");
  if ((plansCount.rows[0] as any).count === 0) {
    const defaultPlans = [
      { id: 'free', name: 'Gratuito', description: 'Para começar', price: 0, max_users: 1, max_uploads: 5, features: JSON.stringify(['dashboard']) },
      { id: 'pro', name: 'Profissional', description: 'Para crescer', price: 199, max_users: 5, max_uploads: 50, features: JSON.stringify(['dashboard', 'export_pdf', 'export_ppt']) },
      { id: 'enterprise', name: 'Enterprise', description: 'Para grandes empresas', price: 999, max_users: 999, max_uploads: 999, features: JSON.stringify(['dashboard', 'export_pdf', 'export_ppt', 'admin']) }
    ];
    for (const plan of defaultPlans) {
      await db.execute({
        sql: "INSERT INTO plans (id, name, description, price, max_users, max_uploads, features) VALUES (?, ?, ?, ?, ?, ?, ?)",
        args: [plan.id, plan.name, plan.description, plan.price, plan.max_users, plan.max_uploads, plan.features]
      });
    }
  }

  // Seed pilot tenant and demo environment without making either the product identity.
  const pilotCompanyCount = await db.execute("SELECT COUNT(*) as count FROM companies WHERE id = 'uniao_bag'");
  if ((pilotCompanyCount.rows[0] as any).count === 0) {
    await db.execute({
      sql: "INSERT INTO companies (id, name, slug, system_name, plan_id, plan_status, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
      args: ["uniao_bag", "União Bag", "uniao-bag", "RJT NEXUS360", "enterprise", "active", "active"]
    });
  } else {
    await db.execute({
      sql: "UPDATE companies SET name = ?, slug = ?, system_name = ?, plan_id = ?, plan_status = ?, status = ? WHERE id = ?",
      args: ["União Bag", "uniao-bag", "RJT NEXUS360", "enterprise", "active", "active", "uniao_bag"]
    });
  }

  // Seed demo company and user
  const demoCompanyCount = await db.execute("SELECT COUNT(*) as count FROM companies WHERE id = 'demo_company'");
  if ((demoCompanyCount.rows[0] as any).count === 0) {
    await db.execute({
      sql: "INSERT INTO companies (id, name, slug, system_name, plan_id, plan_status, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
      args: ["demo_company", "RJT NEXUS360 Demo", "rjt-nexus360-demo", "RJT NEXUS360", "enterprise", "active", "active"]
    });
  } else {
    await db.execute({
      sql: "UPDATE companies SET name = ?, slug = ?, system_name = ?, plan_id = ?, plan_status = ?, status = ? WHERE id = ?",
      args: ["RJT NEXUS360 Demo", "rjt-nexus360-demo", "RJT NEXUS360", "enterprise", "active", "active", "demo_company"]
    });
  }

  const demoUserCount = await db.execute("SELECT COUNT(*) as count FROM users WHERE id = 'demo_user'");
  if ((demoUserCount.rows[0] as any).count === 0) {
    await db.execute({
      sql: "INSERT INTO users (id, name, email, password, company_id, role, onboarding_completed) VALUES (?, ?, ?, ?, ?, ?, ?)",
      args: ["demo_user", "Usuário Demonstração", "demo@rjtnexus360.com", "demo_password", "demo_company", "admin_master", 1]
    });
  }
}
