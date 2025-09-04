"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Eye, Edit, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Staff {
  id: string
  firstName: string
  surname: string
  staffId?: string
  designation: string
  staffType?: string
  status?: string
  dateOfBirth: string
  dateOfEmployment?: string
  nationality: string
}

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const fetchStaff = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/staff?search=${encodeURIComponent(search)}`)
      const data = await response.json()

      // Ensure we have the expected data structure
      if (data.staff && Array.isArray(data.staff)) {
        setStaff(data.staff)
      } else {
        console.error("Invalid data structure:", data)
        setStaff([])
      }
    } catch (error) {
      console.error("Error fetching staff:", error)
      setStaff([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchStaff()
    }, 300) // Debounce search

    return () => clearTimeout(timeoutId)
  }, [search])

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/staff/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchStaff()
      } else {
        alert("Failed to delete staff member")
      }
    } catch (error) {
      console.error("Error deleting staff:", error)
      alert("Failed to delete staff member")
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatStaffType = (type?: string) => {
    if (!type) return "N/A"
    return type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff</h1>
          <p className="text-gray-600">Manage staff records and information</p>
        </div>
        <Link href="/staff/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Staff
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Staff Records</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search staff..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Staff ID</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Staff Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Nationality</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff && staff.length > 0 ? (
                  staff.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">
                        {member.firstName} {member.surname}
                      </TableCell>
                      <TableCell>{member.staffId || "N/A"}</TableCell>
                      <TableCell>{member.designation}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{formatStaffType(member.staffType)}</Badge>
                      </TableCell>
                       <TableCell>
                       <Badge variant={member.status  === "ACTIVE" ? "default" : "secondary"}>{member.status }</Badge>
                        </TableCell>
                      <TableCell>{member.nationality || "N/A"}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Link href={`/staff/${member.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Link href={`/staff/${member.id}/edit`}>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the staff record and all
                                  associated data.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(member.id)}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      {loading ? "Loading..." : search ? "No staff found matching your search." : "No staff found."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
