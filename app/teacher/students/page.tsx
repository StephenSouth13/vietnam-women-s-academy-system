"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/providers/auth-provider"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { ArrowLeft, Eye, Download, Search, Plus, Mail } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Dữ liệu demo sinh viên
const demoStudents = [
  {
    id: "SV001",
    fullName: "Nguyễn Thị Hoa",
    email: "hoa.nguyen@student.womanacademy.edu.vn",
    classId: "CNTT01",
    totalScore: 85,
    status: "submitted",
    submittedAt: "2024-12-20",
  },
  {
    id: "SV002",
    fullName: "Trần Thị Mai",
    email: "mai.tran@student.womanacademy.edu.vn",
    classId: "CNTT01",
    totalScore: 78,
    status: "submitted",
    submittedAt: "2024-12-19",
  },
  {
    id: "SV003",
    fullName: "Lê Thị Lan",
    email: "lan.le@student.womanacademy.edu.vn",
    classId: "CNTT01",
    totalScore: 0,
    status: "draft",
    submittedAt: null,
  },
  {
    id: "SV004",
    fullName: "Phạm Thị Hương",
    email: "huong.pham@student.womanacademy.edu.vn",
    classId: "CNTT01",
    totalScore: 92,
    status: "graded",
    submittedAt: "2024-12-18",
  },
  {
    id: "SV005",
    fullName: "Hoàng Thị Linh",
    email: "linh.hoang@student.womanacademy.edu.vn",
    classId: "CNTT01",
    totalScore: 0,
    status: "draft",
    submittedAt: null,
  },
]

export default function StudentsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [students, setStudents] = useState(demoStudents)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])

  useEffect(() => {
    if (!loading && (!user || user.role !== "teacher")) {
      router.push("/")
    }
  }, [user, loading, router])

  const filteredStudents = students.filter(
    (student) =>
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "submitted":
        return <Badge className="bg-blue-100 text-blue-800">Chờ chấm</Badge>
      case "graded":
        return <Badge className="bg-green-100 text-green-800">Đã chấm</Badge>
      case "draft":
        return <Badge className="bg-yellow-100 text-yellow-800">Nháp</Badge>
      default:
        return <Badge variant="secondary">Chưa rõ</Badge>
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 font-bold"
    if (score >= 80) return "text-blue-600 font-semibold"
    if (score >= 70) return "text-yellow-600"
    if (score > 0) return "text-red-600"
    return "text-gray-400"
  }

  const handleViewEvaluation = (studentId: string) => {
    router.push(`/teacher/students/${studentId}/evaluation`)
  }

  const handleExportStudent = (studentId: string) => {
    const student = students.find((s) => s.id === studentId)
    toast({
      title: "Xuất phiếu sinh viên",
      description: `Đang xuất phiếu của ${student?.fullName}`,
    })
  }

  const handleExportAll = () => {
    toast({
      title: "Xuất danh sách",
      description: "Đang xuất danh sách tất cả sinh viên",
    })
  }

  const handleSendNotification = () => {
    router.push("/teacher/notifications/send")
  }

  const handleAddStudent = () => {
    router.push("/teacher/students/add")
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
            Quay lại Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Quản Lý Sinh Viên</h1>
          <p className="text-gray-600 mt-2">Xem và chấm điểm phiếu rèn luyện của sinh viên</p>
        </div>

        {/* Thống kê nhanh */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-[#005BAC]">{students.length}</div>
              <p className="text-sm text-gray-600">Tổng sinh viên</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-blue-600">
                {students.filter((s) => s.status === "submitted").length}
              </div>
              <p className="text-sm text-gray-600">Chờ chấm</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-green-600">
                {students.filter((s) => s.status === "graded").length}
              </div>
              <p className="text-sm text-gray-600">Đã chấm</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-yellow-600">
                {students.filter((s) => s.status === "draft").length}
              </div>
              <p className="text-sm text-gray-600">Chưa nộp</p>
            </CardContent>
          </Card>
        </div>

        {/* Thanh công cụ */}
        <Card className="mb-6">
          <CardContent className="pt-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-2 flex-1">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm sinh viên..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddStudent} className="bg-[#005BAC] hover:bg-[#004A8F]">
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm sinh viên
                </Button>
                <Button variant="outline" onClick={handleExportAll}>
                  <Download className="mr-2 h-4 w-4" />
                  Xuất danh sách
                </Button>
                <Button variant="outline" onClick={handleSendNotification}>
                  <Mail className="mr-2 h-4 w-4" />
                  Gửi thông báo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danh sách sinh viên */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách sinh viên ({filteredStudents.length})</CardTitle>
            <CardDescription>Quản lý phiếu chấm điểm rèn luyện</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-[#005BAC] text-white rounded-full flex items-center justify-center font-semibold">
                      {student.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="font-semibold">{student.fullName}</h3>
                      <p className="text-sm text-gray-600">
                        {student.id} - Lớp {student.classId}
                      </p>
                      <p className="text-xs text-gray-500">{student.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className={`text-lg font-bold ${getScoreColor(student.totalScore)}`}>
                        {student.totalScore > 0 ? `${student.totalScore}/100` : "Chưa có"}
                      </div>
                      <div className="text-xs text-gray-500">Điểm</div>
                    </div>

                    <div className="text-center">
                      {getStatusBadge(student.status)}
                      {student.submittedAt && (
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(student.submittedAt).toLocaleDateString("vi-VN")}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleViewEvaluation(student.id)}
                        className="bg-[#005BAC] hover:bg-[#004A8F]"
                      >
                        <Eye className="mr-1 h-3 w-3" />
                        Xem phiếu
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleExportStudent(student.id)}>
                        <Download className="mr-1 h-3 w-3" />
                        Xuất
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredStudents.length === 0 && (
              <div className="text-center py-8 text-gray-500">Không tìm thấy sinh viên nào</div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
