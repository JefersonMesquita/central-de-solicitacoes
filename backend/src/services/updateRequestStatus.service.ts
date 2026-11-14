import prisma from "../lib/prisma.js";
import { Status } from "../../generated/prisma/client.js";

async function updateRequestStatus(id: number, status: Status) {
  const request = await prisma.request.findUnique({
    where: { id },
  });

  if (!request) {
    throw new Error("Solicitação não encontrada.");
  }

  const allowedTransitions: Record<Status, Status | null> = {
    ABERTA: "EM_ANDAMENTO",
    EM_ANDAMENTO: "CONCLUIDA",
    CONCLUIDA: null,
  };

  if (allowedTransitions[request.status] !== status) {
    throw new Error("Transição de status inválida.");
  }

  const updatedRequest = await prisma.request.update({
    where: { id },
    data: { status },
  });

  return updatedRequest;
}

export default updateRequestStatus;
