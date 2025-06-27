"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/providers/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { User, Save } from "lucide-react"
import FileUpload from "@/components/shared/file-upload"

interface StudentProfile {
  fullName: string
  studentId: string
  email: string
  phone: string
  dateOfBirth: string
  classId: string
  avatar?: string
}

export default function StudentProfile() {
  const { user, userData } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<StudentProfile>({
    fullName: "",
    studentId: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    classId: "",
  })

  useEffect(() => {
    loadProfile()
  }, [userData])

  const loadProfile = async () => {
    if (!userData?.uid) return

    setLoading(true)
    try {
      const response = await fetch(`/api/user/profile?userId=${userData.uid}`)
      const result = await response.json()

      if (result.success) {
        setProfile({
          fullName: result.data.fullName || "",
          studentId: result.data.studentId || "",
          email: result.data.email || "",
          phone: result.data.phone || "",
          dateOfBirth: result.data.dateOfBirth || "",
          classId: result.data.classId || "",
          avatar: result.data.avatar || "",
        })
      }
    } catch (error) {
      console.error("Error loading profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof StudentProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  const handleAvatarUpload = (url: string) => {
    setProfile((prev) => ({ ...prev, avatar: url }))
  }

  const saveProfile = async () => {
    if (!userData?.uid) return

    setSaving(true)
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userData.uid,
          ...profile,
        }),
      })

      const result = await response.json()
      if (result.success) {
        toast({
          title: "Cập nhật thành công",
          description: result.message,
        })
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật thông tin",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Hồ sơ cá nhân
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Upload */}
          <div>
            <Label>Ảnh đại diện</Label>
            <div className="mt-2 flex items-center gap-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                {profile.avatar ? (
                  <img src={profile.avatar || "/placeholder.svg"} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-blue-600" />
                )}
              </div>
              <div className="flex-1">
                <FileUpload
                  type="avatar"
                  userId={userData?.uid || ""}
                  onUpload={handleAvatarUpload}
                  currentFile={profile.avatar}
                  accept="image/*"
                  maxSize={2}
                />
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Họ và tên</Label>
              <Input
                id="fullName"
                value={profile.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                placeholder="Nhập họ và tên"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="studentId">Mã sinh viên</Label>
              <Input
                id="studentId"
                value={profile.studentId}
                onChange={(e) => handleInputChange("studentId", e.target.value)}
                placeholder="Nhập mã sinh viên"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Nhập email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="Nhập số điện thoại"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Ngày sinh</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={profile.dateOfBirth}
                onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="classId">Lớp</Label>
              <Input
                id="classId"
                value={profile.classId}
                onChange={(e) => handleInputChange("classId", e.target.value)}
                placeholder="Nhập mã lớp"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={saveProfile}
              disabled={saving}
              className="flex items-center gap-2 bg-[#005BAC] hover:bg-[#003D73]"
            >
              <Save className="w-4 h-4" />
              {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
