-- DropForeignKey
ALTER TABLE `asset_components` DROP FOREIGN KEY `asset_components_asset_id_fkey`;

-- DropForeignKey
ALTER TABLE `repair_images` DROP FOREIGN KEY `repair_images_request_id_fkey`;

-- DropForeignKey
ALTER TABLE `user_assets` DROP FOREIGN KEY `user_assets_asset_id_fkey`;

-- DropForeignKey
ALTER TABLE `user_assets` DROP FOREIGN KEY `user_assets_user_id_fkey`;

-- DropIndex
DROP INDEX `asset_components_asset_id_fkey` ON `asset_components`;

-- DropIndex
DROP INDEX `repair_images_request_id_fkey` ON `repair_images`;

-- DropIndex
DROP INDEX `user_assets_asset_id_fkey` ON `user_assets`;

-- DropIndex
DROP INDEX `user_assets_user_id_fkey` ON `user_assets`;

-- AddForeignKey
ALTER TABLE `asset_components` ADD CONSTRAINT `asset_components_asset_id_fkey` FOREIGN KEY (`asset_id`) REFERENCES `assets`(`asset_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_assets` ADD CONSTRAINT `user_assets_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_assets` ADD CONSTRAINT `user_assets_asset_id_fkey` FOREIGN KEY (`asset_id`) REFERENCES `assets`(`asset_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `repair_images` ADD CONSTRAINT `repair_images_request_id_fkey` FOREIGN KEY (`request_id`) REFERENCES `repair_requests`(`request_id`) ON DELETE CASCADE ON UPDATE CASCADE;
