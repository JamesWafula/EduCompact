"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Users, UserCheck, FileText, Home, Settings, Shield, Eye, LogOut } from "lucide-react"
import { signOut } from "next-auth/react"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Students", href: "/students", icon: Users },
  { name: "Staff", href: "/staff", icon: UserCheck },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <div className="flex flex-col w-64 bg-gray-50 border-r">
      <div className="flex items-center justify-center h-48 border-b p-4">
        <h1 className="text-xl font-semibold">
          <img src="/logo.png" alt="Logo" className="h-40 w-45" />
        </h1>
      </div>

      {/* User Info */}
      {session?.user && (
        <div className="px-6 py-4 border-b bg-white">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              {session.user.role === "ADMINISTRATOR" ? (
                <Shield className="h-8 w-8 text-blue-600" />
              ) : (
                <Eye className="h-8 w-8 text-green-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{session.user.name || session.user.email}</p>
              <p className="text-xs text-gray-500 capitalize">{session.user.role?.toLowerCase()}</p>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                pathname === item.href
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
              )}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          )
        })}
        {/* Sign Out Button */}
        <button
          onClick={() => signOut({ callbackUrl: "/auth/signin" })}
          className="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors text-blue-700 hover:bg-red-50 w-full mt-2"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sign Out
        </button>
      </nav>
      <footer style={{ textAlign: "center", color: "#888", padding: "1rem 0", marginTop: "auto" }} className="px-4 border-t text-xs">
        Faith + Hope + Love
      </footer>
    </div>
  )
}
