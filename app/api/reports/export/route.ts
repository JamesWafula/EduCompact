import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "students"
    const format = searchParams.get("format") || "json"

    // Build filters
    const filters: any = {}
    if (searchParams.get("class") && searchParams.get("class") !== "all") {
      filters.class = searchParams.get("class")
    }
    if (searchParams.get("status") && searchParams.get("status") !== "all") {
      filters.status = searchParams.get("status")
    }
    if (searchParams.get("staffType") && searchParams.get("staffType") !== "all") {
      filters.staffType = searchParams.get("staffType")
    }

    const nationality = searchParams.get("nationality")
    if (nationality) {
      // Use contains without mode for better compatibility
      filters.nationality = {
        contains: nationality,
      }
    }

    // Date range filters
    const dateFrom = searchParams.get("dateFrom")
    const dateTo = searchParams.get("dateTo")
    if (dateFrom || dateTo) {
      const dateField = type === "students" ? "dateOfAdmission" : "dateOfEmployment"
      filters[dateField] = {}
      if (dateFrom) {
        const fromDate = new Date(dateFrom)
        fromDate.setHours(0, 0, 0, 0) // Start of day
        filters[dateField].gte = fromDate
      }
      if (dateTo) {
        const toDate = new Date(dateTo)
        toDate.setHours(23, 59, 59, 999) // End of day
        filters[dateField].lte = toDate
      }
    }

    let data: any[] = []

    if (type === "students") {
      // Remove staff-specific filters for students
      const studentFilters = { ...filters }
      delete studentFilters.staffType

      data = await prisma.student.findMany({
        where: studentFilters,
        include: {
          guardians: {
            select: {
              fullName: true,
              relationship: true,
              contactPhone: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      })
    } else {
      // Remove student-specific filters for staff
      const staffFilters = { ...filters }
      delete staffFilters.class

      data = await prisma.staff.findMany({
        where: staffFilters,
        include: {
          emergencyContacts: {
            select: {
              fullNames: true,
              relationship: true,
              contactPhone: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      })
    }

    if (format === "excel") {
      // Generate CSV format
      const headers =
        type === "students"
          ? [
              "Name",
              "Registration No",
              "Class",
              "Status",
              "Date of Birth",
              "Date of Admission",
              "Nationality",
              "Gender",
              "Guardian Name",
              "Guardian Phone",
              "Created Date",
            ]
          : [
              "Name",
              "Staff ID",
              "Designation",
              "Staff Type",
              "Employment Date",
              "Status",
              "Nationality",
              "Email",
              "Phone",
              "Highest Qualification",
              "Years Experience",
              "Emergency Contact",
              "Created Date",
            ]

      const csvContent = [
        headers.join(","),
        ...data.map((item) => {
          if (type === "students") {
            return [
              `"${item.firstName} ${item.middleName || ""} ${item.surname}".trim()`,
              `"${item.registrationNo || "N/A"}"`,
              `"${item.class || "N/A"}"`,
              `"${item.status || "N/A"}"`,
              `"${item.dateOfBirth ? new Date(item.dateOfBirth).toLocaleDateString() : "N/A"}"`,
              `"${item.dateOfAdmission ? new Date(item.dateOfAdmission).toLocaleDateString() : "N/A"}"`,
              `"${item.nationality || "N/A"}"`,
              `"${item.gender || "N/A"}"`,
              `"${item.guardians?.[0]?.fullName || "N/A"}"`,
              `"${item.guardians?.[0]?.contactPhone || "N/A"}"`,
              `"${new Date(item.createdAt).toLocaleDateString()}"`,
            ].join(",")
          } else {
            return [
              `"${item.firstName} ${item.middleName || ""} ${item.surname}".trim()`,
              `"${item.staffId || "N/A"}"`,
              `"${item.designation || "N/A"}"`,
              `"${item.staffType?.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase()) || "N/A"}"`,
              `"${item.dateOfEmployment ? new Date(item.dateOfEmployment).toLocaleDateString() : "N/A"}"`,
              `"${item.status || "N/A"}"`,
              `"${item.nationality || "N/A"}"`,
              `"${item.email || "N/A"}"`,
              `"${item.phone || "N/A"}"`,
              `"${item.highestQualification || "N/A"}"`,
              `"${item.yearsOfWorkExperience || 0}"`,
              `"${item.emergencyContacts?.[0]?.fullNames || "N/A"}"`,
              `"${new Date(item.createdAt).toLocaleDateString()}"`,
            ].join(",")
          }
        }),
      ].join("\n")

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${type}-report-${new Date().toISOString().split("T")[0]}.csv"`,
        },
      })
    }

    // Return JSON format with metadata
    return NextResponse.json({
      data,
      metadata: {
        total: data.length,
        type,
        filters: Object.keys(filters).length > 0 ? filters : null,
        generatedAt: new Date().toISOString(),
        exportedBy: "System",
      },
    })
  } catch (error) {
    console.error("Error generating export report:", error)
    return NextResponse.json(
      {
        error: "Failed to generate export report",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
