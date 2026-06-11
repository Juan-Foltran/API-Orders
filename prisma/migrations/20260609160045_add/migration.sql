/*
  Warnings:

  - A unique constraint covering the columns `[cnpj]` on the table `StoreRequest` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "StoreRequest_cnpj_key" ON "StoreRequest"("cnpj");
