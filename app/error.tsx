"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-red-800">Đã xảy ra lỗi</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">Ứng dụng gặp lỗi không mong muốn. Vui lòng thử lại hoặc quay về trang chủ.</p>

          {process.env.NODE_ENV === "development" && (
            <div className="text-left bg-gray-100 p-3 rounded text-sm">
              <strong>Chi tiết lỗi:</strong>
              <pre className="mt-2 text-xs overflow-auto whitespace-pre-wrap">{error.message}</pre>
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={reset} className="flex-1 bg-[#005BAC] hover:bg-[#003D73]">
              <RefreshCw className="w-4 h-4 mr-2" />
              Thử lại
            </Button>
            <Button onClick={() => (window.location.href = "/")} variant="outline" className="flex-1 bg-transparent">
              <Home className="w-4 h-4 mr-2" />
              Trang chủ
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
