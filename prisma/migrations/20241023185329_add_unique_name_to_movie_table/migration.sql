/*
  Warnings:

  - A unique constraint covering the columns `[uniqueName]` on the table `movies` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `uniqueName` to the `movies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `movies` ADD COLUMN `uniqueName` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `movies_uniqueName_key` ON `movies`(`uniqueName`);
