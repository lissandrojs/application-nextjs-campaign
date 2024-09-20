const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

beforeEach(async () => {
  await prisma.campaign.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});