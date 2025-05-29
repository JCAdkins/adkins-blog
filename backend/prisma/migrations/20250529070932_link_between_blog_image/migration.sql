/*
  Warnings:

  - You are about to drop the column `blogPostId` on the `Image` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_blogPostId_fkey";

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "blogPostId";

-- CreateTable
CREATE TABLE "BlogPostImage" (
    "blogPostId" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,

    CONSTRAINT "BlogPostImage_pkey" PRIMARY KEY ("blogPostId","imageId")
);

-- AddForeignKey
ALTER TABLE "BlogPostImage" ADD CONSTRAINT "BlogPostImage_blogPostId_fkey" FOREIGN KEY ("blogPostId") REFERENCES "BlogPost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogPostImage" ADD CONSTRAINT "BlogPostImage_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
