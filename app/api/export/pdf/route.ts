import { type NextRequest, NextResponse } from "next/server"
import { jsPDF } from "jspdf"

export async function POST(request: NextRequest) {
  try {
    const { scoringData, userData } = await request.json()

    // Create PDF
    const doc = new jsPDF()

    // Set font
    doc.setFont("helvetica")

    // Header
    doc.setFontSize(20)
    doc.text("PHIẾU CHẤM ĐIỂM RÈN LUYỆN", 105, 20, { align: "center" })
    doc.setFontSize(14)
    doc.text("Phân hiệu Học viện Phụ nữ Việt Nam", 105, 30, { align: "center" })

    // Student info
    doc.setFontSize(12)
    doc.text(`Họ và tên: ${userData.fullName}`, 20, 50)
    doc.text(`Mã sinh viên: ${userData.studentId || "N/A"}`, 20, 60)
    doc.text(`Lớp: ${userData.classId || "N/A"}`, 20, 70)
    doc.text(`Học kỳ: ${scoringData.semester} - Năm học: ${scoringData.academicYear}`, 20, 80)

    // Scoring sections
    let yPos = 100
    const sections = [
      { id: "section1", title: "I. Ý thức học tập", maxScore: 20 },
      { id: "section2", title: "II. Chấp hành nội quy", maxScore: 25 },
      { id: "section3", title: "III. Tham gia hoạt động xã hội", maxScore: 20 },
      { id: "section4", title: "IV. Ý thức công dân", maxScore: 25 },
      { id: "section5", title: "V. Tham gia công tác lớp", maxScore: 10 },
    ]

    sections.forEach((section) => {
      const sectionData = scoringData[section.id]
      doc.setFontSize(11)
      doc.text(section.title, 20, yPos)
      doc.text(`Điểm tự đánh giá: ${sectionData.selfScore}/${section.maxScore}`, 20, yPos + 10)

      // Evidence text (wrap if too long)
      const evidence = sectionData.evidence || "Không có minh chứng"
      const splitEvidence = doc.splitTextToSize(evidence, 170)
      doc.text(splitEvidence, 20, yPos + 20)

      yPos += 40 + splitEvidence.length * 5

      // Add new page if needed
      if (yPos > 250) {
        doc.addPage()
        yPos = 20
      }
    })

    // Summary
    doc.setFontSize(12)
    doc.text("TỔNG KẾT ĐIỂM:", 20, yPos + 10)
    doc.text(`Điểm tự đánh giá: ${scoringData.totalSelfScore}/100`, 20, yPos + 25)
    doc.text(`Điểm lớp: ${scoringData.classScore || "--"}/100`, 20, yPos + 35)
    doc.text(`Điểm giảng viên: ${scoringData.teacherScore || "--"}/100`, 20, yPos + 45)
    doc.text(`Điểm cuối cùng: ${scoringData.finalScore || "--"}/100`, 20, yPos + 55)

    // Generate PDF buffer
    const pdfBuffer = doc.output("arraybuffer")

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="phieu-cham-diem-${userData.studentId || "student"}.pdf"`,
      },
    })
  } catch (error) {
    console.error("PDF export error:", error)
    return NextResponse.json({ error: "PDF export failed" }, { status: 500 })
  }
}
