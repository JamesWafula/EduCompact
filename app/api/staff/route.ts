import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""

    // Build where clause for search (SQLite doesn't support case-insensitive mode)
    const where = search
      ? {
          OR: [
            { firstName: { contains: search } },
            { surname: { contains: search } },
            { staffId: { contains: search } },
            { designation: { contains: search } },
            { email: { contains: search } },
          ],
        }
      : {}

    const staff = await prisma.staff.findMany({
      where,
      include: {
        emergencyContacts: true,
        residentTeachingStaffProfile: true,
        residentNonTeachingStaffProfile: true,
        internationalTeachingStaffProfile: true,
        InternationalNonTeachingStaffProfile: true,
        staffExit: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ staff })
  } catch (error) {
    console.error("Error fetching staff:", error)
    return NextResponse.json({ error: "Failed to fetch staff", staff: [] }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Format dates and handle nested data
    const formattedData = {
      ...body,
      dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : null,
      dateOfEmployment: body.dateOfEmployment ? new Date(body.dateOfEmployment) : null,
      yearsOfWorkExperience: Number(body.yearsOfWorkExperience) || 0,
      noOfYearsAtCCIS: Number(body.noOfYearsAtCCIS) || 0,
    }

    // Remove nested arrays and profile data from main data
    const { emergencyContacts, profileData, exitData, ...staffData } = formattedData

    // Create staff member with profile data based on staff type
    const staff = await prisma.staff.create({
      data: {
        ...staffData,
        emergencyContacts: {
          create: emergencyContacts?.filter((ec: any) => ec.fullNames) || [],
        },
        // Create profile based on staff type
        ...(staffData.staffType === "resident_teaching_staff" && {
          residentTeachingStaffProfile: {
            create: {
              nationalIdNo: profileData?.nationalIdNo || "",
              nationalIdAttachment: profileData?.nationalIdAttachment || "",
              nssfNo: profileData?.nssfNo || "",
              nssfAttachment: profileData?.nssfAttachment || "",
              tinNo: profileData?.tinNo || "",
              tinAttachment: profileData?.tinAttachment || "",
              teachingLicenseNo: profileData?.teachingLicenseNo || "",
              teachingLicenseAttachment: profileData?.teachingLicenseAttachment || "",
            },
          },
        }),
        ...(staffData.staffType === "resident_non_teaching_staff" && {
          residentNonTeachingStaffProfile: {
            create: {
              nationalIdNo: profileData?.nationalIdNo || "",
              nationalIdAttachment: profileData?.nationalIdAttachment || "",
              nssfNo: profileData?.nssfNo || "",
              nssfAttachment: profileData?.nssfAttachment || "",
              tinNo: profileData?.tinNo || "",
              tinAttachment: profileData?.tinAttachment || "",
            },
          },
        }),
        ...(staffData.staffType === "international_teaching_staff" && {
          internationalTeachingStaffProfile: {
            create: {
              tcuNo: profileData?.tcuNo || "",
              tcuAttachment: profileData?.tcuAttachment || "",
              teachingLicenseNo: profileData?.teachingLicenseNo || "",
              teachingLicenseAttachment: profileData?.teachingLicenseAttachment || "",
              expirationDate: profileData?.expirationDate ? new Date(profileData.expirationDate) : null,
              workPermitNo: profileData?.workPermitNo || "",
              workPermitExpirationDate: profileData?.workPermitExpirationDate
                ? new Date(profileData.workPermitExpirationDate)
                : null,
              workPermitAttachment: profileData?.workPermitAttachment || "",
              residentPermitNo: profileData?.residentPermitNo || "",
              residentPermitExpirationDate: profileData?.residentPermitExpirationDate
                ? new Date(profileData.residentPermitExpirationDate)
                : null,
              residentPermitAttachment: profileData?.residentPermitAttachment || "",
              passportNo: profileData?.passportNo || "",
              passportExpirationDate: profileData?.passportExpirationDate
                ? new Date(profileData.passportExpirationDate)
                : null,
              passportAttachment: profileData?.passportAttachment || "",
            },
          },
        }),
        ...(staffData.staffType === "international_non_teaching_staff" && {
          InternationalNonTeachingStaffProfile: {
            create: {
              workPermitNo: profileData?.workPermitNo || "",
              workPermitExpirationDate: profileData?.workPermitExpirationDate
                ? new Date(profileData.workPermitExpirationDate)
                : null,
              workPermitAttachment: profileData?.workPermitAttachment || "",
              residentPermitNo: profileData?.residentPermitNo || "",
              residentPermitExpirationDate: profileData?.residentPermitExpirationDate
                ? new Date(profileData.residentPermitExpirationDate)
                : null,
              residentPermitAttachment: profileData?.residentPermitAttachment || "",
              passportNo: profileData?.passportNo || "",
              passportExpirationDate: profileData?.passportExpirationDate
                ? new Date(profileData.passportExpirationDate)
                : null,
              passportAttachment: profileData?.passportAttachment || "",
            },
          },
        }),
        // Create staff exit if status is INACTIVE and exit data exists
        ...(staffData.status === "INACTIVE" &&
          exitData && {
            staffExit: {
              create: {
                dateOfExit: exitData.dateOfExit ? new Date(exitData.dateOfExit) : null,
                notice: exitData.notice || "",
                certificateOfService: exitData.certificateOfService || "",
                letterOfNoObjectionRefNo: exitData.letterOfNoObjectionRefNo || "",
                letterOfNoObjectionAttachment: exitData.letterOfNoObjectionAttachment || "",
                staffClearanceForm: exitData.staffClearanceForm || "",
                exitStatement: exitData.exitStatement || "",
              },
            },
          }),
      },
      include: {
        emergencyContacts: true,
        residentTeachingStaffProfile: true,
        residentNonTeachingStaffProfile: true,
        internationalTeachingStaffProfile: true,
        InternationalNonTeachingStaffProfile: true,
        staffExit: true,
      },
    })

    return NextResponse.json(staff, { status: 201 })
  } catch (error) {
    console.error("Error creating staff:", error)
    return NextResponse.json({ error: "Failed to create staff member" }, { status: 500 })
  }
}
