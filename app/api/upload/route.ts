import { type NextRequest, NextResponse } from "next/server"
import { saveFile, deleteFile, isValidFileType } from "@/lib/file-upload"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const folder = formData.get("folder") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!folder) {
      return NextResponse.json({ error: "No folder specified" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ["pdf", "jpg", "jpeg", "png"]
    if (!isValidFileType(file.name, allowedTypes)) {
      return NextResponse.json(
        { error: "Invalid file type. Only PDF, JPG, JPEG, and PNG files are allowed." },
        { status: 400 },
      )
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large. Maximum size is 10MB." }, { status: 400 })
    }

    // Validate folder name
    const allowedFolders = ["students", "staff"]
    if (!allowedFolders.includes(folder)) {
      return NextResponse.json({ error: "Invalid folder specified" }, { status: 400 })
    }

    const filePath = await saveFile(file, folder)

    return NextResponse.json({
      filePath,
      fileName: file.name,
      fileSize: file.size,
      message: "File uploaded successfully",
    })
  } catch (error) {
    console.error("Upload error:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to upload file"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { filePath } = await request.json()

    if (!filePath) {
      return NextResponse.json({ error: "No file path provided" }, { status: 400 })
    }

    const deleted = await deleteFile(filePath)

    if (deleted) {
      return NextResponse.json({ message: "File deleted successfully" })
    } else {
      return NextResponse.json({ message: "File not found or already deleted" })
    }
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 })
  }
}
