"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { FileUpload } from "@/components/file-upload"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

export default function EditStudentPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    middleName: "",
    surname: "",
    preferredName: "",
    dateOfBirth: "",
    gender: "",
    nationality: "",
    religion: "",

    // Academic Information
    academicYear: "",
    dateOfAdmission: "",
    class: "",
    registrationNo: "",
    status: "ACTIVE",

    // Documents
    studentPhoto: "",
    birthCertificatNo: "",
    birthCertificateFile: "",
    passportNo: "",
    expiryDate: "",
    passportFile: "",
    studentPassNo: "",
    dateOfExpiry: "",
    studentPassFile: "",

    // Former School
    nameOfSchool: "",
    location: "",
    reasonForExit: "",
    recentReportFile: "",
    additionalAttachment: "",

    // General Information
    bloodType: "",
    whoLivesWithStudentAtHome: "",
    primaryLanguageAtHome: "",
    otherChildrenAtCCIS: false,
    referredByCurrentFamily: false,
    permissionForSocialMediaPhotos: false,
    specialInformation: "",
    medicalConditions: "",
    feesContribution: false,
    feesContributionPercentage: 0,

    // Guardians
    guardians: [
      {
        relationship: "",
        fullName: "",
        occupation: "",
        residentialAddress: "",
        contactPhone: "",
        whatsappNumber: "",
        emailAddress: "",
        preferredContact: "",
      },
    ],

    // Emergency Contacts
    emergencyContacts: [
      {
        fullNames: "",
        relationship: "",
        contactPhone: "",
        whatsappNumber: "",
      },
    ],

    // Doctors
    doctors: [
      {
        fullNames: "",
        contactPhone: "",
      },
    ],

    // Student Exit Information (only when status is INACTIVE)
    studentExit: {
      dateOfExit: "",
      destinationSchool: "",
      nextClass: "",
      reasonForExit: "",
      exitStatement: "",
      studentReport: "",
      studentClearanceForm: "",
      otherExitDocuments: "",
    },
  })

  useEffect(() => {
    if (params.id) {
      fetchStudent()
    }
  }, [params.id])

  const fetchStudent = async () => {
    try {
      setInitialLoading(true)
      const response = await fetch(`/api/students/${params.id}`)
      if (response.ok) {
        const student = await response.json()

        // Format dates for input fields
        const formatDateForInput = (dateString?: string) => {
          if (!dateString) return ""
          return new Date(dateString).toISOString().split("T")[0]
        }

        setFormData({
          firstName: student.firstName || "",
          middleName: student.middleName || "",
          surname: student.surname || "",
          preferredName: student.preferredName || "",
          dateOfBirth: formatDateForInput(student.dateOfBirth),
          gender: student.gender || "",
          nationality: student.nationality || "",
          religion: student.religion || "",
          academicYear: student.academicYear || "",
          dateOfAdmission: formatDateForInput(student.dateOfAdmission),
          class: student.class || "",
          registrationNo: student.registrationNo || "",
          status: student.status || "ACTIVE",
          studentPhoto: student.studentPhoto || "",
          birthCertificatNo: student.birthCertificatNo || "",
          birthCertificateFile: student.birthCertificateFile || "",
          passportNo: student.passportNo || "",
          expiryDate: formatDateForInput(student.expiryDate),
          passportFile: student.passportFile || "",
          studentPassNo: student.studentPassNo || "",
          dateOfExpiry: formatDateForInput(student.dateOfExpiry),
          studentPassFile: student.studentPassFile || "",
          nameOfSchool: student.nameOfSchool || "",
          location: student.location || "",
          reasonForExit: student.reasonForExit || "",
          recentReportFile: student.recentReportFile || "",
          additionalAttachment: student.additionalAttachment || "",
          bloodType: student.bloodType || "",
          whoLivesWithStudentAtHome: student.whoLivesWithStudentAtHome || "",
          primaryLanguageAtHome: student.primaryLanguageAtHome || "",
          otherChildrenAtCCIS: student.otherChildrenAtCCIS || false,
          referredByCurrentFamily: student.referredByCurrentFamily || false,
          permissionForSocialMediaPhotos: student.permissionForSocialMediaPhotos || false,
          specialInformation: student.specialInformation || "",
          medicalConditions: student.medicalConditions || "",
          feesContribution: student.feesContribution || false,
          feesContributionPercentage: student.feesContributionPercentage || 0,
          guardians:
            student.guardians && student.guardians.length > 0
              ? student.guardians
              : [
                  {
                    relationship: "",
                    fullName: "",
                    occupation: "",
                    residentialAddress: "",
                    contactPhone: "",
                    whatsappNumber: "",
                    emailAddress: "",
                    preferredContact: "",
                  },
                ],
          emergencyContacts:
            student.emergencyContacts && student.emergencyContacts.length > 0
              ? student.emergencyContacts
              : [
                  {
                    fullNames: "",
                    relationship: "",
                    contactPhone: "",
                    whatsappNumber: "",
                  },
                ],
          doctors:
            student.doctors && student.doctors.length > 0
              ? student.doctors
              : [
                  {
                    fullNames: "",
                    contactPhone: "",
                  },
                ],
          studentExit: student.studentExit
            ? {
                dateOfExit: formatDateForInput(student.studentExit.dateOfExit),
                destinationSchool: student.studentExit.destinationSchool || "",
                nextClass: student.studentExit.nextClass || "",
                reasonForExit: student.studentExit.reasonForExit || "",
                exitStatement: student.studentExit.exitStatement || "",
                studentReport: student.studentExit.studentReport || "",
                studentClearanceForm: student.studentExit.studentClearanceForm || "",
                otherExitDocuments: student.studentExit.otherExitDocuments || "",
              }
            : {
                dateOfExit: "",
                destinationSchool: "",
                nextClass: "",
                reasonForExit: "",
                exitStatement: "",
                studentReport: "",
                studentClearanceForm: "",
                otherExitDocuments: "",
              },
        })
      } else {
        console.error("Failed to fetch student")
      }
    } catch (error) {
      console.error("Error fetching student:", error)
    } finally {
      setInitialLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleArrayChange = (arrayName: string, index: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName as keyof typeof prev].map((item: any, i: number) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    }))
  }

  const addArrayItem = (arrayName: string, template: any) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: [...prev[arrayName as keyof typeof prev], template],
    }))
  }

  const removeArrayItem = (arrayName: string, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName as keyof typeof prev].filter((_: any, i: number) => i !== index),
    }))
  }

  const handleStudentExitChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      studentExit: {
        ...prev.studentExit,
        [field]: value,
      },
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/students/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push(`/students/${params.id}`)
        router.refresh()
      } else {
        const error = await response.json()
        alert(`Failed to update student: ${error.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Error updating student:", error)
      alert("Failed to update student")
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/students/${params.id}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Student</h1>
          <p className="text-gray-600">Update student information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className={`grid w-full ${formData.status === "INACTIVE" ? "grid-cols-7" : "grid-cols-6"}`}>
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="academic">Academic</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="guardians">Guardians</TabsTrigger>
            <TabsTrigger value="emergency">Emergency</TabsTrigger>
            <TabsTrigger value="additional">Additional</TabsTrigger>
            {formData.status === "INACTIVE" && <TabsTrigger value="exit">Student Exit</TabsTrigger>}
          </TabsList>

          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="middleName">Middle Name</Label>
                    <Input
                      id="middleName"
                      value={formData.middleName}
                      onChange={(e) => handleInputChange("middleName", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="surname">Surname *</Label>
                    <Input
                      id="surname"
                      value={formData.surname}
                      onChange={(e) => handleInputChange("surname", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="preferredName">Preferred Name</Label>
                    <Input
                      id="preferredName"
                      value={formData.preferredName}
                      onChange={(e) => handleInputChange("preferredName", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="nationality">Nationality</Label>
                    <Input
                      id="nationality"
                      value={formData.nationality}
                      onChange={(e) => handleInputChange("nationality", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="religion">Religion</Label>
                    <Input
                      id="religion"
                      value={formData.religion}
                      onChange={(e) => handleInputChange("religion", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bloodType">Blood Type</Label>
                    <Select value={formData.bloodType} onValueChange={(value) => handleInputChange("bloodType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="O_POSITIVE">O+</SelectItem>
                        <SelectItem value="O_NEGATIVE">O-</SelectItem>
                        <SelectItem value="A_POSITIVE">A+</SelectItem>
                        <SelectItem value="A_NEGATIVE">A-</SelectItem>
                        <SelectItem value="B_POSITIVE">B+</SelectItem>
                        <SelectItem value="B_NEGATIVE">B-</SelectItem>
                        <SelectItem value="AB_POSITIVE">AB+</SelectItem>
                        <SelectItem value="AB_NEGATIVE">AB-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="primaryLanguageAtHome">Primary Language at Home</Label>
                    <Input
                      id="primaryLanguageAtHome"
                      value={formData.primaryLanguageAtHome}
                      onChange={(e) => handleInputChange("primaryLanguageAtHome", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="medicalConditions">Medical Conditions</Label>
                  <Textarea
                    id="medicalConditions"
                    value={formData.medicalConditions}
                    onChange={(e) => handleInputChange("medicalConditions", e.target.value)}
                    placeholder="Any medical conditions or allergies..."
                  />
                </div>
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
                    <Label htmlFor="registrationNo">Registration Number</Label>
                    <Input
                      id="registrationNo"
                      value={formData.registrationNo}
                      onChange={(e) => handleInputChange("registrationNo", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="academicYear">Academic Year</Label>
                    <Input
                      id="academicYear"
                      value={formData.academicYear}
                      onChange={(e) => handleInputChange("academicYear", e.target.value)}
                      placeholder="e.g., 2024-2025"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="class">Class *</Label>
                    <Select
                      value={formData.class}
                      onValueChange={(value) => handleInputChange("class", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Dik_dik">Dik-dik</SelectItem>
                        <SelectItem value="Reception">Reception</SelectItem>
                        <SelectItem value="Year_1">Year 1</SelectItem>
                        <SelectItem value="Year_2">Year 2</SelectItem>
                        <SelectItem value="Year_3">Year 3</SelectItem>
                        <SelectItem value="Year_4">Year 4</SelectItem>
                        <SelectItem value="Year_5">Year 5</SelectItem>
                        <SelectItem value="Year_6">Year 6</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="dateOfAdmission">Date of Admission</Label>
                    <Input
                      id="dateOfAdmission"
                      type="date"
                      value={formData.dateOfAdmission}
                      onChange={(e) => handleInputChange("dateOfAdmission", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Former School Information */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-medium">Former School Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nameOfSchool">School Name</Label>
                      <Input
                        id="nameOfSchool"
                        value={formData.nameOfSchool}
                        onChange={(e) => handleInputChange("nameOfSchool", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="reasonForExit">Reason for Exit</Label>
                    <Textarea
                      id="reasonForExit"
                      value={formData.reasonForExit}
                      onChange={(e) => handleInputChange("reasonForExit", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Documents & Attachments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FileUpload
                  label="Student Photo"
                  value={formData.studentPhoto}
                  onChange={(filePath) => handleInputChange("studentPhoto", filePath)}
                  accept=".jpg,.jpeg,.png"
                  folder="students"
                  description="Upload student's photograph"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="birthCertificatNo">Birth Certificate Number</Label>
                    <Input
                      id="birthCertificatNo"
                      value={formData.birthCertificatNo}
                      onChange={(e) => handleInputChange("birthCertificatNo", e.target.value)}
                    />
                  </div>
                  <FileUpload
                    label="Birth Certificate File"
                    value={formData.birthCertificateFile}
                    onChange={(filePath) => handleInputChange("birthCertificateFile", filePath)}
                    folder="students"
                    description="Upload birth certificate document"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="passportNo">Passport Number</Label>
                    <Input
                      id="passportNo"
                      value={formData.passportNo}
                      onChange={(e) => handleInputChange("passportNo", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="expiryDate">Passport Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                    />
                  </div>
                  <FileUpload
                    label="Passport File"
                    value={formData.passportFile}
                    onChange={(filePath) => handleInputChange("passportFile", filePath)}
                    folder="students"
                    description="Upload passport document"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="studentPassNo">Student Pass Number</Label>
                    <Input
                      id="studentPassNo"
                      value={formData.studentPassNo}
                      onChange={(e) => handleInputChange("studentPassNo", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateOfExpiry">Student Pass Expiry Date</Label>
                    <Input
                      id="dateOfExpiry"
                      type="date"
                      value={formData.dateOfExpiry}
                      onChange={(e) => handleInputChange("dateOfExpiry", e.target.value)}
                    />
                  </div>
                  <FileUpload
                    label="Student Pass File"
                    value={formData.studentPassFile}
                    onChange={(filePath) => handleInputChange("studentPassFile", filePath)}
                    folder="students"
                    description="Upload student pass document"
                  />
                </div>

                <FileUpload
                  label="Recent Report File"
                  value={formData.recentReportFile}
                  onChange={(filePath) => handleInputChange("recentReportFile", filePath)}
                  folder="students"
                  description="Upload most recent academic report"
                />

                <FileUpload
                  label="Additional Attachment"
                  value={formData.additionalAttachment}
                  onChange={(filePath) => handleInputChange("additionalAttachment", filePath)}
                  folder="students"
                  description="Upload any additional supporting documents"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="guardians">
            <Card>
              <CardHeader>
                <CardTitle>Guardian Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {formData.guardians.map((guardian, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Guardian {index + 1}</h4>
                      {formData.guardians.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeArrayItem("guardians", index)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Relationship</Label>
                        <Select
                          value={guardian.relationship}
                          onValueChange={(value) => handleArrayChange("guardians", index, "relationship", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select relationship" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mother">Mother</SelectItem>
                            <SelectItem value="father">Father</SelectItem>
                            <SelectItem value="guardian">Guardian</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Full Name</Label>
                        <Input
                          value={guardian.fullName}
                          onChange={(e) => handleArrayChange("guardians", index, "fullName", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Occupation</Label>
                        <Input
                          value={guardian.occupation}
                          onChange={(e) => handleArrayChange("guardians", index, "occupation", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Contact Phone</Label>
                        <Input
                          value={guardian.contactPhone}
                          onChange={(e) => handleArrayChange("guardians", index, "contactPhone", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>WhatsApp Number</Label>
                        <Input
                          value={guardian.whatsappNumber}
                          onChange={(e) => handleArrayChange("guardians", index, "whatsappNumber", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Email Address</Label>
                        <Input
                          type="email"
                          value={guardian.emailAddress}
                          onChange={(e) => handleArrayChange("guardians", index, "emailAddress", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Preferred Contact Method</Label>
                        <Select
                          value={guardian.preferredContact}
                          onValueChange={(value) => handleArrayChange("guardians", index, "preferredContact", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select preferred contact" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="phone">Phone</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="sms">SMS</SelectItem>
                            <SelectItem value="whatsapp">WhatsApp</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div></div>
                    </div>

                    <div>
                      <Label>Residential Address</Label>
                      <Textarea
                        value={guardian.residentialAddress}
                        onChange={(e) => handleArrayChange("guardians", index, "residentialAddress", e.target.value)}
                      />
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    addArrayItem("guardians", {
                      relationship: "",
                      fullName: "",
                      occupation: "",
                      residentialAddress: "",
                      contactPhone: "",
                      whatsappNumber: "",
                      emailAddress: "",
                      preferredContact: "",
                    })
                  }
                >
                  Add Guardian
                </Button>
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
                  {formData.emergencyContacts.map((contact, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-4 mb-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Emergency Contact {index + 1}</h4>
                        {formData.emergencyContacts.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeArrayItem("emergencyContacts", index)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Full Names</Label>
                          <Input
                            value={contact.fullNames}
                            onChange={(e) => handleArrayChange("emergencyContacts", index, "fullNames", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Relationship</Label>
                          <Input
                            value={contact.relationship}
                            onChange={(e) =>
                              handleArrayChange("emergencyContacts", index, "relationship", e.target.value)
                            }
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Contact Phone</Label>
                          <Input
                            value={contact.contactPhone}
                            onChange={(e) =>
                              handleArrayChange("emergencyContacts", index, "contactPhone", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <Label>WhatsApp Number</Label>
                          <Input
                            value={contact.whatsappNumber}
                            onChange={(e) =>
                              handleArrayChange("emergencyContacts", index, "whatsappNumber", e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      addArrayItem("emergencyContacts", {
                        fullNames: "",
                        relationship: "",
                        contactPhone: "",
                        whatsappNumber: "",
                      })
                    }
                  >
                    Add Emergency Contact
                  </Button>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Doctors</h3>
                  {formData.doctors.map((doctor, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-4 mb-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Doctor {index + 1}</h4>
                        {formData.doctors.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeArrayItem("doctors", index)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Full Names</Label>
                          <Input
                            value={doctor.fullNames}
                            onChange={(e) => handleArrayChange("doctors", index, "fullNames", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Contact Phone</Label>
                          <Input
                            value={doctor.contactPhone}
                            onChange={(e) => handleArrayChange("doctors", index, "contactPhone", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      addArrayItem("doctors", {
                        fullNames: "",
                        contactPhone: "",
                      })
                    }
                  >
                    Add Doctor
                  </Button>
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
                <div>
                  <Label htmlFor="whoLivesWithStudentAtHome">Who lives with student at home?</Label>
                  <Input
                    id="whoLivesWithStudentAtHome"
                    value={formData.whoLivesWithStudentAtHome}
                    onChange={(e) => handleInputChange("whoLivesWithStudentAtHome", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="otherChildrenAtCCIS"
                      checked={formData.otherChildrenAtCCIS}
                      onCheckedChange={(checked) => handleInputChange("otherChildrenAtCCIS", checked)}
                    />
                    <Label htmlFor="otherChildrenAtCCIS">Other children at CCIS</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="referredByCurrentFamily"
                      checked={formData.referredByCurrentFamily}
                      onCheckedChange={(checked) => handleInputChange("referredByCurrentFamily", checked)}
                    />
                    <Label htmlFor="referredByCurrentFamily">Referred by current family</Label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="permissionForSocialMediaPhotos"
                      checked={formData.permissionForSocialMediaPhotos}
                      onCheckedChange={(checked) => handleInputChange("permissionForSocialMediaPhotos", checked)}
                    />
                    <Label htmlFor="permissionForSocialMediaPhotos">Permission for social media photos</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="feesContribution"
                      checked={formData.feesContribution}
                      onCheckedChange={(checked) => handleInputChange("feesContribution", checked)}
                    />
                    <Label htmlFor="feesContribution">Fees contribution</Label>
                  </div>
                </div>

                {formData.feesContribution && (
                  <div>
                    <Label htmlFor="feesContributionPercentage">Fees Contribution Percentage</Label>
                    <Input
                      id="feesContributionPercentage"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.feesContributionPercentage}
                      onChange={(e) =>
                        handleInputChange("feesContributionPercentage", Number.parseInt(e.target.value) || 0)
                      }
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="specialInformation">Special Information</Label>
                  <Textarea
                    id="specialInformation"
                    value={formData.specialInformation}
                    onChange={(e) => handleInputChange("specialInformation", e.target.value)}
                    placeholder="Any special information about the student..."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {formData.status === "INACTIVE" && (
            <TabsContent value="exit">
              <Card>
                <CardHeader>
                  <CardTitle>Student Exit Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dateOfExit">Date of Exit</Label>
                      <Input
                        id="dateOfExit"
                        type="date"
                        value={formData.studentExit.dateOfExit}
                        onChange={(e) => handleStudentExitChange("dateOfExit", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="destinationSchool">Destination School</Label>
                      <Input
                        id="destinationSchool"
                        value={formData.studentExit.destinationSchool}
                        onChange={(e) => handleStudentExitChange("destinationSchool", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nextClass">Next Class</Label>
                      <Input
                        id="nextClass"
                        value={formData.studentExit.nextClass}
                        onChange={(e) => handleStudentExitChange("nextClass", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="reasonForExit">Reason for Exit</Label>
                      <Input
                        id="reasonForExit"
                        value={formData.studentExit.reasonForExit}
                        onChange={(e) => handleStudentExitChange("reasonForExit", e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="exitStatement">Exit Statement</Label>
                    <Textarea
                      id="exitStatement"
                      value={formData.studentExit.exitStatement}
                      onChange={(e) => handleStudentExitChange("exitStatement", e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FileUpload
                      label="Student Report"
                      value={formData.studentExit.studentReport}
                      onChange={(filePath) => handleStudentExitChange("studentReport", filePath)}
                      folder="students"
                      description="Upload student report"
                    />

                    <FileUpload
                      label="Student Clearance Form"
                      value={formData.studentExit.studentClearanceForm}
                      onChange={(filePath) => handleStudentExitChange("studentClearanceForm", filePath)}
                      folder="students"
                      description="Upload student clearance form"
                    />

                    <FileUpload
                      label="Other Exit Documents"
                      value={formData.studentExit.otherExitDocuments}
                      onChange={(filePath) => handleStudentExitChange("otherExitDocuments", filePath)}
                      folder="students"
                      description="Upload other exit documents"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>

        <div className="flex justify-end space-x-4 mt-6">
          <Link href={`/students/${params.id}`}>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Updating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Update Student
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
