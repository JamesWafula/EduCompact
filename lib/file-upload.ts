import { writeFile, mkdir, unlink } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function saveFile(file: File, folder: string): Promise<string> {
  try {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      throw new Error("File size exceeds 10MB limit")
    }

    // Validate file type
    const allowedTypes = ["pdf", "jpg", "jpeg", "png"]
    const extension = getFileExtension(file.name)
    if (!allowedTypes.includes(extension)) {
      throw new Error("Invalid file type. Only PDF, JPG, JPEG, and PNG files are allowed.")
    }

    // Create unique filename with timestamp
    const timestamp = Date.now()
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
    const filename = `${timestamp}-${sanitizedName}`

    // Ensure upload directory exists
    const uploadDir = join(process.cwd(), "public", "uploads", folder)
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    const filepath = join(uploadDir, filename)
    await writeFile(filepath, buffer)

    return `/uploads/${folder}/${filename}`
  } catch (error) {
    console.error("File upload error:", error)
    throw error
  }
}

export async function deleteFile(filePath: string): Promise<boolean> {
  try {
    if (!filePath) return false

    const fullPath = join(process.cwd(), "public", filePath)
    if (existsSync(fullPath)) {
      await unlink(fullPath)
      return true
    }
    return false
  } catch (error) {
    console.error("File deletion error:", error)
    return false
  }
}

export function getFileExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() || ""
}

export function isValidFileType(filename: string, allowedTypes: string[]): boolean {
  const extension = getFileExtension(filename)
  return allowedTypes.includes(extension)
}

export function getFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}
