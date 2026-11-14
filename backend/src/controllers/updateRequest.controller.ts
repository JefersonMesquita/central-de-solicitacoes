import type { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import { updateRequestSchema } from "../schemas/updateRequest.schema.js";
import { idParamsSchema } from "../schemas/idParams.schema.js";

const updateRequest = async (req: Request, res: Response) => {
  try {
    const params = idParamsSchema.safeParse(req.params);

    if (!params.success) {
      return res.status(400).json({
        message: "ID inválido.",
      });
    }

    const { id } = params.data;

    // Validacao do body
    const result = updateRequestSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Dados inválidos.",
        errors: result.error.issues,
      });
    }

    const { title, description, priority, categoryIds } = result.data;

    const existingRequest = await prisma.request.findUnique({
      where: { id },
    });

    if (!existingRequest) {
      return res.status(404).json({
        message: "Solicitação não encontrada.",
      });
    }

    const request = await prisma.request.update({
      where: { id },
      data: {
        title,
        description,
        priority,
        categories: {
          deleteMany: {},
          create: categoryIds.map((categoryId) => ({
            category: {
              connect: { id: categoryId },
            },
          })),
        },
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    return res.status(200).json(request);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao atualizar solicitação.",
    });
  }
};

export default updateRequest;
