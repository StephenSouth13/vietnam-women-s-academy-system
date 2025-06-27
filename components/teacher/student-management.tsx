"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/providers/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Users, Search, UserPlus, Download, Filter, Mail, Phone, Calendar, BookOpen, X, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Student {
  id: string
  studentId: string
  fullName: string
  email: string
  phone?: string
  classId: string
  dateOfBirth?: string
  status: "active" | "inactive"
  totalScores: number
  averageScore: number
  lastSubmission?: Date
}

export default function StudentManagement() {
  const { userData } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [students, setStudents] = useState<Student[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterClass, setFilterClass] = useState<string>("all")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [addingStudent, setAddingStudent] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [newStudentEmail, setNewStudentEmail] = useState("")
  const [selectedClass, setSelectedClass] = useState("CNTT2024A")

  useEffect(() => {
    loadStudents()
  }, [userData])

  const loadStudents = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/students?teacherId=${userData?.uid}`)
      const result = await response.json()

      if (result.success) {
        setStudents(result.data)
      }
    } catch (error) {
      console.error("Error loading students:", error)
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách sinh viên",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const addStudentByEmail = async () => {
    if (!newStudentEmail.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập email sinh viên",
        variant: "destructive",
      })
      return
    }

    setAddingStudent(true)
    try {
      const response = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newStudentEmail,
          classId: selectedClass,
          teacherId: userData?.uid,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Thành công",
          description: "Đã thêm sinh viên vào lớp",
        })
        setNewStudentEmail("")
        setShowAddDialog(false)
        loadStudents() // Reload students list
      } else {
        toast({
          title: "Lỗi",
          description: result.error || "Không thể thêm sinh viên",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể thêm sinh viên",
        variant: "destructive",
      })
    } finally {
      setAddingStudent(false)
    }
  }

  const exportStudentList = async () => {
    setExporting(true)
    try {
      const response = await fetch("/api/students/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          students: filteredStudents,
          format: "csv",
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `danh-sach-sinh-vien-${new Date().toISOString().split("T")[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        toast({
          title: "Xuất file thành công",
          description: "Danh sách sinh viên đã được tải xuống",
        })
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xuất danh sách",
        variant: "destructive",
      })
    } finally {
      setExporting(false)
    }
  }

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesClass = filterClass === "all" || student.classId === filterClass
    return matchesSearch && matchesClass
  })

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-blue-600"
    if (score >= 65) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Xuất sắc"
    if (score >= 80) return "Tốt"
    if (score >= 65) return "Khá"
    if (score >= 50) return "Trung bình"
    return "Yếu"
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Quản lý sinh viên</h2>
          <p className="text-gray-600">Danh sách và thông tin sinh viên trong các lớp</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportStudentList} disabled={exporting} className="bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            {exporting ? "Đang xuất..." : "Xuất CSV"}
          </Button>

          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-[#005BAC] hover:bg-[#003D73]">
                <UserPlus className="w-4 h-4 mr-2" />
                Thêm sinh viên
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm sinh viên vào lớp</DialogTitle>
                <DialogDescription>Nhập email sinh viên để thêm vào lớp học</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="studentEmail">Email sinh viên</Label>
                  <Input
                    id="studentEmail"
                    type="email"
                    value={newStudentEmail}
                    onChange={(e) => setNewStudentEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="classSelect">Lớp</Label>
                  <select
                    id="classSelect"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full mt-1 p-2 border rounded-md"
                  >
                    <option value="CNTT2024A">CNTT2024A</option>
                    <option value="CNTT2024B">CNTT2024B</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={addStudentByEmail}
                    disabled={addingStudent}
                    className="flex-1 bg-[#005BAC] hover:bg-[#003D73]"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {addingStudent ? "Đang thêm..." : "Thêm sinh viên"}
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddDialog(false)} className="bg-transparent">
                    <X className="w-4 h-4 mr-2" />
                    Hủy
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tổng sinh viên</p>
                <p className="text-xl font-bold text-blue-600">{students.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Đã nộp phiếu</p>
                <p className="text-xl font-bold text-green-600">{students.filter((s) => s.lastSubmission).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Calendar className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Điểm TB</p>
                <p className="text-xl font-bold text-yellow-600">
                  {students.length > 0
                    ? Math.round(students.reduce((sum, s) => sum + s.averageScore, 0) / students.length)
                    : 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Lớp học</p>
                <p className="text-xl font-bold text-purple-600">{new Set(students.map((s) => s.classId)).size}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm theo tên, mã SV hoặc email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="border rounded-md px-3 py-2 text-sm"
              >
                <option value="all">Tất cả lớp</option>
                <option value="CNTT2024A">CNTT2024A</option>
                <option value="CNTT2024B">CNTT2024B</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Danh sách sinh viên ({filteredStudents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredStudents.map((student) => (
              <div key={student.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{student.fullName}</h4>
                      <p className="text-sm text-gray-600">
                        {student.studentId} - {student.classId}
                      </p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {student.email}
                        </span>
                        {student.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {student.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="bg-green-50">
                        {student.totalScores} phiếu
                      </Badge>
                      <Badge variant="outline" className={`${getScoreColor(student.averageScore)} border-current`}>
                        {student.averageScore} điểm
                      </Badge>
                    </div>
                    <p className={`text-sm font-medium ${getScoreColor(student.averageScore)}`}>
                      {getScoreLabel(student.averageScore)}
                    </p>
                    {student.lastSubmission && (
                      <p className="text-xs text-gray-500 mt-1">
                        Nộp cuối: {new Date(student.lastSubmission).toLocaleDateString("vi-VN")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Không tìm thấy sinh viên nào</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
