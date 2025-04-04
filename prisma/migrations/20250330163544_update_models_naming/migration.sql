/*
  Warnings:

  - You are about to drop the `Cabinet` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Client` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ClientHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Department` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DepartmentUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Office` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Opportunity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Position` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductSale` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Review` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Schedule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Service` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ServiceCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ServiceRecord` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserOnCabinet` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkerOnService` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ServiceToServiceCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "eStatusRecord" AS ENUM ('CANCELED', 'DONE', 'PROBLEMS');

-- CreateEnum
CREATE TYPE "eCabinetStatus" AS ENUM ('AVAILABLE', 'OCCUPIED', 'UNDER_MAINTENANCE');

-- CreateEnum
CREATE TYPE "eGrade" AS ENUM ('VERY_BAD', 'BAD', 'OK', 'GOOD', 'EXCELLENT');

-- DropForeignKey
ALTER TABLE "Cabinet" DROP CONSTRAINT "Cabinet_officeId_fkey";

-- DropForeignKey
ALTER TABLE "ClientHistory" DROP CONSTRAINT "ClientHistory_clientId_fkey";

-- DropForeignKey
ALTER TABLE "ClientHistory" DROP CONSTRAINT "ClientHistory_feedbackId_fkey";

-- DropForeignKey
ALTER TABLE "ClientHistory" DROP CONSTRAINT "ClientHistory_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "DepartmentUser" DROP CONSTRAINT "DepartmentUser_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "DepartmentUser" DROP CONSTRAINT "DepartmentUser_userId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "ProductSale" DROP CONSTRAINT "ProductSale_clientId_fkey";

-- DropForeignKey
ALTER TABLE "ProductSale" DROP CONSTRAINT "ProductSale_productId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_clientId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_cabinetId_fkey";

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_userId_fkey";

-- DropForeignKey
ALTER TABLE "ServiceRecord" DROP CONSTRAINT "ServiceRecord_clientId_fkey";

-- DropForeignKey
ALTER TABLE "ServiceRecord" DROP CONSTRAINT "ServiceRecord_officeId_fkey";

-- DropForeignKey
ALTER TABLE "ServiceRecord" DROP CONSTRAINT "ServiceRecord_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "ServiceRecord" DROP CONSTRAINT "ServiceRecord_workCabinetId_fkey";

-- DropForeignKey
ALTER TABLE "ServiceRecord" DROP CONSTRAINT "ServiceRecord_workerId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_roleId_fkey";

-- DropForeignKey
ALTER TABLE "UserOnCabinet" DROP CONSTRAINT "UserOnCabinet_cabinetId_fkey";

-- DropForeignKey
ALTER TABLE "UserOnCabinet" DROP CONSTRAINT "UserOnCabinet_userId_fkey";

-- DropForeignKey
ALTER TABLE "WorkerOnService" DROP CONSTRAINT "WorkerOnService_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "WorkerOnService" DROP CONSTRAINT "WorkerOnService_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "WorkerOnService" DROP CONSTRAINT "WorkerOnService_userId_fkey";

-- DropForeignKey
ALTER TABLE "_ServiceToServiceCategory" DROP CONSTRAINT "_ServiceToServiceCategory_A_fkey";

-- DropForeignKey
ALTER TABLE "_ServiceToServiceCategory" DROP CONSTRAINT "_ServiceToServiceCategory_B_fkey";

-- DropTable
DROP TABLE "Cabinet";

-- DropTable
DROP TABLE "Client";

-- DropTable
DROP TABLE "ClientHistory";

-- DropTable
DROP TABLE "Department";

-- DropTable
DROP TABLE "DepartmentUser";

-- DropTable
DROP TABLE "Office";

-- DropTable
DROP TABLE "Opportunity";

-- DropTable
DROP TABLE "Position";

-- DropTable
DROP TABLE "Product";

-- DropTable
DROP TABLE "ProductSale";

-- DropTable
DROP TABLE "Review";

-- DropTable
DROP TABLE "Role";

-- DropTable
DROP TABLE "Schedule";

-- DropTable
DROP TABLE "Service";

-- DropTable
DROP TABLE "ServiceCategory";

-- DropTable
DROP TABLE "ServiceRecord";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "UserOnCabinet";

-- DropTable
DROP TABLE "WorkerOnService";

-- DropTable
DROP TABLE "_ServiceToServiceCategory";

-- DropEnum
DROP TYPE "ECabinetStatus";

-- DropEnum
DROP TYPE "EGrade";

-- DropEnum
DROP TYPE "EStatusRecord";

-- CreateTable
CREATE TABLE "cabinet" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "officeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creatorId" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "eCabinetStatus" NOT NULL DEFAULT 'AVAILABLE',

    CONSTRAINT "cabinet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userOnCabinet" (
    "cabinetId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "userOnCabinet_pkey" PRIMARY KEY ("cabinetId","userId")
);

-- CreateTable
CREATE TABLE "product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "volume" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "unit" TEXT NOT NULL DEFAULT 'мл',
    "quantity" INTEGER NOT NULL,
    "prices" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "creatorId" TEXT NOT NULL,

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "productSale" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "saleDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creatorId" TEXT NOT NULL,

    CONSTRAINT "productSale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client" (
    "id" TEXT NOT NULL,
    "telegramId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "middleName" TEXT,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "office" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "creatorId" TEXT NOT NULL,

    CONSTRAINT "office_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "opportunity" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "opportunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "position" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "position_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL DEFAULT 'Default Description',

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" INTEGER NOT NULL,
    "duration" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "creatorId" TEXT NOT NULL,

    CONSTRAINT "service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workerOnService" (
    "serviceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,

    CONSTRAINT "workerOnService_pkey" PRIMARY KEY ("serviceId","userId")
);

-- CreateTable
CREATE TABLE "serviceRecord" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "workerId" TEXT NOT NULL,
    "dateTime" TIMESTAMP(3) NOT NULL,
    "serviceId" TEXT NOT NULL,
    "officeId" TEXT NOT NULL,
    "workCabinetId" TEXT NOT NULL,
    "result" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "serviceRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "login" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "telegramId" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "department" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departmentUser" (
    "userId" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,

    CONSTRAINT "departmentUser_pkey" PRIMARY KEY ("userId","departmentId")
);

-- CreateTable
CREATE TABLE "schedule" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "cabinetId" TEXT NOT NULL,

    CONSTRAINT "schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "serviceCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "serviceCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientHistory" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "feedbackId" TEXT,

    CONSTRAINT "clientHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "comment" TEXT,
    "grade" "eGrade" NOT NULL,

    CONSTRAINT "review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_serviceToServiceCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "client_telegramId_key" ON "client"("telegramId");

-- CreateIndex
CREATE UNIQUE INDEX "user_login_key" ON "user"("login");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_telegramId_key" ON "user"("telegramId");

-- CreateIndex
CREATE UNIQUE INDEX "_serviceToServiceCategory_AB_unique" ON "_serviceToServiceCategory"("A", "B");

-- CreateIndex
CREATE INDEX "_serviceToServiceCategory_B_index" ON "_serviceToServiceCategory"("B");

-- AddForeignKey
ALTER TABLE "cabinet" ADD CONSTRAINT "cabinet_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "office"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userOnCabinet" ADD CONSTRAINT "userOnCabinet_cabinetId_fkey" FOREIGN KEY ("cabinetId") REFERENCES "cabinet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userOnCabinet" ADD CONSTRAINT "userOnCabinet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productSale" ADD CONSTRAINT "productSale_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productSale" ADD CONSTRAINT "productSale_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workerOnService" ADD CONSTRAINT "workerOnService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workerOnService" ADD CONSTRAINT "workerOnService_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workerOnService" ADD CONSTRAINT "workerOnService_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "serviceRecord" ADD CONSTRAINT "serviceRecord_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "serviceRecord" ADD CONSTRAINT "serviceRecord_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "office"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "serviceRecord" ADD CONSTRAINT "serviceRecord_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "serviceRecord" ADD CONSTRAINT "serviceRecord_workCabinetId_fkey" FOREIGN KEY ("workCabinetId") REFERENCES "cabinet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "serviceRecord" ADD CONSTRAINT "serviceRecord_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "departmentUser" ADD CONSTRAINT "departmentUser_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "departmentUser" ADD CONSTRAINT "departmentUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule" ADD CONSTRAINT "schedule_cabinetId_fkey" FOREIGN KEY ("cabinetId") REFERENCES "cabinet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule" ADD CONSTRAINT "schedule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clientHistory" ADD CONSTRAINT "clientHistory_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clientHistory" ADD CONSTRAINT "clientHistory_feedbackId_fkey" FOREIGN KEY ("feedbackId") REFERENCES "review"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clientHistory" ADD CONSTRAINT "clientHistory_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_serviceToServiceCategory" ADD CONSTRAINT "_serviceToServiceCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_serviceToServiceCategory" ADD CONSTRAINT "_serviceToServiceCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "serviceCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
