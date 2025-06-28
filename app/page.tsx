"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff, Mail, Lock, UserPlus, GraduationCap } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Get user role from Firestore
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid))
        const userData = userDoc.data()

        if (userData?.role === "teacher") {
          router.push("/teacher/dashboard")
        } else if (userData?.role === "student") {
          router.push("/student/dashboard")
        } else {
          throw new Error("Vai trò người dùng không hợp lệ")
        }

        toast({
          title: "Đăng nhập thành công",
          description: "Chào mừng bạn quay trở lại!",
        })
      } catch (firestoreError) {
        console.error("Firestore error:", firestoreError)
        // Default redirect based on email
        if (email.includes("giangvien")) {
          router.push("/teacher/dashboard")
        } else {
          router.push("/student/dashboard")
        }
      }
    } catch (error: any) {
      console.error("Login error:", error)
      toast({
        title: "Lỗi đăng nhập",
        description: error.message || "Email hoặc mật khẩu không đúng",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="mb-6">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto overflow-hidden border border-blue-200 shadow">
                <Image
                  src="/logo/2025-Logo-VWAH-Final.png"
                  alt="Logo"
                  width={80}
                  height={80}
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800 mb-2">Hệ thống chấm điểm rèn luyện</CardTitle>
            <p className="text-gray-600">Phân hiệu Học viện Phụ nữ Việt Nam</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    placeholder="Nhập email của bạn"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    placeholder="Nhập mật khẩu"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full bg-[#005BAC] hover:bg-[#003D73] text-white" disabled={loading}>
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/register" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline">
                <UserPlus className="w-4 h-4" />
                Chưa có tài khoản? Đăng ký ngay
              </Link>
            </div>

            {/* Demo Accounts */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Tài khoản Demo:</h3>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleDemoLogin("giangvien@demo.com", "123456")}
                  className="w-full text-left p-2 text-xs bg-white rounded border hover:bg-blue-50"
                >
                  👩‍🏫 <strong>Giảng viên:</strong> giangvien@demo.com / 123456
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin("sinhvien@demo.com", "123456")}
                  className="w-full text-left p-2 text-xs bg-white rounded border hover:bg-blue-50"
                >
                  👨‍🎓 <strong>Sinh viên:</strong> sinhvien@demo.com / 123456
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
