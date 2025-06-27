import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    // Mock data for demo
    const mockProfile = {
      uid: userId,
      fullName: userId.includes("giangvien") ? "TS. Trần Thị B" : "Nguyễn Văn A",
      email: userId.includes("giangvien") ? "giangvien@demo.com" : "sinhvien@demo.com",
      role: userId.includes("giangvien") ? "teacher" : "student",
      phone: "0123456789",
      avatar: null,
      ...(userId.includes("student") && {
        studentId: "SV2024001",
        classId: "CNTT2024A",
        dateOfBirth: "2002-01-15",
      }),
      ...(userId.includes("teacher") && {
        department: "Khoa Công nghệ thông tin",
        position: "Tiến sĩ",
      }),
    }

    return NextResponse.json({ success: true, data: mockProfile })
  } catch (error) {
    console.error("Get profile error:", error)
    return NextResponse.json({ error: "Failed to get profile" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId, ...profileData } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    // Simulate update delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In real app, update Firebase
    // await updateDoc(doc(db, 'users', userId), {
    //   ...profileData,
    //   updatedAt: new Date()
    // })

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
    })
  } catch (error) {
    console.error("Update profile error:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
