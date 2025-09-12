// Global error handling middleware
import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { ZodError } from 'zod'

export interface ApiError extends Error {
  code?: string
  statusCode?: number
}

// Create a custom error class
export class AppError extends Error {
  public code: string
  public statusCode: number
  
  constructor(code: string, message: string, statusCode: number = 500) {
    super(message)
    this.code = code
    this.statusCode = statusCode
    this.name = 'AppError'
  }
}

// Common error codes
export const ErrorCodes = {
  // Authentication
  NO_TOKEN: 'NO_TOKEN',
  INVALID_TOKEN: 'INVALID_TOKEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  
  // User
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
  PHONE_ALREADY_EXISTS: 'PHONE_ALREADY_EXISTS',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  
  // Store
  STORE_NOT_FOUND: 'STORE_NOT_FOUND',
  STORE_NOT_APPROVED: 'STORE_NOT_APPROVED',
  UNAUTHORIZED_STORE_ACCESS: 'UNAUTHORIZED_STORE_ACCESS',
  
  // Reservation
  RESERVATION_NOT_FOUND: 'RESERVATION_NOT_FOUND',
  TABLE_NOT_AVAILABLE: 'TABLE_NOT_AVAILABLE',
  INVALID_RESERVATION_TIME: 'INVALID_RESERVATION_TIME',
  RESERVATION_DEADLINE_PASSED: 'RESERVATION_DEADLINE_PASSED',
  
  // System
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR'
} as const

// Global error handler
export function handleApiError(error: any): NextResponse {
  console.error('API Error:', error)
  
  // App errors (custom errors)
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message
        }
      },
      { status: error.statusCode }
    )
  }

  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002': // Unique constraint violation
        const target = error.meta?.target as string[]
        const field = target?.[0] || 'field'
        return NextResponse.json(
          {
            success: false,
            error: {
              code: field === 'email' ? ErrorCodes.EMAIL_ALREADY_EXISTS : 
                    field === 'phone' ? ErrorCodes.PHONE_ALREADY_EXISTS : 
                    'DUPLICATE_ENTRY',
              message: field === 'email' ? '이미 사용중인 이메일입니다.' :
                      field === 'phone' ? '이미 사용중인 휴대폰 번호입니다.' :
                      '이미 존재하는 데이터입니다.',
              field
            }
          },
          { status: 400 }
        )
        
      case 'P2025': // Record not found
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'RECORD_NOT_FOUND',
              message: '요청한 데이터를 찾을 수 없습니다.'
            }
          },
          { status: 404 }
        )
        
      case 'P2003': // Foreign key constraint violation
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'INVALID_REFERENCE',
              message: '참조된 데이터가 존재하지 않습니다.'
            }
          },
          { status: 400 }
        )
        
      default:
        return NextResponse.json(
          {
            success: false,
            error: {
              code: ErrorCodes.DATABASE_ERROR,
              message: '데이터베이스 오류가 발생했습니다.'
            }
          },
          { status: 500 }
        )
    }
  }
  
  // Zod validation errors
  if (error instanceof ZodError) {
    const details = error.errors.reduce((acc: Record<string, string>, err) => {
      const path = err.path.join('.')
      acc[path] = err.message
      return acc
    }, {})

    return NextResponse.json(
      {
        success: false,
        error: {
          code: ErrorCodes.VALIDATION_ERROR,
          message: '입력 데이터가 올바르지 않습니다.',
          details
        }
      },
      { status: 422 }
    )
  }

  // Generic errors
  if (error instanceof Error) {
    // In development, show the actual error message
    const message = process.env.NODE_ENV === 'development' 
      ? error.message 
      : '서버 오류가 발생했습니다.'
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: ErrorCodes.INTERNAL_SERVER_ERROR,
          message
        }
      },
      { status: 500 }
    )
  }

  // Fallback for unknown errors
  return NextResponse.json(
    {
      success: false,
      error: {
        code: ErrorCodes.INTERNAL_SERVER_ERROR,
        message: '알 수 없는 오류가 발생했습니다.'
      }
    },
    { status: 500 }
  )
}

// Error handling middleware wrapper
export function withErrorHandling(handler: Function) {
  return async (req: any, ...args: any[]): Promise<NextResponse> => {
    try {
      return await handler(req, ...args)
    } catch (error) {
      return handleApiError(error)
    }
  }
}