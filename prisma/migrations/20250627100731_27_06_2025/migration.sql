-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" DATETIME,
    "image" TEXT,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'HEAD',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "academicYear" TEXT,
    "dateOfAdmission" DATETIME,
    "class" TEXT NOT NULL,
    "registrationNo" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "surname" TEXT NOT NULL,
    "preferredName" TEXT,
    "nationality" TEXT,
    "dateOfBirth" DATETIME NOT NULL,
    "gender" TEXT,
    "religion" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "studentPhoto" TEXT,
    "birthCertificatNo" TEXT,
    "birthCertificateFile" TEXT,
    "passportNo" TEXT,
    "expiryDate" DATETIME,
    "passportFile" TEXT,
    "studentPassNo" TEXT,
    "dateOfExpiry" DATETIME,
    "studentPassFile" TEXT,
    "nameOfSchool" TEXT,
    "location" TEXT,
    "reasonForExit" TEXT,
    "recentReportFile" TEXT,
    "additionalAttachment" TEXT,
    "bloodType" TEXT,
    "whoLivesWithStudentAtHome" TEXT,
    "primaryLanguageAtHome" TEXT,
    "otherChildrenAtCCIS" BOOLEAN,
    "referredByCurrentFamily" BOOLEAN,
    "permissionForSocialMediaPhotos" BOOLEAN,
    "specialInformation" TEXT,
    "medicalConditions" TEXT,
    "feesContribution" BOOLEAN,
    "feesContributionPercentage" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Guardian" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "relationship" TEXT,
    "fullName" TEXT NOT NULL,
    "occupation" TEXT,
    "residentialAddress" TEXT,
    "contactPhone" TEXT,
    "whatsappNumber" TEXT,
    "emailAddress" TEXT,
    "preferredContact" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Guardian_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EmergencyContact" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "fullNames" TEXT NOT NULL,
    "relationship" TEXT,
    "contactPhone" TEXT,
    "whatsappNumber" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "EmergencyContact_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StudentDoctor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "fullNames" TEXT NOT NULL,
    "contactPhone" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "StudentDoctor_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Staff" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "staffId" TEXT,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "surname" TEXT NOT NULL,
    "gender" TEXT,
    "dateOfBirth" DATETIME NOT NULL,
    "nationality" TEXT,
    "dateOfEmployment" DATETIME,
    "highestQualification" TEXT,
    "yearsOfWorkExperience" INTEGER,
    "noOfYearsAtCCIS" INTEGER,
    "designation" TEXT NOT NULL,
    "resume" TEXT,
    "staffType" TEXT,
    "comment" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ResidentTeachingStaffProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nationalIdNo" TEXT,
    "nationalIdAttachment" TEXT,
    "nssfNo" TEXT,
    "nssfAttachment" TEXT,
    "tinNo" TEXT,
    "tinAttachment" TEXT,
    "teachingLicenseNo" TEXT,
    "teachingLicenseAttachment" TEXT,
    "staffId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ResidentTeachingStaffProfile_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ResidentNonTeachingStaffProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nationalIdNo" TEXT,
    "nationalIdAttachment" TEXT,
    "nssfNo" TEXT,
    "nssfAttachment" TEXT,
    "tinNo" TEXT,
    "tinAttachment" TEXT,
    "staffId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ResidentNonTeachingStaffProfile_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InternationalTeachingStaffProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tcuNo" TEXT,
    "tcuAttachment" TEXT,
    "teachingLicenseNo" TEXT,
    "expirationDate" DATETIME,
    "teachingLicenseAttachment" TEXT,
    "workPermitNo" TEXT,
    "workPermitExpirationDate" DATETIME,
    "workPermitAttachment" TEXT,
    "residentPermitNo" TEXT,
    "residentPermitExpirationDate" DATETIME,
    "residentPermitAttachment" TEXT,
    "passportNo" TEXT,
    "passportExpirationDate" DATETIME,
    "passportAttachment" TEXT,
    "staffId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "InternationalTeachingStaffProfile_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InternationalNonTeachingStaffProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workPermitNo" TEXT,
    "workPermitExpirationDate" DATETIME,
    "workPermitAttachment" TEXT,
    "residentPermitNo" TEXT,
    "residentPermitExpirationDate" DATETIME,
    "residentPermitAttachment" TEXT,
    "passportNo" TEXT,
    "passportExpirationDate" DATETIME,
    "passportAttachment" TEXT,
    "staffId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "InternationalNonTeachingStaffProfile_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StaffEmergencyContact" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullNames" TEXT NOT NULL,
    "relationship" TEXT,
    "contactPhone" TEXT,
    "whatsapp" TEXT,
    "staffId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "StaffEmergencyContact_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Student_registrationNo_key" ON "Student"("registrationNo");

-- CreateIndex
CREATE UNIQUE INDEX "ResidentTeachingStaffProfile_staffId_key" ON "ResidentTeachingStaffProfile"("staffId");

-- CreateIndex
CREATE UNIQUE INDEX "ResidentNonTeachingStaffProfile_staffId_key" ON "ResidentNonTeachingStaffProfile"("staffId");

-- CreateIndex
CREATE UNIQUE INDEX "InternationalTeachingStaffProfile_staffId_key" ON "InternationalTeachingStaffProfile"("staffId");

-- CreateIndex
CREATE UNIQUE INDEX "InternationalNonTeachingStaffProfile_staffId_key" ON "InternationalNonTeachingStaffProfile"("staffId");
