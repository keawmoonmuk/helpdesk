-- CreateTable
CREATE TABLE `users` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_name` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `full_name` VARCHAR(191) NOT NULL,
    `department` VARCHAR(191) NOT NULL,
    `role` ENUM('user', 'admin', 'technician', 'it_head', 'executive') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `users_user_name_key`(`user_name`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `external_technicians` (
    `ext_tech_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `company` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `specialties` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`ext_tech_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `assets` (
    `asset_id` INTEGER NOT NULL AUTO_INCREMENT,
    `asset_name` VARCHAR(191) NOT NULL,
    `asset_number` VARCHAR(191) NOT NULL,
    `asset_type` VARCHAR(191) NOT NULL,
    `manufacturer` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `serial_number` VARCHAR(191) NOT NULL,
    `purchase_date` DATETIME(3) NOT NULL,
    `warranty_expire` DATETIME(3) NOT NULL,
    `specifications` JSON NULL,
    `location` VARCHAR(191) NOT NULL,
    `status` ENUM('active', 'repair', 'inactive', 'disposed') NOT NULL DEFAULT 'active',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `assets_asset_number_key`(`asset_number`),
    PRIMARY KEY (`asset_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `repair_requests` (
    `request_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `asset_id` INTEGER NOT NULL,
    `requestDetails` TEXT NOT NULL,
    `urgency_level` ENUM('low', 'normal', 'high', 'critical') NOT NULL DEFAULT 'normal',
    `status` ENUM('pending', 'assessed', 'waiting_approval', 'approved', 'assigned', 'in_progress', 'waiting_quotation', 'quoted', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
    `require_external` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`request_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `repair_assessments` (
    `assessment_id` INTEGER NOT NULL AUTO_INCREMENT,
    `request_id` INTEGER NOT NULL,
    `assessed_by` INTEGER NOT NULL,
    `external_technician_id` INTEGER NULL,
    `damage_details` TEXT NOT NULL,
    `estimated_cost` DECIMAL(65, 30) NULL,
    `recommended_action` ENUM('internal_repair', 'external_repair', 'replace', 'dispose') NOT NULL,
    `assessment_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `repair_assessments_request_id_key`(`request_id`),
    PRIMARY KEY (`assessment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `repair_quotations` (
    `quotation_id` INTEGER NOT NULL AUTO_INCREMENT,
    `request_id` INTEGER NOT NULL,
    `external_technician_id` INTEGER NOT NULL,
    `quotation_number` VARCHAR(191) NOT NULL,
    `quotation_amount` DECIMAL(65, 30) NOT NULL,
    `quotation_details` TEXT NOT NULL,
    `valid_until` DATETIME(3) NOT NULL,
    `status` ENUM('pending', 'approved', 'rejected', 'expired') NOT NULL DEFAULT 'pending',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `repair_quotations_request_id_key`(`request_id`),
    PRIMARY KEY (`quotation_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `purchase_requests` (
    `purchase_request_id` INTEGER NOT NULL AUTO_INCREMENT,
    `quotation_id` INTEGER NOT NULL,
    `requested_by` INTEGER NOT NULL,
    `request_details` TEXT NOT NULL,
    `total_amount` DECIMAL(65, 30) NOT NULL,
    `status` ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `purchase_requests_quotation_id_key`(`quotation_id`),
    PRIMARY KEY (`purchase_request_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `purchase_approvals` (
    `approval_id` INTEGER NOT NULL AUTO_INCREMENT,
    `purchase_id` INTEGER NOT NULL,
    `approved_by` INTEGER NOT NULL,
    `approvalStatus` ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    `comments` TEXT NULL,
    `approved_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`approval_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `repair_approvals` (
    `approval_id` INTEGER NOT NULL AUTO_INCREMENT,
    `request_id` INTEGER NOT NULL,
    `approved_by` INTEGER NOT NULL,
    `approvalStatus` ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    `comments` TEXT NULL,
    `approved_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`approval_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `repair_assignments` (
    `assignment_id` INTEGER NOT NULL AUTO_INCREMENT,
    `request_id` INTEGER NOT NULL,
    `technician_id` INTEGER NULL,
    `external_technician_id` INTEGER NULL,
    `assigned_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expected_end_date` DATETIME(3) NOT NULL,

    UNIQUE INDEX `repair_assignments_request_id_key`(`request_id`),
    PRIMARY KEY (`assignment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `repair_logs` (
    `log_id` INTEGER NOT NULL AUTO_INCREMENT,
    `request_id` INTEGER NOT NULL,
    `technician_id` INTEGER NOT NULL,
    `repairDetails` TEXT NOT NULL,
    `partsReplaced` JSON NULL,
    `repairTime` INTEGER NOT NULL,
    `checkout_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `repairResult` ENUM('success', 'fail') NOT NULL,

    UNIQUE INDEX `repair_logs_request_id_key`(`request_id`),
    PRIMARY KEY (`log_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `maintenance_logs` (
    `maintenance_id` INTEGER NOT NULL AUTO_INCREMENT,
    `asset_id` INTEGER NOT NULL,
    `maintenance_type` VARCHAR(191) NOT NULL,
    `details` TEXT NOT NULL,
    `performed_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `next_scheduled` DATETIME(3) NULL,

    PRIMARY KEY (`maintenance_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `repair_reviews` (
    `review_id` INTEGER NOT NULL AUTO_INCREMENT,
    `request_id` INTEGER NOT NULL,
    `reviewed_by` INTEGER NOT NULL,
    `reviewDetails` TEXT NOT NULL,
    `reviewScore` INTEGER NOT NULL,
    `reviewed_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `repair_reviews_request_id_key`(`request_id`),
    PRIMARY KEY (`review_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `repair_images` (
    `image_id` INTEGER NOT NULL AUTO_INCREMENT,
    `request_id` INTEGER NOT NULL,
    `image_url` VARCHAR(191) NOT NULL,
    `imageType` ENUM('issue', 'assessment', 'repair', 'completion') NOT NULL DEFAULT 'issue',
    `uploaded_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`image_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `repair_requests` ADD CONSTRAINT `repair_requests_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `repair_requests` ADD CONSTRAINT `repair_requests_asset_id_fkey` FOREIGN KEY (`asset_id`) REFERENCES `assets`(`asset_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `repair_assessments` ADD CONSTRAINT `repair_assessments_request_id_fkey` FOREIGN KEY (`request_id`) REFERENCES `repair_requests`(`request_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `repair_assessments` ADD CONSTRAINT `repair_assessments_assessed_by_fkey` FOREIGN KEY (`assessed_by`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `repair_assessments` ADD CONSTRAINT `repair_assessments_external_technician_id_fkey` FOREIGN KEY (`external_technician_id`) REFERENCES `external_technicians`(`ext_tech_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `repair_quotations` ADD CONSTRAINT `repair_quotations_request_id_fkey` FOREIGN KEY (`request_id`) REFERENCES `repair_requests`(`request_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `repair_quotations` ADD CONSTRAINT `repair_quotations_external_technician_id_fkey` FOREIGN KEY (`external_technician_id`) REFERENCES `external_technicians`(`ext_tech_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase_requests` ADD CONSTRAINT `purchase_requests_quotation_id_fkey` FOREIGN KEY (`quotation_id`) REFERENCES `repair_quotations`(`quotation_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase_requests` ADD CONSTRAINT `purchase_requests_requested_by_fkey` FOREIGN KEY (`requested_by`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase_approvals` ADD CONSTRAINT `purchase_approvals_purchase_id_fkey` FOREIGN KEY (`purchase_id`) REFERENCES `purchase_requests`(`purchase_request_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase_approvals` ADD CONSTRAINT `purchase_approvals_approved_by_fkey` FOREIGN KEY (`approved_by`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `repair_approvals` ADD CONSTRAINT `repair_approvals_request_id_fkey` FOREIGN KEY (`request_id`) REFERENCES `repair_requests`(`request_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `repair_approvals` ADD CONSTRAINT `repair_approvals_approved_by_fkey` FOREIGN KEY (`approved_by`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `repair_assignments` ADD CONSTRAINT `repair_assignments_request_id_fkey` FOREIGN KEY (`request_id`) REFERENCES `repair_requests`(`request_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `repair_assignments` ADD CONSTRAINT `repair_assignments_technician_id_fkey` FOREIGN KEY (`technician_id`) REFERENCES `users`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `repair_assignments` ADD CONSTRAINT `repair_assignments_external_technician_id_fkey` FOREIGN KEY (`external_technician_id`) REFERENCES `external_technicians`(`ext_tech_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `repair_logs` ADD CONSTRAINT `repair_logs_request_id_fkey` FOREIGN KEY (`request_id`) REFERENCES `repair_requests`(`request_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `repair_logs` ADD CONSTRAINT `repair_logs_technician_id_fkey` FOREIGN KEY (`technician_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `maintenance_logs` ADD CONSTRAINT `maintenance_logs_asset_id_fkey` FOREIGN KEY (`asset_id`) REFERENCES `assets`(`asset_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `repair_reviews` ADD CONSTRAINT `repair_reviews_request_id_fkey` FOREIGN KEY (`request_id`) REFERENCES `repair_requests`(`request_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `repair_reviews` ADD CONSTRAINT `repair_reviews_reviewed_by_fkey` FOREIGN KEY (`reviewed_by`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `repair_images` ADD CONSTRAINT `repair_images_request_id_fkey` FOREIGN KEY (`request_id`) REFERENCES `repair_requests`(`request_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
