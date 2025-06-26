import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function clearDatabase() {
  await prisma.comment.deleteMany();
  console.log("All comments have been deleted.");
}

clearDatabase().then(() => prisma.$disconnect());
