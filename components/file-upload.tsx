"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Eye, Download, AlertCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface FileUploadProps {
  label: string
  value?: string
  onChange: (filePath: string | null) => void
  accept?: string
  folder: string
  required?: boolean
  description?: string
}

export function FileUpload({
  label,
  value,
  onChange,
  accept = ".pdf,.jpg,.jpeg,.png",
  folder,
  required = false,
  description,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setUploading(true)

    try {
      // Client-side validation
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        throw new Error("File size must be less than 10MB")
      }

      const allowedTypes = ["pdf", "jpg", "jpeg", "png"]
      const extension = file.name.split(".").pop()?.toLowerCase()
      if (!extension || !allowedTypes.includes(extension)) {
        throw new Error("Only PDF, JPG, JPEG, and PNG files are allowed")
      }

      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", folder)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to upload file")
      }

      onChange(result.filePath)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to upload file"
      setError(errorMessage)
      console.error("Upload error:", error)
    } finally {
      setUploading(false)
      // Reset input
      e.target.value = ""
    }
  }

  const handleRemove = async () => {
    if (!value) return

    try {
      // Call delete API
      await fetch("/api/upload", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filePath: value }),
      })
    } catch (error) {
      console.error("Error deleting file:", error)
    }

    onChange(null)
    setError(null)
  }

  const getFileName = (path: string) => {
    return path.split("/").pop()?.replace(/^\d+-/, "") || path
  }

  const isImage = (path: string) => {
    const ext = path.split(".").pop()?.toLowerCase()
    return ["jpg", "jpeg", "png", "gif"].includes(ext || "")
  }

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>

      {description && <p className="text-sm text-gray-500">{description}</p>}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {value ? (
        <div className="flex items-center gap-2 p-3 border rounded-md bg-gray-50">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{getFileName(value)}</p>
            <p className="text-xs text-gray-500">File uploaded successfully</p>
          </div>
          <div className="flex gap-1">
            <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" title="Preview">
                  <Eye className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh]">
                <DialogHeader>
                  <DialogTitle>File Preview - {getFileName(value)}</DialogTitle>
                </DialogHeader>
                <div className="max-h-[70vh] overflow-auto">
                  {isImage(value) ? (
                    <img
                      src={value || "/placeholder.svg"}
                      alt="Preview"
                      className="max-w-full h-auto mx-auto"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg?height=400&width=400"
                      }}
                    />
                  ) : (
                    <iframe src={value} className="w-full h-[60vh] border-0" title="Document Preview" />
                  )}
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline" size="sm" asChild title="Download">
              <a href={value} download target="_blank" rel="noopener noreferrer">
                <Download className="w-4 h-4" />
              </a>
            </Button>

            <Button variant="outline" size="sm" onClick={handleRemove} title="Remove file">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Input
              type="file"
              accept={accept}
              onChange={handleFileUpload}
              disabled={uploading}
              className="flex-1"
              required={required}
            />
            {uploading && (
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-md">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-blue-700">Uploading...</span>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500">Supported formats: PDF, JPG, JPEG, PNG (Max: 10MB)</p>
        </div>
      )}
    </div>
  )
}
