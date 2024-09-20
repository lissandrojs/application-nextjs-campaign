import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handlerID(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'ID inválido.' });
  }
  if (req.method === 'PUT') {
    const { name, category } = req.body;

    if (!name || !category) {
      return res.status(400).json({ error: 'Dados incompletos.' });
    }

    try {
      const updatedCampaign = await prisma.campaign.update({
        where: { id },
        data: { name, category },
      });
      return res.status(200).json(updatedCampaign);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao atualizar a campanha.' });
    }
  }
  if (req.method === 'DELETE') {
    try {
      await prisma.campaign.update({
        where: { id },
        data: {
          isActive: false,
        },
      });
      return res.status(200).json({ message: 'Campanha desativada com sucesso.' });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao desativar a campanha.' });
    }
  } else if (req.method === 'GET') {
    try {
      const campaigns = await prisma.campaign.findMany({
        where: {
          isActive: true, 
        },
      });
      return res.status(200).json(campaigns);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao listar as campanhas.' });
    }
  } else {
    return res.status(405).json({ error: 'Método não permitido.' });
  }
}