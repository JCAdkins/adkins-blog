import { PrismaClient } from "../generated/prisma/client";

const db = new PrismaClient();

async function main() {
  const admin = await db.user.upsert({
    where: { email: "jordan.adkins111@gmail.com" },
    update: {},
    create: {
      email: "jordan.adkins111@gmail.com",
      username: "JCAdkins",
      password: "$2b$10$Y5vVZh/kVXuWRUDambUJPegKlbsGQGdL60xWt3ebjWuFu.LDPnaOu",
      firstName: "Jordan",
      lastName: "Adkins",
      role: "admin",
      isVerified: true,
    },
  });

  console.log("Seeded admin user:", admin.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
