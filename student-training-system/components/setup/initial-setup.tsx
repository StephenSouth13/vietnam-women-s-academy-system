"use client"

import { useState, useEffect } from "react"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/components/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CheckCircle } from "lucide-react"

export function InitialSetup() {
  const { user, firebaseUser } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [needsSetup, setNeedsSetup] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    checkSetupNeeded()
  }, [firebaseUser])

  const checkSetupNeeded = async () => {
    if (!firebaseUser) {
      setChecking(false)
      return
    }

    try {
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))
      const needsInit = !userDoc.exists()
      setNeedsSetup(needsInit)

      if (needsInit) {
        console.log("User document not found, needs initialization")
      } else {
        console.log("User document exists:", userDoc.data())
      }
    } catch (error) {
      console.error("Error checking setup:", error)
      // Nếu có lỗi permission, vẫn cần setup
      setNeedsSetup(true)
    } finally {
      setChecking(false)
    }
  }

  const initializeUser = async () => {
    if (!firebaseUser) return

    setLoading(true)
    try {
      const userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || "",
        role: "student", // Mặc định là sinh viên
        fullName: firebaseUser.displayName || `Sinh viên ${firebaseUser.email?.split("@")[0]}`,
        studentId: `SV${Date.now().toString().slice(-6)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      console.log("Creating user document:", userData)
      await setDoc(doc(db, "users", firebaseUser.uid), userData)

      toast({
        title: "Khởi tạo thành công",
        description: "Tài khoản đã được thiết lập! Trang sẽ tự động tải lại.",
      })

      setNeedsSetup(false)

      // Reload sau 2 giây để user có thể đọc thông báo
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (error: any) {
      console.error("Error initializing user:", error)
      toast({
        title: "Lỗi khởi tạo",
        description: `Không thể khởi tạo tài khoản: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Đang kiểm tra
  if (checking) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-8 w-8 animate-spin mr-2" />
              <span>Đang kiểm tra tài khoản...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Không cần setup
  if (!needsSetup) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center">
            <CheckCircle className="mr-2 h-6 w-6 text-[#005BAC]" />
            Thiết lập tài khoản
          </CardTitle>
          <CardDescription>Chào mừng! Cần khởi tạo thông tin tài khoản để sử dụng hệ thống</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-600 space-y-2">
            <p>
              <strong>Email:</strong> {firebaseUser?.email}
            </p>
            <p>
              <strong>Vai trò:</strong> Sinh viên
            </p>
            <p>
              <strong>Trạng thái:</strong> Cần khởi tạo
            </p>
          </div>

          <Button onClick={initializeUser} disabled={loading} className="w-full bg-[#005BAC] hover:bg-[#004A8F]">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Đang khởi tạo..." : "Khởi tạo tài khoản"}
          </Button>

          <p className="text-xs text-center text-gray-500">
            Quá trình này sẽ tạo hồ sơ cá nhân và cấp quyền truy cập hệ thống
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
