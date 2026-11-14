import type { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import { getListRequestSchema } from "../schemas/getListRequests.schema.js";

const getRequests = async (req: Request, res: Response) => {
  try {
    const result = getListRequestSchema.safeParse(req.query);

    if (!result.success) {
      return res.status(400).json({
        message: "Status ou prioridade inválidos.",
      });
    }

    const requests = await prisma.request.findMany({
      where: result.data,
      orderBy: { createdAt: "desc" },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    return res.status(200).json(requests);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro interno do servidor.",
    });
  }
};

export default getRequests;
