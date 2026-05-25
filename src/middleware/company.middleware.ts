import { Request, Response, NextFunction } from "express";
import { companyRepository } from "../repositories/index.js";

export const checkCompanyStatus = async (req: Request, res: Response, next: NextFunction) => {
  const companyId = req.body.companyId || req.query.companyId || req.params.companyId;
  
  if (!companyId) return next();

  try {
    const company = await companyRepository.findById(companyId as string) as any;
    if (company && company.status === "inactive") {
      return res.status(403).json({ 
        error: "Acesso bloqueado. Esta empresa está inativa no sistema. Entre em contato com o suporte." 
      });
    }
    next();
  } catch (error) {
    next();
  }
};
