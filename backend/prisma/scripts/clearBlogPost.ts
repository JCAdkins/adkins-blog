import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function clearDatabase() {
  await prisma.blogPost.deleteMany();
  console.log("All blogs have been deleted.");
}

clearDatabase().then(() => prisma.$disconnect());
