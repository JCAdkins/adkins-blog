import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function clearDatabase() {
  await prisma.blogPostImage.deleteMany();
  console.log("All blogs/image relations have been deleted.");
}

clearDatabase().then(() => prisma.$disconnect());
