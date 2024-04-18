/*
  Warnings:

  - The primary key for the `Emprunt` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `dateEmprunt` on the `Emprunt` table. All the data in the column will be lost.
  - You are about to drop the column `dateRetour` on the `Emprunt` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Emprunt` table. All the data in the column will be lost.
  - The primary key for the `categorie` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `categorie` table. All the data in the column will be lost.
  - You are about to drop the column `nom` on the `categorie` table. All the data in the column will be lost.
  - You are about to drop the `manga` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `empruntsId` to the `Emprunt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categorieId` to the `categorie` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Emprunt` DROP FOREIGN KEY `Emprunt_mangaId_fkey`;

-- DropForeignKey
ALTER TABLE `Emprunt` DROP FOREIGN KEY `Emprunt_userId_fkey`;

-- DropForeignKey
ALTER TABLE `manga` DROP FOREIGN KEY `manga_categorieId_fkey`;

-- AlterTable
ALTER TABLE `Emprunt` DROP PRIMARY KEY,
    DROP COLUMN `dateEmprunt`,
    DROP COLUMN `dateRetour`,
    DROP COLUMN `id`,
    ADD COLUMN `empruntsId` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`empruntsId`);

-- AlterTable
ALTER TABLE `categorie` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    DROP COLUMN `nom`,
    ADD COLUMN `categorieId` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`categorieId`);

-- DropTable
DROP TABLE `manga`;

-- DropTable
DROP TABLE `users`;

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
CREATE TABLE `User` (
    `userId` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
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
