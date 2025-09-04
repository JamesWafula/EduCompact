const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

const classes = [
  'Dik_dik',
  'Impala',
  'Year_1',
  'Year_2',
  'Year_3',
  'Year_4',
  'Year_5',
  'Year_6',
];

async function main() {
  // Create 100 Students
  for (let i = 0; i < 100; i++) {
    const student = await prisma.student.create({
      data: {
        firstName: faker.person.firstName(),
        middleName: faker.person.firstName(),
        surname: faker.person.lastName(),
        preferredName: faker.person.firstName(),
        nationality: faker.location.country(),
        dateOfBirth: faker.date.past({ years: 18 }),
        gender: faker.helpers.arrayElement(['male', 'female']),
        religion: faker.lorem.word(),
        registrationNo: `REG${i + 1}`,
        academicYear: `2024-2025`,
        status: faker.helpers.arrayElement(['ACTIVE', 'INACTIVE']),
        dateOfAdmission: new Date(),
        bloodType: faker.helpers.arrayElement([
          'O_POSITIVE', 'O_NEGATIVE', 'A_POSITIVE', 'A_NEGATIVE',
          'B_POSITIVE', 'B_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE'
        ]),
        whoLivesWithStudentAtHome: faker.lorem.words(2),
        primaryLanguageAtHome: faker.lorem.word(),
        otherChildrenAtCCIS: faker.datatype.boolean(),
        referredByCurrentFamily: faker.datatype.boolean(),
        permissionForSocialMediaPhotos: faker.datatype.boolean(),
        specialInformation: faker.lorem.sentence(),
        medicalConditions: faker.lorem.sentence(),
        feesContribution: faker.datatype.boolean(),
        feesContributionPercentage: faker.number.int({ min: 0, max: 100 }),
        createdAt: new Date(),
        updatedAt: new Date(),
        class: faker.helpers.arrayElement(classes), // <-- Add this line
      },
    });

    // Create Guardians for each Student
    await prisma.guardian.create({
      data: {
        studentId: student.id,
        fullName: faker.person.fullName(),
        relationship: faker.helpers.arrayElement(['mother', 'father', 'guardian']),
        occupation: faker.person.jobTitle(),
        residentialAddress: faker.location.streetAddress(),
        contactPhone: faker.phone.number(),
        whatsappNumber: faker.phone.number(),
        emailAddress: faker.internet.email(),
        preferredContact: faker.helpers.arrayElement(['phone', 'email', 'sms', 'whatsapp']),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Create Emergency Contacts for each Student
    await prisma.emergencyContact.create({
      data: {
        studentId: student.id,
        fullNames: faker.person.fullName(),
        relationship: faker.helpers.arrayElement(['parent', 'sibling', 'relative']),
        contactPhone: faker.phone.number(),
        whatsappNumber: faker.phone.number(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Add former school details
    await prisma.student.update({
      where: { id: student.id },
      data: {
        nameOfSchool: faker.company.name(),
        location: faker.location.city(),
        reasonForExit: faker.lorem.sentence(),
      },
    });
  }

  // Create 30 Staff Members
  for (let j = 0; j < 30; j++) {
    const staff = await prisma.staff.create({
      data: {
        firstName: faker.person.firstName(),
        middleName: faker.person.firstName(),
        surname: faker.person.lastName(),
        gender: faker.helpers.arrayElement(['male', 'female']),
        dateOfBirth: faker.date.past({ years: 30 }),
        nationality: faker.location.country(),
        dateOfEmployment: new Date(),
        highestQualification: faker.lorem.word(),
        yearsOfWorkExperience: faker.number.int({ min: 1, max: 30 }),
        noOfYearsAtCCIS: faker.number.int({ min: 1, max: 30 }),
        designation: faker.helpers.arrayElement(['Teacher', 'Admin', 'Support Staff']),
        staffType: faker.helpers.arrayElement([
          'resident_teaching_staff', 'resident_non_teaching_staff',
          'international_teaching_staff', 'international_non_teaching_staff'
        ]),
        comment: faker.lorem.sentence(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Create Emergency Contacts for each Staff Member
    await prisma.staffEmergencyContact.create({
      data: {
        staffId: staff.id,
        fullNames: faker.person.fullName(),
        relationship: faker.helpers.arrayElement(['spouse', 'parent', 'friend']),
        contactPhone: faker.phone.number(),
        whatsapp: faker.phone.number(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  console.log('Seed data created successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
