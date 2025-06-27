"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { type User as FirebaseUser, onAuthStateChanged } from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import type { User } from "@/lib/types"

interface AuthContextType {
  user: User | null
  firebaseUser: FirebaseUser | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  firebaseUser: null,
  loading: true,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))
          if (userDoc.exists()) {
            setUser(userDoc.data() as User)
          } else {
            // User document doesn't exist, create a basic one
            const basicUser: User = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || "",
              role: "student", // default role
              fullName: firebaseUser.displayName || "User",
              createdAt: new Date().toISOString(),
            }
            await setDoc(doc(db, "users", firebaseUser.uid), basicUser)
            setUser(basicUser)
          }
          setFirebaseUser(firebaseUser)
        } catch (error) {
          console.error("Error fetching user data:", error)
          // Still set the firebase user even if we can't get the document
          setFirebaseUser(firebaseUser)
          // Create a minimal user object from Firebase auth
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || "",
            role: "student",
            fullName: firebaseUser.displayName || "User",
            createdAt: new Date().toISOString(),
          })
        }
      } else {
        setUser(null)
        setFirebaseUser(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  return <AuthContext.Provider value={{ user, firebaseUser, loading }}>{children}</AuthContext.Provider>
}
