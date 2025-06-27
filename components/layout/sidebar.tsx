"use client"
import { useAuth } from "@/components/providers/auth-provider"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import { BarChart3, Bell, User, LogOut, GraduationCap, FileText, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  notifications?: number
}

export default function Sidebar({ activeTab, onTabChange, notifications = 0 }: SidebarProps) {
  const { userData } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const studentMenuItems = [
    { id: "scoring", label: "Bảng điểm rèn luyện", icon: BarChart3 },
    { id: "notifications", label: "Thông báo", icon: Bell, badge: 2 },
    { id: "profile", label: "Hồ sơ cá nhân", icon: User },
  ]

  const teacherMenuItems = [
    { id: "dashboard", label: "Tổng quan", icon: BarChart3 },
    { id: "grading", label: "Chấm điểm rèn luyện", icon: FileText },
    { id: "students", label: "Quản lý sinh viên", icon: Users },
    { id: "notifications", label: "Thông báo", icon: Bell, badge: 2 },
    { id: "profile", label: "Hồ sơ", icon: User },
  ]

  const menuItems = userData?.role === "teacher" ? teacherMenuItems : studentMenuItems

  return (
    <div className="w-64 bg-white border-l border-gray-200 h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-800 text-sm">Học viện Phụ nữ VN</h2>
            <p className="text-xs text-gray-500">Hệ thống rèn luyện</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-800 text-sm truncate">{userData?.fullName || "Người dùng"}</p>
            <p className="text-xs text-gray-500 capitalize">
              {userData?.role === "teacher" ? "Giảng viên" : "Sinh viên"}
            </p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`sidebar-item w-full ${activeTab === item.id ? "active" : ""}`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && item.badge > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Đăng xuất
        </Button>
      </div>
    </div>
  )
}
