import { Request, Response } from "express";
import { userRepository, companyRepository } from "../repositories/index.js";
import bcrypt from "bcryptjs";
import { auditService } from "../services/audit.service.js";
import { checkPlanLimit } from "../services/plan.service.js";

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const { name, email, password, companyName, companyId: existingCompanyId } = req.body;
      
      if (existingCompanyId) {
        const limitCheck = await checkPlanLimit(existingCompanyId, "create_user");
        if (!limitCheck.allowed) {
          return res.status(403).json({ success: false, error: limitCheck.message });
        }
      }

      if (!name || !email || !password || (!companyName && !existingCompanyId)) {
        return res.status(400).json({ success: false, error: "Todos os campos são obrigatórios" });
      }

      const existingUser = await userRepository.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ success: false, error: "Email já cadastrado" });
      }

      // Create company first
      const companyId = await companyRepository.create({ name: companyName });

      // Create user
      const passwordHash = await bcrypt.hash(password, 10);
      const userId = await userRepository.create({
        name,
        email,
        passwordHash,
        companyId,
        role: "admin_empresa"
      });

      const user = await userRepository.findById(userId) as any;

      await auditService.logAction(userId, companyId, "register", "auth", userId, { email });

      res.status(201).json({
        message: "Usuário registrado com sucesso",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          companyId: user.company_id,
          role: user.role,
          onboardingCompleted: user.onboarding_completed === 1
        }
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await userRepository.findByEmail(email) as any;
      if (!user) {
        return res.status(401).json({ success: false, error: "Credenciais inválidas" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        await auditService.logAction(null, null, "login_failed", "auth", null, { email }, "error");
        return res.status(401).json({ success: false, error: "Credenciais inválidas" });
      }

      await auditService.logAction(user.id, user.company_id, "login", "auth", user.id);

      res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          companyId: user.company_id,
          role: user.role,
          onboardingCompleted: user.onboarding_completed === 1
        }
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async completeOnboarding(req: Request, res: Response) {
    try {
      const { userId } = req.body;
      await userRepository.completeOnboarding(userId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

export const companyController = {
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { systemName, primaryColor, logoUrl, userId } = req.body;
      await companyRepository.update(id, { systemName, primaryColor, logoUrl });
      
      await auditService.logAction(userId, id, "update_company", "settings", id, { systemName, primaryColor });

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
  async get(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const company = await companyRepository.findById(id);
      res.json(company);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};
