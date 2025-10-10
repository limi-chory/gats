import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getDatabase } from '@/lib/sqlite/db'
import { SqliteContactRepo } from '@/lib/domain/contact/backend/SqliteContactRepo'
import { SqliteUserRepo } from '@/lib/domain/user/backend/SqliteUserRepo'
import { ContactSyncService } from '@/lib/domain/contact/backend/ContactSyncService'

/**
 * POST /api/contact/sync
 * 연락처 동기화
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { contacts } = body

    if (!Array.isArray(contacts)) {
      return NextResponse.json(
        { error: 'Contacts must be an array' },
        { status: 400 }
      )
    }

    const db = getDatabase()
    const contactRepo = new SqliteContactRepo(db)
    const userRepo = new SqliteUserRepo(db)

    const user = await userRepo.findByClerkUserId(userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const syncService = new ContactSyncService(contactRepo, userRepo)

    const result = await syncService.syncContacts(user.id, contacts)

    return NextResponse.json({ result })
  } catch (error) {
    console.error('Error syncing contacts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

