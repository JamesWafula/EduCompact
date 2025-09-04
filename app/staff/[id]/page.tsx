"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Download, Eye } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface StaffMember {
  id: string
  firstName: string
  middleName?: string
  surname: string
  gender?: string
  dateOfBirth: string
  nationality?: string
  email?: string
  phone?: string
  address?: string
  staffId?: string
  designation: string
  staffType?: string
  status: string
  dateOfEmployment?: string
  highestQualification?: string
  yearsOfWorkExperience?: number
  noOfYearsAtCCIS?: number
  resume?: string
  comment?: string
  emergencyContacts: Array<{
    id: string
    fullNames: string
    relationship?: string
    contactPhone?: string
    whatsapp?: string
  }>
  residentTeachingStaffProfile?: {
    nationalIdNo?: string
    nationalIdAttachment?: string
    nssfNo?: string
    nssfAttachment?: string
    tinNo?: string
    tinAttachment?: string
    teachingLicenseNo?: string
    teachingLicenseAttachment?: string
  }
  residentNonTeachingStaffProfile?: {
    nationalIdNo?: string
    nationalIdAttachment?: string
    nssfNo?: string
    nssfAttachment?: string
    tinNo?: string
    tinAttachment?: string
  }
  internationalTeachingStaffProfile?: {
    tcuNo?: string
    tcuAttachment?: string
    teachingLicenseNo?: string
    expirationDate?: string
    teachingLicenseAttachment?: string
    workPermitNo?: string
    workPermitExpirationDate?: string
    workPermitAttachment?: string
    residentPermitNo?: string
    residentPermitExpirationDate?: string
    residentPermitAttachment?: string
    passportNo?: string
    passportExpirationDate?: string
    passportAttachment?: string
  }
  InternationalNonTeachingStaffProfile?: {
    workPermitNo?: string
    workPermitExpirationDate?: string
    workPermitAttachment?: string
    residentPermitNo?: string
    residentPermitExpirationDate?: string
    residentPermitAttachment?: string
    passportNo?: string
    passportExpirationDate?: string
    passportAttachment?: string
  }
  staffExit?: {
    id: string
    dateOfExit?: string
    notice?: string
    certificateOfService?: string
    letterOfNoObjectionRefNo?: string
    letterOfNoObjectionAttachment?: string
    staffClearanceForm?: string
    exitStatement?: string
  }
}

export default function StaffDetailPage() {
  const params = useParams()
  const [staff, setStaff] = useState<StaffMember | null>(null)
  const [loading, setLoading] = useState(true)
  const [previewFile, setPreviewFile] = useState<string | null>(null)

  useEffect(() => {
    fetchStaff()
  }, [params.id])

  const fetchStaff = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/staff/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setStaff(data)
      } else {
        console.error("Failed to fetch staff")
      }
    } catch (error) {
      console.error("Error fetching staff:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString?: string) => {
    return dateString ? new Date(dateString).toLocaleDateString() : "N/A"
  }

  const formatStaffType = (type?: string) => {
    if (!type) return "N/A"
    return type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  const getFileName = (path?: string) => {
    if (!path) return ""
    return path.split("/").pop()?.replace(/^\d+-/, "") || path
  }

  const isImage = (path?: string) => {
    if (!path) return false
    const ext = path.split(".").pop()?.toLowerCase()
    return ["jpg", "jpeg", "png", "gif"].includes(ext || "")
  }

  const FilePreview = ({ filePath, label }: { filePath?: string; label: string }) => {
    if (!filePath) return null

    return (
      <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{label}</p>
          <p className="text-xs text-gray-500">{getFileName(filePath)}</p>
        </div>
        <div className="flex gap-1">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" title="Preview">
                <Eye className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>File Preview - {getFileName(filePath)}</DialogTitle>
              </DialogHeader>
              <div className="max-h-[70vh] overflow-auto">
                {isImage(filePath) ? (
                  <img
                    src={filePath || "/placeholder.svg"}
                    alt="Preview"
                    className="max-w-full h-auto mx-auto"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg?height=400&width=400"
                    }}
                  />
                ) : (
                  <iframe src={filePath} className="w-full h-[60vh] border-0" title="Document Preview" />
                )}
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" size="sm" asChild title="Download">
            <a href={filePath} download target="_blank" rel="noopener noreferrer">
              <Download className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </div>
    )
  }

  const renderProfileDocuments = () => {
    if (!staff) return null

    switch (staff.staffType) {
      case "resident_teaching_staff":
        const rtProfile = staff.residentTeachingStaffProfile
        if (!rtProfile) return null

        return (
          <Card>
            <CardHeader>
              <CardTitle>Resident Teaching Staff Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {rtProfile.nationalIdNo && (
                <div>
                  <p className="text-sm font-medium">National ID: {rtProfile.nationalIdNo}</p>
                  <FilePreview filePath={rtProfile.nationalIdAttachment} label="National ID Document" />
                </div>
              )}
              {rtProfile.nssfNo && (
                <div>
                  <p className="text-sm font-medium">NSSF: {rtProfile.nssfNo}</p>
                  <FilePreview filePath={rtProfile.nssfAttachment} label="NSSF Document" />
                </div>
              )}
              {rtProfile.tinNo && (
                <div>
                  <p className="text-sm font-medium">TIN: {rtProfile.tinNo}</p>
                  <FilePreview filePath={rtProfile.tinAttachment} label="TIN Document" />
                </div>
              )}
              {rtProfile.teachingLicenseNo && (
                <div>
                  <p className="text-sm font-medium">Teaching License: {rtProfile.teachingLicenseNo}</p>
                  <FilePreview filePath={rtProfile.teachingLicenseAttachment} label="Teaching License" />
                </div>
              )}
            </CardContent>
          </Card>
        )

      case "resident_non_teaching_staff":
        const rntProfile = staff.residentNonTeachingStaffProfile
        if (!rntProfile) return null

        return (
          <Card>
            <CardHeader>
              <CardTitle>Resident Non-Teaching Staff Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {rntProfile.nationalIdNo && (
                <div>
                  <p className="text-sm font-medium">National ID: {rntProfile.nationalIdNo}</p>
                  <FilePreview filePath={rntProfile.nationalIdAttachment} label="National ID Document" />
                </div>
              )}
              {rntProfile.nssfNo && (
                <div>
                  <p className="text-sm font-medium">NSSF: {rntProfile.nssfNo}</p>
                  <FilePreview filePath={rntProfile.nssfAttachment} label="NSSF Document" />
                </div>
              )}
              {rntProfile.tinNo && (
                <div>
                  <p className="text-sm font-medium">TIN: {rntProfile.tinNo}</p>
                  <FilePreview filePath={rntProfile.tinAttachment} label="TIN Document" />
                </div>
              )}
            </CardContent>
          </Card>
        )

      case "international_teaching_staff":
        const itProfile = staff.internationalTeachingStaffProfile
        if (!itProfile) return null

        return (
          <Card>
            <CardHeader>
              <CardTitle>International Teaching Staff Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {itProfile.tcuNo && (
                <div>
                  <p className="text-sm font-medium">TCU: {itProfile.tcuNo}</p>
                  <FilePreview filePath={itProfile.tcuAttachment} label="TCU Document" />
                </div>
              )}
              {itProfile.teachingLicenseNo && (
                <div>
                  <p className="text-sm font-medium">
                    Teaching License: {itProfile.teachingLicenseNo}
                    {itProfile.expirationDate && ` (Expires: ${formatDate(itProfile.expirationDate)})`}
                  </p>
                  <FilePreview filePath={itProfile.teachingLicenseAttachment} label="Teaching License" />
                </div>
              )}
              {itProfile.workPermitNo && (
                <div>
                  <p className="text-sm font-medium">
                    Work Permit: {itProfile.workPermitNo}
                    {itProfile.workPermitExpirationDate &&
                      ` (Expires: ${formatDate(itProfile.workPermitExpirationDate)})`}
                  </p>
                  <FilePreview filePath={itProfile.workPermitAttachment} label="Work Permit" />
                </div>
              )}
              {itProfile.residentPermitNo && (
                <div>
                  <p className="text-sm font-medium">
                    Resident Permit: {itProfile.residentPermitNo}
                    {itProfile.residentPermitExpirationDate &&
                      ` (Expires: ${formatDate(itProfile.residentPermitExpirationDate)})`}
                  </p>
                  <FilePreview filePath={itProfile.residentPermitAttachment} label="Resident Permit" />
                </div>
              )}
              {itProfile.passportNo && (
                <div>
                  <p className="text-sm font-medium">
                    Passport: {itProfile.passportNo}
                    {itProfile.passportExpirationDate && ` (Expires: ${formatDate(itProfile.passportExpirationDate)})`}
                  </p>
                  <FilePreview filePath={itProfile.passportAttachment} label="Passport" />
                </div>
              )}
            </CardContent>
          </Card>
        )

      case "international_non_teaching_staff":
        const intProfile = staff.InternationalNonTeachingStaffProfile
        if (!intProfile) return null

        return (
          <Card>
            <CardHeader>
              <CardTitle>International Non-Teaching Staff Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {intProfile.workPermitNo && (
                <div>
                  <p className="text-sm font-medium">
                    Work Permit: {intProfile.workPermitNo}
                    {intProfile.workPermitExpirationDate &&
                      ` (Expires: ${formatDate(intProfile.workPermitExpirationDate)})`}
                  </p>
                  <FilePreview filePath={intProfile.workPermitAttachment} label="Work Permit" />
                </div>
              )}
              {intProfile.residentPermitNo && (
                <div>
                  <p className="text-sm font-medium">
                    Resident Permit: {intProfile.residentPermitNo}
                    {intProfile.residentPermitExpirationDate &&
                      ` (Expires: ${formatDate(intProfile.residentPermitExpirationDate)})`}
                  </p>
                  <FilePreview filePath={intProfile.residentPermitAttachment} label="Resident Permit" />
                </div>
              )}
              {intProfile.passportNo && (
                <div>
                  <p className="text-sm font-medium">
                    Passport: {intProfile.passportNo}
                    {intProfile.passportExpirationDate &&
                      ` (Expires: ${formatDate(intProfile.passportExpirationDate)})`}
                  </p>
                  <FilePreview filePath={intProfile.passportAttachment} label="Passport" />
                </div>
              )}
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  if (!staff) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <p className="text-gray-500">Staff member not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/staff">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {staff.firstName} {staff.middleName} {staff.surname}
            </h1>
            <p className="text-gray-600">{staff.designation}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={staff.status === "ACTIVE" ? "default" : "secondary"}>{staff.status}</Badge>
              {staff.staffType && <Badge variant="outline">{formatStaffType(staff.staffType)}</Badge>}
            </div>
          </div>
        </div>
        <Link href={`/staff/${staff.id}/edit`}>
          <Button>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">First Name</p>
                <p>{staff.firstName}</p>
              </div>
              {staff.middleName && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Middle Name</p>
                  <p>{staff.middleName}</p>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Surname</p>
                <p>{staff.surname}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Gender</p>
                <p>{staff.gender ? staff.gender.charAt(0).toUpperCase() + staff.gender.slice(1) : "N/A"}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                <p>{formatDate(staff.dateOfBirth)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Nationality</p>
                <p>{staff.nationality || "N/A"}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p>{staff.email || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p>{staff.phone || "N/A"}</p>
              </div>
            </div>
            {staff.address && (
              <div>
                <p className="text-sm font-medium text-gray-500">Address</p>
                <p>{staff.address}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Professional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Staff ID</p>
                <p>{staff.staffId || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Designation</p>
                <p>{staff.designation}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Staff Type</p>
                <Badge variant="outline">{formatStaffType(staff.staffType)}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Employment Date</p>
                <p>{formatDate(staff.dateOfEmployment)}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Highest Qualification</p>
                <p>{staff.highestQualification || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Work Experience</p>
                <p>{staff.yearsOfWorkExperience || 0} years</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Years at CCIS</p>
                <p>{staff.noOfYearsAtCCIS || 0} years</p>
              </div>
            </div>
            {staff.resume && (
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Resume</p>
                <FilePreview filePath={staff.resume} label="Resume/CV" />
              </div>
            )}
            {staff.comment && (
              <div>
                <p className="text-sm font-medium text-gray-500">Comments</p>
                <p>{staff.comment}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Emergency Contacts */}
        <Card>
          <CardHeader>
            <CardTitle>Emergency Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            {staff.emergencyContacts.length > 0 ? (
              <div className="space-y-4">
                {staff.emergencyContacts.map((contact, index) => (
                  <div key={contact.id} className="p-3 border rounded-lg">
                    <h4 className="font-medium">Contact {index + 1}</h4>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                      <div>
                        <span className="text-gray-500">Name:</span> {contact.fullNames}
                      </div>
                      <div>
                        <span className="text-gray-500">Relationship:</span> {contact.relationship || "N/A"}
                      </div>
                      <div>
                        <span className="text-gray-500">Phone:</span> {contact.contactPhone || "N/A"}
                      </div>
                      <div>
                        <span className="text-gray-500">WhatsApp:</span> {contact.whatsapp || "N/A"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No emergency contacts added</p>
            )}
          </CardContent>
        </Card>

        {/* Profile-specific Documents */}
        {renderProfileDocuments()}

        {/* Staff Exit Information */}
        {staff.status === "INACTIVE" && staff.staffExit && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Staff Exit Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Date of Exit</p>
                  <p>{formatDate(staff.staffExit.dateOfExit)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Letter of No Objection Ref No</p>
                  <p>{staff.staffExit.letterOfNoObjectionRefNo || "N/A"}</p>
                </div>
              </div>

              {staff.staffExit.exitStatement && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Exit Statement</p>
                  <p>{staff.staffExit.exitStatement}</p>
                </div>
              )}

              <div className="space-y-4">
                {staff.staffExit.notice && (
                  <div>
                    <h4 className="font-medium mb-2">Notice</h4>
                    <FilePreview filePath={staff.staffExit.notice} label="Notice Document" />
                  </div>
                )}

                {staff.staffExit.certificateOfService && (
                  <div>
                    <h4 className="font-medium mb-2">Certificate of Service</h4>
                    <FilePreview filePath={staff.staffExit.certificateOfService} label="Certificate of Service" />
                  </div>
                )}

                {staff.staffExit.letterOfNoObjectionAttachment && (
                  <div>
                    <h4 className="font-medium mb-2">Letter of No Objection</h4>
                    <FilePreview
                      filePath={staff.staffExit.letterOfNoObjectionAttachment}
                      label="Letter of No Objection"
                    />
                  </div>
                )}

                {staff.staffExit.staffClearanceForm && (
                  <div>
                    <h4 className="font-medium mb-2">Staff Clearance Form</h4>
                    <FilePreview filePath={staff.staffExit.staffClearanceForm} label="Staff Clearance Form" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
