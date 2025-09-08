import { NextResponse } from 'next/server'

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  errors?: Record<string, string[]>
}

export function successResponse<T>(data: T, message?: string): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    message
  })
}

export function errorResponse(
  message: string,
  status: number = 400,
  errors?: Record<string, string[]>
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: message,
      errors
    },
    { status }
  )
}

export function unauthorizedResponse(): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: 'Unauthorized'
    },
    { status: 401 }
  )
}

export function forbiddenResponse(): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: 'Forbidden'
    },
    { status: 403 }
  )
}

export function notFoundResponse(): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: 'Not found'
    },
    { status: 404 }
  )
}

export function serverErrorResponse(): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: 'Internal server error'
    },
    { status: 500 }
  )
}