/*
  Warnings:

  - You are about to drop the `assetcomponent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `repairoutsourceimage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `repairrequest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `userasset` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `assetcomponent` DROP FOREIGN KEY `AssetComponent_asset_id_fkey`;

-- DropForeignKey
ALTER TABLE `repairoutsourceimage` DROP FOREIGN KEY `RepairOutsourceImage_request_id_fkey`;

-- DropForeignKey
ALTER TABLE `repairrequest` DROP FOREIGN KEY `RepairRequest_asset_id_fkey`;

-- DropForeignKey
ALTER TABLE `repairrequest` DROP FOREIGN KEY `RepairRequest_checkout_by_fkey`;

-- DropForeignKey
ALTER TABLE `repairrequest` DROP FOREIGN KEY `RepairRequest_created_by_fkey`;

-- DropForeignKey
ALTER TABLE `repairrequest` DROP FOREIGN KEY `RepairRequest_decide_id_fkey`;

-- DropForeignKey
ALTER TABLE `repairrequest` DROP FOREIGN KEY `RepairRequest_department_id_fkey`;

-- DropForeignKey
ALTER TABLE `repairrequest` DROP FOREIGN KEY `RepairRequest_duration_id_fkey`;

-- DropForeignKey
ALTER TABLE `repairrequest` DROP FOREIGN KEY `RepairRequest_inspected_by_fkey`;

-- DropForeignKey
ALTER TABLE `repairrequest` DROP FOREIGN KEY `RepairRequest_updated_by_fkey`;

-- DropForeignKey
ALTER TABLE `userasset` DROP FOREIGN KEY `UserAsset_asset_id_fkey`;

-- DropForeignKey
ALTER TABLE `userasset` DROP FOREIGN KEY `UserAsset_user_id_fkey`;

-- DropTable
DROP TABLE `assetcomponent`;

-- DropTable
DROP TABLE `repairoutsourceimage`;

-- DropTable
DROP TABLE `repairrequest`;

-- DropTable
DROP TABLE `userasset`;

-- CreateTable
CREATE TABLE `asset_components` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `asset_id` INTEGER NOT NULL,
    `component_type` VARCHAR(191) NOT NULL,
    `asset_component_name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `expire_date` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_assets` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `asset_id` INTEGER NOT NULL,
    `start_owned_at` DATETIME(3) NOT NULL,
    `end_owned_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `repair_outsource_images` (
    `image_id` INTEGER NOT NULL AUTO_INCREMENT,
    `request_id` INTEGER NOT NULL,
    `image_url` VARCHAR(191) NOT NULL,
    `uploaded_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`image_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `repair_requests` (
    `request_id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_by` INTEGER NOT NULL,
    `asset_id` INTEGER NULL,
    `asset_code` VARCHAR(191) NULL,
    `asset_serial` VARCHAR(191) NULL,
    `detail` VARCHAR(191) NOT NULL,
    `building` VARCHAR(191) NOT NULL,
    `floor` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `duration_id` INTEGER NULL,
    `department_id` INTEGER NULL,
    `status` ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_by` INTEGER NULL,
    `updated_at` DATETIME(3) NULL,
    `cause` VARCHAR(191) NULL,
    `solution` VARCHAR(191) NULL,
    `inspected_at` DATETIME(3) NULL,
    `inspected_by` INTEGER NULL,
    `decide_id` INTEGER NULL,
    `decide_cause` VARCHAR(191) NULL,
    `checkout_at` DATETIME(3) NULL,
    `checkout_by` INTEGER NULL,
    `is_approved_outsource` BOOLEAN NULL,
    `reject_outsource_reason` VARCHAR(191) NULL,

    PRIMARY KEY (`request_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `asset_components` ADD CONSTRAINT `asset_components_asset_id_fkey` FOREIGN KEY (`asset_id`) REFERENCES `Asset`(`asset_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_assets` ADD CONSTRAINT `user_assets_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_assets` ADD CONSTRAINT `user_assets_asset_id_fkey` FOREIGN KEY (`asset_id`) REFERENCES `Asset`(`asset_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `repair_outsource_images` ADD CONSTRAINT `repair_outsource_images_request_id_fkey` FOREIGN KEY (`request_id`) REFERENCES `repair_requests`(`request_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `repair_requests` ADD CONSTRAINT `repair_requests_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `repair_requests` ADD CONSTRAINT `repair_requests_updated_by_fkey` FOREIGN KEY (`updated_by`) REFERENCES `User`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `repair_requests` ADD CONSTRAINT `repair_requests_inspected_by_fkey` FOREIGN KEY (`inspected_by`) REFERENCES `User`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `repair_requests` ADD CONSTRAINT `repair_requests_decide_id_fkey` FOREIGN KEY (`decide_id`) REFERENCES `User`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `repair_requests` ADD CONSTRAINT `repair_requests_checkout_by_fkey` FOREIGN KEY (`checkout_by`) REFERENCES `User`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `repair_requests` ADD CONSTRAINT `repair_requests_asset_id_fkey` FOREIGN KEY (`asset_id`) REFERENCES `Asset`(`asset_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `repair_requests` ADD CONSTRAINT `repair_requests_duration_id_fkey` FOREIGN KEY (`duration_id`) REFERENCES `Duration`(`duration_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `repair_requests` ADD CONSTRAINT `repair_requests_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `Department`(`department_id`) ON DELETE SET NULL ON UPDATE CASCADE;
