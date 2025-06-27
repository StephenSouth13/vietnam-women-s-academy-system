export interface User {
  uid: string
  email: string
  role: "student" | "teacher"
  fullName: string
  studentId?: string
  classId?: string
  avatar?: string
  phone?: string
  dateOfBirth?: string
  department?: string
  position?: string
  createdAt: string
}

export interface SectionScore {
  selfScore: number
  classScore?: number
  teacherScore?: number
  evidence: string
  files?: string[]
}

export interface Scoring {
  id?: string
  userId: string
  semester: string
  academicYear: string
  section1: SectionScore
  section2: SectionScore
  section3: SectionScore
  section4: SectionScore
  section5: SectionScore
  totalSelfScore: number
  finalScore?: number
  status: "draft" | "submitted" | "graded"
  submittedAt?: Date
  gradedAt?: Date
}

export interface Notification {
  id?: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  userId?: string
  createdAt: Date
  read: boolean
}
