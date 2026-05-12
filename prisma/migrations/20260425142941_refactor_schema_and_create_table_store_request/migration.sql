/*
  Warnings:

  - The values [ADMIN] on the enum `role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `creat_at` on the `Orders` table. All the data in the column will be lost.
  - You are about to drop the column `store` on the `Orders` table. All the data in the column will be lost.
  - You are about to drop the column `user` on the `Orders` table. All the data in the column will be lost.
  - The `status` column on the `Orders` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `storeAdress` on the `stores` table. All the data in the column will be lost.
  - You are about to drop the column `adress` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `passwor` on the `users` table. All the data in the column will be lost.
  - Added the required column `storeId` to the `Orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storeAddress` to the `stores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userAddress` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'SHIPPED', 'DELIVERED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterEnum
BEGIN;
CREATE TYPE "role_new" AS ENUM ('USER', 'OWNER');
ALTER TABLE "public"."users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "role_new" USING ("role"::text::"role_new");
ALTER TYPE "role" RENAME TO "role_old";
ALTER TYPE "role_new" RENAME TO "role";
DROP TYPE "public"."role_old";
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'USER';
COMMIT;

-- DropForeignKey
ALTER TABLE "Orders" DROP CONSTRAINT "Orders_store_fkey";

-- DropForeignKey
ALTER TABLE "Orders" DROP CONSTRAINT "Orders_user_fkey";

-- AlterTable
ALTER TABLE "Orders" DROP COLUMN "creat_at",
DROP COLUMN "store",
DROP COLUMN "user",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "storeId" INTEGER NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "stores" DROP COLUMN "storeAdress",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "storeAddress" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "adress",
DROP COLUMN "passwor",
ADD COLUMN     "password" VARCHAR(255) NOT NULL,
ADD COLUMN     "userAddress" VARCHAR(255) NOT NULL;

-- CreateTable
CREATE TABLE "StoreRequest" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "nameStore" VARCHAR(150) NOT NULL,
    "contactEmail" VARCHAR(150) NOT NULL,
    "cnpj" VARCHAR(14) NOT NULL,
    "storeAddress" VARCHAR(255) NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StoreRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("idStore") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoreRequest" ADD CONSTRAINT "StoreRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
