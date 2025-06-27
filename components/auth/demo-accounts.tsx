"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, GraduationCap } from "lucide-react"

interface DemoAccountsProps {
  onSelectAccount: (email: string, password: string) => void
}

export default function DemoAccounts({ onSelectAccount }: DemoAccountsProps) {
  const demoAccounts = [
    {
      type: "student",
      email: "sinhvien@demo.com",
      password: "123456",
      name: "Nguyễn Văn A",
      role: "Sinh viên",
      icon: User,
    },
    {
      type: "teacher",
      email: "giangvien@demo.com",
      password: "123456",
      name: "TS. Trần Thị B",
      role: "Giảng viên",
      icon: GraduationCap,
    },
  ]

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-center text-lg">Tài khoản Demo</CardTitle>
        <p className="text-center text-sm text-gray-600">Sử dụng tài khoản demo để trải nghiệm hệ thống</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {demoAccounts.map((account) => {
          const Icon = account.icon
          return (
            <div
              key={account.type}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${account.type === "student" ? "bg-blue-100" : "bg-green-100"}`}>
                  <Icon className={`w-4 h-4 ${account.type === "student" ? "text-blue-600" : "text-green-600"}`} />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{account.name}</p>
                  <p className="text-sm text-gray-600">{account.role}</p>
                  <p className="text-xs text-gray-500">{account.email}</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onSelectAccount(account.email, account.password)}
                className="bg-transparent"
              >
                Đăng nhập
              </Button>
            </div>
          )
        })}

        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Lưu ý:</strong> Đây là tài khoản demo. Trong thực tế, bạn cần đăng ký tài khoản mới.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
