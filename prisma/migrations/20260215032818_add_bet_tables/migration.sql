-- AlterTable
ALTER TABLE `users` ADD COLUMN `two_d_limit` DECIMAL(10, 2) NULL;

-- CreateTable
CREATE TABLE `battles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `battle_name` VARCHAR(191) NULL,
    `start_time` DATETIME(3) NULL,
    `end_time` DATETIME(3) NULL,
    `status` BOOLEAN NOT NULL DEFAULT false,
    `open_date` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `two_bet_slips` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slip_no` VARCHAR(191) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `player_name` VARCHAR(191) NOT NULL,
    `agent_id` INTEGER NULL,
    `total_bet_amount` DECIMAL(12, 2) NOT NULL,
    `session` ENUM('morning', 'evening') NOT NULL,
    `status` ENUM('pending', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
    `game_date` DATE NOT NULL,
    `game_time` TIME NOT NULL,
    `before_balance` DECIMAL(12, 2) NOT NULL,
    `after_balance` DECIMAL(12, 2) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `two_bet_slips_slip_no_key`(`slip_no`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `two_bets` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `member_name` VARCHAR(191) NULL,
    `bettle_id` INTEGER NULL,
    `choose_digit_id` INTEGER NULL,
    `head_close_id` INTEGER NULL,
    `agent_id` INTEGER NULL,
    `bet_number` VARCHAR(2) NOT NULL,
    `bet_amount` DECIMAL(10, 2) NOT NULL,
    `session` ENUM('morning', 'evening') NOT NULL,
    `win_lose` BOOLEAN NOT NULL DEFAULT false,
    `potential_payout` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `bet_status` BOOLEAN NOT NULL DEFAULT false,
    `bet_result` VARCHAR(191) NULL,
    `game_date` DATE NOT NULL,
    `game_time` TIME NOT NULL,
    `slip_id` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `two_d_limits` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `two_d_limit` DECIMAL(10, 2) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `choose_digits` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `choose_close_digit` VARCHAR(2) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `head_closes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `head_close_digit` VARCHAR(1) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `slip_number_counter` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `current_number` BIGINT NOT NULL DEFAULT 0,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `two_d_results` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `result_date` DATE NOT NULL,
    `session` ENUM('morning', 'evening') NOT NULL,
    `win_number` VARCHAR(2) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `two_bet_slips` ADD CONSTRAINT `two_bet_slips_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `two_bet_slips` ADD CONSTRAINT `two_bet_slips_agent_id_fkey` FOREIGN KEY (`agent_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `two_bets` ADD CONSTRAINT `two_bets_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `two_bets` ADD CONSTRAINT `two_bets_bettle_id_fkey` FOREIGN KEY (`bettle_id`) REFERENCES `battles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `two_bets` ADD CONSTRAINT `two_bets_slip_id_fkey` FOREIGN KEY (`slip_id`) REFERENCES `two_bet_slips`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `two_bets` ADD CONSTRAINT `two_bets_agent_id_fkey` FOREIGN KEY (`agent_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `two_bets` ADD CONSTRAINT `two_bets_choose_digit_id_fkey` FOREIGN KEY (`choose_digit_id`) REFERENCES `choose_digits`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `two_bets` ADD CONSTRAINT `two_bets_head_close_id_fkey` FOREIGN KEY (`head_close_id`) REFERENCES `head_closes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
