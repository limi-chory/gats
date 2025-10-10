import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getDatabase } from '@/lib/sqlite/db'
import { SqliteUserRepo } from '@/lib/domain/user/backend/SqliteUserRepo'
import { UserService } from '@/lib/domain/user/backend/UserService'

/**
 * POST /api/user
 * 새 사용자 생성 또는 조회
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { phoneNumber, name, company, school, interests } = body

    if (!phoneNumber || !name) {
      return NextResponse.json(
        { error: 'Phone number and name are required' },
        { status: 400 }
      )
    }

    const db = getDatabase()
    const userRepo = new SqliteUserRepo(db)
    const userService = new UserService(userRepo)

    // 기존 사용자 확인
    let user = await userRepo.findByClerkUserId(userId)

    if (user) {
      return NextResponse.json({ user })
    }

    // 새 사용자 생성
    user = await userService.createUser({
      clerkUserId: userId,
      phoneNumber,
      name,
      company,
      school,
      interests,
    })

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/user
 * 현재 사용자 정보 조회
 */
export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = getDatabase()
    const userRepo = new SqliteUserRepo(db)

    const user = await userRepo.findByClerkUserId(userId)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error getting user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

