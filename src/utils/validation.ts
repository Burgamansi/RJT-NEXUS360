import { z } from "zod";

export const uploadSchema = z.object({
  // file is handled by multer, but we can validate other body fields if any
});

export const processSchema = z.object({
  uploadId: z.string().uuid(),
});

export const metricsQuerySchema = z.object({
  domain: z.enum(["finance", "rh", "operations"]).optional(),
  companyId: z.string().optional(),
  period: z.string().optional(),
});
