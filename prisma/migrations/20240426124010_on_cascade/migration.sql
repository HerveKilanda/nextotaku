-- DropForeignKey
ALTER TABLE `Emprunt` DROP FOREIGN KEY `Emprunt_mangaId_fkey`;

-- DropForeignKey
ALTER TABLE `Emprunt` DROP FOREIGN KEY `Emprunt_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Manga` DROP FOREIGN KEY `Manga_categorieId_fkey`;

-- DropForeignKey
ALTER TABLE `Manga` DROP FOREIGN KEY `Manga_userId_fkey`;

-- AddForeignKey
ALTER TABLE `Manga` ADD CONSTRAINT `Manga_categorieId_fkey` FOREIGN KEY (`categorieId`) REFERENCES `categorie`(`categorieId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Manga` ADD CONSTRAINT `Manga_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Emprunt` ADD CONSTRAINT `Emprunt_mangaId_fkey` FOREIGN KEY (`mangaId`) REFERENCES `Manga`(`mangaId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Emprunt` ADD CONSTRAINT `Emprunt_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;
