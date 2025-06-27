// Script để tạo tài khoản demo trong Firebase
import { initializeApp } from "firebase/app"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"
import { getFirestore, doc, setDoc } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyA2o8XRt_K5QFSIU3hqcsraiBDBhIw2r6c",
  authDomain: "hethongrenluyenwomanacademy.firebaseapp.com",
  databaseURL: "https://hethongrenluyenwomanacademy-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "hethongrenluyenwomanacademy",
  storageBucket: "hethongrenluyenwomanacademy.appspot.com",
  messagingSenderId: "961977680525",
  appId: "1:961977680525:web:9a1ac982617bdc289918c4",
  measurementId: "G-SC30MV1DN8",
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

async function createDemoAccounts() {
  try {
    console.log("🚀 Bắt đầu tạo tài khoản demo...")

    // Tạo tài khoản sinh viên demo
    const studentCredential = await createUserWithEmailAndPassword(auth, "sinhvien@demo.com", "123456")

    await setDoc(doc(db, "users", studentCredential.user.uid), {
      uid: studentCredential.user.uid,
      email: "sinhvien@demo.com",
      fullName: "Nguyễn Văn A",
      role: "student",
      studentId: "SV2024001",
      classId: "CNTT2024A",
      phone: "0123456789",
      dateOfBirth: "2002-01-15",
      createdAt: new Date().toISOString(),
    })

    console.log("✅ Tạo tài khoản sinh viên thành công")

    // Tạo tài khoản giảng viên demo
    const teacherCredential = await createUserWithEmailAndPassword(auth, "giangvien@demo.com", "123456")

    await setDoc(doc(db, "users", teacherCredential.user.uid), {
      uid: teacherCredential.user.uid,
      email: "giangvien@demo.com",
      fullName: "TS. Trần Thị B",
      role: "teacher",
      phone: "0987654321",
      department: "Khoa Công nghệ thông tin",
      createdAt: new Date().toISOString(),
    })

    console.log("✅ Tạo tài khoản giảng viên thành công")

    // Tạo lớp demo
    await setDoc(doc(db, "classes", "CNTT2024A"), {
      id: "CNTT2024A",
      name: "Công nghệ thông tin K2024A",
      code: "CNTT2024A",
      teacherId: teacherCredential.user.uid,
      teacherName: "TS. Trần Thị B",
      studentCount: 1,
      createdAt: new Date().toISOString(),
    })

    console.log("✅ Tạo lớp demo thành công")

    // Tạo điểm demo cho sinh viên
    await setDoc(doc(db, "scores", `${studentCredential.user.uid}_1_2024-2025`), {
      studentId: studentCredential.user.uid,
      studentName: "Nguyễn Văn A",
      semester: "1",
      academicYear: "2024-2025",
      section1: { selfScore: 18, evidence: "Tham gia đầy đủ các buổi học, hoàn thành bài tập đúng hạn" },
      section2: { selfScore: 23, evidence: "Tuân thủ nghiêm túc nội quy trường, lớp" },
      section3: { selfScore: 17, evidence: "Tham gia hoạt động tình nguyện mùa hè xanh" },
      section4: { selfScore: 22, evidence: "Chấp hành tốt pháp luật, có ý thức công dân tốt" },
      section5: { selfScore: 8, evidence: "Làm lớp trưởng, tổ chức các hoạt động lớp" },
      totalSelfScore: 88,
      classScore: 85,
      teacherScore: 87,
      finalScore: 87,
      status: "graded",
      submittedAt: new Date(),
      gradedAt: new Date(),
    })

    console.log("✅ Tạo điểm demo thành công")

    console.log("\n🎉 Tạo dữ liệu demo hoàn tất!")
    console.log("\n📋 Thông tin đăng nhập:")
    console.log("👨‍🎓 Sinh viên: sinhvien@demo.com / 123456")
    console.log("👩‍🏫 Giảng viên: giangvien@demo.com / 123456")

    process.exit(0)
  } catch (error) {
    console.error("❌ Lỗi tạo tài khoản demo:", error)
    process.exit(1)
  }
}

createDemoAccounts()
