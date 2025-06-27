import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const semester = searchParams.get("semester")
    const academicYear = searchParams.get("academicYear")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    // Mock scoring data
    const mockScores = {
      semester: semester || "1",
      academicYear: academicYear || "2024-2025",
      section1: { selfScore: 18, evidence: "Tham gia đầy đủ các buổi học, hoàn thành bài tập đúng hạn" },
      section2: { selfScore: 23, evidence: "Tuân thủ nghiêm túc nội quy trường, lớp" },
      section3: { selfScore: 17, evidence: "Tham gia hoạt động tình nguyện mùa hè xanh" },
      section4: { selfScore: 22, evidence: "Chấp hành tốt pháp luật, có ý thức công dân tốt" },
      section5: { selfScore: 8, evidence: "Làm lớp trưởng, tổ chức các hoạt động lớp" },
      totalSelfScore: 88,
      classScore: 85,
      teacherScore: 87,
      finalScore: 87,
      status: "graded",
      submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      gradedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    }

    return NextResponse.json({ success: true, data: mockScores })
  } catch (error) {
    console.error("Get scores error:", error)
    return NextResponse.json({ error: "Failed to get scores" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, scoringData, action } = await request.json()

    if (!userId || !scoringData) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 })
    }

    // Simulate save delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const message =
      action === "submit" ? "Phiếu chấm điểm đã được gửi thành công" : "Phiếu chấm điểm đã được lưu thành công"

    return NextResponse.json({
      success: true,
      message,
      data: {
        ...scoringData,
        status: action === "submit" ? "submitted" : "draft",
        submittedAt: action === "submit" ? new Date() : undefined,
      },
    })
  } catch (error) {
    console.error("Save scores error:", error)
    return NextResponse.json({ error: "Failed to save scores" }, { status: 500 })
  }
}
