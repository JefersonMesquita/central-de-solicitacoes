import type { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import { idParamsSchema } from "../schemas/idParams.schema.js";

const getRequestById = async (req: Request, res: Response) => {
  try {
    const result = idParamsSchema.safeParse(req.params);

    if (!result.success) {
      return res.status(400).json({
        message: "ID inválido.",
      });
    }

    const { id } = result.data;

    const request = await prisma.request.findUnique({
      where: { id },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!request) {
      return res.status(404).json({
        message: "Solicitação não encontrada.",
      });
    }

    return res.status(200).json(request);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro interno do servidor.",
    });
  }
};

export default getRequestById;
