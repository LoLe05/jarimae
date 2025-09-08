import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { NextRequest } from 'next/server'
import { prisma } from './prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

export interface JWTPayload {
  userId: string
  email: string
  userType: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    return null
  }
}

export async function getAuthUser(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.substring(7)
    const payload = verifyToken(token)
    if (!payload) {
      return null
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        nickname: true,
        userType: true,
        phone: true,
        profileImage: true,
        createdAt: true,
        emailVerified: true
      }
    })

    return user
  } catch (error) {
    console.error('Auth error:', error)
    return null
  }
}

export function requireAuth() {
  return async (request: NextRequest) => {
    const user = await getAuthUser(request)
    if (!user) {
      throw new Error('Unauthorized')
    }
    return user
  }
}

export function requireOwner() {
  return async (request: NextRequest) => {
    const user = await getAuthUser(request)
    if (!user || user.userType !== 'OWNER') {
      throw new Error('Owner access required')
    }
    return user
  }
}

export function requireAdmin() {
  return async (request: NextRequest) => {
    const user = await getAuthUser(request)
    if (!user || user.userType !== 'ADMIN') {
      throw new Error('Admin access required')
    }
    return user
  }
}