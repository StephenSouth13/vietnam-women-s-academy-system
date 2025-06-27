"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/providers/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Save, Camera, GraduationCap } from "lucide-react"

interface TeacherProfile {
  fullName: string
  email: string
  phone: string
  department: string
  position: string
  avatar?: string
}

export default function TeacherProfile() {
  const { user, userData } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<TeacherProfile>({
    fullName: "",
    email: "",
    phone: "",
    department: "",
    position: "",
  })

  useEffect(() => {
    loadProfile()
  }, [userData])

  const loadProfile = async () => {
    if (!userData?.uid) return

    setLoading(true)
    try {
      // Mock data for demo
      const mockProfile = {
        fullName: userData.fullName || "TS. Trần Thị B",
        email: userData.email || "giangvien@demo.com",
        phone: "0987654321",
        department: "Khoa Công nghệ thông tin",
        position: "Tiến sĩ",
        avatar: "",
      }
      setProfile(mockProfile)
    } catch (error) {
      console.error("Error loading profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof TeacherProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  const saveProfile = async () => {
    if (!userData?.uid) return

    setSaving(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Cập nhật thành công",
        description: "Thông tin cá nhân đã được cập nhật",
      })
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
            <GraduationCap className="w-5 h-5" />
            Hồ sơ giảng viên
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              {profile.avatar ? (
                <img
                  src={profile.avatar || "/placeholder.svg"}
                  alt="Avatar"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <GraduationCap className="w-10 h-10 text-green-600" />
              )}
            </div>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Camera className="w-4 h-4" />
              Thay đổi ảnh
            </Button>
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
              <Label htmlFor="department">Khoa/Bộ môn</Label>
              <Input
                id="department"
                value={profile.department}
                onChange={(e) => handleInputChange("department", e.target.value)}
                placeholder="Nhập khoa/bộ môn"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Chức vụ</Label>
              <Input
                id="position"
                value={profile.position}
                onChange={(e) => handleInputChange("position", e.target.value)}
                placeholder="Nhập chức vụ"
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
