"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/providers/auth-provider"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Download, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Dữ liệu demo phiếu đánh giá
const demoEvaluation = {
  studentInfo: {
    id: "SV001",
    fullName: "Nguyễn Thị Hoa",
    email: "hoa.nguyen@student.womanacademy.edu.vn",
    classId: "CNTT01",
  },
  evaluation: {
    semester: "HK1",
    academicYear: "2024-2025",
    section1: {
      selfScore: 18,
      teacherScore: 17,
      evidence: "Điểm trung bình học kỳ 8.5/10. Tham gia đầy đủ các môn học, không vắng mặt không phép.",
      files: ["bang_diem_hk1.pdf", "chung_chi_tieng_anh.jpg"],
    },
    section2: {
      selfScore: 23,
      teacherScore: 22,
      evidence: "Chấp hành tốt nội quy trường, lớp. Không vi phạm quy định về trang phục, giờ giấc.",
      files: ["cam_ket_noi_quy.pdf"],
    },
    section3: {
      selfScore: 18,
      teacherScore: 16,
      evidence: "Tham gia CLB Tin học, hoạt động tình nguyện dọn vệ sinh trường học 2 lần/tháng.",
      files: ["chung_nhan_tinh_nguyen.jpg", "hoat_dong_clb.pdf"],
    },
    section4: {
      selfScore: 22,
      teacherScore: 23,
      evidence:
        "Tham gia đầy đủ các hoạt động chính trị, xã hội. Đóng góp ý kiến tích cực trong các buổi sinh hoạt lớp.",
      files: [],
    },
    section5: {
      selfScore: 8,
      teacherScore: 9,
      evidence: "Làm lớp trưởng, tổ chức tốt các hoạt động lớp, hỗ trợ bạn bè trong học tập.",
      files: ["bao_cao_lop_truong.docx"],
    },
    totalSelfScore: 89,
    finalScore: 87,
    status: "submitted",
    submittedAt: "2024-12-20T10:30:00Z",
    teacherComment: "",
  },
}

const sections = [
  { id: "section1", title: "Học tập", maxScore: 20 },
  { id: "section2", title: "Chấp hành nội quy", maxScore: 25 },
  { id: "section3", title: "Hoạt động xã hội", maxScore: 20 },
  { id: "section4", title: "Quan hệ công dân", maxScore: 25 },
  { id: "section5", title: "Công tác lớp", maxScore: 10 },
]

export default function StudentEvaluationPage({ params }: { params: { id: string } }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [evaluation, setEvaluation] = useState(demoEvaluation)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!loading && (!user || user.role !== "teacher")) {
      router.push("/")
    }
  }, [user, loading, router])

  const updateTeacherScore = (sectionId: string, score: number) => {
    setEvaluation((prev) => ({
      ...prev,
      evaluation: {
        ...prev.evaluation,
        [sectionId]: {
          ...prev.evaluation[sectionId as keyof typeof prev.evaluation],
          teacherScore: Math.max(0, score),
        },
      },
    }))
  }

  const updateTeacherComment = (comment: string) => {
    setEvaluation((prev) => ({
      ...prev,
      evaluation: {
        ...prev.evaluation,
        teacherComment: comment,
      },
    }))
  }

  const calculateFinalScore = () => {
    const total = sections.reduce((sum, section) => {
      const sectionData = evaluation.evaluation[section.id as keyof typeof evaluation.evaluation] as any
      return sum + (sectionData.teacherScore || sectionData.selfScore || 0)
    }, 0)
    return total
  }

  const handleSaveGrade = async () => {
    setSaving(true)
    try {
      const finalScore = calculateFinalScore()

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setEvaluation((prev) => ({
        ...prev,
        evaluation: {
          ...prev.evaluation,
          finalScore,
          status: "graded",
        },
      }))

      toast({
        title: "Đã lưu điểm",
        description: `Điểm cuối cùng: ${finalScore}/100`,
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể lưu điểm",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleExportPDF = () => {
    toast({
      title: "Xuất PDF",
      description: `Đang xuất phiếu của ${evaluation.studentInfo.fullName}`,
    })
  }

  const getGradeLevel = (score: number) => {
    if (score >= 90) return { level: "Xuất sắc", color: "bg-green-100 text-green-800" }
    if (score >= 80) return { level: "Giỏi", color: "bg-blue-100 text-blue-800" }
    if (score >= 65) return { level: "Khá", color: "bg-yellow-100 text-yellow-800" }
    if (score >= 50) return { level: "Trung bình", color: "bg-orange-100 text-orange-800" }
    return { level: "Yếu", color: "bg-red-100 text-red-800" }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Đang tải...</div>
  }

  if (!user || user.role !== "teacher") {
    return null
  }

  const finalScore = calculateFinalScore()
  const gradeLevel = getGradeLevel(finalScore)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-6 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại danh sách
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Chấm Điểm Rèn Luyện</h1>
              <p className="text-gray-600 mt-2">
                {evaluation.studentInfo.fullName} - {evaluation.studentInfo.id}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExportPDF}>
                <Download className="mr-2 h-4 w-4" />
                Xuất PDF
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            {/* Thông tin sinh viên */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Thông tin sinh viên</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Họ tên</Label>
                    <p className="font-semibold">{evaluation.studentInfo.fullName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Mã SV</Label>
                    <p className="font-semibold">{evaluation.studentInfo.id}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Lớp</Label>
                    <p className="font-semibold">{evaluation.studentInfo.classId}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Học kỳ</Label>
                    <p className="font-semibold">
                      {evaluation.evaluation.semester} {evaluation.evaluation.academicYear}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Chi tiết từng mục */}
            <Tabs defaultValue="section1" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                {sections.map((section) => (
                  <TabsTrigger key={section.id} value={section.id}>
                    {section.title}
                  </TabsTrigger>
                ))}
              </TabsList>

              {sections.map((section) => {
                const sectionData = evaluation.evaluation[section.id as keyof typeof evaluation.evaluation] as any
                return (
                  <TabsContent key={section.id} value={section.id}>
                    <Card>
                      <CardHeader>
                        <CardTitle>{section.title}</CardTitle>
                        <CardDescription>Điểm tối đa: {section.maxScore}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Điểm tự chấm</Label>
                            <Input value={sectionData.selfScore} disabled className="bg-gray-100" />
                          </div>
                          <div>
                            <Label>Điểm giảng viên</Label>
                            <Input
                              type="number"
                              min="0"
                              max={section.maxScore}
                              value={sectionData.teacherScore || sectionData.selfScore}
                              onChange={(e) => updateTeacherScore(section.id, Number.parseInt(e.target.value) || 0)}
                            />
                          </div>
                        </div>

                        <div>
                          <Label>Minh chứng của sinh viên</Label>
                          <Textarea value={sectionData.evidence} disabled className="bg-gray-100" rows={3} />
                        </div>

                        {sectionData.files && sectionData.files.length > 0 && (
                          <div>
                            <Label>File đính kèm</Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {sectionData.files.map((file: string, index: number) => (
                                <Badge key={index} variant="outline" className="flex items-center gap-1">
                                  <FileText className="h-3 w-3" />
                                  {file}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                )
              })}
            </Tabs>

            {/* Nhận xét của giảng viên */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Nhận xét của giảng viên</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Nhập nhận xét về sinh viên..."
                  value={evaluation.evaluation.teacherComment}
                  onChange={(e) => updateTeacherComment(e.target.value)}
                  rows={4}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar điểm số */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tổng kết điểm</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#005BAC]">{finalScore}/100</div>
                  <Badge className={gradeLevel.color}>{gradeLevel.level}</Badge>
                </div>

                <div className="space-y-2">
                  {sections.map((section) => {
                    const sectionData = evaluation.evaluation[section.id as keyof typeof evaluation.evaluation] as any
                    return (
                      <div key={section.id} className="flex justify-between text-sm">
                        <span>{section.title}:</span>
                        <span className="font-medium">
                          {sectionData.teacherScore || sectionData.selfScore}/{section.maxScore}
                        </span>
                      </div>
                    )
                  })}
                </div>

                <Button onClick={handleSaveGrade} disabled={saving} className="w-full bg-[#005BAC] hover:bg-[#004A8F]">
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? "Đang lưu..." : "Lưu điểm"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thông tin nộp bài</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Trạng thái:</span>
                  <Badge className="bg-blue-100 text-blue-800">
                    {evaluation.evaluation.status === "submitted" ? "Đã nộp" : "Đã chấm"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Ngày nộp:</span>
                  <span>{new Date(evaluation.evaluation.submittedAt).toLocaleDateString("vi-VN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Điểm tự chấm:</span>
                  <span className="font-medium">{evaluation.evaluation.totalSelfScore}/100</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
