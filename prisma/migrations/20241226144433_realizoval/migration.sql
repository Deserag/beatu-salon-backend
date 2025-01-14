/*
  Warnings:

  - You are about to drop the column `creatorId` on the `Product` table. All the data in the column will be lost.
  - The primary key for the `ProductPrice` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `officeId` on the `ProductPrice` table. All the data in the column will be lost.
  - You are about to drop the column `officeId` on the `ProductSale` table. All the data in the column will be lost.
  - You are about to drop the `ProductOffice` table. If the table is not empty, all the data it contains will be lost.
  - The required column `id` was added to the `ProductPrice` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "ProductOffice" DROP CONSTRAINT "ProductOffice_officeId_fkey";

-- DropForeignKey
ALTER TABLE "ProductOffice" DROP CONSTRAINT "ProductOffice_productId_fkey";

-- DropForeignKey
ALTER TABLE "ProductPrice" DROP CONSTRAINT "ProductPrice_officeId_fkey";

-- DropForeignKey
ALTER TABLE "ProductSale" DROP CONSTRAINT "ProductSale_officeId_productId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "creatorId";

-- AlterTable
ALTER TABLE "ProductPrice" DROP CONSTRAINT "ProductPrice_pkey",
DROP COLUMN "officeId",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "ProductPrice_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ProductSale" DROP COLUMN "officeId";

-- DropTable
DROP TABLE "ProductOffice";

-- AddForeignKey
ALTER TABLE "ProductSale" ADD CONSTRAINT "ProductSale_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
