"use client"

import { useAuth } from "@/components/providers/auth-provider"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, FileCheck, Bell, Download, Eye, Plus, Mail } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function TeacherDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || user.role !== "teacher")) {
      router.push("/")
    }
  }, [user, loading, router])

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Chào mừng, {user.fullName}</h1>
          <p className="text-gray-600 mt-2">Quản lý chấm điểm rèn luyện sinh viên</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng sinh viên</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground">Đang quản lý</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Phiếu chờ chấm</CardTitle>
              <FileCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Cần xử lý</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đã chấm xong</CardTitle>
              <div className="h-4 w-4 rounded-full bg-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">33</div>
              <p className="text-xs text-muted-foreground">Hoàn thành</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Thông báo</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Cần gửi</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Danh sách sinh viên</CardTitle>
                <CardDescription>Quản lý phiếu chấm điểm của sinh viên</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Nguyễn Thị Hoa", id: "SV001", class: "CNTT01", status: "submitted", score: 85 },
                    { name: "Trần Thị Mai", id: "SV002", class: "CNTT01", status: "submitted", score: 78 },
                    { name: "Lê Thị Lan", id: "SV003", class: "CNTT01", status: "draft", score: 0 },
                    { name: "Phạm Thị Hương", id: "SV004", class: "CNTT01", status: "graded", score: 92 },
                    { name: "Hoàng Thị Linh", id: "SV005", class: "CNTT01", status: "draft", score: 0 },
                  ].map((student, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {student.id} - Lớp {student.class}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            student.status === "submitted"
                              ? "bg-blue-100 text-blue-800"
                              : student.status === "graded"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {student.status === "submitted"
                            ? "Chờ chấm"
                            : student.status === "graded"
                              ? "Đã chấm"
                              : "Nháp"}
                        </span>
                        <span className="text-sm font-medium">
                          {student.score > 0 ? `${student.score}/100` : "Chưa có"}
                        </span>
                        <Button size="sm" onClick={() => router.push(`/teacher/students/${student.id}/evaluation`)}>
                          <Eye className="mr-1 h-3 w-3" />
                          Xem phiếu
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 text-center">
                  <Button variant="outline" onClick={() => router.push("/teacher/students")}>
                    Xem tất cả sinh viên
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thao tác nhanh</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  className="w-full justify-start bg-[#005BAC] hover:bg-[#004A8F]"
                  onClick={() => router.push("/teacher/students/add")}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm sinh viên
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => router.push("/teacher/students")}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Xuất danh sách
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => router.push("/teacher/notifications/send")}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Gửi thông báo
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thống kê nhanh</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Điểm trung bình:</span>
                    <span className="font-medium">78.5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Xuất sắc:</span>
                    <span className="font-medium">15 SV</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Giỏi:</span>
                    <span className="font-medium">20 SV</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Khá:</span>
                    <span className="font-medium">8 SV</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Trung bình:</span>
                    <span className="font-medium">2 SV</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
