/*
  Warnings:

  - You are about to drop the `asset` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `asset_components` DROP FOREIGN KEY `asset_components_asset_id_fkey`;

-- DropForeignKey
ALTER TABLE `repair_requests` DROP FOREIGN KEY `repair_requests_asset_id_fkey`;

-- DropForeignKey
ALTER TABLE `user_assets` DROP FOREIGN KEY `user_assets_asset_id_fkey`;

-- DropIndex
DROP INDEX `asset_components_asset_id_fkey` ON `asset_components`;

-- DropIndex
DROP INDEX `repair_requests_asset_id_fkey` ON `repair_requests`;

-- DropIndex
DROP INDEX `user_assets_asset_id_fkey` ON `user_assets`;

-- DropTable
DROP TABLE `asset`;

-- CreateTable
CREATE TABLE `assets` (
    `asset_id` INTEGER NOT NULL AUTO_INCREMENT,
    `asset_code` VARCHAR(191) NULL DEFAULT '',
    `asset_name` VARCHAR(191) NOT NULL,
    `asset_serial_number` VARCHAR(191) NOT NULL,
    `asset_type` VARCHAR(191) NULL,
    `asset_location` VARCHAR(191) NOT NULL,
    `manufacturer` VARCHAR(191) NULL,
    `model` VARCHAR(191) NULL,
    `purchase_date` DATETIME(3) NULL,
    `warranty_expire` DATETIME(3) NULL,
    `specification` VARCHAR(191) NULL,
    `status` ENUM('AVAILABLE', 'IN_USE', 'UNDER_REPAIR', 'DISPOSED') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`asset_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `asset_components` ADD CONSTRAINT `asset_components_asset_id_fkey` FOREIGN KEY (`asset_id`) REFERENCES `assets`(`asset_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_assets` ADD CONSTRAINT `user_assets_asset_id_fkey` FOREIGN KEY (`asset_id`) REFERENCES `assets`(`asset_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `repair_requests` ADD CONSTRAINT `repair_requests_asset_id_fkey` FOREIGN KEY (`asset_id`) REFERENCES `assets`(`asset_id`) ON DELETE SET NULL ON UPDATE CASCADE;
