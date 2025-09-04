"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, FileText, Eye, Loader2, ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function ExportReportsPage() {
  const [filters, setFilters] = useState({
    type: "students",
    format: "excel",
    class: "all",
    status: "all",
    staffType: "all",
    nationality: "",
    dateFrom: "",
    dateTo: "",
  })
  const [loading, setLoading] = useState(false)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [previewData, setPreviewData] = useState<any[]>([])
  const [showPreview, setShowPreview] = useState(false)

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
    // Reset preview when filters change
    setShowPreview(false)
    setPreviewData([])
  }

  const handlePreview = async () => {
    setPreviewLoading(true)
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value && key !== "format") params.append(key, value)
      })
      params.append("format", "json") // Always get JSON for preview

      const response = await fetch(`/api/reports/export?${params.toString()}`)

      if (!response.ok) {
        throw new Error("Failed to generate preview")
      }

      const result = await response.json()
      setPreviewData(result.data || [])
      setShowPreview(true)
    } catch (error) {
      console.error("Preview error:", error)
      alert("Failed to generate preview")
    } finally {
      setPreviewLoading(false)
    }
  }

  const handleExport = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })

      const response = await fetch(`/api/reports/export?${params.toString()}`)

      if (!response.ok) {
        throw new Error("Failed to generate report")
      }

      if (filters.format === "excel") {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${filters.type}-report-${new Date().toISOString().split("T")[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        const data = await response.json()
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${filters.type}-report-${new Date().toISOString().split("T")[0]}.json`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error("Export error:", error)
      alert("Failed to export data")
    } finally {
      setLoading(false)
    }
  }

  const renderPreviewTable = () => {
    if (!previewData.length) return null

    const isStudent = filters.type === "students"

    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Data Preview ({previewData.length} records)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-96 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {isStudent ? (
                    <>
                      <TableHead>Name</TableHead>
                      <TableHead>Registration No</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date of Birth</TableHead>
                      <TableHead>Nationality</TableHead>
                      <TableHead>Guardian</TableHead>
                    </>
                  ) : (
                    <>
                      <TableHead>Name</TableHead>
                      <TableHead>Staff ID</TableHead>
                      <TableHead>Designation</TableHead>
                      <TableHead>Staff Type</TableHead>
                      <TableHead>Employment Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Nationality</TableHead>
                    </>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {previewData.slice(0, 50).map((item, index) => (
                  <TableRow key={index}>
                    {isStudent ? (
                      <>
                        <TableCell className="font-medium">
                          {item.firstName} {item.surname}
                        </TableCell>
                        <TableCell>{item.registrationNo || "N/A"}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.class || "N/A"}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={item.status === "ACTIVE" ? "default" : "secondary"}>
                            {item.status || "N/A"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {item.dateOfBirth ? new Date(item.dateOfBirth).toLocaleDateString() : "N/A"}
                        </TableCell>
                        <TableCell>{item.nationality || "N/A"}</TableCell>
                        <TableCell>{item.guardians?.[0]?.fullName || "N/A"}</TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell className="font-medium">
                          {item.firstName} {item.surname}
                        </TableCell>
                        <TableCell>{item.staffId || "N/A"}</TableCell>
                        <TableCell>{item.designation || "N/A"}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {item.staffType?.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase()) ||
                              "N/A"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {item.dateOfEmployment ? new Date(item.dateOfEmployment).toLocaleDateString() : "N/A"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={item.status === "ACTIVE" ? "default" : "secondary"}>
                            {item.status || "N/A"}
                          </Badge>
                        </TableCell>
                        <TableCell>{item.nationality || "N/A"}</TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {previewData.length > 50 && (
              <div className="text-center py-4 text-sm text-muted-foreground">
                Showing first 50 records of {previewData.length} total records
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/reports">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Reports
            </Button>
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Export Reports</h1>
        <p className="text-gray-600">Generate and download reports for students and staff</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Export Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Report Type</Label>
              <Select value={filters.type} onValueChange={(value) => handleFilterChange("type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="students">Students</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="format">Export Format</Label>
              <Select value={filters.format} onValueChange={(value) => handleFilterChange("format", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excel">Excel/CSV</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Student-specific filters */}
          {filters.type === "students" && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Student Filters</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="class">Class</Label>
                  <Select value={filters.class} onValueChange={(value) => handleFilterChange("class", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Classes</SelectItem>
                      <SelectItem value="Dik_dik">Dik-dik</SelectItem>
                      <SelectItem value="Impala">Impala</SelectItem>
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
                  <Label htmlFor="status">Student Status</Label>
                  <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Staff-specific filters */}
          {filters.type === "staff" && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Staff Filters</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="staffType">Staff Type</Label>
                  <Select value={filters.staffType} onValueChange={(value) => handleFilterChange("staffType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select staff type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="resident_teaching_staff">Resident Teaching Staff</SelectItem>
                      <SelectItem value="resident_non_teaching_staff">Resident Non-Teaching Staff</SelectItem>
                      <SelectItem value="international_teaching_staff">International Teaching Staff</SelectItem>
                      <SelectItem value="international_non_teaching_staff">International Non-Teaching Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status">Staff Status</Label>
                  <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Common filters */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Additional Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="nationality">Nationality</Label>
                <Input
                  id="nationality"
                  value={filters.nationality}
                  onChange={(e) => handleFilterChange("nationality", e.target.value)}
                  placeholder="Filter by nationality"
                />
              </div>

              <div>
                <Label htmlFor="dateFrom">Date From</Label>
                <Input
                  id="dateFrom"
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="dateTo">Date To</Label>
                <Input
                  id="dateTo"
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              onClick={handlePreview}
              disabled={previewLoading}
              variant="outline"
              className="flex items-center gap-2 bg-transparent"
            >
              {previewLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
              {previewLoading ? "Loading..." : "Preview Data"}
            </Button>
            <Button onClick={handleExport} disabled={loading} className="flex items-center gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {loading ? "Generating..." : "Export Report"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {showPreview && renderPreviewTable()}
    </div>
  )
}
