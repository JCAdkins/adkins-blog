/*
  Warnings:

  - Made the column `name` on table `ContactMessage` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `ContactMessage` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ContactMessage" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "email" SET NOT NULL;
