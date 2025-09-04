import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const staff = await prisma.staff.findUnique({
      where: { id },
      include: {
        emergencyContacts: true,
        residentTeachingStaffProfile: true,
        residentNonTeachingStaffProfile: true,
        internationalTeachingStaffProfile: true,
        InternationalNonTeachingStaffProfile: true,
        staffExit: true,
      },
    })

    if (!staff) {
      return NextResponse.json({ error: "Staff member not found" }, { status: 404 })
    }

    return NextResponse.json(staff)
  } catch (error) {
    console.error("Error fetching staff:", error)
    return NextResponse.json({ error: "Failed to fetch staff member" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = await request.json()
    const { profileData, emergencyContacts, exitData, ...staffData } = data

    // Update staff member with transaction
    const staff = await prisma.$transaction(async (tx) => {
      // Update main staff record
      const updatedStaff = await tx.staff.update({
        where: { id },
        data: {
          ...staffData,
          dateOfBirth: new Date(staffData.dateOfBirth),
          dateOfEmployment: staffData.dateOfEmployment ? new Date(staffData.dateOfEmployment) : null,
        },
      })

      // Delete existing emergency contacts and create new ones
      await tx.staffEmergencyContact.deleteMany({
        where: { staffId: id },
      })

      if (emergencyContacts && emergencyContacts.length > 0) {
        await tx.staffEmergencyContact.createMany({
          data: emergencyContacts.map((contact: any) => ({
            ...contact,
            staffId: id,
          })),
        })
      }

      // Update profile-specific data based on staff type
      if (staffData.staffType && profileData) {
        // Delete existing profiles
        await Promise.all([
          tx.residentTeachingStaffProfile.deleteMany({ where: { staffId: id } }),
          tx.residentNonTeachingStaffProfile.deleteMany({ where: { staffId: id } }),
          tx.internationalTeachingStaffProfile.deleteMany({ where: { staffId: id } }),
          tx.internationalNonTeachingStaffProfile.deleteMany({ where: { staffId: id } }),
        ])

        // Create new profile based on staff type
        switch (staffData.staffType) {
          case "resident_teaching_staff":
            await tx.residentTeachingStaffProfile.create({
              data: {
                staffId: id,
                nationalIdNo: profileData.nationalIdNo,
                nationalIdAttachment: profileData.nationalIdAttachment,
                nssfNo: profileData.nssfNo,
                nssfAttachment: profileData.nssfAttachment,
                tinNo: profileData.tinNo,
                tinAttachment: profileData.tinAttachment,
                teachingLicenseNo: profileData.teachingLicenseNo,
                teachingLicenseAttachment: profileData.teachingLicenseAttachment,
              },
            })
            break

          case "resident_non_teaching_staff":
            await tx.residentNonTeachingStaffProfile.create({
              data: {
                staffId: id,
                nationalIdNo: profileData.nationalIdNo,
                nationalIdAttachment: profileData.nationalIdAttachment,
                nssfNo: profileData.nssfNo,
                nssfAttachment: profileData.nssfAttachment,
                tinNo: profileData.tinNo,
                tinAttachment: profileData.tinAttachment,
              },
            })
            break

          case "international_teaching_staff":
            await tx.internationalTeachingStaffProfile.create({
              data: {
                staffId: id,
                tcuNo: profileData.tcuNo,
                tcuAttachment: profileData.tcuAttachment,
                teachingLicenseNo: profileData.teachingLicenseNo,
                expirationDate: profileData.expirationDate ? new Date(profileData.expirationDate) : null,
                teachingLicenseAttachment: profileData.teachingLicenseAttachment,
                workPermitNo: profileData.workPermitNo,
                workPermitExpirationDate: profileData.workPermitExpirationDate
                  ? new Date(profileData.workPermitExpirationDate)
                  : null,
                workPermitAttachment: profileData.workPermitAttachment,
                residentPermitNo: profileData.residentPermitNo,
                residentPermitExpirationDate: profileData.residentPermitExpirationDate
                  ? new Date(profileData.residentPermitExpirationDate)
                  : null,
                residentPermitAttachment: profileData.residentPermitAttachment,
                passportNo: profileData.passportNo,
                passportExpirationDate: profileData.passportExpirationDate
                  ? new Date(profileData.passportExpirationDate)
                  : null,
                passportAttachment: profileData.passportAttachment,
              },
            })
            break

          case "international_non_teaching_staff":
            await tx.internationalNonTeachingStaffProfile.create({
              data: {
                staffId: id,
                workPermitNo: profileData.workPermitNo,
                workPermitExpirationDate: profileData.workPermitExpirationDate
                  ? new Date(profileData.workPermitExpirationDate)
                  : null,
                workPermitAttachment: profileData.workPermitAttachment,
                residentPermitNo: profileData.residentPermitNo,
                residentPermitExpirationDate: profileData.residentPermitExpirationDate
                  ? new Date(profileData.residentPermitExpirationDate)
                  : null,
                residentPermitAttachment: profileData.residentPermitAttachment,
                passportNo: profileData.passportNo,
                passportExpirationDate: profileData.passportExpirationDate
                  ? new Date(profileData.passportExpirationDate)
                  : null,
                passportAttachment: profileData.passportAttachment,
              },
            })
            break
        }
      }

      // Handle staff exit data
      await tx.staffExit.deleteMany({ where: { staffId: id } })

      if (staffData.status === "INACTIVE" && exitData) {
        await tx.staffExit.create({
          data: {
            staffId: id,
            dateOfExit: exitData.dateOfExit ? new Date(exitData.dateOfExit) : null,
            notice: exitData.notice || "",
            certificateOfService: exitData.certificateOfService || "",
            letterOfNoObjectionRefNo: exitData.letterOfNoObjectionRefNo || "",
            letterOfNoObjectionAttachment: exitData.letterOfNoObjectionAttachment || "",
            staffClearanceForm: exitData.staffClearanceForm || "",
            exitStatement: exitData.exitStatement || "",
          },
        })
      }

      return updatedStaff
    })

    // Fetch the complete updated staff record
    const completeStaff = await prisma.staff.findUnique({
      where: { id },
      include: {
        emergencyContacts: true,
        residentTeachingStaffProfile: true,
        residentNonTeachingStaffProfile: true,
        internationalTeachingStaffProfile: true,
        InternationalNonTeachingStaffProfile: true,
        staffExit: true,
      },
    })

    return NextResponse.json(completeStaff)
  } catch (error) {
    console.error("Error updating staff:", error)
    return NextResponse.json({ error: "Failed to update staff member" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.staff.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Staff member deleted successfully" })
  } catch (error) {
    console.error("Error deleting staff:", error)
    return NextResponse.json({ error: "Failed to delete staff member" }, { status: 500 })
  }
}
