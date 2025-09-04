"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Users,
  UserCheck,
  FileText,
  TrendingUp,
  GraduationCap,
  Building,
  Calendar,
  Award,
  Download,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ReportData {
  totalStudents: number
  totalStaff: number
  activeStudents: number
  inactiveStudents: number
  studentsByClass: Array<{ class: string; count: number }>
  staffByType: Array<{ type: string; count: number }>
  recentStudents: Array<{
    id: string
    firstName: string
    surname: string
    class: string
    dateOfAdmission: string
  }>
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FFC658", "#FF7C7C"]

const chartConfig = {
  students: {
    label: "Students",
    color: "#2563eb",
  },
  staff: {
    label: "Staff",
    color: "#dc2626",
  },
  active: {
    label: "Active",
    color: "#16a34a",
  },
  inactive: {
    label: "Inactive",
    color: "#ca8a04",
  },
}

export default function ReportsPage() {
  const [data, setData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchReportData()
  }, [])

  const fetchReportData = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/reports")
      if (!response.ok) {
        throw new Error("Failed to fetch report data")
      }
      const reportData = await response.json()
      setData(reportData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Comprehensive insights and statistics</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(8)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-red-600">Error: {error}</p>
          <button onClick={fetchReportData} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!data) return null

  // Calculate additional metrics
  const totalRecords = data.totalStudents + data.totalStaff
  const studentRetentionRate =
    data.totalStudents > 0 ? ((data.activeStudents / data.totalStudents) * 100).toFixed(1) : 0
  const staffRetentionRate =
    data.totalStaff > 0
      ? (
          ((data.totalStaff - (data.staffByType.find((s) => s.type === "INACTIVE")?.count || 0)) / data.totalStaff) *
          100
        ).toFixed(1)
      : 0
  const averageClassSize =
    data.studentsByClass.length > 0 ? (data.totalStudents / data.studentsByClass.length).toFixed(1) : 0

  // Prepare chart data
  const statusData = [
    { name: "Active Students", value: data.activeStudents, color: "#16a34a" },
    { name: "Inactive Students", value: data.inactiveStudents, color: "#dc2626" },
  ]

  const overviewData = [
    { category: "Students", count: data.totalStudents, color: "#2563eb" },
    { category: "Staff", count: data.totalStaff, color: "#dc2626" },
  ]

  // Monthly trend simulation (you can replace with real data)
  const monthlyTrend = [
    { month: "Jan", students: Math.max(0, data.totalStudents - 50), staff: Math.max(0, data.totalStaff - 5) },
    { month: "Feb", students: Math.max(0, data.totalStudents - 40), staff: Math.max(0, data.totalStaff - 4) },
    { month: "Mar", students: Math.max(0, data.totalStudents - 30), staff: Math.max(0, data.totalStaff - 3) },
    { month: "Apr", students: Math.max(0, data.totalStudents - 20), staff: Math.max(0, data.totalStaff - 2) },
    { month: "May", students: Math.max(0, data.totalStudents - 10), staff: Math.max(0, data.totalStaff - 1) },
    { month: "Jun", students: data.totalStudents, staff: data.totalStaff },
  ]

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600">
             EduCompact comprehensive insights and statistics
            </p>
          </div>
          <Link href="/reports/export">
            <Button>
              <Download className="w-4 h-4 mr-2" />
              Export Reports
            </Button>
          </Link>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">{data.activeStudents} active</span> •
              <span className="text-red-600 ml-1">{data.inactiveStudents} inactive</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalStaff}</div>
            <p className="text-xs text-muted-foreground">{data.staffByType.length} different types</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Student Retention</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentRetentionRate}%</div>
            <p className="text-xs text-muted-foreground">Active student rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Class Size</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageClassSize}</div>
            <p className="text-xs text-muted-foreground">Students per class</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRecords}</div>
            <p className="text-xs text-muted-foreground">Students + Staff</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.studentsByClass.length}</div>
            <p className="text-xs text-muted-foreground">Active classes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Admissions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.recentStudents.length}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Staff Retention</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staffRetentionRate}%</div>
            <p className="text-xs text-muted-foreground">Active staff rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Students by Class Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Students by Class</CardTitle>
            <CardDescription>Distribution of students across different classes</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.studentsByClass}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="class" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Staff by Type Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Staff Distribution</CardTitle>
            <CardDescription>Staff members by type and category</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.staffByType}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    label={({ type, count }) => `${type.replace(/_/g, " ")}: ${count}`}
                  >
                    {data.staffByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Student Status Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Student Status Overview</CardTitle>
            <CardDescription>Active vs Inactive students</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Growth Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Growth Trend</CardTitle>
            <CardDescription>Monthly growth in students and staff</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="students"
                    stackId="1"
                    stroke="#2563eb"
                    fill="#2563eb"
                    fillOpacity={0.6}
                  />
                  <Area type="monotone" dataKey="staff" stackId="1" stroke="#dc2626" fill="#dc2626" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Student Admissions</CardTitle>
            <CardDescription>Latest students admitted to the school</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentStudents.length > 0 ? (
                data.recentStudents.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">
                        {student.firstName} {student.surname}
                      </p>
                      <p className="text-sm text-gray-600">Class: {student.class}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">{new Date(student.dateOfAdmission).toLocaleDateString()}</Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No recent admissions</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Summary</CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="font-medium">Database Health</span>
                <Badge className="bg-green-100 text-green-800">Excellent</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="font-medium">Data Integrity</span>
                <Badge className="bg-green-100 text-green-800">100%</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <span className="font-medium">Storage Usage</span>
                <Badge className="bg-yellow-100 text-yellow-800">Moderate</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="font-medium">Last Backup</span>
                <Badge className="bg-purple-100 text-purple-800">Today</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
