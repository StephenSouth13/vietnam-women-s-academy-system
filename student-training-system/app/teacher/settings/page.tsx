"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/providers/auth-provider"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Shield, Bell, Users, Download } from "lucide-react"
import { updatePassword } from "firebase/auth"
import { auth } from "@/lib/firebase"

export default function TeacherSettings() {
  const { user, loading } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [settings, setSettings] = useState({
    emailNotifications: true,
    autoGrading: false,
    studentNotifications: true,
    exportReminders: true,
  })

  useEffect(() => {
    if (!loading && (!user || user.role !== "teacher")) {
      router.push("/")
    }
  }, [user, loading, router])

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Lỗi",
        description: "Mật khẩu mới không khớp",
        variant: "destructive",
      })
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Lỗi",
        description: "Mật khẩu phải có ít nhất 6 ký tự",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, passwordData.newPassword)
        toast({
          title: "Thành công",
          description: "Mật khẩu đã được cập nhật",
        })
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      }
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật mật khẩu",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleSettingsChange = (key: string, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    toast({
      title: "Đã cập nhật",
      description: "Cài đặt đã được lưu",
    })
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Đang tải...</div>
  }

  if (!user || user.role !== "teacher") {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-6 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Cài Đặt Giảng Viên</h1>
          <p className="text-gray-600 mt-2">Quản lý cài đặt tài khoản và chức năng giảng dạy</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  Bảo mật
                </CardTitle>
                <CardDescription>Thay đổi mật khẩu và cài đặt bảo mật</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="newPassword">Mật khẩu mới</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                  />
                </div>
                <Button
                  onClick={handlePasswordChange}
                  disabled={saving}
                  className="w-full bg-[#005BAC] hover:bg-[#004A8F]"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Quản lý sinh viên
                </CardTitle>
                <CardDescription>Cài đặt liên quan đến quản lý sinh viên</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Tự động chấm điểm</Label>
                    <p className="text-sm text-gray-600">Tự động tính điểm dựa trên tiêu chí</p>
                  </div>
                  <Switch
                    checked={settings.autoGrading}
                    onCheckedChange={(checked) => handleSettingsChange("autoGrading", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Thông báo sinh viên</Label>
                    <p className="text-sm text-gray-600">Gửi thông báo tự động cho sinh viên</p>
                  </div>
                  <Switch
                    checked={settings.studentNotifications}
                    onCheckedChange={(checked) => handleSettingsChange("studentNotifications", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="mr-2 h-5 w-5" />
                  Thông báo
                </CardTitle>
                <CardDescription>Cài đặt thông báo và nhắc nhở</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Thông báo email</Label>
                    <p className="text-sm text-gray-600">Nhận thông báo qua email</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingsChange("emailNotifications", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Nhắc nhở xuất báo cáo</Label>
                    <p className="text-sm text-gray-600">Nhắc nhở xuất báo cáo định kỳ</p>
                  </div>
                  <Switch
                    checked={settings.exportReminders}
                    onCheckedChange={(checked) => handleSettingsChange("exportReminders", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Download className="mr-2 h-5 w-5" />
                  Báo cáo & Xuất dữ liệu
                </CardTitle>
                <CardDescription>Quản lý báo cáo và xuất dữ liệu</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full bg-transparent">
                  <Download className="mr-2 h-4 w-4" />
                  Xuất danh sách sinh viên
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  <Download className="mr-2 h-4 w-4" />
                  Xuất báo cáo điểm
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  Sao lưu dữ liệu
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thông tin hệ thống</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Phiên bản:</span>
                  <span className="font-medium">v1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Quyền truy cập:</span>
                  <span className="font-medium">Giảng viên</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Hỗ trợ:</span>
                  <span className="font-medium">support@womanacademy.edu.vn</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
