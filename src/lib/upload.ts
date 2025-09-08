import { NextRequest } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

// 허용되는 이미지 타입
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export interface UploadResult {
  success: boolean
  url?: string
  error?: string
}

export async function uploadImage(file: File): Promise<UploadResult> {
  try {
    // 파일 타입 검증
    if (!ALLOWED_TYPES.includes(file.type)) {
      return { success: false, error: '지원하지 않는 파일 형식입니다. JPG, PNG, WebP만 업로드 가능합니다.' }
    }

    // 파일 크기 검증
    if (file.size > MAX_FILE_SIZE) {
      return { success: false, error: '파일 크기가 너무 큽니다. 최대 5MB까지 업로드 가능합니다.' }
    }

    // 파일 확장자 추출
    const extension = file.type.split('/')[1]
    
    // 고유한 파일명 생성
    const fileName = `${uuidv4()}.${extension}`
    
    // 업로드 디렉토리 생성
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'images')
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // 파일 저장
    const filePath = path.join(uploadDir, fileName)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    await writeFile(filePath, buffer)

    // 공개 URL 생성
    const publicUrl = `/uploads/images/${fileName}`

    return { success: true, url: publicUrl }
  } catch (error) {
    console.error('Upload error:', error)
    return { success: false, error: '파일 업로드 중 오류가 발생했습니다.' }
  }
}

export async function uploadMultipleImages(files: File[]): Promise<UploadResult[]> {
  const results: UploadResult[] = []
  
  for (const file of files) {
    const result = await uploadImage(file)
    results.push(result)
  }
  
  return results
}

// 파일 삭제 함수 (필요시 사용)
export async function deleteImage(url: string): Promise<boolean> {
  try {
    const fileName = url.split('/').pop()
    if (!fileName) return false
    
    const filePath = path.join(process.cwd(), 'public', 'uploads', 'images', fileName)
    const fs = await import('fs/promises')
    await fs.unlink(filePath)
    
    return true
  } catch (error) {
    console.error('Delete file error:', error)
    return false
  }
}