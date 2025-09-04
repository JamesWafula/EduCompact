-- CreateTable
CREATE TABLE "StaffExit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "staffId" TEXT NOT NULL,
    "dateOfExit" DATETIME,
    "notice" TEXT,
    "certificateOfService" TEXT,
    "letterOfNoObjectionRefNo" TEXT,
    "letterOfNoObjectionAttachment" TEXT,
    "staffClearanceForm" TEXT,
    "exitStatement" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "StaffExit_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StudentExit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "dateOfExit" DATETIME,
    "destinationSchool" TEXT,
    "nextClass" TEXT,
    "reasonForExit" TEXT,
    "exitStatement" TEXT,
    "studentReport" TEXT,
    "studentClearanceForm" TEXT,
    "otherExitDocuments" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "StudentExit_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Staff" (
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
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "lastName" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Staff" ("address", "comment", "createdAt", "dateOfBirth", "dateOfEmployment", "designation", "email", "firstName", "gender", "highestQualification", "id", "lastName", "middleName", "nationality", "noOfYearsAtCCIS", "phone", "resume", "staffId", "staffType", "surname", "updatedAt", "yearsOfWorkExperience") SELECT "address", "comment", "createdAt", "dateOfBirth", "dateOfEmployment", "designation", "email", "firstName", "gender", "highestQualification", "id", "lastName", "middleName", "nationality", "noOfYearsAtCCIS", "phone", "resume", "staffId", "staffType", "surname", "updatedAt", "yearsOfWorkExperience" FROM "Staff";
DROP TABLE "Staff";
ALTER TABLE "new_Staff" RENAME TO "Staff";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "StaffExit_staffId_key" ON "StaffExit"("staffId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentExit_studentId_key" ON "StudentExit"("studentId");
