/*
  Warnings:

  - You are about to alter the column `status` on the `Orders` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.

*/
-- AlterTable
ALTER TABLE "Orders" ADD COLUMN     "creat_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "status" SET DATA TYPE VARCHAR(50);

-- CreateTable
CREATE TABLE "ContentOrder" (
    "id" SERIAL NOT NULL,
    "OrderId" INTEGER NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "ContentOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ContentOrder_OrderId_key" ON "ContentOrder"("OrderId");

-- AddForeignKey
ALTER TABLE "ContentOrder" ADD CONSTRAINT "ContentOrder_OrderId_fkey" FOREIGN KEY ("OrderId") REFERENCES "Orders"("idOrder") ON DELETE RESTRICT ON UPDATE CASCADE;
