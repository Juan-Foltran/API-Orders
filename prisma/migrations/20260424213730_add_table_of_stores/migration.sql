-- CreateTable
CREATE TABLE "stores" (
    "idStore" SERIAL NOT NULL,
    "nameStore" VARCHAR(150) NOT NULL,
    "contactEmail" VARCHAR(150) NOT NULL,
    "cnpj" VARCHAR(14) NOT NULL,
    "storeAdress" VARCHAR(255) NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "ownerId" INTEGER NOT NULL,

    CONSTRAINT "stores_pkey" PRIMARY KEY ("idStore")
);

-- CreateIndex
CREATE UNIQUE INDEX "stores_cnpj_key" ON "stores"("cnpj");

-- AddForeignKey
ALTER TABLE "stores" ADD CONSTRAINT "stores_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
