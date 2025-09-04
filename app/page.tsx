import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, FileText, TrendingUp } from "lucide-react"
import { prisma } from "@/lib/prisma"

async function getDashboardStats() {
  try {
    const [studentCount, staffCount, activeStudents, activeStaff] = await Promise.all([
      prisma.student.count(),
      prisma.staff.count(),
      prisma.student.count({ where: { status: "ACTIVE" } }),
      prisma.staff.count({ where: { status: "ACTIVE" } }),
    ])

    return {
      students: studentCount,
      staff: staffCount,
      totalRecords: studentCount + staffCount,
      activeStudents,
      activeStaff,
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return {
      students: 0,
      staff: 0,
      totalRecords: 0,
      activeStudents: 0,
      activeStaff: 0,
    }
  }
}

export default async function Dashboard() {
  const stats = await getDashboardStats()

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">EduCompact School Record Management System</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.students}</div>
            <p className="text-xs text-muted-foreground">{stats.activeStudents} active students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.staff}</div>
            <p className="text-xs text-muted-foreground">{stats.activeStaff} active staff</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRecords}</div>
            <p className="text-xs text-muted-foreground">Students + Staff</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Active</div>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates to the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">System initialized</p>
                  <p className="text-xs text-gray-500">Ready to manage records</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <a href="/students/new" className="block p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <p className="font-medium text-blue-900">Add New Student</p>
                <p className="text-sm text-blue-600">Register a new student record</p>
              </a>
              <a href="/staff/new" className="block p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <p className="font-medium text-green-900">Add New Staff</p>
                <p className="text-sm text-green-600">Create a new staff member record</p>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
