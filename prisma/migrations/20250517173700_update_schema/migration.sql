/*
  Warnings:

  - You are about to drop the column `clientId` on the `clientHistory` table. All the data in the column will be lost.
  - You are about to drop the column `clientId` on the `productSale` table. All the data in the column will be lost.
  - You are about to drop the column `clientId` on the `review` table. All the data in the column will be lost.
  - You are about to drop the column `clientId` on the `serviceRecord` table. All the data in the column will be lost.
  - You are about to drop the `client` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `clientHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `productSale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `serviceRecord` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "clientHistory" DROP CONSTRAINT "clientHistory_clientId_fkey";

-- DropForeignKey
ALTER TABLE "productSale" DROP CONSTRAINT "productSale_clientId_fkey";

-- DropForeignKey
ALTER TABLE "review" DROP CONSTRAINT "review_clientId_fkey";

-- DropForeignKey
ALTER TABLE "serviceRecord" DROP CONSTRAINT "serviceRecord_clientId_fkey";

-- AlterTable
ALTER TABLE "clientHistory" DROP COLUMN "clientId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "productSale" DROP COLUMN "clientId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "review" DROP COLUMN "clientId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "serviceRecord" DROP COLUMN "clientId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- DropTable
DROP TABLE "client";

-- AddForeignKey
ALTER TABLE "productSale" ADD CONSTRAINT "productSale_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "serviceRecord" ADD CONSTRAINT "serviceRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clientHistory" ADD CONSTRAINT "clientHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
