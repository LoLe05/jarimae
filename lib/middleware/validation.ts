// Validation middleware using Zod
import { NextRequest, NextResponse } from 'next/server'
import { ZodSchema, ZodError } from 'zod'

export interface ValidatedRequest extends NextRequest {
  validatedData?: any
}

// Request body validation middleware
export function withValidation(schema: ZodSchema) {
  return function(handler: (req: ValidatedRequest) => Promise<NextResponse>) {
    return async (req: NextRequest): Promise<NextResponse> => {
      try {
        let body = {}
        
        // Only try to parse JSON for POST, PUT, PATCH methods
        if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
          const text = await req.text()
          if (text) {
            body = JSON.parse(text)
          }
        }

        const validatedData = schema.parse(body)
        
        const validatedReq = req as ValidatedRequest
        validatedReq.validatedData = validatedData
        
        return handler(validatedReq)
      } catch (error) {
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
                code: 'VALIDATION_ERROR',
                message: '입력 데이터가 올바르지 않습니다.',
                details
              }
            },
            { status: 422 }
          )
        }

        if (error instanceof SyntaxError) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: 'INVALID_JSON',
                message: 'JSON 형식이 올바르지 않습니다.'
              }
            },
            { status: 400 }
          )
        }

        throw error
      }
    }
  }
}

// Query parameters validation middleware
export function withQueryValidation(schema: ZodSchema) {
  return function(handler: (req: ValidatedRequest) => Promise<NextResponse>) {
    return async (req: NextRequest): Promise<NextResponse> => {
      try {
        const { searchParams } = new URL(req.url)
        const query: Record<string, string> = {}
        
        searchParams.forEach((value, key) => {
          query[key] = value
        })

        const validatedData = schema.parse(query)
        
        const validatedReq = req as ValidatedRequest
        validatedReq.validatedData = validatedData
        
        return handler(validatedReq)
      } catch (error) {
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
                code: 'VALIDATION_ERROR',
                message: '쿼리 파라미터가 올바르지 않습니다.',
                details
              }
            },
            { status: 422 }
          )
        }

        throw error
      }
    }
  }
}