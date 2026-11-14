import type { Request, Response } from "express";
import { idParamsSchema } from "../schemas/idParams.schema.js";
import { updateRequestStatusSchema } from "../schemas/updateRequestStatus.schema.js";
import updateRequestStatus from "../services/updateRequestStatus.service.js";

const updateRequestStatusController = async (req: Request, res: Response) => {
  try {
    const params = idParamsSchema.safeParse(req.params);

    if (!params.success) {
      return res.status(400).json({
        message: "ID inválido.",
      });
    }

    const body = updateRequestStatusSchema.safeParse(req.body);

    if (!body.success) {
      return res.status(400).json({
        message: "Status inválido.",
      });
    }

    const request = await updateRequestStatus(params.data.id, body.data.status);

    return res.status(200).json(request);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Solicitação não encontrada.") {
        return res.status(404).json({ message: error.message });
      }

      if (error.message === "Transição de status inválida.") {
        return res.status(409).json({ message: error.message });
      }
    }

    console.error(error);

    return res.status(500).json({
      message: "Erro ao atualizar status.",
    });
  }
};

export default updateRequestStatusController;
