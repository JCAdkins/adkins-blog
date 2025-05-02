-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_blogPostId_fkey";

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_blogPostId_fkey" FOREIGN KEY ("blogPostId") REFERENCES "BlogPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
