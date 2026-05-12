/*
  Warnings:

  - Added the required column `passwor` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "passwor" VARCHAR(8) NOT NULL;
