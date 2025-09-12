// Authentication middleware for API routes
import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken, extractTokenFromHeader, JWTPayload } from '../auth'

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload
}

// Authentication middleware
export function withAuth(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const authHeader = req.headers.get('authorization')
    const token = extractTokenFromHeader(authHeader)
    
    if (!token) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'NO_TOKEN', 
            message: '인증 토큰이 필요합니다.' 
          } 
        },
        { status: 401 }
      )
    }

    const payload = verifyAccessToken(token)
    if (!payload) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'INVALID_TOKEN', 
            message: '유효하지 않은 토큰입니다.' 
          } 
        },
        { status: 401 }
      )
    }

    // Add user info to request
    const authReq = req as AuthenticatedRequest
    authReq.user = payload
    
    return handler(authReq)
  }
}

// Optional authentication middleware (doesn't fail if no token)
export function withOptionalAuth(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const authHeader = req.headers.get('authorization')
    const token = extractTokenFromHeader(authHeader)
    
    const authReq = req as AuthenticatedRequest
    
    if (token) {
      const payload = verifyAccessToken(token)
      if (payload) {
        authReq.user = payload
      }
    }
    
    return handler(authReq)
  }
}