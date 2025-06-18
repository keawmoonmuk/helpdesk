/*
  Warnings:

  - Added the required column `building` to the `repair_requests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `repair_requests` ADD COLUMN `building` VARCHAR(191) NOT NULL;
