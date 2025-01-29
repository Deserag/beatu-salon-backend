/*
  Warnings:

  - You are about to drop the column `creatorId` on the `Department` table. All the data in the column will be lost.
  - You are about to drop the column `creatorId` on the `Role` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Department" DROP COLUMN "creatorId";

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "creatorId";
