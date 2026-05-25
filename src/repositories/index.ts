import { db } from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

export const uploadRepository = {
  async create(data: { companyId: string; filename: string; originalName: string; domain: string; type: string; status?: string }) {
    const id = uuidv4();
    await db.execute({
      sql: "INSERT INTO uploads (id, company_id, filename, original_name, domain, type, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
      args: [id, data.companyId, data.filename, data.originalName, data.domain, data.type, data.status || "pending"],
    });
    return id;
  },

  async findById(id: string, companyId: string) {
    if (!companyId) {
      throw new Error("companyId é obrigatório para recuperar o upload.");
    }
    const result = await db.execute({
      sql: "SELECT * FROM uploads WHERE id = ? AND company_id = ?",
      args: [id, companyId],
    });
    return result.rows[0];
  },

  async updateStatus(id: string, status: string, companyId: string) {
    if (!companyId) {
      throw new Error("companyId é obrigatório para atualizar o status do upload.");
    }
    await db.execute({
      sql: "UPDATE uploads SET status = ? WHERE id = ? AND company_id = ?",
      args: [status, id, companyId],
    });
  },

  async getUsageStats(companyId: string) {
    if (!companyId) {
      throw new Error("companyId é obrigatório para consultar estatísticas de uso.");
    }
    const result = await db.execute({
      sql: `
        SELECT 
          COUNT(*) as total_uploads,
          SUM(CASE WHEN status = 'processed' THEN 1 ELSE 0 END) as total_processings,
          MAX(created_at) as last_activity
        FROM uploads 
        WHERE company_id = ?
      `,
      args: [companyId]
    });
    return result.rows[0];
  }
};

export const dataRepository = {
  async saveRawData(uploadId: string, companyId: string, rowIndex: number, payload: any) {
    if (!companyId) {
      throw new Error("companyId é obrigatório para salvar dados brutos.");
    }
    await db.execute({
      sql: "INSERT INTO raw_data (upload_id, company_id, row_index, payload) VALUES (?, ?, ?, ?)",
      args: [uploadId, companyId, rowIndex, JSON.stringify(payload)],
    });
  },

  async saveNormalized(uploadId: string, companyId: string, domain: string, type: string, referenceDate: string | null, payload: any) {
    if (!companyId) {
      throw new Error("companyId é obrigatório para salvar dados normalizados.");
    }
    await db.execute({
      sql: "INSERT INTO normalized_data (upload_id, company_id, domain, type, reference_date, payload) VALUES (?, ?, ?, ?, ?, ?)",
      args: [uploadId, companyId, domain, type, referenceDate, JSON.stringify(payload)],
    });
  },

  async saveMetrics(domain: string, metricName: string, value: number, period: string, companyId: string, metadata: any) {
    if (!companyId) {
      throw new Error("companyId é obrigatório para salvar métricas.");
    }
    await db.execute({
      sql: "INSERT INTO metrics (domain, company_id, metric_name, metric_value, period, metadata) VALUES (?, ?, ?, ?, ?, ?)",
      args: [domain, companyId, metricName, value, period, JSON.stringify(metadata)],
    });
  },

  async deleteMetricsByUpload(uploadId: string, companyId: string) {
    if (!companyId) {
      throw new Error("companyId é obrigatório para deletar métricas do upload.");
    }
    await db.execute({
      sql: "DELETE FROM metrics WHERE company_id = ? AND metadata LIKE ?",
      args: [companyId, `%"uploadId":"${uploadId}"%`],
    });
  },

  async getNormalizedByUpload(uploadId: string, companyId: string) {
    if (!companyId) {
      throw new Error("companyId é obrigatório para obter dados normalizados.");
    }
    const result = await db.execute({
      sql: "SELECT * FROM normalized_data WHERE upload_id = ? AND company_id = ?",
      args: [uploadId, companyId],
    });
    return result.rows.map(row => ({
      ...row,
      payload: typeof row.payload === "string" ? JSON.parse(row.payload) : row.payload
    }));
  },

  async getRawByUpload(uploadId: string, companyId: string) {
    if (!companyId) {
      throw new Error("companyId é obrigatório para obter dados brutos.");
    }
    const result = await db.execute({
      sql: "SELECT * FROM raw_data WHERE upload_id = ? AND company_id = ?",
      args: [uploadId, companyId],
    });
    return result.rows.map(row => ({
      ...row,
      payload: typeof row.payload === "string" ? JSON.parse(row.payload) : row.payload
    }));
  },

  async getMetrics(filters: { domain?: string; companyId?: string; period?: string }) {
    if (!filters.companyId) {
      throw new Error("companyId é obrigatório na consulta de métricas.");
    }

    let query = "SELECT * FROM metrics";
    const args: any[] = [];
    const where: string[] = [];

    if (filters.domain) {
      where.push("domain = ?");
      args.push(filters.domain);
    }
    
    where.push("company_id = ?");
    args.push(filters.companyId);

    if (filters.period) {
      where.push("period = ?");
      args.push(filters.period);
    }

    if (where.length > 0) {
      query += " WHERE " + where.join(" AND ");
    }

    query += " ORDER BY created_at DESC";

    const result = await db.execute({ sql: query, args });
    return result.rows.map(row => ({
      ...row,
      metric_value: row.metric_value,
      metadata: typeof row.metadata === "string" ? JSON.parse(row.metadata) : row.metadata
    }));
  }
};

export const planRepository = {
  async findAll() {
    const result = await db.execute("SELECT * FROM plans");
    return result.rows.map(row => ({
      ...row,
      features: typeof row.features === "string" ? JSON.parse(row.features) : row.features
    }));
  },
  async findById(id: string) {
    const result = await db.execute({
      sql: "SELECT * FROM plans WHERE id = ?",
      args: [id],
    });
    const row = result.rows[0];
    if (!row) return null;
    return {
      ...row,
      features: typeof row.features === "string" ? JSON.parse(row.features) : row.features
    };
  }
};

export const companyRepository = {
  async create(data: { name: string; systemName?: string; primaryColor?: string; logoUrl?: string; planId?: string; slug?: string }) {
    const id = uuidv4();
    const planId = data.planId || 'free';
    const planEndDate = planId === 'free' ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    const systemName = data.systemName || data.name;
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    
    await db.execute({
      sql: "INSERT INTO companies (id, name, slug, system_name, primary_color, logo_url, plan_id, plan_end_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      args: [id, data.name, slug, systemName, data.primaryColor || null, data.logoUrl || null, planId, planEndDate],
    });
    return id;
  },
  async findById(id: string) {
    const result = await db.execute({
      sql: `
        SELECT c.*, p.name as plan_name, p.max_users, p.max_uploads, p.features
        FROM companies c
        LEFT JOIN plans p ON c.plan_id = p.id
        WHERE c.id = ?
      `,
      args: [id],
    });
    const row = result.rows[0];
    if (!row) return null;
    return {
      ...row,
      features: typeof row.features === "string" ? JSON.parse(row.features) : row.features
    };
  },
  async update(id: string, data: Partial<{ name: string; systemName: string; primaryColor: string; logoUrl: string; status: string; planId: string; planStatus: string; planEndDate: string }>) {
    const fields = [];
    const args = [];
    if (data.name) { fields.push("name = ?"); args.push(data.name); }
    if (data.systemName) { fields.push("system_name = ?"); args.push(data.systemName); }
    if (data.primaryColor) { fields.push("primary_color = ?"); args.push(data.primaryColor); }
    if (data.logoUrl) { fields.push("logo_url = ?"); args.push(data.logoUrl); }
    if (data.status) { fields.push("status = ?"); args.push(data.status); }
    if (data.planId) { fields.push("plan_id = ?"); args.push(data.planId); }
    if (data.planStatus) { fields.push("plan_status = ?"); args.push(data.planStatus); }
    if (data.planEndDate) { fields.push("plan_end_date = ?"); args.push(data.planEndDate); }
    
    if (fields.length === 0) return;
    
    args.push(id);
    await db.execute({
      sql: `UPDATE companies SET ${fields.join(", ")} WHERE id = ?`,
      args,
    });
  },
  async findAllWithStats() {
    const result = await db.execute({
      sql: `
        SELECT 
          c.*,
          (SELECT COUNT(*) FROM users u WHERE u.company_id = c.id) as user_count,
          (SELECT COUNT(*) FROM uploads up WHERE up.company_id = c.id) as upload_count
        FROM companies c
        ORDER BY c.created_at DESC
      `
    });
    return result.rows;
  }
};

export const userRepository = {
  async create(data: { name: string; email: string; passwordHash: string; companyId: string; role?: string }) {
    const id = uuidv4();
    await db.execute({
      sql: "INSERT INTO users (id, name, email, password, company_id, role) VALUES (?, ?, ?, ?, ?, ?)",
      args: [id, data.name, data.email, data.passwordHash, data.companyId, data.role || "user"],
    });
    return id;
  },
  async findByEmail(email: string) {
    const result = await db.execute({
      sql: "SELECT * FROM users WHERE email = ?",
      args: [email],
    });
    return result.rows[0];
  },
  async findById(id: string) {
    const result = await db.execute({
      sql: "SELECT * FROM users WHERE id = ?",
      args: [id],
    });
    return result.rows[0];
  },
  async findByCompany(companyId: string) {
    const result = await db.execute({
      sql: "SELECT * FROM users WHERE company_id = ?",
      args: [companyId],
    });
    return result.rows;
  },
  async countByCompany(companyId: string) {
    const result = await db.execute({
      sql: "SELECT COUNT(*) as count FROM users WHERE company_id = ?",
      args: [companyId],
    });
    return (result.rows[0] as any).count;
  },
  async update(id: string, data: Partial<{ name: string; email: string; role: string; status: string }>) {
    const fields = [];
    const args = [];
    if (data.name) { fields.push("name = ?"); args.push(data.name); }
    if (data.email) { fields.push("email = ?"); args.push(data.email); }
    if (data.role) { fields.push("role = ?"); args.push(data.role); }
    if (data.status) { fields.push("status = ?"); args.push(data.status); }
    
    if (fields.length === 0) return;
    
    args.push(id);
    await db.execute({
      sql: `UPDATE users SET ${fields.join(", ")} WHERE id = ?`,
      args,
    });
  },
  async completeOnboarding(id: string) {
    await db.execute({
      sql: "UPDATE users SET onboarding_completed = 1 WHERE id = ?",
      args: [id],
    });
  }
};

export const auditRepository = {
  async create(data: { 
    companyId: string | null; 
    userId: string | null; 
    action: string; 
    module: string; 
    entityId?: string; 
    metadata?: any; 
    status?: string 
  }) {
    const id = uuidv4();
    await db.execute({
      sql: `INSERT INTO audit_logs (id, company_id, user_id, action, module, entity_id, metadata, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id, 
        data.companyId, 
        data.userId, 
        data.action, 
        data.module, 
        data.entityId || null, 
        data.metadata ? JSON.stringify(data.metadata) : null, 
        data.status || "success"
      ],
    });
    return id;
  },

  async find(filters: { 
    companyId?: string; 
    userId?: string; 
    action?: string; 
    module?: string; 
    status?: string;
    limit?: number;
    offset?: number;
  }) {
    let query = `
      SELECT a.*, u.name as user_name 
      FROM audit_logs a 
      LEFT JOIN users u ON a.user_id = u.id
    `;
    const where = [];
    const args = [];

    if (filters.companyId) { where.push("a.company_id = ?"); args.push(filters.companyId); }
    if (filters.userId) { where.push("a.user_id = ?"); args.push(filters.userId); }
    if (filters.action) { where.push("a.action = ?"); args.push(filters.action); }
    if (filters.module) { where.push("a.module = ?"); args.push(filters.module); }
    if (filters.status) { where.push("a.status = ?"); args.push(filters.status); }

    if (where.length > 0) {
      query += " WHERE " + where.join(" AND ");
    }

    query += " ORDER BY a.created_at DESC LIMIT ? OFFSET ?";
    args.push(filters.limit || 100);
    args.push(filters.offset || 0);

    const result = await db.execute({ sql: query, args });
    return result.rows;
  }
};
