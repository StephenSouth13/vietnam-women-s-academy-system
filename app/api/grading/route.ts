import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const teacherId = searchParams.get("teacherId")
    const status = searchParams.get("status")

    if (!teacherId) {
      return NextResponse.json({ error: "Teacher ID required" }, { status: 400 })
    }

    // Mock scoring data
    const mockScores = [
      {
        id: "1",
        studentId: "SV2024001",
        studentName: "Nguyễn Văn A",
        classId: "CNTT2024A",
        semester: "1",
        academicYear: "2024-2025",
        totalSelfScore: 88,
        classScore: 85,
        status: "submitted",
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        sections: {
          section1: { selfScore: 18, evidence: "Tham gia đầy đủ các buổi học, hoàn thành bài tập đúng hạn" },
          section2: { selfScore: 23, evidence: "Tuân thủ nghiêm túc nội quy trường, lớp" },
          section3: { selfScore: 17, evidence: "Tham gia hoạt động tình nguyện mùa hè xanh" },
          section4: { selfScore: 22, evidence: "Chấp hành tốt pháp luật, có ý thức công dân tốt" },
          section5: { selfScore: 8, evidence: "Làm lớp trưởng, tổ chức các hoạt động lớp" },
        },
      },
      {
        id: "2",
        studentId: "SV2024002",
        studentName: "Trần Thị B",
        classId: "CNTT2024A",
        semester: "1",
        academicYear: "2024-2025",
        totalSelfScore: 92,
        classScore: 88,
        teacherScore: 90,
        finalScore: 90,
        status: "graded",
        submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        gradedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        sections: {
          section1: { selfScore: 19, evidence: "Học tập chăm chỉ, điểm số cao" },
          section2: { selfScore: 24, evidence: "Không vi phạm nội quy" },
          section3: { selfScore: 18, evidence: "Tích cực tham gia hoạt động xã hội" },
          section4: { selfScore: 23, evidence: "Có ý thức công dân tốt" },
          section5: { selfScore: 8, evidence: "Tham gia ban cán sự lớp" },
        },
      },
      {
        id: "3",
        studentId: "SV2024003",
        studentName: "Lê Văn C",
        classId: "CNTT2024A",
        semester: "1",
        academicYear: "2024-2025",
        totalSelfScore: 75,
        status: "submitted",
        submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        sections: {
          section1: { selfScore: 15, evidence: "Tham gia học đầy đủ" },
          section2: { selfScore: 20, evidence: "Tuân thủ nội quy cơ bản" },
          section3: { selfScore: 12, evidence: "Ít tham gia hoạt động ngoại khóa" },
          section4: { selfScore: 20, evidence: "Chấp hành pháp luật tốt" },
          section5: { selfScore: 8, evidence: "Không đảm nhiệm công tác lớp" },
        },
      },
    ]

    // Filter by status if specified
    const filteredScores =
      status && status !== "all" ? mockScores.filter((score) => score.status === status) : mockScores

    return NextResponse.json({
      success: true,
      data: filteredScores,
    })
  } catch (error) {
    console.error("Get grading data error:", error)
    return NextResponse.json({ error: "Failed to get grading data" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { scoreId, teacherScore, feedback, teacherId } = await request.json()

    if (!scoreId || !teacherScore || !teacherId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (teacherScore < 0 || teacherScore > 100) {
      return NextResponse.json({ error: "Teacher score must be between 0 and 100" }, { status: 400 })
    }

    // Simulate grading delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock successful grading
    const gradedScore = {
      id: scoreId,
      teacherScore,
      feedback: feedback || "",
      finalScore: Math.round((88 + 85 + teacherScore) / 3), // Mock calculation
      status: "graded",
      gradedAt: new Date(),
      gradedBy: teacherId,
    }

    return NextResponse.json({
      success: true,
      message: "Score graded successfully",
      data: gradedScore,
    })
  } catch (error) {
    console.error("Grade score error:", error)
    return NextResponse.json({ error: "Failed to grade score" }, { status: 500 })
  }
}
