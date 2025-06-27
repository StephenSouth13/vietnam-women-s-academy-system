"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { type User, onAuthStateChanged } from "firebase/auth"
import { auth, db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"

interface UserData {
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

interface AuthContextType {
  user: User | null
  userData: UserData | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let unsubscribe: (() => void) | undefined

    try {
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        try {
          if (user) {
            setUser(user)
            try {
              const userDoc = await getDoc(doc(db, "users", user.uid))
              if (userDoc.exists()) {
                setUserData(userDoc.data() as UserData)
              } else {
                // If user document doesn't exist, create a basic one
                const basicUserData: UserData = {
                  uid: user.uid,
                  email: user.email || "",
                  role: user.email?.includes("giangvien") ? "teacher" : "student",
                  fullName: user.email?.split("@")[0] || "Người dùng",
                  createdAt: new Date().toISOString(),
                }
                setUserData(basicUserData)
              }
            } catch (firestoreError) {
              console.error("Error fetching user data:", firestoreError)
              // Set basic user data on error
              const basicUserData: UserData = {
                uid: user.uid,
                email: user.email || "",
                role: user.email?.includes("giangvien") ? "teacher" : "student",
                fullName: user.email?.split("@")[0] || "Người dùng",
                createdAt: new Date().toISOString(),
              }
              setUserData(basicUserData)
            }
          } else {
            setUser(null)
            setUserData(null)
          }
          setError(null)
        } catch (authError) {
          console.error("Auth state change error:", authError)
          setError("Authentication error occurred")
          setUser(null)
          setUserData(null)
        } finally {
          setLoading(false)
        }
      })
    } catch (initError) {
      console.error("Auth initialization error:", initError)
      setError("Failed to initialize authentication")
      setLoading(false)
    }

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [])

  // Show error state if needed
  if (error) {
    console.error("Auth Provider Error:", error)
  }

  return <AuthContext.Provider value={{ user, userData, loading }}>{children}</AuthContext.Provider>
}
