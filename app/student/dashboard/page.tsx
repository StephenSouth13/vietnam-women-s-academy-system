"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/providers/auth-provider"
import { redirect } from "next/navigation"
import StudentLayout from "@/components/layout/student-layout"
import ScoringForm from "@/components/student/scoring-form"
import StudentProfile from "@/components/student/profile"
import NotificationPanel from "@/components/shared/notifications"

export default function StudentDashboard() {
  const { user, userData, loading } = useAuth()
  const [activeTab, setActiveTab] = useState("scoring")

  useEffect(() => {
    if (!loading && (!user || userData?.role !== "student")) {
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
      case "scoring":
        return <ScoringForm />
      case "notifications":
        return <NotificationPanel userRole="student" />
      case "profile":
        return <StudentProfile />
      default:
        return <ScoringForm />
    }
  }

  return (
    <StudentLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </StudentLayout>
  )
}
