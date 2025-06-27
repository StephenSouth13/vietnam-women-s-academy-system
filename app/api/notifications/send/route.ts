import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { title, message, type = "info", targetRole, targetUsers = [], senderId, classId } = await request.json()

    if (!title || !message || !senderId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate notification type
    const validTypes = ["info", "success", "warning", "error"]
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: "Invalid notification type" }, { status: 400 })
    }

    // Simulate sending notification
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock notification creation
    const notification = {
      id: Date.now().toString(),
      title,
      message,
      type,
      targetRole: targetRole || "all",
      targetUsers,
      classId,
      senderId,
      senderName: "Giảng viên", // In real app, get from user data
      createdAt: new Date(),
      read: false,
      delivered: true,
    }

    // In real implementation, you would:
    // 1. Save to database
    // 2. Send push notifications
    // 3. Send emails if configured
    // 4. Update notification counters

    return NextResponse.json({
      success: true,
      message: "Notification sent successfully",
      data: notification,
      recipientCount: targetUsers.length || (targetRole === "student" ? 45 : 5), // Mock count
    })
  } catch (error) {
    console.error("Send notification error:", error)
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 })
  }
}
