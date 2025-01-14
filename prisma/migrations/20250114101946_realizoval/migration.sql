-- CreateTable
CREATE TABLE "WorkerOnService" (
    "serviceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,

    CONSTRAINT "WorkerOnService_pkey" PRIMARY KEY ("serviceId","userId")
);

-- AddForeignKey
ALTER TABLE "WorkerOnService" ADD CONSTRAINT "WorkerOnService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkerOnService" ADD CONSTRAINT "WorkerOnService_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkerOnService" ADD CONSTRAINT "WorkerOnService_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
