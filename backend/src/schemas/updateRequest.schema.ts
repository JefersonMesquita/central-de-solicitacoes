import { z } from "zod";
import { Priority } from "../../generated/prisma/client.js";

export const updateRequestSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1),
  priority: z.enum(Priority),
  categoryIds: z.array(z.number().int().positive()).default([]),
});
