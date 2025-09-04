"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Edit, Trash2, Download, Eye, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Student {
  id: string
  firstName: string
  middleName?: string
  surname: string
  preferredName?: string
  dateOfBirth: string
  gender?: string
  nationality?: string
  religion?: string
  academicYear?: string
  dateOfAdmission?: string
  class: string
  registrationNo?: string
  status: string
  studentPhoto?: string
  birthCertificatNo?: string
  birthCertificateFile?: string
  passportNo?: string
  expiryDate?: string
  passportFile?: string
  studentPassNo?: string
  dateOfExpiry?: string
  studentPassFile?: string
  nameOfSchool?: string
  location?: string
  reasonForExit?: string
  recentReportFile?: string
  additionalAttachment?: string
  bloodType?: string
  whoLivesWithStudentAtHome?: string
  primaryLanguageAtHome?: string
  otherChildrenAtCCIS?: boolean
  referredByCurrentFamily?: boolean
  permissionForSocialMediaPhotos?: boolean
  specialInformation?: string
  medicalConditions?: string
  feesContribution?: boolean
  feesContributionPercentage?: number
  guardians: Array<{
    id: string
    relationship?: string
    fullName: string
    occupation?: string
    residentialAddress?: string
    contactPhone?: string
    whatsappNumber?: string
    emailAddress?: string
    preferredContact?: string
  }>
  emergencyContacts: Array<{
    id: string
    fullNames: string
    relationship?: string
    contactPhone?: string
    whatsappNumber?: string
  }>
  doctors: Array<{
    id: string
    fullNames: string
    contactPhone?: string
  }>
  studentExit?: {
    id: string
    dateOfExit?: string
    destinationSchool?: string
    nextClass?: string
    reasonForExit?: string
    exitStatement?: string
    studentReport?: string
    studentClearanceForm?: string
    otherExitDocuments?: string
  }
  createdAt: string
  updatedAt: string
}

export default function StudentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    fetchStudent()
  }, [params.id])

  const fetchStudent = async () => {
    try {
      const response = await fetch(`/api/students/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setStudent(data)
      } else {
        console.error("Failed to fetch student")
      }
    } catch (error) {
      console.error("Error fetching student:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this student? This action cannot be undone.")) {
      return
    }

    setDeleteLoading(true)
    try {
      const response = await fetch(`/api/students/${params.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        router.push("/students")
      } else {
        alert("Failed to delete student")
      }
    } catch (error) {
      console.error("Error deleting student:", error)
      alert("Failed to delete student")
    } finally {
      setDeleteLoading(false)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not provided"
    return new Date(dateString).toLocaleDateString()
  }

  const downloadFile = (filePath?: string, fileName?: string) => {
    if (!filePath) return
    const link = document.createElement("a")
    link.href = filePath
    link.download = fileName || "document"
    link.click()
  }

  const previewFile = (filePath?: string) => {
    if (!filePath) return
    window.open(filePath, "_blank")
  }

  const FilePreview = ({ filePath, label }: { filePath?: string; label: string }) => {
    if (!filePath) return null

    return (
      <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{label}</p>
          <p className="text-xs text-gray-500">{filePath.split("/").pop()?.replace(/^\d+-/, "") || filePath}</p>
        </div>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" onClick={() => previewFile(filePath)} title="Preview">
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => downloadFile(filePath, label)} title="Download">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>
    )
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

  if (!student) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-gray-900">Student not found</h2>
          <p className="text-gray-600 mt-2">The student you're looking for doesn't exist.</p>
          <Link href="/students">
            <Button className="mt-4">Back to Students</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/students">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Student Details</h1>
          <p className="text-gray-600">View and manage student information</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/students/${student.id}/edit`}>
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Button variant="destructive" onClick={handleDelete} disabled={deleteLoading}>
            {deleteLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <Trash2 className="w-4 h-4 mr-2" />
            )}
            Delete
          </Button>
        </div>
      </div>

      {/* Student Header with Photo */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              {student.studentPhoto ? (
                <Image
                  src={student.studentPhoto || "/placeholder.svg"}
                  alt={`${student.firstName} ${student.surname}`}
                  width={120}
                  height={120}
                  className="rounded-full object-cover border-4 border-gray-200"
                />
              ) : (
                <div className="w-30 h-30 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-300">
                  <User className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">
                {student.firstName} {student.middleName} {student.surname}
              </h2>
              {student.preferredName && <p className="text-lg text-gray-600">Preferred: {student.preferredName}</p>}
              <div className="flex items-center gap-4 mt-2">
                <Badge variant={student.status === "ACTIVE" ? "default" : "secondary"}>{student.status}</Badge>
                <span className="text-sm text-gray-600">Class: {student.class.replace("_", " ")}</span>
                {student.registrationNo && <span className="text-sm text-gray-600">Reg: {student.registrationNo}</span>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList
          className={`grid w-full ${student.status === "INACTIVE" && student.studentExit ? "grid-cols-7" : "grid-cols-6"}`}
        >
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="guardians">Guardians</TabsTrigger>
          <TabsTrigger value="emergency">Emergency</TabsTrigger>
          <TabsTrigger value="additional">Additional</TabsTrigger>
          {student.status === "INACTIVE" && student.studentExit && <TabsTrigger value="exit">Student Exit</TabsTrigger>}
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                  <p className="text-sm">{formatDate(student.dateOfBirth)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Gender</label>
                  <p className="text-sm">{student.gender || "Not specified"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Nationality</label>
                  <p className="text-sm">{student.nationality || "Not provided"}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Religion</label>
                  <p className="text-sm">{student.religion || "Not provided"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Blood Type</label>
                  <p className="text-sm">{student.bloodType?.replace("_", "") || "Not provided"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Primary Language</label>
                  <p className="text-sm">{student.primaryLanguageAtHome || "Not provided"}</p>
                </div>
              </div>

              {student.medicalConditions && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Medical Conditions</label>
                  <p className="text-sm">{student.medicalConditions}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="academic">
          <Card>
            <CardHeader>
              <CardTitle>Academic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Academic Year</label>
                  <p className="text-sm">{student.academicYear || "Not provided"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Date of Admission</label>
                  <p className="text-sm">{formatDate(student.dateOfAdmission)}</p>
                </div>
              </div>

              {(student.nameOfSchool || student.location || student.reasonForExit) && (
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-medium">Former School Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">School Name</label>
                      <p className="text-sm">{student.nameOfSchool || "Not provided"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Location</label>
                      <p className="text-sm">{student.location || "Not provided"}</p>
                    </div>
                  </div>
                  {student.reasonForExit && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Reason for Exit</label>
                      <p className="text-sm">{student.reasonForExit}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documents & Attachments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Birth Certificate */}
              {(student.birthCertificatNo || student.birthCertificateFile) && (
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Birth Certificate</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Certificate Number</label>
                      <p className="text-sm">{student.birthCertificatNo || "Not provided"}</p>
                    </div>
                    {student.birthCertificateFile && (
                      <FilePreview filePath={student.birthCertificateFile} label="Birth Certificate Document" />
                    )}
                  </div>
                </div>
              )}

              {/* Passport */}
              {(student.passportNo || student.passportFile) && (
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Passport</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Passport Number</label>
                      <p className="text-sm">{student.passportNo || "Not provided"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Expiry Date</label>
                      <p className="text-sm">{formatDate(student.expiryDate)}</p>
                    </div>
                    {student.passportFile && <FilePreview filePath={student.passportFile} label="Passport Document" />}
                  </div>
                </div>
              )}

              {/* Student Pass */}
              {(student.studentPassNo || student.studentPassFile) && (
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Student Pass</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Student Pass Number</label>
                      <p className="text-sm">{student.studentPassNo || "Not provided"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Expiry Date</label>
                      <p className="text-sm">{formatDate(student.dateOfExpiry)}</p>
                    </div>
                    {student.studentPassFile && (
                      <FilePreview filePath={student.studentPassFile} label="Student Pass Document" />
                    )}
                  </div>
                </div>
              )}

              {/* Additional Documents */}
              {student.recentReportFile && (
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Recent Report</h4>
                  <FilePreview filePath={student.recentReportFile} label="Recent Report" />
                </div>
              )}

              {student.additionalAttachment && (
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Additional Attachment</h4>
                  <FilePreview filePath={student.additionalAttachment} label="Additional Document" />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guardians">
          <Card>
            <CardHeader>
              <CardTitle>Guardian Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {student.guardians.length > 0 ? (
                student.guardians.map((guardian, index) => (
                  <div key={guardian.id} className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-3">Guardian {index + 1}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Full Name</label>
                        <p className="text-sm">{guardian.fullName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Relationship</label>
                        <p className="text-sm">{guardian.relationship || "Not specified"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Occupation</label>
                        <p className="text-sm">{guardian.occupation || "Not provided"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Contact Phone</label>
                        <p className="text-sm">{guardian.contactPhone || "Not provided"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">WhatsApp</label>
                        <p className="text-sm">{guardian.whatsappNumber || "Not provided"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Email</label>
                        <p className="text-sm">{guardian.emailAddress || "Not provided"}</p>
                      </div>
                    </div>
                    {guardian.residentialAddress && (
                      <div className="mt-4">
                        <label className="text-sm font-medium text-gray-500">Residential Address</label>
                        <p className="text-sm">{guardian.residentialAddress}</p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No guardian information available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emergency">
          <Card>
            <CardHeader>
              <CardTitle>Emergency Contacts & Doctors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Emergency Contacts</h3>
                {student.emergencyContacts.length > 0 ? (
                  student.emergencyContacts.map((contact, index) => (
                    <div key={contact.id} className="p-4 border rounded-lg mb-4">
                      <h4 className="font-medium mb-3">Emergency Contact {index + 1}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Full Names</label>
                          <p className="text-sm">{contact.fullNames}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Relationship</label>
                          <p className="text-sm">{contact.relationship || "Not specified"}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Contact Phone</label>
                          <p className="text-sm">{contact.contactPhone || "Not provided"}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">WhatsApp</label>
                          <p className="text-sm">{contact.whatsappNumber || "Not provided"}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No emergency contacts available</p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Doctors</h3>
                {student.doctors.length > 0 ? (
                  student.doctors.map((doctor, index) => (
                    <div key={doctor.id} className="p-4 border rounded-lg mb-4">
                      <h4 className="font-medium mb-3">Doctor {index + 1}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Full Names</label>
                          <p className="text-sm">{doctor.fullNames}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Contact Phone</label>
                          <p className="text-sm">{doctor.contactPhone || "Not provided"}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No doctor information available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="additional">
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Who lives with student at home</label>
                  <p className="text-sm">{student.whoLivesWithStudentAtHome || "Not provided"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Other children at CCIS</label>
                  <p className="text-sm">{student.otherChildrenAtCCIS ? "Yes" : "No"}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Referred by current family</label>
                  <p className="text-sm">{student.referredByCurrentFamily ? "Yes" : "No"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Permission for social media photos</label>
                  <p className="text-sm">{student.permissionForSocialMediaPhotos ? "Yes" : "No"}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Fees contribution</label>
                  <p className="text-sm">{student.feesContribution ? "Yes" : "No"}</p>
                </div>
                {student.feesContribution && student.feesContributionPercentage && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Fees contribution percentage</label>
                    <p className="text-sm">{student.feesContributionPercentage}%</p>
                  </div>
                )}
              </div>

              {student.specialInformation && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Special Information</label>
                  <p className="text-sm">{student.specialInformation}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {student.status === "INACTIVE" && student.studentExit && (
          <TabsContent value="exit">
            <Card>
              <CardHeader>
                <CardTitle>Student Exit Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Date of Exit</label>
                    <p className="text-sm">{formatDate(student.studentExit.dateOfExit)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Destination School</label>
                    <p className="text-sm">{student.studentExit.destinationSchool || "Not provided"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Next Class</label>
                    <p className="text-sm">{student.studentExit.nextClass || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Reason for Exit</label>
                    <p className="text-sm">{student.studentExit.reasonForExit || "Not provided"}</p>
                  </div>
                </div>

                {student.studentExit.exitStatement && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Exit Statement</label>
                    <p className="text-sm">{student.studentExit.exitStatement}</p>
                  </div>
                )}

                <div className="space-y-4">
                  {student.studentExit.studentReport && (
                    <div>
                      <h4 className="font-medium mb-2">Student Report</h4>
                      <FilePreview filePath={student.studentExit.studentReport} label="Student Report" />
                    </div>
                  )}

                  {student.studentExit.studentClearanceForm && (
                    <div>
                      <h4 className="font-medium mb-2">Student Clearance Form</h4>
                      <FilePreview filePath={student.studentExit.studentClearanceForm} label="Student Clearance Form" />
                    </div>
                  )}

                  {student.studentExit.otherExitDocuments && (
                    <div>
                      <h4 className="font-medium mb-2">Other Exit Documents</h4>
                      <FilePreview filePath={student.studentExit.otherExitDocuments} label="Other Exit Documents" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
