-- CreateTable
CREATE TABLE `two_digits` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `two_digit` VARCHAR(2) NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `two_digits_two_digit_key`(`two_digit`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
