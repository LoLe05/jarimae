// Role-based access control middleware
import { NextResponse } from 'next/server'
import { UserType } from '@prisma/client'
import { withAuth, AuthenticatedRequest } from './auth'

// Role-based access control middleware
export function withRole(allowedRoles: UserType | UserType[]) {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]
  
  return function(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
    return withAuth(async (req: AuthenticatedRequest): Promise<NextResponse> => {
      const userRole = req.user?.userType
      
      if (!userRole || !roles.includes(userRole)) {
        return NextResponse.json(
          { 
            success: false, 
            error: { 
              code: 'INSUFFICIENT_PERMISSIONS', 
              message: '이 작업을 수행할 권한이 없습니다.' 
            } 
          },
          { status: 403 }
        )
      }
      
      return handler(req)
    })
  }
}

// Customer only access
export function withCustomerRole(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return withRole(UserType.CUSTOMER)(handler)
}

// Store owner only access
export function withOwnerRole(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return withRole(UserType.OWNER)(handler)
}

// Alias for withRole (commonly used in API routes)
export function withRBAC(allowedRoles: string | string[]) {
  // Convert string roles to UserType
  const convertToUserType = (role: string): UserType => {
    switch (role.toLowerCase()) {
      case 'customer': return UserType.CUSTOMER
      case 'owner': return UserType.OWNER  
      case 'admin': return UserType.ADMIN
      default: throw new Error(`Invalid role: ${role}`)
    }
  }
  
  const roles = Array.isArray(allowedRoles) 
    ? allowedRoles.map(convertToUserType)
    : [convertToUserType(allowedRoles)]
  
  return withRole(roles)
}

// Check if user owns the store
export function withStoreOwnership(storeIdExtractor: (req: AuthenticatedRequest) => string) {
  return function(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
    return withAuth(async (req: AuthenticatedRequest): Promise<NextResponse> => {
      const userId = req.user?.userId
      const storeId = storeIdExtractor(req)
      
      if (!userId || !storeId) {
        return NextResponse.json(
          { 
            success: false, 
            error: { 
              code: 'INVALID_REQUEST', 
              message: '필수 정보가 누락되었습니다.' 
            } 
          },
          { status: 400 }
        )
      }

      // Import prisma here to avoid circular dependencies
      const { prisma } = await import('../db')
      
      try {
        const store = await prisma.store.findFirst({
          where: {
            id: storeId,
            owner_id: userId
          }
        })

        if (!store) {
          return NextResponse.json(
            { 
              success: false, 
              error: { 
                code: 'UNAUTHORIZED_STORE_ACCESS', 
                message: '해당 매장에 접근할 권한이 없습니다.' 
              } 
            },
            { status: 403 }
          )
        }

        return handler(req)
      } catch (error) {
        console.error('Store ownership check failed:', error)
        return NextResponse.json(
          { 
            success: false, 
            error: { 
              code: 'DATABASE_ERROR', 
              message: '권한 확인 중 오류가 발생했습니다.' 
            } 
          },
          { status: 500 }
        )
      }
    })
  }
}