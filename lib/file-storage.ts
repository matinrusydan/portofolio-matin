import { writeFile, unlink, mkdir } from 'fs/promises'
import { join, extname } from 'path'
import { randomUUID } from 'crypto'

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads')

export async function saveFile(file: File, prefix: string = 'file'): Promise<string> {
  // Ensure upload directory exists
  try {
    await mkdir(UPLOAD_DIR, { recursive: true })
  } catch (error) {
    // Directory might already exist, ignore error
  }

  // Generate unique filename
  const fileExtension = extname(file.name) || '.jpg'
  const uniqueName = `${prefix}-${Date.now()}-${randomUUID().slice(0, 8)}${fileExtension}`
  const filepath = join(UPLOAD_DIR, uniqueName)

  // Convert file to buffer and save
  const bytes = await file.arrayBuffer()
  const buffer = new Uint8Array(bytes)
  await writeFile(filepath, buffer)

  // Return relative path for database storage
  return `/uploads/${uniqueName}`
}

export async function deleteFile(filepath: string): Promise<void> {
  try {
    // Convert relative path to absolute path
    const relativePath = filepath.startsWith('/') ? filepath.slice(1) : filepath
    const fullPath = join(process.cwd(), 'public', relativePath)
    await unlink(fullPath)
  } catch (error) {
    // File might not exist, ignore error
    console.warn(`Failed to delete file ${filepath}:`, error)
  }
}

export function getFileUrl(filepath: string): string {
  // Ensure filepath starts with /
  return filepath.startsWith('/') ? filepath : `/${filepath}`
}