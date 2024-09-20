
import { createMocks } from 'node-mocks-http';
import handler from '../pages/api/campaings';
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import handlerID from '../pages/api/campaings/[id]';
const prisma = new PrismaClient();

describe('Campaign API', () => {
  beforeEach(async () => {
    await prisma.campaign.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('Deve listar todas as campanhas', async () => {
    await prisma.campaign.create({
      data: {
        name: 'Campanha venda notebooks',
        category: 'TECHNOLOGY',
        initialDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 1)),
        status: 'ACTIVE',
        isActive: true,
      },
    });

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      url: '/api/campaigns',
    });

    req.env = process.env; 

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const responseBody = JSON.parse(res._getData());
    expect(responseBody.length).toBe(1);
    expect(responseBody[0].name).toBe('Campanha venda notebooks');
  });

  it('Deve criar uma nova campanha (POST)', async () => {
    const newCampaign = {
      name: 'Campanha criptomoeda',
      category: 'FINANCE',
      initialDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 5)),
      status: 'ACTIVE',
      isActive: true,
    };

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      url: '/api/campaigns',
      body: newCampaign,
    });

    req.env = process.env;

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
    const responseBody = JSON.parse(res._getData());
    expect(responseBody.name).toBe('Campanha criptomoeda');
  });

  it('Deve falhar ao criar uma campanha com data de início no passado (POST)', async () => {
    const invalidCampaign = {
      name: 'Campanha unimed',
      category: 'HEALTH',
      initialDate: new Date(new Date().setDate(new Date().getDate() - 5)),
      endDate: new Date(new Date().setDate(new Date().getDate() + 1)),
      status: 'ACTIVE',
      isActive: true,
    };

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      url: '/api/campaigns',
      body: invalidCampaign,
    });

    req.env = process.env;

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    const responseBody = JSON.parse(res._getData());
    expect(responseBody.error).toBe('A data de início deve ser igual ou posterior à data atual.');
  });

  it('Deve atualizar uma campanha existente (PUT)', async () => {
    const campaign = await prisma.campaign.create({
      data: {
        name: 'Campanha anúncio',
        category: 'MARKETING',
        initialDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 3)),
        status: 'ACTIVE',
        isActive: true,
      },
    });

    const updatedData = {
      id:campaign.id,
      name: 'Campanha criptomoeda',
      category: 'FINANCE',
      endDate:campaign.endDate,
      status:campaign.status,
      isActive:campaign.isActive
    };

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'PUT',
      url: `/api/campaigns/${campaign.id}`,
      body: updatedData,
      query: { id: campaign.id }
    });

    req.env = process.env;

    await handlerID(req, res);

    expect(res._getStatusCode()).toBe(200);
    const responseBody = JSON.parse(res._getData());
    expect(responseBody.name).toBe('Campanha criptomoeda');
    expect(responseBody.isActive).toBe(true);
  });

  it('Deve realizar soft delete de uma campanha (DELETE)', async () => {
    const campaign = await prisma.campaign.create({
      data: {
        name: 'Ciência',
        category: 'EDUCATION',
        initialDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 3)),
        status: 'ACTIVE',
        isActive: true,
      },
    });

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'DELETE',
      url: `/api/campaigns/${campaign.id}`,
      query: { id: campaign.id }
    });

    req.env = process.env;

    await handlerID(req, res);

    expect(res._getStatusCode()).toBe(200);
    const responseBody = JSON.parse(res._getData());
    expect(responseBody.message).toBe('Campanha desativada com sucesso.');

    const deactivatedCampaign = await prisma.campaign.findUnique({
      where: { id: campaign.id },
    });
    expect(deactivatedCampaign?.isActive).toBe(false);

    const { req: reqList, res: resList } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      url: '/api/campaigns',
    });

    reqList.env = process.env;

    await handler(reqList, resList);
    const currentCampaign = JSON.parse(resList._getData());
    expect(currentCampaign[0].isActive).toBe(false);
  });
});