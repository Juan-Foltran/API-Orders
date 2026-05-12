/*
  Warnings:

  - You are about to alter the column `total` on the `Orders` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "Orders" ALTER COLUMN "total" SET DATA TYPE DECIMAL(10,2);

-- CreateTable
CREATE TABLE "Products" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(70) NOT NULL,
    "description" VARCHAR(300) NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "idStore" INTEGER NOT NULL,

    CONSTRAINT "Products_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Products" ADD CONSTRAINT "Products_idStore_fkey" FOREIGN KEY ("idStore") REFERENCES "stores"("idStore") ON DELETE RESTRICT ON UPDATE CASCADE;
