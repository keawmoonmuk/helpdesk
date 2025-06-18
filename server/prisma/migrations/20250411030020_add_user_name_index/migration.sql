/*
  Warnings:

  - You are about to drop the `department` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `repair_requests` DROP FOREIGN KEY `repair_requests_checkout_by_fkey`;

-- DropForeignKey
ALTER TABLE `repair_requests` DROP FOREIGN KEY `repair_requests_created_by_fkey`;

-- DropForeignKey
ALTER TABLE `repair_requests` DROP FOREIGN KEY `repair_requests_decide_id_fkey`;

-- DropForeignKey
ALTER TABLE `repair_requests` DROP FOREIGN KEY `repair_requests_department_id_fkey`;

-- DropForeignKey
ALTER TABLE `repair_requests` DROP FOREIGN KEY `repair_requests_inspected_by_fkey`;

-- DropForeignKey
ALTER TABLE `repair_requests` DROP FOREIGN KEY `repair_requests_updated_by_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_department_id_fkey`;

-- DropForeignKey
ALTER TABLE `user_assets` DROP FOREIGN KEY `user_assets_user_id_fkey`;

-- DropIndex
DROP INDEX `repair_requests_checkout_by_fkey` ON `repair_requests`;

-- DropIndex
DROP INDEX `repair_requests_created_by_fkey` ON `repair_requests`;

-- DropIndex
DROP INDEX `repair_requests_decide_id_fkey` ON `repair_requests`;

-- DropIndex
DROP INDEX `repair_requests_department_id_fkey` ON `repair_requests`;

-- DropIndex
DROP INDEX `repair_requests_inspected_by_fkey` ON `repair_requests`;

-- DropIndex
DROP INDEX `repair_requests_updated_by_fkey` ON `repair_requests`;

-- DropIndex
DROP INDEX `user_assets_user_id_fkey` ON `user_assets`;

-- DropTable
DROP TABLE `department`;

-- DropTable
DROP TABLE `user`;

-- CreateTable
CREATE TABLE `users` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_name` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `full_name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `role` ENUM('USER', 'TECHNICIAN', 'ADMIN') NOT NULL,
    `department_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `users_email_key`(`email`),
    INDEX `users_user_name_idx`(`user_name`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Departments` (
    `department_id` INTEGER NOT NULL AUTO_INCREMENT,
    `department_name` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `created_by` INTEGER NULL,

    PRIMARY KEY (`department_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `Departments`(`department_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_assets` ADD CONSTRAINT `user_assets_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `repair_requests` ADD CONSTRAINT `repair_requests_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `repair_requests` ADD CONSTRAINT `repair_requests_updated_by_fkey` FOREIGN KEY (`updated_by`) REFERENCES `users`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `repair_requests` ADD CONSTRAINT `repair_requests_inspected_by_fkey` FOREIGN KEY (`inspected_by`) REFERENCES `users`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `repair_requests` ADD CONSTRAINT `repair_requests_decide_id_fkey` FOREIGN KEY (`decide_id`) REFERENCES `users`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `repair_requests` ADD CONSTRAINT `repair_requests_checkout_by_fkey` FOREIGN KEY (`checkout_by`) REFERENCES `users`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `repair_requests` ADD CONSTRAINT `repair_requests_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `Departments`(`department_id`) ON DELETE SET NULL ON UPDATE CASCADE;
