import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

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
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

/*
FIRESTORE SECURITY RULES - Thêm vào Firebase Console:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Cho phép người dùng đọc/ghi document của chính họ
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Cho phép sinh viên đọc/ghi phiếu đánh giá của chính họ
    match /student_evaluations/{evaluationId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && 
        request.resource.data.userId == request.auth.uid;
    }
    
    // Cho phép giảng viên đọc tất cả phiếu đánh giá
    match /student_evaluations/{evaluationId} {
      allow read, write: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "teacher";
    }
    
    // Cho phép tất cả người dùng đã đăng nhập đọc thông báo
    match /notifications/{notificationId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "teacher";
    }
  }
}

STORAGE RULES - Thêm vào Firebase Console:

rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /evaluations/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /evaluations/{allPaths=**} {
      allow read: if request.auth != null && 
        exists(/databases/(default)/documents/users/$(request.auth.uid)) &&
        get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == "teacher";
    }
  }
}
*/
