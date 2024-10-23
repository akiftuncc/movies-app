/*
  Warnings:

  - A unique constraint covering the columns `[date,roomNumber]` on the table `sessions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `sessions_date_roomNumber_key` ON `sessions`(`date`, `roomNumber`);
