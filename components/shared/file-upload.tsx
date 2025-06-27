"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Upload, X, FileText, ImageIcon } from "lucide-react"

interface FileUploadProps {
  onUpload: (url: string) => void
  accept?: string
  maxSize?: number // in MB
  type: "avatar" | "evidence"
  userId: string
  currentFile?: string
}

export default function FileUpload({
  onUpload,
  accept = "image/*,application/pdf",
  maxSize = 5,
  type,
  userId,
  currentFile,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = async (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        title: "Lỗi",
        description: `Kích thước file không được vượt quá ${maxSize}MB`,
        variant: "destructive",
      })
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("userId", userId)
      formData.append("type", type)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        onUpload(result.url)
        toast({
          title: "Thành công",
          description: "File đã được tải lên thành công",
        })
      } else {
        throw new Error(result.error)
      }
    } catch (error: any) {
      toast({
        title: "Lỗi tải file",
        description: error.message || "Không thể tải file lên",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const removeFile = () => {
    onUpload("")
  }

  const getFileIcon = (filename: string) => {
    if (filename.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return <ImageIcon className="w-4 h-4" />
    }
    return <FileText className="w-4 h-4" />
  }

  return (
    <div className="space-y-4">
      {currentFile ? (
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          {getFileIcon(currentFile)}
          <span className="flex-1 text-sm text-gray-700 truncate">{currentFile.split("/").pop()}</span>
          <Button
            size="sm"
            variant="ghost"
            onClick={removeFile}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragOver ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400"
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
        >
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-2">Kéo thả file vào đây hoặc</p>
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="bg-transparent"
          >
            {uploading ? "Đang tải..." : "Chọn file"}
          </Button>
          <p className="text-xs text-gray-500 mt-2">
            Hỗ trợ: {accept.replace(/\*/g, "tất cả")} (tối đa {maxSize}MB)
          </p>
        </div>
      )}

      <input ref={fileInputRef} type="file" accept={accept} onChange={handleFileInputChange} className="hidden" />
    </div>
  )
}
