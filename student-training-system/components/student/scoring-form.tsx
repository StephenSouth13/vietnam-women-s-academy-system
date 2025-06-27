"use client"

import { useState, useEffect } from "react"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage } from "@/lib/firebase"
import { useAuth } from "@/components/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import type { Scoring, SectionScore } from "@/lib/types"
import { Save, Send, Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

const sections = [
  { id: "section1", title: "Học tập", maxScore: 20 },
  { id: "section2", title: "Chấp hành nội quy", maxScore: 25 },
  { id: "section3", title: "Hoạt động xã hội", maxScore: 20 },
  { id: "section4", title: "Quan hệ công dân", maxScore: 25 },
  { id: "section5", title: "Công tác lớp", maxScore: 10 },
]

export function ScoringForm() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState<string | null>(null)
  const [dataLoaded, setDataLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  const [formData, setFormData] = useState<Scoring>({
    userId: user?.uid || "",
    semester: "HK1",
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
    if (user) {
      setFormData((prev) => ({ ...prev, userId: user.uid }))
      loadExistingData()
    }
  }, [user])

  useEffect(() => {
    calculateTotal()
  }, [formData.section1, formData.section2, formData.section3, formData.section4, formData.section5])

  const loadExistingData = async () => {
    if (!user) {
      console.log("No user found")
      return
    }

    try {
      setHasError(false)
      console.log("Loading data for user:", user.uid)

      // Sử dụng collection đơn giản hơn
      const docId = `${user.uid}_${formData.semester}_${formData.academicYear}`
      const docRef = doc(db, "student_evaluations", docId)

      console.log("Document path:", `student_evaluations/${docId}`)

      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const data = docSnap.data() as Scoring
        console.log("Data loaded successfully:", data)
        setFormData(data)
      } else {
        console.log("No existing evaluation found, using default data")
        // Không có dữ liệu cũ, sử dụng dữ liệu mặc định
      }

      setDataLoaded(true)
    } catch (error: any) {
      console.error("Error loading data:", error)
      setHasError(true)

      // Chỉ hiển thị lỗi nếu không phải lỗi permission hoặc not-found
      if (error.code === "permission-denied") {
        toast({
          title: "Lỗi quyền truy cập",
          description: "Bạn không có quyền truy cập dữ liệu này. Vui lòng liên hệ quản trị viên.",
          variant: "destructive",
        })
      } else if (error.code !== "not-found") {
        toast({
          title: "Lỗi tải dữ liệu",
          description: "Không thể tải dữ liệu. Hệ thống sẽ sử dụng dữ liệu mặc định.",
          variant: "destructive",
        })
      }

      setDataLoaded(true)
    }
  }

  const calculateTotal = () => {
    const total =
      formData.section1.selfScore +
      formData.section2.selfScore +
      formData.section3.selfScore +
      formData.section4.selfScore +
      formData.section5.selfScore

    setFormData((prev) => ({ ...prev, totalSelfScore: total }))
  }

  const updateSection = (sectionId: keyof Scoring, field: keyof SectionScore, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [sectionId]: {
        ...(prev[sectionId] as SectionScore),
        [field]: value,
      },
    }))
  }

  const handleFileUpload = async (sectionId: keyof Scoring, files: FileList) => {
    if (!files.length || !user) return

    setUploading(sectionId)
    const uploadedFiles: string[] = []

    try {
      for (const file of Array.from(files)) {
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "Lỗi",
            description: "File không được vượt quá 5MB",
            variant: "destructive",
          })
          continue
        }

        // Tạo tên file đơn giản hơn
        const fileName = `evaluations/${user.uid}/${sectionId}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`
        const storageRef = ref(storage, fileName)

        await uploadBytes(storageRef, file)
        const downloadURL = await getDownloadURL(storageRef)
        uploadedFiles.push(downloadURL)
      }

      const currentFiles = (formData[sectionId] as SectionScore).files || []
      updateSection(sectionId, "files", [...currentFiles, ...uploadedFiles])

      toast({
        title: "Thành công",
        description: `Đã tải lên ${uploadedFiles.length} file`,
      })
    } catch (error: any) {
      console.error("Upload error:", error)
      toast({
        title: "Lỗi",
        description: "Không thể tải file lên. Vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setUploading(null)
    }
  }

  const saveDraft = async () => {
    if (!user) return

    setLoading(true)
    try {
      const docId = `${user.uid}_${formData.semester}_${formData.academicYear}`
      const docRef = doc(db, "student_evaluations", docId)

      const dataToSave = {
        ...formData,
        userId: user.uid,
        status: "draft",
        updatedAt: new Date().toISOString(),
        createdAt: formData.createdAt || new Date().toISOString(),
      }

      await setDoc(docRef, dataToSave, { merge: true })

      toast({
        title: "Đã lưu nháp",
        description: "Phiếu chấm điểm đã được lưu tạm thời",
      })
    } catch (error: any) {
      console.error("Save draft error:", error)
      toast({
        title: "Lỗi",
        description: "Không thể lưu nháp. Vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const submitForm = async () => {
    if (!user) return

    // Kiểm tra dữ liệu trước khi gửi
    if (formData.totalSelfScore === 0) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền ít nhất một mục điểm trước khi gửi",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const docId = `${user.uid}_${formData.semester}_${formData.academicYear}`
      const docRef = doc(db, "student_evaluations", docId)

      const dataToSave = {
        ...formData,
        userId: user.uid,
        status: "submitted",
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdAt: formData.createdAt || new Date().toISOString(),
      }

      await setDoc(docRef, dataToSave, { merge: true })

      toast({
        title: "Đã gửi phiếu",
        description: "Phiếu chấm điểm đã được gửi thành công",
      })

      // Cập nhật trạng thái local
      setFormData((prev) => ({ ...prev, status: "submitted" }))
    } catch (error: any) {
      console.error("Submit form error:", error)
      toast({
        title: "Lỗi",
        description: "Không thể gửi phiếu. Vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const renderSectionForm = (section: (typeof sections)[0]) => {
    const sectionData = formData[section.id as keyof Scoring] as SectionScore

    return (
      <Card>
        <CardHeader>
          <CardTitle>{section.title}</CardTitle>
          <CardDescription>Điểm tối đa: {section.maxScore}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor={`${section.id}-score`}>Điểm tự chấm</Label>
            <Input
              id={`${section.id}-score`}
              type="number"
              min="0"
              max={section.maxScore}
              value={sectionData.selfScore}
              onChange={(e) =>
                updateSection(
                  section.id as keyof Scoring,
                  "selfScore",
                  Math.min(Number.parseInt(e.target.value) || 0, section.maxScore),
                )
              }
              disabled={formData.status === "submitted"}
            />
          </div>

          <div>
            <Label htmlFor={`${section.id}-evidence`}>Minh chứng</Label>
            <Textarea
              id={`${section.id}-evidence`}
              placeholder="Mô tả chi tiết minh chứng..."
              value={sectionData.evidence}
              onChange={(e) => updateSection(section.id as keyof Scoring, "evidence", e.target.value)}
              rows={4}
              disabled={formData.status === "submitted"}
            />
          </div>

          <div>
            <Label>Tải file minh chứng</Label>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => e.target.files && handleFileUpload(section.id as keyof Scoring, e.target.files)}
                disabled={uploading === section.id || formData.status === "submitted"}
              />
              {uploading === section.id && <Loader2 className="h-4 w-4 animate-spin" />}
            </div>
            {sectionData.files && sectionData.files.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-muted-foreground">Đã tải lên {sectionData.files.length} file</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Hiển thị loading khi chưa tải xong dữ liệu
  if (!dataLoaded) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mr-2" />
              <span>Đang tải dữ liệu...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {hasError && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Không thể tải dữ liệu từ hệ thống. Bạn có thể tiếp tục điền phiếu mới.</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Phiếu Chấm Điểm Rèn Luyện</CardTitle>
          <CardDescription>
            Học kỳ {formData.semester} - Năm học {formData.academicYear}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="semester">Học kỳ</Label>
              <select
                id="semester"
                className="w-full p-2 border rounded-md"
                value={formData.semester}
                onChange={(e) => setFormData((prev) => ({ ...prev, semester: e.target.value }))}
                disabled={formData.status === "submitted"}
              >
                <option value="HK1">Học kỳ 1</option>
                <option value="HK2">Học kỳ 2</option>
                <option value="HK3">Học kỳ 3</option>
              </select>
            </div>
            <div>
              <Label htmlFor="academicYear">Năm học</Label>
              <Input
                id="academicYear"
                value={formData.academicYear}
                onChange={(e) => setFormData((prev) => ({ ...prev, academicYear: e.target.value }))}
                disabled={formData.status === "submitted"}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="section1" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          {sections.map((section) => (
            <TabsTrigger key={section.id} value={section.id}>
              {section.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {sections.map((section) => (
          <TabsContent key={section.id} value={section.id}>
            {renderSectionForm(section)}
          </TabsContent>
        ))}
      </Tabs>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold">Tổng điểm tự chấm: {formData.totalSelfScore}/100</p>
              <p className="text-sm text-muted-foreground">
                Trạng thái:{" "}
                <span
                  className={`font-medium ${
                    formData.status === "draft"
                      ? "text-yellow-600"
                      : formData.status === "submitted"
                        ? "text-blue-600"
                        : "text-green-600"
                  }`}
                >
                  {formData.status === "draft" ? "Nháp" : formData.status === "submitted" ? "Đã gửi" : "Đã chấm"}
                </span>
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={saveDraft} disabled={loading || formData.status === "submitted"}>
                <Save className="mr-2 h-4 w-4" />
                Lưu nháp
              </Button>
              <Button
                onClick={submitForm}
                disabled={loading || formData.status === "submitted"}
                className="bg-[#005BAC] hover:bg-[#004A8F]"
              >
                <Send className="mr-2 h-4 w-4" />
                {formData.status === "submitted" ? "Đã gửi" : "Gửi phiếu"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
