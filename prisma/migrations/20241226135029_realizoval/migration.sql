-- CreateTable
CREATE TABLE "ProductSale" (
    "id" TEXT NOT NULL,
    "officeId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "saleDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creatorId" TEXT NOT NULL,

    CONSTRAINT "ProductSale_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductSale" ADD CONSTRAINT "ProductSale_officeId_productId_fkey" FOREIGN KEY ("officeId", "productId") REFERENCES "ProductOffice"("officeId", "productId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductSale" ADD CONSTRAINT "ProductSale_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
