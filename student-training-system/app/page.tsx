import { LoginForm } from "@/components/auth/login-form"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#005BAC] mb-2">Học Viện Phụ Nữ Việt Nam</h1>
          <p className="text-gray-600">Phân hiệu tại TP. Hồ Chí Minh</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
