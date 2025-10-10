import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getDatabase } from '@/lib/sqlite/db'
import { SqliteIntroductionRepo } from '@/lib/domain/introductionFlow/backend/SqliteIntroductionRepo'
import { SqlitePathRequestRepo } from '@/lib/domain/pathRequest/backend/SqlitePathRequestRepo'
import { SqliteUserRepo } from '@/lib/domain/user/backend/SqliteUserRepo'
import { IntroductionOrchestrator } from '@/lib/domain/introductionFlow/backend/IntroductionOrchestrator'

/**
 * POST /api/introduction/request
 * 소개 요청 시작
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { pathRequestId, pathResultIndex } = body

    if (!pathRequestId || pathResultIndex === undefined) {
      return NextResponse.json(
        { error: 'pathRequestId and pathResultIndex are required' },
        { status: 400 }
      )
    }

    const db = getDatabase()
    const introRepo = new SqliteIntroductionRepo(db)
    const pathRequestRepo = new SqlitePathRequestRepo(db)
    const userRepo = new SqliteUserRepo(db)

    const user = await userRepo.findByClerkUserId(userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const orchestrator = new IntroductionOrchestrator(
      introRepo,
      pathRequestRepo,
      userRepo
    )

    const flow = await orchestrator.startIntroduction(
      user.id,
      pathRequestId,
      pathResultIndex
    )

    return NextResponse.json({ flow }, { status: 201 })
  } catch (error) {
    console.error('Error starting introduction:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

