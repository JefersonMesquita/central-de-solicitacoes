import type { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import { createRequestSchema } from "../schemas/createRequest.schema.js";
import { Status } from "../../generated/prisma/client.js";

const postRequest = async (req: Request, res: Response) => {
  try {
    const result = createRequestSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Dados inválidos.",
      });
    }

    const { title, description, priority, categoryIds } = result.data;

    const newRequest = await prisma.request.create({
      data: {
        title,
        description,
        priority,
        status: Status.ABERTA,

        categories: {
          create: categoryIds.map((id) => ({
            category: {
              connect: { id },
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

    return res.status(201).json(newRequest);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao criar solicitação.",
    });
  }
};

export default postRequest;
