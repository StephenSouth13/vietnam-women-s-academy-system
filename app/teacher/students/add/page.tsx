"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/providers/auth-provider"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, Upload, UserPlus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AddStudentPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    studentId: "",
    classId: "",
    phone: "",
  })
  const [bulkEmails, setBulkEmails] = useState("")

  useEffect(() => {
    if (!loading && (!user || user.role !== "teacher")) {
      router.push("/")
    }
  }, [user, loading, router])

  const handleSingleAdd = async () => {
    if (!formData.fullName || !formData.email || !formData.studentId) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Thêm sinh viên thành công",
        description: `Đã thêm ${formData.fullName} vào hệ thống`,
      })

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        studentId: "",
        classId: "",
        phone: "",
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể thêm sinh viên",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleBulkAdd = async () => {
    if (!bulkEmails.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập danh sách email",
        variant: "destructive",
      })
      return
    }

    const emails = bulkEmails.split("\n").filter((email) => email.trim())

    setSaving(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Thêm hàng loạt thành công",
        description: `Đã gửi lời mời đến ${emails.length} email`,
      })

      setBulkEmails("")
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể thêm hàng loạt",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
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
            Quay lại danh sách
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Thêm Sinh Viên</h1>
          <p className="text-gray-600 mt-2">Thêm sinh viên mới vào hệ thống</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Thêm từng sinh viên */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserPlus className="mr-2 h-5 w-5" />
                Thêm từng sinh viên
              </CardTitle>
              <CardDescription>Nhập thông tin chi tiết cho một sinh viên</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="fullName">Họ và tên *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Nguyễn Thị Hoa"
                />
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="hoa.nguyen@student.womanacademy.edu.vn"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="studentId">Mã sinh viên *</Label>
                  <Input
                    id="studentId"
                    value={formData.studentId}
                    onChange={(e) => setFormData((prev) => ({ ...prev, studentId: e.target.value }))}
                    placeholder="SV001"
                  />
                </div>
                <div>
                  <Label htmlFor="classId">Lớp</Label>
                  <Input
                    id="classId"
                    value={formData.classId}
                    onChange={(e) => setFormData((prev) => ({ ...prev, classId: e.target.value }))}
                    placeholder="CNTT01"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="0123456789"
                />
              </div>

              <Button onClick={handleSingleAdd} disabled={saving} className="w-full bg-[#005BAC] hover:bg-[#004A8F]">
                <Plus className="mr-2 h-4 w-4" />
                {saving ? "Đang thêm..." : "Thêm sinh viên"}
              </Button>
            </CardContent>
          </Card>

          {/* Thêm hàng loạt */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="mr-2 h-5 w-5" />
                Thêm hàng loạt
              </CardTitle>
              <CardDescription>Gửi lời mời qua email cho nhiều sinh viên</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="bulkEmails">Danh sách email</Label>
                <Textarea
                  id="bulkEmails"
                  value={bulkEmails}
                  onChange={(e) => setBulkEmails(e.target.value)}
                  placeholder="Nhập mỗi email trên một dòng:&#10;hoa.nguyen@student.womanacademy.edu.vn&#10;mai.tran@student.womanacademy.edu.vn&#10;lan.le@student.womanacademy.edu.vn"
                  rows={8}
                />
                <p className="text-sm text-gray-500 mt-2">
                  Mỗi email trên một dòng. Hệ thống sẽ gửi lời mời đăng ký tự động.
                </p>
              </div>

              <Button onClick={handleBulkAdd} disabled={saving} className="w-full bg-green-600 hover:bg-green-700">
                <Upload className="mr-2 h-4 w-4" />
                {saving ? "Đang gửi..." : "Gửi lời mời hàng loạt"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Hướng dẫn */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Hướng dẫn</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Thêm từng sinh viên:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Điền đầy đủ thông tin bắt buộc (*)</li>
                  <li>• Hệ thống sẽ tạo tài khoản tự động</li>
                  <li>• Sinh viên sẽ nhận email hướng dẫn đăng nhập</li>
                  <li>• Mật khẩu mặc định là mã sinh viên</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Thêm hàng loạt:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Mỗi email trên một dòng</li>
                  <li>• Hệ thống gửi lời mời đăng ký</li>
                  <li>• Sinh viên tự điền thông tin khi đăng ký</li>
                  <li>• Giảng viên xác nhận sau khi sinh viên đăng ký</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
