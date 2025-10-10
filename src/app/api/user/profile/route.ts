import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getDatabase } from '@/lib/sqlite/db'
import { SqliteUserRepo } from '@/lib/domain/user/backend/SqliteUserRepo'
import { ProfileService } from '@/lib/domain/user/backend/ProfileService'

/**
 * GET /api/user/profile
 * 사용자 프로필 조회
 */
export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = getDatabase()
    const userRepo = new SqliteUserRepo(db)
    const profileService = new ProfileService(userRepo)

    const user = await userRepo.findByClerkUserId(userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const profile = await profileService.getProfile(user.id)

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Error getting profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/user/profile
 * 사용자 프로필 업데이트
 */
export async function PUT(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, company, school, interests, profileVisibility } = body

    const db = getDatabase()
    const userRepo = new SqliteUserRepo(db)
    const profileService = new ProfileService(userRepo)

    const user = await userRepo.findByClerkUserId(userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const profile = await profileService.updateProfile(user.id, {
      name,
      company,
      school,
      interests,
      profileVisibility,
    })

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

