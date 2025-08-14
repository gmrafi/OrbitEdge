"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Satellite, Settings, LogOut, User, Bell } from "lucide-react"
import Link from "next/link"
import { signOut } from "@/lib/actions"
import { Badge } from "@/components/ui/badge"
import { usePathname } from "next/navigation"

interface DashboardHeaderProps {
  user: {
    email?: string
  }
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return pathname === "/dashboard"
    }
    return pathname.startsWith(path)
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Logo and Navigation */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#4e6aff] rounded-lg flex items-center justify-center">
                <Satellite className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">OrbitEdge Global</h1>
                <p className="text-xs text-gray-600">Dashboard</p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/dashboard"
                className={`font-medium transition-colors ${
                  isActive("/dashboard") && pathname === "/dashboard"
                    ? "text-[#4e6aff]"
                    : "text-gray-600 hover:text-[#4e6aff]"
                }`}
              >
                Overview
              </Link>
              <Link
                href="/dashboard/satellites"
                className={`font-medium transition-colors ${
                  isActive("/dashboard/satellites") ? "text-[#4e6aff]" : "text-gray-600 hover:text-[#4e6aff]"
                }`}
              >
                Satellites
              </Link>
              <Link
                href="/dashboard/map"
                className={`font-medium transition-colors ${
                  isActive("/dashboard/map") ? "text-[#4e6aff]" : "text-gray-600 hover:text-[#4e6aff]"
                }`}
              >
                Map
              </Link>
              <Link
                href="/dashboard/analytics"
                className={`font-medium transition-colors ${
                  isActive("/dashboard/analytics") ? "text-[#4e6aff]" : "text-gray-600 hover:text-[#4e6aff]"
                }`}
              >
                Analytics
              </Link>
              <Link
                href="/dashboard/compliance"
                className={`font-medium transition-colors ${
                  isActive("/dashboard/compliance") ? "text-[#4e6aff]" : "text-gray-600 hover:text-[#4e6aff]"
                }`}
              >
                Compliance
              </Link>
              <Link
                href="/dashboard/learn"
                className={`font-medium transition-colors ${
                  isActive("/dashboard/learn") ? "text-[#4e6aff]" : "text-gray-600 hover:text-[#4e6aff]"
                }`}
              >
                Learn
              </Link>
            </nav>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 bg-red-500 text-white text-xs">3</Badge>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 p-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-[#4e6aff] text-white text-sm">
                      {user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block text-sm font-medium">{user.email?.split("@")[0]}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <form action={signOut}>
                    <button type="submit" className="flex items-center w-full">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
