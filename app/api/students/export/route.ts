import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { students, format = "csv" } = await request.json()

    if (!students || !Array.isArray(students)) {
      return NextResponse.json({ error: "Students data required" }, { status: 400 })
    }

    if (format === "csv") {
      // Create CSV content
      const csvRows = [
        // Header
        [
          "STT",
          "Mã sinh viên",
          "Họ và tên",
          "Email",
          "Số điện thoại",
          "Lớp",
          "Ngày sinh",
          "Số phiếu",
          "Điểm TB",
          "Xếp loại",
          "Lần nộp cuối",
        ],
        // Data rows
        ...students.map((student: any, index: number) => [
          index + 1,
          student.studentId || "",
          student.fullName || "",
          student.email || "",
          student.phone || "",
          student.classId || "",
          student.dateOfBirth || "",
          student.totalScores || 0,
          student.averageScore || 0,
          getGradeText(student.averageScore || 0),
          student.lastSubmission ? new Date(student.lastSubmission).toLocaleDateString("vi-VN") : "",
        ]),
      ]

      // Convert to CSV string
      const csvContent = csvRows.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")

      // Add BOM for UTF-8 encoding (for Excel compatibility)
      const bom = "\uFEFF"
      const csvWithBom = bom + csvContent

      return new NextResponse(csvWithBom, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="danh-sach-sinh-vien-${new Date().toISOString().split("T")[0]}.csv"`,
        },
      })
    }

    return NextResponse.json({ error: "Unsupported format" }, { status: 400 })
  } catch (error) {
    console.error("Export students error:", error)
    return NextResponse.json({ error: "Export failed" }, { status: 500 })
  }
}

function getGradeText(score: number): string {
  if (score >= 90) return "Xuất sắc"
  if (score >= 80) return "Tốt"
  if (score >= 65) return "Khá"
  if (score >= 50) return "Trung bình"
  if (score >= 35) return "Yếu"
  return "Kém"
}
