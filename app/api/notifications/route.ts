import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const userRole = searchParams.get("userRole")
    const unreadOnly = searchParams.get("unreadOnly") === "true"

    if (!userId || !userRole) {
      return NextResponse.json({ error: "User ID and role required" }, { status: 400 })
    }

    // Mock notifications based on role
    const mockNotifications =
      userRole === "teacher"
        ? [
            {
              id: "1",
              title: "Phiếu chấm điểm mới",
              message: "Sinh viên Nguyễn Văn A đã gửi phiếu chấm điểm học kỳ I năm học 2024-2025",
              type: "info",
              read: false,
              createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
              targetRole: "teacher",
              actionUrl: "/teacher/dashboard?tab=grading",
            },
            {
              id: "2",
              title: "Phiếu chấm điểm mới",
              message: "Sinh viên Trần Thị B đã gửi phiếu chấm điểm học kỳ I năm học 2024-2025",
              type: "info",
              read: false,
              createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
              targetRole: "teacher",
              actionUrl: "/teacher/dashboard?tab=grading",
            },
            {
              id: "3",
              title: "Hệ thống bảo trì",
              message: "Hệ thống sẽ được bảo trì vào 23:00 ngày 28/06/2025",
              type: "warning",
              read: true,
              createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
              targetRole: "teacher",
            },
            {
              id: "4",
              title: "Cập nhật thành công",
              message: "Đã cập nhật điểm rèn luyện cho 15 sinh viên lớp CNTT2024A",
              type: "success",
              read: true,
              createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
              targetRole: "teacher",
            },
          ]
        : [
            {
              id: "5",
              title: "Phiếu đã được duyệt",
              message: "Phiếu chấm điểm rèn luyện học kỳ I của bạn đã được giảng viên duyệt với điểm 87/100",
              type: "success",
              read: false,
              createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
              targetRole: "student",
              actionUrl: "/student/dashboard?tab=scoring",
            },
            {
              id: "6",
              title: "Nhắc nhở nộp phiếu",
              message: "Hạn nộp phiếu chấm điểm rèn luyện học kỳ II là ngày 30/06/2025",
              type: "warning",
              read: false,
              createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
              targetRole: "student",
              actionUrl: "/student/dashboard?tab=scoring",
            },
            {
              id: "7",
              title: "Thông báo từ lớp",
              message: "Lớp CNTT2024A sẽ có buổi họp lớp vào 14:00 ngày 29/06/2025",
              type: "info",
              read: true,
              createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
              targetRole: "student",
            },
          ]

    // Filter unread only if requested
    const filteredNotifications = unreadOnly ? mockNotifications.filter((n) => !n.read) : mockNotifications

    return NextResponse.json({
      success: true,
      data: filteredNotifications,
      unreadCount: mockNotifications.filter((n) => !n.read).length,
    })
  } catch (error) {
    console.error("Get notifications error:", error)
    return NextResponse.json({ error: "Failed to get notifications" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { notificationId, action, userId } = await request.json()

    if (!notificationId || !action || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Simulate update delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (action === "markAsRead") {
      return NextResponse.json({
        success: true,
        message: "Notification marked as read",
      })
    }

    if (action === "markAllAsRead") {
      return NextResponse.json({
        success: true,
        message: "All notifications marked as read",
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Update notification error:", error)
    return NextResponse.json({ error: "Failed to update notification" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, message, type, targetRole, targetUsers, senderId } = await request.json()

    if (!title || !message || !type || !targetRole || !senderId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Simulate sending notification
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const notification = {
      id: Date.now().toString(),
      title,
      message,
      type,
      targetRole,
      targetUsers: targetUsers || [],
      senderId,
      createdAt: new Date(),
      read: false,
    }

    return NextResponse.json({
      success: true,
      message: "Notification sent successfully",
      data: notification,
    })
  } catch (error) {
    console.error("Send notification error:", error)
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 })
  }
}
