"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/providers/auth-provider"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { ArrowLeft, Send, Mail, Bell } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Dữ liệu demo sinh viên
const demoStudents = [
  { id: "SV001", fullName: "Nguyễn Thị Hoa", email: "hoa.nguyen@student.womanacademy.edu.vn", status: "submitted" },
  { id: "SV002", fullName: "Trần Thị Mai", email: "mai.tran@student.womanacademy.edu.vn", status: "submitted" },
  { id: "SV003", fullName: "Lê Thị Lan", email: "lan.le@student.womanacademy.edu.vn", status: "draft" },
  { id: "SV004", fullName: "Phạm Thị Hương", email: "huong.pham@student.womanacademy.edu.vn", status: "graded" },
  { id: "SV005", fullName: "Hoàng Thị Linh", email: "linh.hoang@student.womanacademy.edu.vn", status: "draft" },
]

const notificationTemplates = [
  {
    id: "reminder",
    title: "Nhắc nhở nộp phiếu",
    content:
      "Thân gửi các em sinh viên,\n\nHệ thống nhắc nhở các em hoàn thành và nộp phiếu chấm điểm rèn luyện trước hạn chót.\n\nThời hạn: [DATE]\n\nTrân trọng,\nBan Giám hiệu",
  },
  {
    id: "deadline",
    title: "Thông báo hạn chót",
    content:
      "Thân gửi các em sinh viên,\n\nĐây là thông báo cuối cùng về việc nộp phiếu chấm điểm rèn luyện.\n\nHạn chót: [DATE]\nSau thời gian này, hệ thống sẽ không nhận phiếu muộn.\n\nTrân trọng,\nBan Giám hiệu",
  },
  {
    id: "completed",
    title: "Thông báo hoàn thành chấm điểm",
    content:
      "Thân gửi em [STUDENT_NAME],\n\nPhiếu chấm điểm rèn luyện của em đã được chấm xong.\n\nĐiểm cuối cùng: [SCORE]/100\nXếp loại: [GRADE]\n\nEm có thể xem chi tiết trong hệ thống.\n\nTrân trọng,\nGiảng viên",
  },
]

export default function SendNotificationPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [sending, setSending] = useState(false)
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [notificationData, setNotificationData] = useState({
    title: "",
    content: "",
    type: "info" as "info" | "warning" | "success" | "error",
    sendEmail: true,
    sendPush: false,
  })

  useEffect(() => {
    if (!loading && (!user || user.role !== "teacher")) {
      router.push("/")
    }
  }, [user, loading, router])

  const handleStudentSelect = (studentId: string, checked: boolean) => {
    if (checked) {
      setSelectedStudents((prev) => [...prev, studentId])
    } else {
      setSelectedStudents((prev) => prev.filter((id) => id !== studentId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudents(demoStudents.map((s) => s.id))
    } else {
      setSelectedStudents([])
    }
  }

  const handleTemplateSelect = (template: (typeof notificationTemplates)[0]) => {
    setNotificationData((prev) => ({
      ...prev,
      title: template.title,
      content: template.content,
    }))
  }

  const handleSendNotification = async () => {
    if (!notificationData.title || !notificationData.content) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền tiêu đề và nội dung thông báo",
        variant: "destructive",
      })
      return
    }

    if (selectedStudents.length === 0) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn ít nhất một sinh viên",
        variant: "destructive",
      })
      return
    }

    setSending(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Gửi thông báo thành công",
        description: `Đã gửi thông báo đến ${selectedStudents.length} sinh viên`,
      })

      // Reset form
      setNotificationData({
        title: "",
        content: "",
        type: "info",
        sendEmail: true,
        sendPush: false,
      })
      setSelectedStudents([])
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể gửi thông báo",
        variant: "destructive",
      })
    } finally {
      setSending(false)
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
            Quay lại
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Gửi Thông Báo</h1>
          <p className="text-gray-600 mt-2">Gửi thông báo đến sinh viên</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form thông báo */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mẫu thông báo */}
            <Card>
              <CardHeader>
                <CardTitle>Mẫu thông báo</CardTitle>
                <CardDescription>Chọn mẫu có sẵn hoặc tự viết</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {notificationTemplates.map((template) => (
                    <Button
                      key={template.id}
                      variant="outline"
                      onClick={() => handleTemplateSelect(template)}
                      className="h-auto p-3 text-left"
                    >
                      <div>
                        <div className="font-medium">{template.title}</div>
                        <div className="text-xs text-gray-500 mt-1">{template.content.substring(0, 50)}...</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Nội dung thông báo */}
            <Card>
              <CardHeader>
                <CardTitle>Nội dung thông báo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Tiêu đề</Label>
                  <Input
                    id="title"
                    value={notificationData.title}
                    onChange={(e) => setNotificationData((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Nhập tiêu đề thông báo"
                  />
                </div>

                <div>
                  <Label htmlFor="content">Nội dung</Label>
                  <Textarea
                    id="content"
                    value={notificationData.content}
                    onChange={(e) => setNotificationData((prev) => ({ ...prev, content: e.target.value }))}
                    placeholder="Nhập nội dung thông báo"
                    rows={8}
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sendEmail"
                      checked={notificationData.sendEmail}
                      onCheckedChange={(checked) =>
                        setNotificationData((prev) => ({ ...prev, sendEmail: checked as boolean }))
                      }
                    />
                    <Label htmlFor="sendEmail" className="flex items-center">
                      <Mail className="mr-1 h-4 w-4" />
                      Gửi email
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sendPush"
                      checked={notificationData.sendPush}
                      onCheckedChange={(checked) =>
                        setNotificationData((prev) => ({ ...prev, sendPush: checked as boolean }))
                      }
                    />
                    <Label htmlFor="sendPush" className="flex items-center">
                      <Bell className="mr-1 h-4 w-4" />
                      Thông báo đẩy
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Chọn sinh viên */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>
                    Chọn sinh viên ({selectedStudents.length}/{demoStudents.length})
                  </span>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="selectAll"
                      checked={selectedStudents.length === demoStudents.length}
                      onCheckedChange={handleSelectAll}
                    />
                    <Label htmlFor="selectAll" className="text-sm">
                      Chọn tất cả
                    </Label>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {demoStudents.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id={student.id}
                          checked={selectedStudents.includes(student.id)}
                          onCheckedChange={(checked) => handleStudentSelect(student.id, checked as boolean)}
                        />
                        <div>
                          <p className="font-medium">{student.fullName}</p>
                          <p className="text-sm text-gray-600">
                            {student.id} - {student.email}
                          </p>
                        </div>
                      </div>
                      <Badge
                        className={
                          student.status === "submitted"
                            ? "bg-blue-100 text-blue-800"
                            : student.status === "graded"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {student.status === "submitted" ? "Chờ chấm" : student.status === "graded" ? "Đã chấm" : "Nháp"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tóm tắt</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Số sinh viên:</span>
                  <span className="font-medium">{selectedStudents.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Gửi email:</span>
                  <span className="font-medium">{notificationData.sendEmail ? "Có" : "Không"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Thông báo đẩy:</span>
                  <span className="font-medium">{notificationData.sendPush ? "Có" : "Không"}</span>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handleSendNotification}
              disabled={sending}
              className="w-full bg-[#005BAC] hover:bg-[#004A8F]"
            >
              <Send className="mr-2 h-4 w-4" />
              {sending ? "Đang gửi..." : "Gửi thông báo"}
            </Button>

            <Card>
              <CardHeader>
                <CardTitle>Lưu ý</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600 space-y-2">
                <p>• Thông báo sẽ được gửi ngay lập tức</p>
                <p>• Sinh viên sẽ nhận được trong hệ thống</p>
                <p>• Email sẽ được gửi nếu được chọn</p>
                <p>• Có thể sử dụng [STUDENT_NAME], [DATE], [SCORE] trong nội dung</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
