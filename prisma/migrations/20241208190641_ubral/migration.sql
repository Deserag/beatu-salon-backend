/*
  Warnings:

  - You are about to drop the `WorkCabinet` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "WorkCabinet";

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "grade" INTEGER NOT NULL,
    "comment" TEXT,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);
