# 🇻🇳 Hệ thống Chấm điểm Rèn luyện - Học viện Phụ nữ Việt Nam

![License](https://img.shields.io/badge/license-MIT-blue)
![Tech](https://img.shields.io/badge/next.js-14-blue)
![UI](https://img.shields.io/badge/CRM-Design-informational)

## 🎯 Giới thiệu

Hệ thống quản lý và chấm điểm **rèn luyện sinh viên** tại Phân hiệu Học viện Phụ nữ Việt Nam. Hỗ trợ:
- Sinh viên tự đánh giá và nộp minh chứng.
- Giảng viên quản lý lớp, chấm điểm, gửi thông báo.
- Giao diện CRM hiện đại, hỗ trợ dark mode.

> Demo: https://vietnam-women-s-academy-system.onrender.com/
>![image](https://github.com/user-attachments/assets/ba3f9164-b27d-4ffc-aef2-beeab415d874)
> ![image](https://github.com/user-attachments/assets/72f8d569-ef9c-409e-8a0c-7064e775c036)




---

## 🧠 Tính năng chính

### 👨‍🎓 Dành cho Sinh viên:
- 🔐 Đăng nhập/Đăng ký bằng Firebase
- 📝 Điền phiếu rèn luyện với 5 phần
- 📎 Upload minh chứng (PDF, ảnh)
- 💾 Lưu nháp, gửi phiếu, xuất PDF/CSV
- 🛠 Quản lý hồ sơ cá nhân
- 🔔 Nhận thông báo từ giảng viên

### 👩‍🏫 Dành cho Giảng viên:
- 📊 Dashboard thống kê
- 👥 Quản lý danh sách sinh viên theo lớp
- 🧾 Xem phiếu sinh viên gửi
- ✅ Chấm điểm từng mục (có minh chứng)
- 📤 Xuất CSV, gửi thông báo
- 💬 Xem lịch sử đánh giá & phản hồi

---

## 🧱 Công nghệ sử dụng

| Thành phần | Chi tiết |
|------------|----------|
| 🖥️ Frontend | [Next.js 14](https://nextjs.org/), App Router, TypeScript |
| 🎨 UI | TailwindCSS + [shadcn/ui](https://ui.shadcn.com/), màu xanh BIDV `#005BAC`, hỗ trợ Dark Mode |
| 🔐 Auth | Firebase Authentication |
| 🔥 Database | Firebase Firestore |
| 📦 Upload | API route + lưu local `/public/uploads/` |
| 📄 Export | `jsPDF` (PDF), UTF-8 CSV |
| ⚙️ Hosting | [Render.com](https://render.com/) |

---

## 🧾 Cấu trúc dự án

```bash
app/
├── layout.tsx
├── page.tsx (login)
├── register/page.tsx
├── student/dashboard/page.tsx
├── teacher/dashboard/page.tsx
├── api/
│   ├── upload/
│   ├── scores/
│   ├── students/
│   ├── grading/
│   ├── notifications/
│   └── export/
components/
├── layout/
├── student/
├── teacher/
├── shared/
├── auth/
├── providers/
---
###  🔐 Firebase Config
Tạo file .env.local:

env
Sao chép
Chỉnh sửa
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...
🔧 Cài đặt local
bash
Sao chép
Chỉnh sửa
# 1. Clone repo
git clone https://github.com/StephenSouth13/vietnam-women-s-academy-system.git
cd vietnam-women-s-academy-system

# 2. Cài dependencies
npm install

# 3. Chạy dev
npm run dev
🧪 Tài khoản Demo
json
Sao chép
Chỉnh sửa
// Sinh viên
email: sinhvien@demo.com
password: 123456

// Giảng viên
email: giangvien@demo.com
password: 123456
📷 Screenshot
<img src="docs/dashboard.png" alt="dashboard" width="700" />
📄 License
MIT © 2025 — StephenSouth13
