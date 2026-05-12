-- CreateTable
CREATE TABLE "Orders" (
    "idOrder" SERIAL NOT NULL,
    "status" TEXT NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "user" INTEGER NOT NULL,
    "store" INTEGER NOT NULL,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("idOrder")
);

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_user_fkey" FOREIGN KEY ("user") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_store_fkey" FOREIGN KEY ("store") REFERENCES "stores"("idStore") ON DELETE RESTRICT ON UPDATE CASCADE;
