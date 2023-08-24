/*
  Warnings:

  - A unique constraint covering the columns `[title,username]` on the table `medias` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "medias_title_username_key" ON "medias"("title", "username");
