import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding users...")

  // Hash passwords
  const adminPassword = await bcrypt.hash("#educompactadmin#", 12)
  const headPassword = await bcrypt.hash("#educompacthead#", 12)

  // Create Administrator user
  const admin = await prisma.user.upsert({
    where: { email: "administrator@educompact.education" },
    update: {},
    create: {
      email: "administrator@educompact.education",
      name: "Administrator",
      password: adminPassword,
      role: "ADMINISTRATOR",
    },
  })

  // Create Head user
  const head = await prisma.user.upsert({
    where: { email: "head@educompact.education" },
    update: {},
    create: {
      email: "head@educompact.education",
      name: "Head",
      password: headPassword,
      role: "HEAD",
    },
  })

  console.log("Users created:")
  console.log("Administrator:", admin.email)
  console.log("Head:", head.email)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
