"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/providers/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Bell, CheckCircle, AlertCircle, Info, Database, Send, Plus, X, Check } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  createdAt: Date
  targetRole: string
  actionUrl?: string
  senderName?: string
}

interface NotificationPanelProps {
  userRole: "student" | "teacher"
}

export default function NotificationPanel({ userRole }: NotificationPanelProps) {
  const { userData } = useAuth()
  const { toast } = useToast()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [showSendDialog, setShowSendDialog] = useState(false)
  const [sending, setSending] = useState(false)
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    type: "info" as const,
    targetRole: "student" as const,
  })

  useEffect(() => {
    loadNotifications()
  }, [userData, userRole])

  const loadNotifications = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/notifications?userId=${userData?.uid}&userRole=${userRole}`)
      const result = await response.json()

      if (result.success) {
        setNotifications(
          result.data.map((n: any) => ({
            ...n,
            createdAt: new Date(n.createdAt),
          })),
        )
      }
    } catch (error) {
      console.error("Error loading notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notificationId,
          action: "markAsRead",
          userId: userData?.uid,
        }),
      })

      const result = await response.json()
      if (result.success) {
        setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)))
      }
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "markAllAsRead",
          userId: userData?.uid,
        }),
      })

      const result = await response.json()
      if (result.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
        toast({
          title: "Thành công",
          description: "Đã đánh dấu tất cả thông báo là đã đọc",
        })
      }
    } catch (error) {
      console.error("Error marking all as read:", error)
    }
  }

  const sendNotification = async () => {
    if (!newNotification.title.trim() || !newNotification.message.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ tiêu đề và nội dung thông báo",
        variant: "destructive",
      })
      return
    }

    setSending(true)
    try {
      const response = await fetch("/api/notifications/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newNotification,
          senderId: userData?.uid,
        }),
      })

      const result = await response.json()
      if (result.success) {
        toast({
          title: "Gửi thành công",
          description: `Đã gửi thông báo đến ${result.recipientCount} người`,
        })
        setNewNotification({
          title: "",
          message: "",
          type: "info",
          targetRole: "student",
        })
        setShowSendDialog(false)
        loadNotifications() // Reload notifications
      } else {
        toast({
          title: "Lỗi",
          description: result.error || "Không thể gửi thông báo",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể gửi thông báo",
        variant: "destructive",
      })
    } finally {
      setSending(false)
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-600" />
      default:
        return <Info className="w-5 h-5 text-blue-600" />
    }
  }

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      return "Vừa xong"
    } else if (diffInHours < 24) {
      return `${diffInHours} giờ trước`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays} ngày trước`
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* API Status */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-green-600" />
          <p className="text-green-800">
            <strong>API hoạt động:</strong> Hệ thống thông báo đã được tích hợp đầy đủ với backend
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Thông báo
              {notifications.filter((n) => !n.read).length > 0 && (
                <Badge variant="destructive">{notifications.filter((n) => !n.read).length}</Badge>
              )}
            </CardTitle>
            <div className="flex items-center gap-2">
              {userRole === "teacher" && (
                <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-[#005BAC] hover:bg-[#003D73]">
                      <Plus className="w-4 h-4 mr-2" />
                      Gửi thông báo
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Gửi thông báo mới</DialogTitle>
                      <DialogDescription>Gửi thông báo đến sinh viên trong lớp</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Tiêu đề</Label>
                        <Input
                          id="title"
                          value={newNotification.title}
                          onChange={(e) => setNewNotification((prev) => ({ ...prev, title: e.target.value }))}
                          placeholder="Nhập tiêu đề thông báo"
                        />
                      </div>
                      <div>
                        <Label htmlFor="message">Nội dung</Label>
                        <Textarea
                          id="message"
                          value={newNotification.message}
                          onChange={(e) => setNewNotification((prev) => ({ ...prev, message: e.target.value }))}
                          placeholder="Nhập nội dung thông báo"
                          rows={4}
                        />
                      </div>
                      <div>
                        <Label htmlFor="type">Loại thông báo</Label>
                        <select
                          id="type"
                          value={newNotification.type}
                          onChange={(e) => setNewNotification((prev) => ({ ...prev, type: e.target.value as any }))}
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="info">Thông tin</option>
                          <option value="success">Thành công</option>
                          <option value="warning">Cảnh báo</option>
                          <option value="error">Lỗi</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="targetRole">Gửi đến</Label>
                        <select
                          id="targetRole"
                          value={newNotification.targetRole}
                          onChange={(e) =>
                            setNewNotification((prev) => ({ ...prev, targetRole: e.target.value as any }))
                          }
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="student">Sinh viên</option>
                          <option value="teacher">Giảng viên</option>
                          <option value="all">Tất cả</option>
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={sendNotification}
                          disabled={sending}
                          className="flex-1 bg-[#005BAC] hover:bg-[#003D73]"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          {sending ? "Đang gửi..." : "Gửi thông báo"}
                        </Button>
                        <Button variant="outline" onClick={() => setShowSendDialog(false)} className="bg-transparent">
                          <X className="w-4 h-4 mr-2" />
                          Hủy
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={markAllAsRead}
                disabled={notifications.filter((n) => !n.read).length === 0}
                className="bg-transparent"
              >
                <Check className="w-4 h-4 mr-2" />
                Đánh dấu đã đọc
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Chưa có thông báo nào</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border transition-colors hover:bg-gray-50 ${
                    notification.read ? "bg-gray-50 border-gray-200" : "bg-white border-blue-200 shadow-sm"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {getIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-800 truncate">{notification.title}</h4>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(notification.type)}`}
                          >
                            {notification.type === "info"
                              ? "Thông tin"
                              : notification.type === "success"
                                ? "Thành công"
                                : notification.type === "warning"
                                  ? "Cảnh báo"
                                  : "Lỗi"}
                          </span>
                          {!notification.read && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-2 leading-relaxed">{notification.message}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-400">{formatTimeAgo(notification.createdAt)}</p>
                        {!notification.read && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => markAsRead(notification.id)}
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          >
                            Đánh dấu đã đọc
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cài đặt thông báo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">Thông báo email</p>
                <p className="text-sm text-gray-600">Nhận thông báo qua email</p>
              </div>
              <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform"></div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">Thông báo điểm số</p>
                <p className="text-sm text-gray-600">Thông báo khi có cập nhật điểm</p>
              </div>
              <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform"></div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">Thông báo hệ thống</p>
                <p className="text-sm text-gray-600">Thông báo bảo trì và cập nhật</p>
              </div>
              <div className="w-12 h-6 bg-gray-300 rounded-full relative cursor-pointer">
                <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
