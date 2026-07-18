import { type Request, type Response } from 'express';
import { verification, creationStore, aproveOrReject, Role, updateRole } from '../../models/adm/updateRequest.model.js';
import { schemaAproveOrReject } from '../../schemas/updateRequests.schema.js';

export const updateRequest = async (req: Request, res: Response) => {
  const result = schemaAproveOrReject.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      errors: result.error.flatten().fieldErrors,
    });
    return;
  }

  const data = result.data;

  try {
    const verificationStore = await verification(data.idStore);

    if (!verificationStore) {
      return res.status(404).json({
        message: 'Solicitação de loja não encontrada.',
      });
    }

    if (verificationStore.status !== 'PENDING') {
      return res.status(409).json({
        message: 'Esta solicitação já foi processada e não pode ser alterada novamente.',
      });
    }

    const newStatus = await aproveOrReject(data.idStore, data.status);

    if (newStatus === 'APPROVED') {
      const creation = await creationStore({
        userId: verificationStore.userId,
        storeAddress: verificationStore.storeAddress,
        nameStore: verificationStore.nameStore,
        contactEmail: verificationStore.contactEmail,
        cnpj: verificationStore.cnpj,
        category: verificationStore.category,
      });

      if (creation === null) {
        await aproveOrReject(data.idStore, 'PENDING');
        return res.status(500).json({
          message: 'Não foi possível criar a loja no momento.',
        });
      }

      const userRole = await Role(verificationStore.userId);

      if (userRole === 'USER') {
        await updateRole(verificationStore.userId, 'OWNER');
      }

      return res.status(201).json({
        message: `Loja ${creation?.nameStore} criada com sucesso.`,
      });
    }

    if (newStatus === 'REJECTED') {
      return res.status(200).json({
        message: 'Solicitação rejeitada com sucesso.',
      });
    }

    if (newStatus === 'PENDING') {
      return res.status(200).json({
        message: 'Solicitação mantida como pendente.',
      });
    }
  } catch (err) {
    console.error('Erro ao processar a solicitação de loja:', err);
    return res.status(500).json({
      message: 'Erro ao processar a solicitação de loja.',
    });
  }
};
