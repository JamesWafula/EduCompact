import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting database seed...")

  // Create sample students
  const student1 = await prisma.student.create({
    data: {
      firstName: "John",
      surname: "Doe",
      dateOfBirth: new Date("2010-05-15"),
      class: "Year_3",
      status: "ACTIVE",
      bloodType: "O_POSITIVE",
      nationality: "Tanzanian",
      gender: "male",
      academicYear: "2024-2025",
      registrationNo: "STU001",
      guardians: {
        create: [
          {
            relationship: "father",
            fullName: "Robert Doe",
            occupation: "Engineer",
            contactPhone: "+255123456789",
            emailAddress: "robert.doe@email.com",
          },
          {
            relationship: "mother",
            fullName: "Alice Doe",
            occupation: "Teacher",
            contactPhone: "+255987654321",
            emailAddress: "alice.doe@email.com",
          },
        ],
      },
      emergencyContacts: {
        create: [
          {
            fullNames: "James Doe",
            relationship: "Uncle",
            contactPhone: "+255111222333",
          },
        ],
      },
    },
  })

  const student2 = await prisma.student.create({
    data: {
      firstName: "Jane",
      surname: "Smith",
      dateOfBirth: new Date("2011-08-22"),
      class: "Year_2",
      status: "ACTIVE",
      bloodType: "A_POSITIVE",
      nationality: "Kenyan",
      gender: "female",
      academicYear: "2024-2025",
      registrationNo: "STU002",
      guardians: {
        create: [
          {
            relationship: "mother",
            fullName: "Susan Smith",
            occupation: "Doctor",
            contactPhone: "+254123456789",
            emailAddress: "susan.smith@email.com",
          },
        ],
      },
      emergencyContacts: {
        create: [
          {
            fullNames: "Peter Smith",
            relationship: "Grandfather",
            contactPhone: "+254444555666",
          },
        ],
      },
    },
  })

  // Create sample staff
  const staff1 = await prisma.staff.create({
    data: {
      firstName: "Sarah",
      surname: "Wilson",
      dateOfBirth: new Date("1985-03-20"),
      designation: "Mathematics Teacher",
      staffType: "resident_teaching_staff",
      nationality: "Tanzanian",
      gender: "female",
      dateOfEmployment: new Date("2020-01-15"),
      staffId: "STAFF001",
      emergencyContacts: {
        create: [
          {
            fullNames: "Michael Wilson",
            relationship: "Husband",
            contactPhone: "+255777888999",
          },
        ],
      },
      residentTeachingStaffProfile: {
        create: {
          nationalIdNo: "TZ123456789",
          nssfNo: "NSSF001",
          tinNo: "TIN001",
          teachingLicenseNo: "TL001",
        },
      },
    },
  })

  const staff2 = await prisma.staff.create({
    data: {
      firstName: "David",
      surname: "Brown",
      dateOfBirth: new Date("1978-11-05"),
      designation: "Principal",
      staffType: "international_teaching_staff",
      nationality: "British",
      gender: "male",
      dateOfEmployment: new Date("2018-08-01"),
      staffId: "STAFF002",
      emergencyContacts: {
        create: [
          {
            fullNames: "Emma Brown",
            relationship: "Wife",
            contactPhone: "+255666777888",
          },
        ],
      },
      internationalTeachingStaffProfile: {
        create: {
          passportNo: "UK123456789",
          passportExpirationDate: new Date("2025-12-31"),
          workPermitNo: "WP001",
          workPermitExpirationDate: new Date("2025-06-30"),
          teachingLicenseNo: "ITL001",
          expirationDate: new Date("2025-12-31"),
        },
      },
    },
  })

  console.log("✅ Database seeded successfully!")
  console.log(`Created ${2} students and ${2} staff members`)
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
