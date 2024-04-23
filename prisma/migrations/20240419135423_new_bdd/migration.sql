-- CreateTable
CREATE TABLE `Manga` (
    `mangaId` INTEGER NOT NULL AUTO_INCREMENT,
    `titre` VARCHAR(100) NOT NULL,
    `categorieId` INTEGER NOT NULL,
    `status` ENUM('LIBRE', 'EMPRUNTE') NOT NULL DEFAULT 'LIBRE',
    `description` TEXT NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`mangaId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categorie` (
    `categorieId` INTEGER NOT NULL AUTO_INCREMENT,

    PRIMARY KEY (`categorieId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Emprunt` (
    `empruntsId` INTEGER NOT NULL AUTO_INCREMENT,
    `mangaId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `dateDebut` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dateFin` DATETIME(3) NOT NULL,

    PRIMARY KEY (`empruntsId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `userId` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Manga` ADD CONSTRAINT `Manga_categorieId_fkey` FOREIGN KEY (`categorieId`) REFERENCES `categorie`(`categorieId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Manga` ADD CONSTRAINT `Manga_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Emprunt` ADD CONSTRAINT `Emprunt_mangaId_fkey` FOREIGN KEY (`mangaId`) REFERENCES `Manga`(`mangaId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Emprunt` ADD CONSTRAINT `Emprunt_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;
