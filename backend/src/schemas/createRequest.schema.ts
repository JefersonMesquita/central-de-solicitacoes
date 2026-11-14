import { z } from "zod";
import { Priority } from "../../generated/prisma/client.js";

export const createRequestSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "O título é obrigatório.")
    .max(200, "O título deve ter no máximo 200 caracteres."),
  description: z.string().trim().min(1, "A descrição é obrigatória."),
  priority: z.enum(Priority, "Prioridade inválida."),
  categoryIds: z.array(z.number().int().positive()).optional().default([]),
});
