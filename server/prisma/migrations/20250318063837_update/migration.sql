/*
  Warnings:

  - You are about to drop the column `name` on the `assetcomponent` table. All the data in the column will be lost.
  - You are about to drop the column `code` on the `department` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `department` table. All the data in the column will be lost.
  - Added the required column `asset_component_name` to the `AssetComponent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `department_name` to the `Department` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Department_code_key` ON `department`;

-- DropIndex
DROP INDEX `User_user_name_key` ON `user`;

-- AlterTable
ALTER TABLE `assetcomponent` DROP COLUMN `name`,
    ADD COLUMN `asset_component_name` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `department` DROP COLUMN `code`,
    DROP COLUMN `name`,
    ADD COLUMN `department_name` VARCHAR(191) NOT NULL;
