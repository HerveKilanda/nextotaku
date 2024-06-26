/*
  Warnings:

  - Added the required column `imageUrl` to the `Manga` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `manga` ADD COLUMN `imageUrl` VARCHAR(255) NOT NULL;
