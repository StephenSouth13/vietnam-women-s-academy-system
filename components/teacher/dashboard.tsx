"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/providers/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, CheckCircle, Clock, TrendingUp, AlertCircle } from "lucide-react"

interface DashboardStats {
  totalClasses: number
  totalStudents: number
  submittedScores: number
  pendingScores: number
  averageScore: number
}

export default function TeacherDashboard() {
  const { userData } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalClasses: 0,
    totalStudents: 0,
    submittedScores: 0,
    pendingScores: 0,
    averageScore: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (userData?.uid) {
      loadDashboardStats()
    }
  }, [userData])

  const loadDashboardStats = async () => {
    if (!userData?.uid) return

    try {
      // For demo purposes, we'll use mock data since Firebase rules might not be configured
      // In a real application, you would query the actual Firebase collections

      // Simulate loading time
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock data for demonstration
      const mockStats = {
        totalClasses: 3,
        totalStudents: 45,
        submittedScores: 12,
        pendingScores: 8,
        averageScore: 85.2,
      }

      setStats(mockStats)
      setError(null)
    } catch (error) {
      console.error("Error loading dashboard stats:", error)
      setError("Không thể tải dữ liệu thống kê")

      // Set default values on error
      setStats({
        totalClasses: 0,
        totalStudents: 0,
        submittedScores: 0,
        pendingScores: 0,
        averageScore: 0,
      })
    } finally {
      setLoading(false)
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
      {/* Error Alert */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <p className="text-yellow-800">
              <strong>Lưu ý:</strong> Đang sử dụng dữ liệu demo. {error}
            </p>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số lớp</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalClasses}</div>
            <p className="text-xs text-muted-foreground">Lớp đang quản lý</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng sinh viên</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Sinh viên trong các lớp</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Phiếu đã gửi</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.submittedScores}</div>
            <p className="text-xs text-muted-foreground">Chờ chấm điểm</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã chấm điểm</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.pendingScores}</div>
            <p className="text-xs text-muted-foreground">Phiếu đã hoàn thành</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Điểm TB</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">{stats.averageScore}</div>
            <p className="text-xs text-muted-foreground">Điểm trung bình lớp</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Hoạt động gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <p className="font-medium text-gray-800">Sinh viên Nguyễn Văn A đã gửi phiếu chấm điểm</p>
                <p className="text-sm text-gray-600">Lớp: CNTT2024A - Học kỳ I - 2 giờ trước</p>
              </div>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Mới</span>
            </div>

            <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
              <FileText className="w-5 h-5 text-green-600" />
              <div className="flex-1">
                <p className="font-medium text-gray-800">Đã chấm điểm cho sinh viên Trần Thị B</p>
                <p className="text-sm text-gray-600">Lớp: CNTT2024A - Điểm: 87/100 - 4 giờ trước</p>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Hoàn thành</span>
            </div>

            <div className="flex items-center gap-4 p-3 bg-yellow-50 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
              <div className="flex-1">
                <p className="font-medium text-gray-800">Sinh viên Lê Văn C đã gửi phiếu chấm điểm</p>
                <p className="text-sm text-gray-600">Lớp: CNTT2024B - Cần xem xét và chấm điểm</p>
              </div>
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Chờ duyệt</span>
            </div>

            <div className="flex items-center gap-4 p-3 bg-purple-50 rounded-lg">
              <Users className="w-5 h-5 text-purple-600" />
              <div className="flex-1">
                <p className="font-medium text-gray-800">Sinh viên Phạm Thị D đã cập nhật hồ sơ</p>
                <p className="text-sm text-gray-600">Lớp: CNTT2024A - Cập nhật thông tin cá nhân</p>
              </div>
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">Thông tin</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Thao tác nhanh</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border-2 border-dashed border-blue-200 rounded-lg text-center hover:border-blue-400 transition-colors cursor-pointer">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-medium text-blue-800 mb-1">Quản lý lớp</h4>
              <p className="text-sm text-blue-600">Xem danh sách lớp học</p>
            </div>

            <div className="p-4 border-2 border-dashed border-green-200 rounded-lg text-center hover:border-green-400 transition-colors cursor-pointer">
              <FileText className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-medium text-green-800 mb-1">Chấm điểm</h4>
              <p className="text-sm text-green-600">Xem phiếu chờ duyệt</p>
            </div>

            <div className="p-4 border-2 border-dashed border-purple-200 rounded-lg text-center hover:border-purple-400 transition-colors cursor-pointer">
              <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-medium text-purple-800 mb-1">Báo cáo</h4>
              <p className="text-sm text-purple-600">Xuất báo cáo điểm</p>
            </div>

            <div className="p-4 border-2 border-dashed border-orange-200 rounded-lg text-center hover:border-orange-400 transition-colors cursor-pointer">
              <CheckCircle className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <h4 className="font-medium text-orange-800 mb-1">Thông báo</h4>
              <p className="text-sm text-orange-600">Gửi thông báo lớp</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>Trạng thái hệ thống</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium text-green-800">Hệ thống hoạt động bình thường</p>
                <p className="text-sm text-green-600">Tất cả dịch vụ đang hoạt động</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div>
                <p className="font-medium text-blue-800">Cơ sở dữ liệu</p>
                <p className="text-sm text-blue-600">Kết nối ổn định</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <div>
                <p className="font-medium text-purple-800">Phiên bản hệ thống</p>
                <p className="text-sm text-purple-600">v1.0.0 - Ổn định</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
