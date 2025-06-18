/*
  Warnings:

  - You are about to drop the column `location` on the `asset` table. All the data in the column will be lost.
  - You are about to drop the column `serial_number` on the `asset` table. All the data in the column will be lost.
  - You are about to alter the column `status` on the `asset` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.
  - You are about to drop the column `asset_code` on the `repair_requests` table. All the data in the column will be lost.
  - You are about to drop the column `asset_serial` on the `repair_requests` table. All the data in the column will be lost.
  - You are about to drop the `repair_outsource_images` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `asset_location` to the `Asset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `asset_serial_number` to the `Asset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `importance` to the `repair_requests` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `repair_outsource_images` DROP FOREIGN KEY `repair_outsource_images_request_id_fkey`;

-- AlterTable
ALTER TABLE `asset` DROP COLUMN `location`,
    DROP COLUMN `serial_number`,
    ADD COLUMN `asset_location` VARCHAR(191) NOT NULL,
    ADD COLUMN `asset_serial_number` VARCHAR(191) NOT NULL,
    MODIFY `status` ENUM('AVAILABLE', 'IN_USE', 'UNDER_REPAIR', 'DISPOSED') NOT NULL;

-- AlterTable
ALTER TABLE `repair_requests` DROP COLUMN `asset_code`,
    DROP COLUMN `asset_serial`,
    ADD COLUMN `importance` ENUM('LOW', 'MEDIUM', 'HIGH') NOT NULL;

-- DropTable
DROP TABLE `repair_outsource_images`;

-- CreateTable
CREATE TABLE `repair_images` (
    `image_id` INTEGER NOT NULL AUTO_INCREMENT,
    `request_id` INTEGER NOT NULL,
    `image_url` VARCHAR(191) NOT NULL,
    `image_type` ENUM('INTERNAL', 'EXTERNAL') NOT NULL,
    `uploaded_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`image_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `repair_images` ADD CONSTRAINT `repair_images_request_id_fkey` FOREIGN KEY (`request_id`) REFERENCES `repair_requests`(`request_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
