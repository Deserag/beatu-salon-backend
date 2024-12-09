-- CreateEnum
CREATE TYPE "EUserRole" AS ENUM ('ADMIN', 'WORKER', 'CLIENT');

-- CreateEnum
CREATE TYPE "ECabinetStatus" AS ENUM ('AVAILABLE', 'OCCUPIED', 'UNDER_MAINTENANCE');

-- CreateEnum
CREATE TYPE "EGrade" AS ENUM ('VERY_BAD', 'BAD', 'OK', 'GOOD', 'EXCELLENT');

-- CreateTable
CREATE TABLE "Schedule" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "cabinetId" TEXT NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "ServiceCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserStatus" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "UserStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientHistory" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "feedbackId" TEXT,

    CONSTRAINT "ClientHistory_pkey" PRIMARY KEY ("id")
);
