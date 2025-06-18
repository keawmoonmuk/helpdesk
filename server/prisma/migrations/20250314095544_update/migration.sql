/*
  Warnings:

  - You are about to drop the `assets` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `external_technicians` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `maintenance_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `purchase_approvals` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `purchase_requests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `repair_approvals` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `repair_assessments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `repair_assignments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `repair_images` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `repair_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `repair_quotations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `repair_requests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `repair_reviews` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `maintenance_logs` DROP FOREIGN KEY `maintenance_logs_asset_id_fkey`;

-- DropForeignKey
ALTER TABLE `purchase_approvals` DROP FOREIGN KEY `purchase_approvals_approved_by_fkey`;

-- DropForeignKey
ALTER TABLE `purchase_approvals` DROP FOREIGN KEY `purchase_approvals_purchase_id_fkey`;

-- DropForeignKey
ALTER TABLE `purchase_requests` DROP FOREIGN KEY `purchase_requests_quotation_id_fkey`;

-- DropForeignKey
ALTER TABLE `purchase_requests` DROP FOREIGN KEY `purchase_requests_requested_by_fkey`;

-- DropForeignKey
ALTER TABLE `repair_approvals` DROP FOREIGN KEY `repair_approvals_approved_by_fkey`;

-- DropForeignKey
ALTER TABLE `repair_approvals` DROP FOREIGN KEY `repair_approvals_request_id_fkey`;

-- DropForeignKey
ALTER TABLE `repair_assessments` DROP FOREIGN KEY `repair_assessments_assessed_by_fkey`;

-- DropForeignKey
ALTER TABLE `repair_assessments` DROP FOREIGN KEY `repair_assessments_external_technician_id_fkey`;

-- DropForeignKey
ALTER TABLE `repair_assessments` DROP FOREIGN KEY `repair_assessments_request_id_fkey`;

-- DropForeignKey
ALTER TABLE `repair_assignments` DROP FOREIGN KEY `repair_assignments_external_technician_id_fkey`;

-- DropForeignKey
ALTER TABLE `repair_assignments` DROP FOREIGN KEY `repair_assignments_request_id_fkey`;

-- DropForeignKey
ALTER TABLE `repair_assignments` DROP FOREIGN KEY `repair_assignments_technician_id_fkey`;

-- DropForeignKey
ALTER TABLE `repair_images` DROP FOREIGN KEY `repair_images_request_id_fkey`;

-- DropForeignKey
ALTER TABLE `repair_logs` DROP FOREIGN KEY `repair_logs_request_id_fkey`;

-- DropForeignKey
ALTER TABLE `repair_logs` DROP FOREIGN KEY `repair_logs_technician_id_fkey`;

-- DropForeignKey
ALTER TABLE `repair_quotations` DROP FOREIGN KEY `repair_quotations_external_technician_id_fkey`;

-- DropForeignKey
ALTER TABLE `repair_quotations` DROP FOREIGN KEY `repair_quotations_request_id_fkey`;

-- DropForeignKey
ALTER TABLE `repair_requests` DROP FOREIGN KEY `repair_requests_asset_id_fkey`;

-- DropForeignKey
ALTER TABLE `repair_requests` DROP FOREIGN KEY `repair_requests_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `repair_reviews` DROP FOREIGN KEY `repair_reviews_request_id_fkey`;

-- DropForeignKey
ALTER TABLE `repair_reviews` DROP FOREIGN KEY `repair_reviews_reviewed_by_fkey`;

-- DropTable
DROP TABLE `assets`;

-- DropTable
DROP TABLE `external_technicians`;

-- DropTable
DROP TABLE `maintenance_logs`;

-- DropTable
DROP TABLE `purchase_approvals`;

-- DropTable
DROP TABLE `purchase_requests`;

-- DropTable
DROP TABLE `repair_approvals`;

-- DropTable
DROP TABLE `repair_assessments`;

-- DropTable
DROP TABLE `repair_assignments`;

-- DropTable
DROP TABLE `repair_images`;

-- DropTable
DROP TABLE `repair_logs`;

-- DropTable
DROP TABLE `repair_quotations`;

-- DropTable
DROP TABLE `repair_requests`;

-- DropTable
DROP TABLE `repair_reviews`;

-- DropTable
DROP TABLE `users`;

-- CreateTable
CREATE TABLE `User` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_name` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `full_name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `role` ENUM('USER', 'TECHNICIAN', 'ADMIN') NOT NULL,
    `department_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_user_name_key`(`user_name`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Department` (
    `department_id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Department_code_key`(`code`),
    PRIMARY KEY (`department_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Asset` (
    `asset_id` INTEGER NOT NULL AUTO_INCREMENT,
    `asset_code` VARCHAR(191) NOT NULL,
    `asset_name` VARCHAR(191) NOT NULL,
    `asset_type` VARCHAR(191) NOT NULL,
    `manufacturer` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `serial_number` VARCHAR(191) NOT NULL,
    `purchase_date` DATETIME(3) NOT NULL,
    `warranty_expire` DATETIME(3) NOT NULL,
    `specification` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Asset_asset_code_key`(`asset_code`),
    PRIMARY KEY (`asset_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AssetComponent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `asset_id` INTEGER NOT NULL,
    `component_type` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `expire_date` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserAsset` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `asset_id` INTEGER NOT NULL,
    `start_owned_at` DATETIME(3) NOT NULL,
    `end_owned_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RepairOutsourceImage` (
    `image_id` INTEGER NOT NULL AUTO_INCREMENT,
    `request_id` INTEGER NOT NULL,
    `image_url` VARCHAR(191) NOT NULL,
    `uploaded_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`image_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Duration` (
    `duration_id` INTEGER NOT NULL AUTO_INCREMENT,
    `time_period` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`duration_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RepairRequest` (
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
ALTER TABLE `User` ADD CONSTRAINT `User_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `Department`(`department_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AssetComponent` ADD CONSTRAINT `AssetComponent_asset_id_fkey` FOREIGN KEY (`asset_id`) REFERENCES `Asset`(`asset_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserAsset` ADD CONSTRAINT `UserAsset_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserAsset` ADD CONSTRAINT `UserAsset_asset_id_fkey` FOREIGN KEY (`asset_id`) REFERENCES `Asset`(`asset_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RepairOutsourceImage` ADD CONSTRAINT `RepairOutsourceImage_request_id_fkey` FOREIGN KEY (`request_id`) REFERENCES `RepairRequest`(`request_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RepairRequest` ADD CONSTRAINT `RepairRequest_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RepairRequest` ADD CONSTRAINT `RepairRequest_updated_by_fkey` FOREIGN KEY (`updated_by`) REFERENCES `User`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RepairRequest` ADD CONSTRAINT `RepairRequest_inspected_by_fkey` FOREIGN KEY (`inspected_by`) REFERENCES `User`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RepairRequest` ADD CONSTRAINT `RepairRequest_decide_id_fkey` FOREIGN KEY (`decide_id`) REFERENCES `User`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RepairRequest` ADD CONSTRAINT `RepairRequest_checkout_by_fkey` FOREIGN KEY (`checkout_by`) REFERENCES `User`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RepairRequest` ADD CONSTRAINT `RepairRequest_asset_id_fkey` FOREIGN KEY (`asset_id`) REFERENCES `Asset`(`asset_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RepairRequest` ADD CONSTRAINT `RepairRequest_duration_id_fkey` FOREIGN KEY (`duration_id`) REFERENCES `Duration`(`duration_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RepairRequest` ADD CONSTRAINT `RepairRequest_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `Department`(`department_id`) ON DELETE SET NULL ON UPDATE CASCADE;
