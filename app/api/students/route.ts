import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const page = Number(searchParams.get("page")) || 1
    const limit = Number(searchParams.get("limit")) || 10
    const skip = (page - 1) * limit

    // Build where clause for search (SQLite doesn't support case-insensitive search with mode)
    const where = search
      ? {
          OR: [
            { firstName: { contains: search } },
            { surname: { contains: search } },
            { registrationNo: { contains: search } },
            {
              guardians: {
                some: {
                  fullName: { contains: search },
                },
              },
            },
          ],
        }
      : {}

    // Get total count for pagination
    const total = await prisma.student.count({ where })
    const pages = Math.ceil(total / limit)

    // Get students with guardians
    const students = await prisma.student.findMany({
      where,
      include: {
        guardians: {
          select: {
            fullName: true,
            relationship: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    })

    const pagination = {
      page,
      limit,
      total,
      pages,
    }

    return NextResponse.json({ students, pagination })
  } catch (error) {
    console.error("Error fetching students:", error)
    return NextResponse.json(
      { error: "Failed to fetch students", students: [], pagination: { page: 1, limit: 10, total: 0, pages: 0 } },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Format dates and handle nested data
    const formattedStudentData = {
      ...body,
      dateOfBirth: new Date(body.dateOfBirth),
      dateOfAdmission: body.dateOfAdmission ? new Date(body.dateOfAdmission) : null,
      expiryDate: body.expiryDate ? new Date(body.expiryDate) : null,
      dateOfExpiry: body.dateOfExpiry ? new Date(body.dateOfExpiry) : null,
      otherChildrenAtCCIS: Boolean(body.otherChildrenAtCCIS),
      referredByCurrentFamily: Boolean(body.referredByCurrentFamily),
      permissionForSocialMediaPhotos: Boolean(body.permissionForSocialMediaPhotos),
      feesContribution: Boolean(body.feesContribution),
      feesContributionPercentage: Number(body.feesContributionPercentage) || 0,
    }

    // Remove nested arrays from main data
    const { guardians, emergencyContacts, studentExit, ...studentData } = formattedStudentData

    console.log("Creating student with data:", studentData)

    const student = await prisma.student.create({
      data: {
        ...studentData,
        guardians: {
          create: guardians?.filter((g: any) => g.fullName) || [],
        },
        emergencyContacts: {
          create: emergencyContacts?.filter((ec: any) => ec.fullNames) || [],
        },
        // Only create student exit if status is INACTIVE and exit data exists
        ...(studentData.status === "INACTIVE" &&
          studentExit && {
            studentExit: {
              create: {
                dateOfExit: studentExit.dateOfExit ? new Date(studentExit.dateOfExit) : null,
                destinationSchool: studentExit.destinationSchool || "",
                nextClass: studentExit.nextClass || "",
                reasonForExit: studentExit.reasonForExit || "",
                exitStatement: studentExit.exitStatement || "",
                studentReport: studentExit.studentReport || "",
                studentClearanceForm: studentExit.studentClearanceForm || "",
                otherExitDocuments: studentExit.otherExitDocuments || "",
              },
            },
          }),
      },
      include: {
        guardians: true,
        emergencyContacts: true,
        studentExit: true,
      },
    })

    return NextResponse.json(student, { status: 201 })
  } catch (error) {
    console.error("Error creating student:", error)
    return NextResponse.json({ error: "Failed to create student" }, { status: 500 })
  }
}
