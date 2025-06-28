"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/providers/auth-provider"
import { redirect } from "next/navigation"
import Sidebar from "@/components/layout/sidebar"
import TeacherDashboard from "@/components/teacher/dashboard"
import NotificationPanel from "@/components/shared/notifications"
import TeacherProfile from "@/components/teacher/profile"
import GradingPanel from "@/components/teacher/grading-panel"
import StudentManagement from "@/components/teacher/student-management"
import Image from "next/image"

export default function TeacherDashboardPage() {
  const { user, userData, loading } = useAuth()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [notifications, setNotifications] = useState(0)

  useEffect(() => {
    if (!loading && (!user || userData?.role !== "teacher")) {
      redirect("/")
    }
  }, [user, userData, loading])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <TeacherDashboard />
      case "grading":
        return <GradingPanel />
      case "students":
        return <StudentManagement />
      case "notifications":
        return <NotificationPanel userRole="teacher" />
      case "profile":
        return <TeacherProfile />
      default:
        return <TeacherDashboard />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="flex-1">
        <main className="p-6">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-6">
              <Image
                src="/logo/2025-Logo-VWAH-Final.png"
                alt="Logo"
                width={48}
                height={48}
                className="object-contain"
                priority
              />
              <span className="font-bold text-xl text-[#005BAC]">Hệ thống chấm điểm rèn luyện</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Chào mừng, {userData?.fullName}</h1>
            <p className="text-gray-600">Hệ thống quản lý chấm điểm rèn luyện</p>
          </div>
          {renderContent()}
        </main>
      </div>
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} notifications={notifications} />
    </div>
  )
}
