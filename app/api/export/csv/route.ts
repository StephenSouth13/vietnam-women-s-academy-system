import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { scoringData, userData } = await request.json()

    // Create CSV content
    const csvRows = [
      // Header
      ["Thông tin", "Giá trị"],
      ["Họ và tên", userData.fullName],
      ["Mã sinh viên", userData.studentId || "N/A"],
      ["Lớp", userData.classId || "N/A"],
      ["Học kỳ", scoringData.semester],
      ["Năm học", scoringData.academicYear],
      [""],
      ["Mục đánh giá", "Điểm tự đánh giá", "Điểm tối đa", "Minh chứng"],
      ["I. Ý thức học tập", scoringData.section1.selfScore, "20", scoringData.section1.evidence],
      ["II. Chấp hành nội quy", scoringData.section2.selfScore, "25", scoringData.section2.evidence],
      ["III. Tham gia hoạt động xã hội", scoringData.section3.selfScore, "20", scoringData.section3.evidence],
      ["IV. Ý thức công dân", scoringData.section4.selfScore, "25", scoringData.section4.evidence],
      ["V. Tham gia công tác lớp", scoringData.section5.selfScore, "10", scoringData.section5.evidence],
      [""],
      ["Tổng kết", "Điểm"],
      ["Điểm tự đánh giá", scoringData.totalSelfScore],
      ["Điểm lớp", scoringData.classScore || ""],
      ["Điểm giảng viên", scoringData.teacherScore || ""],
      ["Điểm cuối cùng", scoringData.finalScore || ""],
      [
        "Trạng thái",
        scoringData.status === "draft" ? "Bản nháp" : scoringData.status === "submitted" ? "Đã gửi" : "Đã chấm điểm",
      ],
    ]

    // Convert to CSV string
    const csvContent = csvRows.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")

    // Add BOM for UTF-8 encoding (for Excel compatibility)
    const bom = "\uFEFF"
    const csvWithBom = bom + csvContent

    return new NextResponse(csvWithBom, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="phieu-cham-diem-${userData.studentId || "student"}.csv"`,
      },
    })
  } catch (error) {
    console.error("CSV export error:", error)
    return NextResponse.json({ error: "CSV export failed" }, { status: 500 })
  }
}
