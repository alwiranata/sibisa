-- CreateTable
CREATE TABLE `SensorData` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `curah_hujan` DOUBLE NOT NULL,
    `ketinggian_air` DOUBLE NOT NULL,
    `suhu_udara` DOUBLE NOT NULL,
    `kecepatan_angin` DOUBLE NOT NULL,
    `status_hujan` VARCHAR(191) NOT NULL,
    `status_air` VARCHAR(191) NOT NULL,
    `status_suhu` VARCHAR(191) NOT NULL,
    `status_angin` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `pasword` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
