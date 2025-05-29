import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function clearDatabase() {
  await prisma.user.deleteMany();
  console.log("All user data deleted.");
}

clearDatabase().then(() => prisma.$disconnect());
