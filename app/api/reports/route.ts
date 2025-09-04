import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Use Promise.all to run queries in parallel for better performance
    const [totalStudents, totalStaff, activeStudents, inactiveStudents, studentsByClass, staffByType, recentStudents] =
      await Promise.all([
        // Total students count
        prisma.student.count(),

        // Total staff count
        prisma.staff.count(),

        // Active students count
        prisma.student.count({
          where: { status: "ACTIVE" },
        }),

        // Inactive students count
        prisma.student.count({
          where: { status: "INACTIVE" },
        }),

        // Students grouped by class
        prisma.student.groupBy({
          by: ["class"],
          _count: {
            id: true,
          },
          orderBy: {
            class: "asc",
          },
        }),

        // Staff grouped by type
        prisma.staff.groupBy({
          by: ["staffType"],
          _count: {
            id: true,
          },
          where: {
            staffType: {
              not: null,
            },
          },
          orderBy: {
            staffType: "asc",
          },
        }),

        // Recent students (last 30 days)
        prisma.student.findMany({
          where: {
            dateOfAdmission: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
            },
          },
          select: {
            id: true,
            firstName: true,
            surname: true,
            class: true,
            dateOfAdmission: true,
          },
          orderBy: {
            dateOfAdmission: "desc",
          },
          take: 10,
        }),
      ])

    // Format the data
    const reportData = {
      totalStudents,
      totalStaff,
      activeStudents,
      inactiveStudents,
      studentsByClass: studentsByClass.map((item) => ({
        class: item.class,
        count: item._count.id,
      })),
      staffByType: staffByType.map((item) => ({
        type: item.staffType || "Unknown",
        count: item._count.id,
      })),
      recentStudents: recentStudents.filter((student) => student.dateOfAdmission),
    }

    return NextResponse.json(reportData)
  } catch (error) {
    console.error("Error generating reports:", error)
    return NextResponse.json({ error: "Failed to generate reports" }, { status: 500 })
  }
}
