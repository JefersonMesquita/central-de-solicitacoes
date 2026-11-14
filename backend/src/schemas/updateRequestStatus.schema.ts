import { z } from "zod";
import { Status } from "../../generated/prisma/client.js";

export const updateRequestStatusSchema = z.object({
  status: z.enum(Status),
});
