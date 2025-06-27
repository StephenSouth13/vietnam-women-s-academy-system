import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const teacherId = searchParams.get("teacherId")
    const classId = searchParams.get("classId")

    if (!teacherId) {
      return NextResponse.json({ error: "Teacher ID required" }, { status: 400 })
    }

    // Mock students data
    const mockStudents = [
      {
        id: "1",
        studentId: "SV2024001",
        fullName: "Nguyễn Văn A",
        email: "nguyenvana@student.edu.vn",
        phone: "0123456789",
        classId: "CNTT2024A",
        dateOfBirth: "2002-01-15",
        status: "active",
        totalScores: 3,
        averageScore: 87,
        lastSubmission: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
      {
        id: "2",
        studentId: "SV2024002",
        fullName: "Trần Thị B",
        email: "tranthib@student.edu.vn",
        phone: "0987654321",
        classId: "CNTT2024A",
        dateOfBirth: "2002-03-20",
        status: "active",
        totalScores: 3,
        averageScore: 92,
        lastSubmission: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
      },
      {
        id: "3",
        studentId: "SV2024003",
        fullName: "Lê Văn C",
        email: "levanc@student.edu.vn",
        classId: "CNTT2024A",
        status: "active",
        totalScores: 2,
        averageScore: 75,
        lastSubmission: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      },
      {
        id: "4",
        studentId: "SV2024004",
        fullName: "Phạm Thị D",
        email: "phamthid@student.edu.vn",
        phone: "0369852147",
        classId: "CNTT2024B",
        dateOfBirth: "2002-07-10",
        status: "active",
        totalScores: 3,
        averageScore: 89,
        lastSubmission: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      },
    ]

    // Filter by class if specified
    const filteredStudents = classId ? mockStudents.filter((student) => student.classId === classId) : mockStudents

    return NextResponse.json({
      success: true,
      data: filteredStudents,
      total: filteredStudents.length,
    })
  } catch (error) {
    console.error("Get students error:", error)
    return NextResponse.json({ error: "Failed to get students" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, classId, teacherId } = await request.json()

    if (!email || !classId || !teacherId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Simulate adding student to class
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if student already exists (mock)
    const existingEmails = [
      "nguyenvana@student.edu.vn",
      "tranthib@student.edu.vn",
      "levanc@student.edu.vn",
      "phamthid@student.edu.vn",
    ]

    if (existingEmails.includes(email)) {
      return NextResponse.json({ error: "Student already exists in system" }, { status: 409 })
    }

    // Mock successful addition
    const newStudent = {
      id: Date.now().toString(),
      studentId: `SV${Date.now()}`,
      fullName: email.split("@")[0],
      email,
      classId,
      status: "active",
      totalScores: 0,
      averageScore: 0,
      createdAt: new Date(),
    }

    return NextResponse.json({
      success: true,
      message: "Student added successfully",
      data: newStudent,
    })
  } catch (error) {
    console.error("Add student error:", error)
    return NextResponse.json({ error: "Failed to add student" }, { status: 500 })
  }
}
