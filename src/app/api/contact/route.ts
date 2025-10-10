import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getDatabase } from '@/lib/sqlite/db'
import { SqliteContactRepo } from '@/lib/domain/contact/backend/SqliteContactRepo'
import { SqliteUserRepo } from '@/lib/domain/user/backend/SqliteUserRepo'

/**
 * GET /api/contact
 * 사용자의 연락처 목록 조회
 */
export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = getDatabase()
    const contactRepo = new SqliteContactRepo(db)
    const userRepo = new SqliteUserRepo(db)

    const user = await userRepo.findByClerkUserId(userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const contacts = await contactRepo.findByUserId(user.id)

    return NextResponse.json({ contacts })
  } catch (error) {
    console.error('Error getting contacts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

