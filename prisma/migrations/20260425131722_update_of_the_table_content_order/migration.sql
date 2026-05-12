/*
  Warnings:

  - You are about to drop the column `OrderId` on the `ContentOrder` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[orderId]` on the table `ContentOrder` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orderId` to the `ContentOrder` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ContentOrder" DROP CONSTRAINT "ContentOrder_OrderId_fkey";

-- DropIndex
DROP INDEX "ContentOrder_OrderId_key";

-- AlterTable
ALTER TABLE "ContentOrder" DROP COLUMN "OrderId",
ADD COLUMN     "orderId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ContentOrder_orderId_key" ON "ContentOrder"("orderId");

-- AddForeignKey
ALTER TABLE "ContentOrder" ADD CONSTRAINT "ContentOrder_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Orders"("idOrder") ON DELETE RESTRICT ON UPDATE CASCADE;
