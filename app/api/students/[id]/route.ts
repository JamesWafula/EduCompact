import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        guardians: true,
        emergencyContacts: true,
        doctors: true,
        studentExit: true,
      },
    })

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    return NextResponse.json(student)
  } catch (error) {
    console.error("Error fetching student:", error)
    return NextResponse.json({ error: "Failed to fetch student" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = await request.json()
    const { guardians, emergencyContacts, doctors, studentExit, ...studentData } = data

    // Update student with transaction
    const student = await prisma.$transaction(async (tx) => {
      // Update main student record
      const updatedStudent = await tx.student.update({
        where: { id },
        data: {
          ...studentData,
          dateOfBirth: new Date(studentData.dateOfBirth),
          dateOfAdmission: studentData.dateOfAdmission ? new Date(studentData.dateOfAdmission) : null,
          expiryDate: studentData.expiryDate ? new Date(studentData.expiryDate) : null,
          dateOfExpiry: studentData.dateOfExpiry ? new Date(studentData.dateOfExpiry) : null,
          otherChildrenAtCCIS: Boolean(studentData.otherChildrenAtCCIS),
          referredByCurrentFamily: Boolean(studentData.referredByCurrentFamily),
          permissionForSocialMediaPhotos: Boolean(studentData.permissionForSocialMediaPhotos),
          feesContribution: Boolean(studentData.feesContribution),
          feesContributionPercentage: studentData.feesContributionPercentage
            ? Number(studentData.feesContributionPercentage)
            : null,
        },
      })

      // Delete existing related records and create new ones
      await Promise.all([
        tx.guardian.deleteMany({ where: { studentId: id } }),
        tx.emergencyContact.deleteMany({ where: { studentId: id } }),
        tx.studentDoctor.deleteMany({ where: { studentId: id } }),
        tx.studentExit.deleteMany({ where: { studentId: id } }),
      ])

      // Create new guardians
      if (guardians && guardians.length > 0) {
        await tx.guardian.createMany({
          data: guardians
            .filter((g: any) => g.fullName && g.fullName.trim() !== "")
            .map((guardian: any) => ({
              ...guardian,
              studentId: id,
            })),
        })
      }

      // Create new emergency contacts
      if (emergencyContacts && emergencyContacts.length > 0) {
        await tx.emergencyContact.createMany({
          data: emergencyContacts
            .filter((ec: any) => ec.fullNames && ec.fullNames.trim() !== "")
            .map((contact: any) => ({
              ...contact,
              studentId: id,
            })),
        })
      }

      // Create new doctors
      if (doctors && doctors.length > 0) {
        await tx.studentDoctor.createMany({
          data: doctors
            .filter((d: any) => d.fullNames && d.fullNames.trim() !== "")
            .map((doctor: any) => ({
              ...doctor,
              studentId: id,
            })),
        })
      }

      // Create student exit if status is INACTIVE and exit data exists
      if (studentData.status === "INACTIVE" && studentExit) {
        await tx.studentExit.create({
          data: {
            studentId: id,
            dateOfExit: studentExit.dateOfExit ? new Date(studentExit.dateOfExit) : null,
            destinationSchool: studentExit.destinationSchool || "",
            nextClass: studentExit.nextClass || "",
            reasonForExit: studentExit.reasonForExit || "",
            exitStatement: studentExit.exitStatement || "",
            studentReport: studentExit.studentReport || "",
            studentClearanceForm: studentExit.studentClearanceForm || "",
            otherExitDocuments: studentExit.otherExitDocuments || "",
          },
        })
      }

      return updatedStudent
    })

    // Fetch the complete updated student record
    const completeStudent = await prisma.student.findUnique({
      where: { id },
      include: {
        guardians: true,
        emergencyContacts: true,
        doctors: true,
        studentExit: true,
      },
    })

    return NextResponse.json(completeStudent)
  } catch (error) {
    console.error("Error updating student:", error)
    return NextResponse.json({ error: "Failed to update student" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.student.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Student deleted successfully" })
  } catch (error) {
    console.error("Error deleting student:", error)
    return NextResponse.json({ error: "Failed to delete student" }, { status: 500 })
  }
}
