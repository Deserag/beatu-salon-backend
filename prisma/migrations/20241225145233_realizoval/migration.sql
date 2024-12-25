/*
  Warnings:

  - The values [canceled,Done,Problems] on the enum `EStatusRecord` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `adress` on the `Office` table. All the data in the column will be lost.
  - You are about to drop the column `department` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `UserStatus` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[telegramId]` on the table `Client` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `address` to the `Office` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `grade` on the `Review` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EStatusRecord_new" AS ENUM ('CANCELED', 'DONE', 'PROBLEMS');
ALTER TYPE "EStatusRecord" RENAME TO "EStatusRecord_old";
ALTER TYPE "EStatusRecord_new" RENAME TO "EStatusRecord";
DROP TYPE "EStatusRecord_old";
COMMIT;

-- AlterTable
ALTER TABLE "Cabinet" ADD COLUMN     "status" "ECabinetStatus" NOT NULL DEFAULT 'AVAILABLE';

-- AlterTable
ALTER TABLE "Office" DROP COLUMN "adress",
ADD COLUMN     "address" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "grade",
ADD COLUMN     "grade" "EGrade" NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "department";

-- DropTable
DROP TABLE "UserStatus";

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "creatorId" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductOffice" (
    "officeId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "ProductOffice_pkey" PRIMARY KEY ("officeId","productId")
);

-- CreateTable
CREATE TABLE "ProductPrice" (
    "officeId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "creatorId" TEXT NOT NULL,

    CONSTRAINT "ProductPrice_pkey" PRIMARY KEY ("officeId","productId")
);

-- CreateTable
CREATE TABLE "DepartmentUser" (
    "userId" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,

    CONSTRAINT "DepartmentUser_pkey" PRIMARY KEY ("userId","departmentId")
);

-- CreateTable
CREATE TABLE "_ServiceToServiceCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ServiceToServiceCategory_AB_unique" ON "_ServiceToServiceCategory"("A", "B");

-- CreateIndex
CREATE INDEX "_ServiceToServiceCategory_B_index" ON "_ServiceToServiceCategory"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Client_telegramId_key" ON "Client"("telegramId");

-- AddForeignKey
ALTER TABLE "Cabinet" ADD CONSTRAINT "Cabinet_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "Office"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOnCabinet" ADD CONSTRAINT "UserOnCabinet_cabinetId_fkey" FOREIGN KEY ("cabinetId") REFERENCES "Cabinet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOnCabinet" ADD CONSTRAINT "UserOnCabinet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductOffice" ADD CONSTRAINT "ProductOffice_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "Office"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductOffice" ADD CONSTRAINT "ProductOffice_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductPrice" ADD CONSTRAINT "ProductPrice_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "Office"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductPrice" ADD CONSTRAINT "ProductPrice_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRecord" ADD CONSTRAINT "ServiceRecord_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRecord" ADD CONSTRAINT "ServiceRecord_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRecord" ADD CONSTRAINT "ServiceRecord_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRecord" ADD CONSTRAINT "ServiceRecord_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "Office"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRecord" ADD CONSTRAINT "ServiceRecord_workCabinetId_fkey" FOREIGN KEY ("workCabinetId") REFERENCES "Cabinet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepartmentUser" ADD CONSTRAINT "DepartmentUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepartmentUser" ADD CONSTRAINT "DepartmentUser_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_cabinetId_fkey" FOREIGN KEY ("cabinetId") REFERENCES "Cabinet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientHistory" ADD CONSTRAINT "ClientHistory_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientHistory" ADD CONSTRAINT "ClientHistory_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientHistory" ADD CONSTRAINT "ClientHistory_feedbackId_fkey" FOREIGN KEY ("feedbackId") REFERENCES "Review"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ServiceToServiceCategory" ADD CONSTRAINT "_ServiceToServiceCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ServiceToServiceCategory" ADD CONSTRAINT "_ServiceToServiceCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "ServiceCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
