/*
  Warnings:

  - Added the required column `department` to the `repair_requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `floor` to the `repair_requests` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `repair_requests` DROP FOREIGN KEY `repair_requests_asset_id_fkey`;

-- DropIndex
DROP INDEX `repair_requests_asset_id_fkey` ON `repair_requests`;

-- AlterTable
ALTER TABLE `repair_requests` ADD COLUMN `department` VARCHAR(191) NOT NULL,
    ADD COLUMN `floor` VARCHAR(191) NOT NULL,
    MODIFY `asset_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `repair_requests` ADD CONSTRAINT `repair_requests_asset_id_fkey` FOREIGN KEY (`asset_id`) REFERENCES `assets`(`asset_id`) ON DELETE SET NULL ON UPDATE CASCADE;
