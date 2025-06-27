"use client"

import type React from "react"

import { useState } from "react"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "@/lib/firebase"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import DemoAccounts from "./demo-accounts"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const [isLogin, setIsLogin] = useState(true)
  const [role, setRole] = useState<"student" | "teacher">("student")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Get user role from Firestore
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
    } catch (error: any) {
      toast({
        title: "Lỗi đăng nhập",
        description: error.message || "Email hoặc mật khẩu không đúng",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Create user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: email,
        role: role,
        displayName: email.split("@")[0],
        createdAt: new Date(),
      })

      toast({
        title: "Đăng ký thành công",
        description: "Tài khoản đã được tạo thành công!",
      })

      // Redirect based on role
      if (role === "teacher") {
        router.push("/teacher/dashboard")
      } else {
        router.push("/student/dashboard")
      }
    } catch (error: any) {
      toast({
        title: "Lỗi đăng ký",
        description: error.message,
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
    <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-6">
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

      {!isLogin && (
        <div className="space-y-2">
          <Label htmlFor="role">Vai trò</Label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value as "student" | "teacher")}
            className="w-full p-2 border rounded-md"
          >
            <option value="student">Sinh viên</option>
            <option value="teacher">Giảng viên</option>
          </select>
        </div>
      )}

      <Button type="submit" className="w-full bg-[#005BAC] hover:bg-[#003D73] text-white" disabled={loading}>
        {loading ? "Đang đăng nhập..." : isLogin ? "Đăng nhập" : "Đăng ký"}
      </Button>

      <div className="text-center">
        {isLogin ? (
          <a href="#" className="text-sm text-blue-600 hover:underline">
            Quên mật khẩu?
          </a>
        ) : null}
      </div>

      <div className="text-center">
        <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-sm text-blue-600 hover:underline">
          {isLogin ? "Chưa có tài khoản? Đăng ký" : "Đã có tài khoản? Đăng nhập"}
        </button>
      </div>
      <DemoAccounts onSelectAccount={handleDemoLogin} />
    </form>
  )
}
