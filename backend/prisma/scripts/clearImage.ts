import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function clearDatabase() {
  await prisma.image.deleteMany();
  console.log("All image data deleted.");
}

clearDatabase().then(() => prisma.$disconnect());
