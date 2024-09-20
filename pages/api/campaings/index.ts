import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const campaigns = await prisma.campaign.findMany();
      return res.status(200).json(campaigns);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao listar as campanhas.' });
    }
  } else if (req.method === 'POST') {
    const { name, category, initialDate, endDate, status, isActive } = req.body;

    if (!name || !category || !initialDate || !status || isActive === undefined) {
      return res.status(400).json({ error: 'Campos obrigatórios estão faltando.' });
    }

    const now = new Date();

    if (new Date(initialDate) < now) {
      return res.status(400).json({ error: 'A data de início deve ser igual ou posterior à data atual.' });
    }

    if (endDate && new Date(endDate) <= new Date(initialDate)) {
      return res.status(400).json({ error: 'A data de fim deve ser maior que a data de início.' });
    }

    const computedStatus = endDate && new Date(endDate) < now ? 'expired' : status;

    try {
      const newCampaign = await prisma.campaign.create({
        data: {
          name,
          category,
          initialDate: new Date(initialDate),
          endDate: endDate ? new Date(endDate) : null,
          status: computedStatus,
          isActive,
        },
      });
      return res.status(201).json(newCampaign);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao criar a campanha.' });
    }
  } else {
    return res.status(405).json({ error: 'Método não permitido.' });
  }
}