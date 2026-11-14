import { z } from "zod";
import { Priority, Status } from "../../generated/prisma/client.js";

export const getListRequestSchema = z.object({
  status: z.enum(Status).optional(),
  priority: z.enum(Priority).optional(),
});
