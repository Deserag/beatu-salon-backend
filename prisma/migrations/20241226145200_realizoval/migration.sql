/*
  Warnings:

  - You are about to drop the `ProductPrice` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `prices` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProductPrice" DROP CONSTRAINT "ProductPrice_productId_fkey";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "prices" INTEGER NOT NULL;

-- DropTable
DROP TABLE "ProductPrice";
