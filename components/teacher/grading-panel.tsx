"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/providers/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { FileText, Search, Users, Filter } from "lucide-react"

interface StudentScore {
  id: string
  studentId: string
  studentName: string
  classId: string
  semester: string
  academicYear: string
  totalSelfScore: number
  classScore?: number
  teacherScore?: number
  finalScore?: number
  status: "submitted" | "graded" | "draft"
  submittedAt: Date
  gradedAt?: Date
  sections: {
    section1: { selfScore: number; evidence: string }
    section2: { selfScore: number; evidence: string }
    section3: { selfScore: number; evidence: string }
    section4: { selfScore: number; evidence: string }
    section5: { selfScore: number; evidence: string }
  }
}

export default function GradingPanel() {
  const { userData } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [scores, setScores] = useState<StudentScore[]>([])
  const [selectedScore, setSelectedScore] = useState<StudentScore | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "submitted" | "graded">("all")
  const [grading, setGrading] = useState(false)

  useEffect(() => {
    loadStudentScores()
  }, [userData])

  const loadStudentScores = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/grading?teacherId=${userData?.uid}&status=${filterStatus}`)
      const result = await response.json()

      if (result.success) {
        setScores(result.data)
      }
    } catch (error) {
      console.error("Error loading student scores:", error)
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách điểm sinh viên",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGradeScore = async (scoreId: string, teacherScore: number, feedback?: string) => {
    setGrading(true)
    try {
      const response = await fetch("/api/grading", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scoreId,
          teacherScore,
          feedback,
          teacherId: userData?.uid,
        }),
      })

      const result = await response.json()

      if (result.success) {
        // Update local state
        setScores((prev) =>
          prev.map((score) =>
            score.id === scoreId
              ? {
                  ...score,
                  teacherScore: result.data.teacherScore,
                  finalScore: result.data.finalScore,
                  status: "graded" as const,
                  gradedAt: new Date(result.data.gradedAt),
                }
              : score,
          ),
        )

        setSelectedScore(null)
        toast({
          title: "Chấm điểm thành công",
          description: result.message,
        })
      } else {
        toast({
          title: "Lỗi",
          description: result.error || "Không thể lưu điểm",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể lưu điểm",
        variant: "destructive",
      })
    } finally {
      setGrading(false)
    }
  }

  const filteredScores = scores.filter((score) => {
    const matchesSearch =
      score.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      score.studentId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || score.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-yellow-100 text-yellow-800"
      case "graded":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getGradeText = (score: number) => {
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
          <h2 className="text-2xl font-bold text-gray-800">Chấm điểm rèn luyện</h2>
          <p className="text-gray-600">Xem và chấm điểm phiếu rèn luyện của sinh viên</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-yellow-50">
            {scores.filter((s) => s.status === "submitted").length} chờ chấm
          </Badge>
          <Badge variant="outline" className="bg-green-50">
            {scores.filter((s) => s.status === "graded").length} đã chấm
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm theo tên hoặc mã sinh viên..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value as any)
                  loadStudentScores() // Reload with new filter
                }}
                className="border rounded-md px-3 py-2 text-sm"
              >
                <option value="all">Tất cả</option>
                <option value="submitted">Chờ chấm điểm</option>
                <option value="graded">Đã chấm điểm</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Student Scores List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Danh sách sinh viên ({filteredScores.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredScores.map((score) => (
                <div
                  key={score.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                    selectedScore?.id === score.id ? "border-blue-500 bg-blue-50" : ""
                  }`}
                  onClick={() => setSelectedScore(score)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-800">{score.studentName}</h4>
                      <p className="text-sm text-gray-600">
                        {score.studentId} - {score.classId}
                      </p>
                    </div>
                    <Badge className={getStatusColor(score.status)}>
                      {score.status === "submitted" ? "Chờ chấm" : "Đã chấm"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      Tự đánh giá: <strong>{score.totalSelfScore}/100</strong>
                    </span>
                    {score.finalScore && (
                      <span className="text-blue-600 font-medium">Điểm cuối: {score.finalScore}/100</span>
                    )}
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Nộp: {new Date(score.submittedAt).toLocaleDateString("vi-VN")}
                    {score.gradedAt && (
                      <span>
                        • Chấm: {new Date(score.gradedAt).toLocaleDateString("vi-VN")}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Score Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {selectedScore ? "Chi tiết phiếu chấm điểm" : "Chọn sinh viên để xem chi tiết"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedScore ? (
              <div className="space-y-6">
                {/* Student Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">{selectedScore.studentName}</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Mã SV:</span>
                      <span className="ml-2 font-medium">{selectedScore.studentId}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Lớp:</span>
                      <span className="ml-2 font-medium">{selectedScore.classId}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Học kỳ:</span>
                      <span className="ml-2 font-medium">{selectedScore.semester}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Năm học:</span>
                      <span className="ml-2 font-medium">{selectedScore.academicYear}</span>
                    </div>
                  </div>
                </div>

                {/* Scoring Sections */}
                <div className="space-y-4">
                  {Object.entries(selectedScore.sections).map(([key, section], index) => {
                    const sectionTitles = [
                      "I. Ý thức học tập (20đ)",
                      "II. Chấp hành nội quy (25đ)",
                      "III. Tham gia hoạt động xã hội (20đ)",
                      "IV. Ý thức công dân (25đ)",
                      "V. Tham gia công tác lớp (10đ)",
                    ]

                    return (
                      <div key={key} className="border rounded-lg p-3">
                        <h4 className="font-medium text-gray-800 mb-2">{sectionTitles[index]}</h4>
                        <div className="text-sm">
                          <p className="text-blue-600 font-medium mb-1">Điểm tự đánh giá: {section.selfScore}</p>
                          <p className="text-gray-600">{section.evidence}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Grading Section */}
                {selectedScore.status === "submitted" && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-800 mb-3">Chấm điểm giảng viên</h4>
                    <GradingForm score={selectedScore} onGrade={handleGradeScore} loading={grading} />
                  </div>
                )}

                {/* Final Scores */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-3">Tổng kết điểm</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Tự đánh giá:</span>
                      <span className="ml-2 font-medium">{selectedScore.totalSelfScore}/100</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Điểm lớp:</span>
                      <span className="ml-2 font-medium">{selectedScore.classScore || "--"}/100</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Điểm GV:</span>
                      <span className="ml-2 font-medium">{selectedScore.teacherScore || "--"}/100</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Điểm cuối:</span>
                      <span className="ml-2 font-bold text-blue-600">
                        {selectedScore.finalScore || "--"}/100
                        {selectedScore.finalScore && (
                          <span className="ml-2 text-xs">({getGradeText(selectedScore.finalScore)})</span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Chọn một sinh viên từ danh sách để xem chi tiết phiếu chấm điểm</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Grading Form Component
function GradingForm({
  score,
  onGrade,
  loading,
}: {
  score: StudentScore
  onGrade: (scoreId: string, teacherScore: number, feedback?: string) => void
  loading: boolean
}) {
  const [teacherScore, setTeacherScore] = useState(0)
  const [feedback, setFeedback] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (teacherScore < 0 || teacherScore > 100) {
      return
    }
    onGrade(score.id, teacherScore, feedback)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="teacherScore">Điểm giảng viên (0-100)</Label>
        <Input
          id="teacherScore"
          type="number"
          min="0"
          max="100"
          value={teacherScore}
          onChange={(e) => setTeacherScore(Number(e.target.value))}
          placeholder="Nhập điểm"
          required
        />
      </div>
      <div>
        <Label htmlFor="feedback">Nhận xét (tùy chọn)</Label>
        <Textarea
          id="feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Nhận xét về kết quả rèn luyện của sinh viên..."
          rows={3}
        />
      </div>
      <Button type="submit" disabled={loading || teacherScore === 0} className="w-full bg-[#005BAC] hover:bg-[#003D73]">
        {loading ? "Đang lưu..." : "Chấm điểm"}
      </Button>
    </form>
  )
}
