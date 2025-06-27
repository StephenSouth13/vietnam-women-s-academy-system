"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/providers/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Save, FileText, Send, Download, FileSpreadsheet, Database, AlertCircle } from "lucide-react"
import FileUpload from "@/components/shared/file-upload"

interface ScoringData {
  semester: string
  academicYear: string
  section1: { selfScore: number; evidence: string; files?: string[] }
  section2: { selfScore: number; evidence: string; files?: string[] }
  section3: { selfScore: number; evidence: string; files?: string[] }
  section4: { selfScore: number; evidence: string; files?: string[] }
  section5: { selfScore: number; evidence: string; files?: string[] }
  totalSelfScore: number
  classScore?: number
  teacherScore?: number
  finalScore?: number
  status: "draft" | "submitted" | "graded"
  submittedAt?: Date
  gradedAt?: Date
}

const scoringSections = [
  {
    id: "section1",
    title: "I. Ý thức học tập",
    maxScore: 20,
    description: "Đánh giá về thái độ học tập, tham gia lớp học, hoàn thành bài tập",
  },
  {
    id: "section2",
    title: "II. Chấp hành nội quy",
    maxScore: 25,
    description: "Tuân thủ nội quy trường, lớp, ký túc xá và các quy định khác",
  },
  {
    id: "section3",
    title: "III. Tham gia hoạt động xã hội",
    maxScore: 20,
    description: "Tham gia các hoạt động tình nguyện, cộng đồng, xã hội",
  },
  {
    id: "section4",
    title: "IV. Ý thức công dân",
    maxScore: 25,
    description: "Ý thức chấp hành pháp luật, đạo đức xã hội",
  },
  {
    id: "section5",
    title: "V. Tham gia công tác lớp hoặc thành tích đặc biệt",
    maxScore: 10,
    description: "Đảm nhiệm công tác lớp, đoàn, hội hoặc có thành tích đặc biệt",
  },
]

export default function ScoringForm() {
  const { userData } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [scoringData, setScoringData] = useState<ScoringData>({
    semester: "1",
    academicYear: "2024-2025",
    section1: { selfScore: 0, evidence: "", files: [] },
    section2: { selfScore: 0, evidence: "", files: [] },
    section3: { selfScore: 0, evidence: "", files: [] },
    section4: { selfScore: 0, evidence: "", files: [] },
    section5: { selfScore: 0, evidence: "", files: [] },
    totalSelfScore: 0,
    status: "draft",
  })

  useEffect(() => {
    loadScoringData()
  }, [userData])

  useEffect(() => {
    // Calculate total self score
    const total = Object.values(scoringData)
      .filter((item) => typeof item === "object" && "selfScore" in item)
      .reduce((sum, section: any) => sum + (section.selfScore || 0), 0)

    setScoringData((prev) => ({ ...prev, totalSelfScore: total }))
  }, [
    scoringData.section1.selfScore,
    scoringData.section2.selfScore,
    scoringData.section3.selfScore,
    scoringData.section4.selfScore,
    scoringData.section5.selfScore,
  ])

  const loadScoringData = async () => {
    if (!userData?.uid) return

    setLoading(true)
    try {
      const response = await fetch(
        `/api/scores?userId=${userData.uid}&semester=${scoringData.semester}&academicYear=${scoringData.academicYear}`,
      )
      const result = await response.json()

      if (result.success && userData.email === "sinhvien@demo.com") {
        setScoringData(result.data)
      }
    } catch (error) {
      console.error("Error loading scoring data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSectionChange = (sectionId: string, field: "selfScore" | "evidence", value: string | number) => {
    setScoringData((prev) => ({
      ...prev,
      [sectionId]: {
        ...(prev[sectionId as keyof ScoringData] as any),
        [field]: value,
      },
    }))
  }

  const handleFileUpload = (sectionId: string, fileUrl: string) => {
    setScoringData((prev) => ({
      ...prev,
      [sectionId]: {
        ...(prev[sectionId as keyof ScoringData] as any),
        files: fileUrl ? [fileUrl] : [],
      },
    }))
  }

  const saveDraft = async () => {
    if (!userData?.uid) return

    setSaving(true)
    try {
      const response = await fetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userData.uid,
          scoringData,
          action: "save",
        }),
      })

      const result = await response.json()
      if (result.success) {
        toast({
          title: "Lưu thành công",
          description: result.message,
        })
        setScoringData(result.data)
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể lưu phiếu chấm điểm",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const submitScore = async () => {
    if (!userData?.uid) return

    // Validate that all sections have scores
    const sections = [
      scoringData.section1,
      scoringData.section2,
      scoringData.section3,
      scoringData.section4,
      scoringData.section5,
    ]
    const hasEmptyScores = sections.some((section) => section.selfScore === 0)

    if (hasEmptyScores) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền điểm cho tất cả các mục",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      const response = await fetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userData.uid,
          scoringData,
          action: "submit",
        }),
      })

      const result = await response.json()
      if (result.success) {
        toast({
          title: "Gửi thành công",
          description: result.message,
        })
        setScoringData(result.data)
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể gửi phiếu chấm điểm",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const exportPDF = async () => {
    setExporting(true)
    try {
      const response = await fetch("/api/export/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scoringData, userData }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `phieu-cham-diem-${userData.studentId || "student"}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        toast({
          title: "Xuất PDF thành công",
          description: "File PDF đã được tải xuống",
        })
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xuất file PDF",
        variant: "destructive",
      })
    } finally {
      setExporting(false)
    }
  }

  const exportCSV = async () => {
    setExporting(true)
    try {
      const response = await fetch("/api/export/csv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scoringData, userData }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `phieu-cham-diem-${userData.studentId || "student"}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        toast({
          title: "Xuất CSV thành công",
          description: "File CSV đã được tải xuống",
        })
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xuất file CSV",
        variant: "destructive",
      })
    } finally {
      setExporting(false)
    }
  }

  const getGradeText = (score: number) => {
    if (score >= 90) return "Xuất sắc"
    if (score >= 80) return "Tốt"
    if (score >= 65) return "Khá"
    if (score >= 50) return "Trung bình"
    if (score >= 35) return "Yếu"
    return "Kém"
  }

  const getGradeColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-blue-600"
    if (score >= 65) return "text-yellow-600"
    if (score >= 50) return "text-orange-600"
    return "text-red-600"
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
      {/* API Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-blue-600" />
          <p className="text-blue-800">
            <strong>Hệ thống API hoàn chỉnh:</strong> Upload file, xuất PDF/CSV, lưu dữ liệu qua Next.js API Routes
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Phiếu chấm điểm rèn luyện
          </CardTitle>
          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              <div>
                <Label htmlFor="semester">Học kỳ</Label>
                <Select
                  value={scoringData.semester}
                  onValueChange={(value) => setScoringData((prev) => ({ ...prev, semester: value }))}
                  disabled={scoringData.status !== "draft"}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Học kỳ I</SelectItem>
                    <SelectItem value="2">Học kỳ II</SelectItem>
                    <SelectItem value="3">Học kỳ hè</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="academicYear">Năm học</Label>
                <Select
                  value={scoringData.academicYear}
                  onValueChange={(value) => setScoringData((prev) => ({ ...prev, academicYear: value }))}
                  disabled={scoringData.status !== "draft"}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024-2025">2024-2025</SelectItem>
                    <SelectItem value="2023-2024">2023-2024</SelectItem>
                    <SelectItem value="2022-2023">2022-2023</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  scoringData.status === "draft"
                    ? "bg-yellow-100 text-yellow-800"
                    : scoringData.status === "submitted"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                }`}
              >
                {scoringData.status === "draft"
                  ? "Bản nháp"
                  : scoringData.status === "submitted"
                    ? "Đã gửi"
                    : "Đã chấm điểm"}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {scoringSections.map((section) => (
            <div key={section.id} className="border rounded-lg p-4">
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800">{section.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{section.description}</p>
                <p className="text-sm font-medium text-blue-600">Điểm tối đa: {section.maxScore}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`${section.id}-score`}>Điểm tự đánh giá</Label>
                  <Input
                    id={`${section.id}-score`}
                    type="number"
                    min="0"
                    max={section.maxScore}
                    value={(scoringData[section.id as keyof ScoringData] as any)?.selfScore || 0}
                    onChange={(e) => handleSectionChange(section.id, "selfScore", Number.parseInt(e.target.value) || 0)}
                    disabled={scoringData.status !== "draft"}
                    className="mt-1"
                  />
                  {(scoringData[section.id as keyof ScoringData] as any)?.selfScore > section.maxScore && (
                    <p className="text-xs text-red-600 mt-1">Điểm không được vượt quá {section.maxScore}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor={`${section.id}-evidence`}>Minh chứng</Label>
                  <Textarea
                    id={`${section.id}-evidence`}
                    value={(scoringData[section.id as keyof ScoringData] as any)?.evidence || ""}
                    onChange={(e) => handleSectionChange(section.id, "evidence", e.target.value)}
                    disabled={scoringData.status !== "draft"}
                    placeholder="Mô tả chi tiết các hoạt động, thành tích..."
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </div>

              {/* File Upload */}
              {scoringData.status === "draft" && (
                <div className="mt-4">
                  <Label>Tài liệu minh chứng</Label>
                  <div className="mt-2">
                    <FileUpload
                      type="evidence"
                      userId={userData?.uid || ""}
                      onUpload={(url) => handleFileUpload(section.id, url)}
                      currentFile={(scoringData[section.id as keyof ScoringData] as any)?.files?.[0]}
                      accept="image/*,application/pdf"
                      maxSize={5}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Summary */}
          <div className="border-t pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Điểm tự đánh giá</p>
                <p className="text-2xl font-bold text-blue-600">{scoringData.totalSelfScore}</p>
                <p className="text-xs text-gray-500">/ 100 điểm</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Điểm tập thể lớp</p>
                <p className="text-2xl font-bold text-green-600">{scoringData.classScore || "--"}</p>
                <p className="text-xs text-gray-500">/ 100 điểm</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Điểm giảng viên</p>
                <p className="text-2xl font-bold text-purple-600">{scoringData.teacherScore || "--"}</p>
                <p className="text-xs text-gray-500">/ 100 điểm</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Điểm cuối cùng</p>
                <p
                  className={`text-2xl font-bold ${scoringData.finalScore ? getGradeColor(scoringData.finalScore) : "text-orange-600"}`}
                >
                  {scoringData.finalScore || "--"}
                </p>
                {scoringData.finalScore && (
                  <p className={`text-sm font-medium mt-1 ${getGradeColor(scoringData.finalScore)}`}>
                    {getGradeText(scoringData.finalScore)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Export Buttons */}
          <div className="flex gap-4 pt-4 border-t">
            <Button
              onClick={exportPDF}
              disabled={exporting}
              variant="outline"
              className="flex items-center gap-2 bg-transparent"
            >
              <Download className="w-4 h-4" />
              {exporting ? "Đang xuất..." : "Xuất PDF"}
            </Button>
            <Button
              onClick={exportCSV}
              disabled={exporting}
              variant="outline"
              className="flex items-center gap-2 bg-transparent"
            >
              <FileSpreadsheet className="w-4 h-4" />
              {exporting ? "Đang xuất..." : "Xuất CSV"}
            </Button>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            {scoringData.status === "draft" && (
              <>
                <Button
                  onClick={saveDraft}
                  disabled={saving}
                  variant="outline"
                  className="flex items-center gap-2 bg-transparent"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Đang lưu..." : "Lưu nháp"}
                </Button>
                <Button
                  onClick={submitScore}
                  disabled={saving || scoringData.totalSelfScore === 0}
                  className="flex items-center gap-2 bg-[#005BAC] hover:bg-[#003D73]"
                >
                  <Send className="w-4 h-4" />
                  {saving ? "Đang gửi..." : "Gửi phiếu chấm điểm"}
                </Button>
              </>
            )}
            {scoringData.status === "submitted" && (
              <div className="flex items-center gap-2 text-blue-600">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">Phiếu đã được gửi, đang chờ giảng viên chấm điểm</span>
              </div>
            )}
            {scoringData.status === "graded" && (
              <div className="flex items-center gap-2 text-green-600">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">Phiếu đã được chấm điểm hoàn tất</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
