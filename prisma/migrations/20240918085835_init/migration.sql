-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'PAUSE', 'EXPIRED');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('TECHNOLOGY', 'MARKETING', 'EDUCATION', 'HEALTH', 'FINANCE');

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "Category" NOT NULL,
    "registrationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "initialDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);
