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
import { FileUpload } from "@/components/file-upload"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

export default function EditStaffPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    surname: "",
    gender: "",
    dateOfBirth: "",
    nationality: "",
    email: "",
    phone: "",
    address: "",
    staffId: "",
    designation: "",
    staffType: "",
    dateOfEmployment: "",
    highestQualification: "",
    yearsOfWorkExperience: 0,
    noOfYearsAtCCIS: 0,
    resume: "",
    comment: "",
    status: "ACTIVE",
    emergencyContacts: [
      {
        fullNames: "",
        relationship: "",
        contactPhone: "",
        whatsapp: "",
      },
    ],
    profileData: {
      nationalIdNo: "",
      nationalIdAttachment: "",
      nssfNo: "",
      nssfAttachment: "",
      tinNo: "",
      tinAttachment: "",
      teachingLicenseNo: "",
      teachingLicenseAttachment: "",
      tcuNo: "",
      tcuAttachment: "",
      workPermitNo: "",
      workPermitExpirationDate: "",
      workPermitAttachment: "",
      residentPermitNo: "",
      residentPermitExpirationDate: "",
      residentPermitAttachment: "",
      passportNo: "",
      passportExpirationDate: "",
      passportAttachment: "",
      expirationDate: "",
    },
    exitData: {
      dateOfExit: "",
      notice: "",
      certificateOfService: "",
      letterOfNoObjectionRefNo: "",
      letterOfNoObjectionAttachment: "",
      staffClearanceForm: "",
      exitStatement: "",
    },
  })

  useEffect(() => {
    fetchStaff()
  }, [params.id])

  const fetchStaff = async () => {
    try {
      setInitialLoading(true)
      const response = await fetch(`/api/staff/${params.id}`)
      if (response.ok) {
        const staff = await response.json()

        // Format dates for input fields
        const formatDateForInput = (dateString?: string) => {
          if (!dateString) return ""
          return new Date(dateString).toISOString().split("T")[0]
        }

        // Extract profile data based on staff type
        let profileData = { ...formData.profileData }

        if (staff.residentTeachingStaffProfile) {
          profileData = { ...profileData, ...staff.residentTeachingStaffProfile }
        } else if (staff.residentNonTeachingStaffProfile) {
          profileData = { ...profileData, ...staff.residentNonTeachingStaffProfile }
        } else if (staff.internationalTeachingStaffProfile) {
          const profile = staff.internationalTeachingStaffProfile
          profileData = {
            ...profileData,
            ...profile,
            expirationDate: formatDateForInput(profile.expirationDate),
            workPermitExpirationDate: formatDateForInput(profile.workPermitExpirationDate),
            residentPermitExpirationDate: formatDateForInput(profile.residentPermitExpirationDate),
            passportExpirationDate: formatDateForInput(profile.passportExpirationDate),
          }
        } else if (staff.InternationalNonTeachingStaffProfile) {
          const profile = staff.InternationalNonTeachingStaffProfile
          profileData = {
            ...profileData,
            ...profile,
            workPermitExpirationDate: formatDateForInput(profile.workPermitExpirationDate),
            residentPermitExpirationDate: formatDateForInput(profile.residentPermitExpirationDate),
            passportExpirationDate: formatDateForInput(profile.passportExpirationDate),
          }
        }

        // Extract exit data
        let exitData = { ...formData.exitData }
        if (staff.staffExit) {
          exitData = {
            ...exitData,
            ...staff.staffExit,
            dateOfExit: formatDateForInput(staff.staffExit.dateOfExit),
          }
        }

        setFormData({
          firstName: staff.firstName || "",
          middleName: staff.middleName || "",
          surname: staff.surname || "",
          gender: staff.gender || "",
          dateOfBirth: formatDateForInput(staff.dateOfBirth),
          nationality: staff.nationality || "",
          email: staff.email || "",
          phone: staff.phone || "",
          address: staff.address || "",
          staffId: staff.staffId || "",
          designation: staff.designation || "",
          staffType: staff.staffType || "",
          dateOfEmployment: formatDateForInput(staff.dateOfEmployment),
          highestQualification: staff.highestQualification || "",
          yearsOfWorkExperience: staff.yearsOfWorkExperience || 0,
          noOfYearsAtCCIS: staff.noOfYearsAtCCIS || 0,
          resume: staff.resume || "",
          comment: staff.comment || "",
          status: staff.status || "ACTIVE",
          emergencyContacts:
            staff.emergencyContacts.length > 0
              ? staff.emergencyContacts
              : [
                  {
                    fullNames: "",
                    relationship: "",
                    contactPhone: "",
                    whatsapp: "",
                  },
                ],
          profileData,
          exitData,
        })
      } else {
        console.error("Failed to fetch staff")
      }
    } catch (error) {
      console.error("Error fetching staff:", error)
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

  const handleProfileDataChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      profileData: {
        ...prev.profileData,
        [field]: value,
      },
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

  const handleExitDataChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      exitData: {
        ...prev.exitData,
        [field]: value,
      },
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/staff/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push(`/staff/${params.id}`)
        router.refresh()
      } else {
        const error = await response.json()
        alert(`Failed to update staff member: ${error.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Error updating staff:", error)
      alert("Failed to update staff member")
    } finally {
      setLoading(false)
    }
  }

  const renderProfileSpecificFields = () => {
    switch (formData.staffType) {
      case "resident_teaching_staff":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Resident Teaching Staff Documents</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>National ID Number</Label>
                <Input
                  value={formData.profileData.nationalIdNo}
                  onChange={(e) => handleProfileDataChange("nationalIdNo", e.target.value)}
                />
              </div>
              <FileUpload
                label="National ID Attachment"
                value={formData.profileData.nationalIdAttachment}
                onChange={(filePath) => handleProfileDataChange("nationalIdAttachment", filePath)}
                folder="staff"
                description="Upload National ID document"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>NSSF Number</Label>
                <Input
                  value={formData.profileData.nssfNo}
                  onChange={(e) => handleProfileDataChange("nssfNo", e.target.value)}
                />
              </div>
              <FileUpload
                label="NSSF Attachment"
                value={formData.profileData.nssfAttachment}
                onChange={(filePath) => handleProfileDataChange("nssfAttachment", filePath)}
                folder="staff"
                description="Upload NSSF document"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>TIN Number</Label>
                <Input
                  value={formData.profileData.tinNo}
                  onChange={(e) => handleProfileDataChange("tinNo", e.target.value)}
                />
              </div>
              <FileUpload
                label="TIN Attachment"
                value={formData.profileData.tinAttachment}
                onChange={(filePath) => handleProfileDataChange("tinAttachment", filePath)}
                folder="staff"
                description="Upload TIN document"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Teaching License Number</Label>
                <Input
                  value={formData.profileData.teachingLicenseNo}
                  onChange={(e) => handleProfileDataChange("teachingLicenseNo", e.target.value)}
                />
              </div>
              <FileUpload
                label="Teaching License Attachment"
                value={formData.profileData.teachingLicenseAttachment}
                onChange={(filePath) => handleProfileDataChange("teachingLicenseAttachment", filePath)}
                folder="staff"
                description="Upload Teaching License document"
              />
            </div>
          </div>
        )

      case "resident_non_teaching_staff":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Resident Non-Teaching Staff Documents</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>National ID Number</Label>
                <Input
                  value={formData.profileData.nationalIdNo}
                  onChange={(e) => handleProfileDataChange("nationalIdNo", e.target.value)}
                />
              </div>
              <FileUpload
                label="National ID Attachment"
                value={formData.profileData.nationalIdAttachment}
                onChange={(filePath) => handleProfileDataChange("nationalIdAttachment", filePath)}
                folder="staff"
                description="Upload National ID document"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>NSSF Number</Label>
                <Input
                  value={formData.profileData.nssfNo}
                  onChange={(e) => handleProfileDataChange("nssfNo", e.target.value)}
                />
              </div>
              <FileUpload
                label="NSSF Attachment"
                value={formData.profileData.nssfAttachment}
                onChange={(filePath) => handleProfileDataChange("nssfAttachment", filePath)}
                folder="staff"
                description="Upload NSSF document"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>TIN Number</Label>
                <Input
                  value={formData.profileData.tinNo}
                  onChange={(e) => handleProfileDataChange("tinNo", e.target.value)}
                />
              </div>
              <FileUpload
                label="TIN Attachment"
                value={formData.profileData.tinAttachment}
                onChange={(filePath) => handleProfileDataChange("tinAttachment", filePath)}
                folder="staff"
                description="Upload TIN document"
              />
            </div>
          </div>
        )

      case "international_teaching_staff":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">International Teaching Staff Documents</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>TCU Number</Label>
                <Input
                  value={formData.profileData.tcuNo}
                  onChange={(e) => handleProfileDataChange("tcuNo", e.target.value)}
                />
              </div>
              <FileUpload
                label="TCU Attachment"
                value={formData.profileData.tcuAttachment}
                onChange={(filePath) => handleProfileDataChange("tcuAttachment", filePath)}
                folder="staff"
                description="Upload TCU document"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Teaching License Number</Label>
                <Input
                  value={formData.profileData.teachingLicenseNo}
                  onChange={(e) => handleProfileDataChange("teachingLicenseNo", e.target.value)}
                />
              </div>
              <div>
                <Label>License Expiration Date</Label>
                <Input
                  type="date"
                  value={formData.profileData.expirationDate}
                  onChange={(e) => handleProfileDataChange("expirationDate", e.target.value)}
                />
              </div>
              <FileUpload
                label="Teaching License Attachment"
                value={formData.profileData.teachingLicenseAttachment}
                onChange={(filePath) => handleProfileDataChange("teachingLicenseAttachment", filePath)}
                folder="staff"
                description="Upload Teaching License"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Work Permit Number</Label>
                <Input
                  value={formData.profileData.workPermitNo}
                  onChange={(e) => handleProfileDataChange("workPermitNo", e.target.value)}
                />
              </div>
              <div>
                <Label>Work Permit Expiry</Label>
                <Input
                  type="date"
                  value={formData.profileData.workPermitExpirationDate}
                  onChange={(e) => handleProfileDataChange("workPermitExpirationDate", e.target.value)}
                />
              </div>
              <FileUpload
                label="Work Permit Attachment"
                value={formData.profileData.workPermitAttachment}
                onChange={(filePath) => handleProfileDataChange("workPermitAttachment", filePath)}
                folder="staff"
                description="Upload Work Permit"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Resident Permit Number</Label>
                <Input
                  value={formData.profileData.residentPermitNo}
                  onChange={(e) => handleProfileDataChange("residentPermitNo", e.target.value)}
                />
              </div>
              <div>
                <Label>Resident Permit Expiry</Label>
                <Input
                  type="date"
                  value={formData.profileData.residentPermitExpirationDate}
                  onChange={(e) => handleProfileDataChange("residentPermitExpirationDate", e.target.value)}
                />
              </div>
              <FileUpload
                label="Resident Permit Attachment"
                value={formData.profileData.residentPermitAttachment}
                onChange={(filePath) => handleProfileDataChange("residentPermitAttachment", filePath)}
                folder="staff"
                description="Upload Resident Permit"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Passport Number</Label>
                <Input
                  value={formData.profileData.passportNo}
                  onChange={(e) => handleProfileDataChange("passportNo", e.target.value)}
                />
              </div>
              <div>
                <Label>Passport Expiry</Label>
                <Input
                  type="date"
                  value={formData.profileData.passportExpirationDate}
                  onChange={(e) => handleProfileDataChange("passportExpirationDate", e.target.value)}
                />
              </div>
              <FileUpload
                label="Passport Attachment"
                value={formData.profileData.passportAttachment}
                onChange={(filePath) => handleProfileDataChange("passportAttachment", filePath)}
                folder="staff"
                description="Upload Passport"
              />
            </div>
          </div>
        )

      case "international_non_teaching_staff":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">International Non-Teaching Staff Documents</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Work Permit Number</Label>
                <Input
                  value={formData.profileData.workPermitNo}
                  onChange={(e) => handleProfileDataChange("workPermitNo", e.target.value)}
                />
              </div>
              <div>
                <Label>Work Permit Expiry</Label>
                <Input
                  type="date"
                  value={formData.profileData.workPermitExpirationDate}
                  onChange={(e) => handleProfileDataChange("workPermitExpirationDate", e.target.value)}
                />
              </div>
              <FileUpload
                label="Work Permit Attachment"
                value={formData.profileData.workPermitAttachment}
                onChange={(filePath) => handleProfileDataChange("workPermitAttachment", filePath)}
                folder="staff"
                description="Upload Work Permit"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Resident Permit Number</Label>
                <Input
                  value={formData.profileData.residentPermitNo}
                  onChange={(e) => handleProfileDataChange("residentPermitNo", e.target.value)}
                />
              </div>
              <div>
                <Label>Resident Permit Expiry</Label>
                <Input
                  type="date"
                  value={formData.profileData.residentPermitExpirationDate}
                  onChange={(e) => handleProfileDataChange("residentPermitExpirationDate", e.target.value)}
                />
              </div>
              <FileUpload
                label="Resident Permit Attachment"
                value={formData.profileData.residentPermitAttachment}
                onChange={(filePath) => handleProfileDataChange("residentPermitAttachment", filePath)}
                folder="staff"
                description="Upload Resident Permit"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Passport Number</Label>
                <Input
                  value={formData.profileData.passportNo}
                  onChange={(e) => handleProfileDataChange("passportNo", e.target.value)}
                />
              </div>
              <div>
                <Label>Passport Expiry</Label>
                <Input
                  type="date"
                  value={formData.profileData.passportExpirationDate}
                  onChange={(e) => handleProfileDataChange("passportExpirationDate", e.target.value)}
                />
              </div>
              <FileUpload
                label="Passport Attachment"
                value={formData.profileData.passportAttachment}
                onChange={(filePath) => handleProfileDataChange("passportAttachment", filePath)}
                folder="staff"
                description="Upload Passport"
              />
            </div>
          </div>
        )

      default:
        return (
          <div className="text-center py-8 text-gray-500">
            <p>Please select a staff type to view specific document requirements.</p>
          </div>
        )
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
        <Link href={`/staff/${params.id}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Staff Member</h1>
          <p className="text-gray-600">Update staff member information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className={`grid w-full ${formData.status === "INACTIVE" ? "grid-cols-5" : "grid-cols-4"}`}>
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="professional">Professional</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="emergency">Emergency</TabsTrigger>
            {formData.status === "INACTIVE" && <TabsTrigger value="exit">Staff Exit</TabsTrigger>}
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="staff@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+255 123 456 789"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Full residential address..."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="professional">
            <Card>
              <CardHeader>
                <CardTitle>Professional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="staffId">Staff ID</Label>
                    <Input
                      id="staffId"
                      value={formData.staffId}
                      onChange={(e) => handleInputChange("staffId", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="designation">Designation *</Label>
                    <Input
                      id="designation"
                      value={formData.designation}
                      onChange={(e) => handleInputChange("designation", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="staffType">Staff Type</Label>
                    <Select value={formData.staffType} onValueChange={(value) => handleInputChange("staffType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select staff type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="resident_teaching_staff">Resident Teaching Staff</SelectItem>
                        <SelectItem value="resident_non_teaching_staff">Resident Non-Teaching Staff</SelectItem>
                        <SelectItem value="international_teaching_staff">International Teaching Staff</SelectItem>
                        <SelectItem value="international_non_teaching_staff">
                          International Non-Teaching Staff
                        </SelectItem>
                      </SelectContent>
                    </Select>
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
                  <div>
                    <Label htmlFor="dateOfEmployment">Date of Employment</Label>
                    <Input
                      id="dateOfEmployment"
                      type="date"
                      value={formData.dateOfEmployment}
                      onChange={(e) => handleInputChange("dateOfEmployment", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="highestQualification">Highest Qualification</Label>
                    <Input
                      id="highestQualification"
                      value={formData.highestQualification}
                      onChange={(e) => handleInputChange("highestQualification", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="yearsOfWorkExperience">Years of Work Experience</Label>
                    <Input
                      id="yearsOfWorkExperience"
                      type="number"
                      value={formData.yearsOfWorkExperience}
                      onChange={(e) => handleInputChange("yearsOfWorkExperience", Number.parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="noOfYearsAtCCIS">Years at CCIS</Label>
                    <Input
                      id="noOfYearsAtCCIS"
                      type="number"
                      value={formData.noOfYearsAtCCIS}
                      onChange={(e) => handleInputChange("noOfYearsAtCCIS", Number.parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <FileUpload
                  label="Resume"
                  value={formData.resume}
                  onChange={(filePath) => handleInputChange("resume", filePath)}
                  folder="staff"
                  description="Upload staff member's resume/CV"
                />

                <div>
                  <Label htmlFor="comment">Comments</Label>
                  <Textarea
                    id="comment"
                    value={formData.comment}
                    onChange={(e) => handleInputChange("comment", e.target.value)}
                    placeholder="Additional comments or notes..."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Staff Documents</CardTitle>
              </CardHeader>
              <CardContent>{renderProfileSpecificFields()}</CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="emergency">
            <Card>
              <CardHeader>
                <CardTitle>Emergency Contacts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {formData.emergencyContacts.map((contact, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-4">
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
                        <Label>WhatsApp</Label>
                        <Input
                          value={contact.whatsapp}
                          onChange={(e) => handleArrayChange("emergencyContacts", index, "whatsapp", e.target.value)}
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
                      whatsapp: "",
                    })
                  }
                >
                  Add Emergency Contact
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {formData.status === "INACTIVE" && (
            <TabsContent value="exit">
              <Card>
                <CardHeader>
                  <CardTitle>Staff Exit Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="dateOfExit">Date of Exit</Label>
                    <Input
                      id="dateOfExit"
                      type="date"
                      value={formData.exitData.dateOfExit}
                      onChange={(e) => handleExitDataChange("dateOfExit", e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="letterOfNoObjectionRefNo">Letter of No Objection Ref. No</Label>
                      <Input
                        id="letterOfNoObjectionRefNo"
                        value={formData.exitData.letterOfNoObjectionRefNo}
                        onChange={(e) => handleExitDataChange("letterOfNoObjectionRefNo", e.target.value)}
                      />
                    </div>
                  </div>

                  <FileUpload
                    label="Notice"
                    value={formData.exitData.notice}
                    onChange={(filePath) => handleExitDataChange("notice", filePath)}
                    folder="staff"
                    description="Upload notice document"
                  />

                  <FileUpload
                    label="Certificate of Service"
                    value={formData.exitData.certificateOfService}
                    onChange={(filePath) => handleExitDataChange("certificateOfService", filePath)}
                    folder="staff"
                    description="Upload certificate of service"
                  />

                  <FileUpload
                    label="Letter of No Objection Attachment"
                    value={formData.exitData.letterOfNoObjectionAttachment}
                    onChange={(filePath) => handleExitDataChange("letterOfNoObjectionAttachment", filePath)}
                    folder="staff"
                    description="Upload letter of no objection"
                  />

                  <FileUpload
                    label="Staff Clearance Form"
                    value={formData.exitData.staffClearanceForm}
                    onChange={(filePath) => handleExitDataChange("staffClearanceForm", filePath)}
                    folder="staff"
                    description="Upload staff clearance form"
                  />

                  <div>
                    <Label htmlFor="exitStatement">Exit Statement</Label>
                    <Textarea
                      id="exitStatement"
                      value={formData.exitData.exitStatement}
                      onChange={(e) => handleExitDataChange("exitStatement", e.target.value)}
                      placeholder="Exit statement or additional notes..."
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>

        <div className="flex justify-end space-x-4 mt-6">
          <Link href={`/staff/${params.id}`}>
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
                Update Staff
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
