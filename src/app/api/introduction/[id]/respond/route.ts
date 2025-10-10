import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getDatabase } from '@/lib/sqlite/db'
import { SqliteIntroductionRepo } from '@/lib/domain/introductionFlow/backend/SqliteIntroductionRepo'
import { SqlitePathRequestRepo } from '@/lib/domain/pathRequest/backend/SqlitePathRequestRepo'
import { SqliteUserRepo } from '@/lib/domain/user/backend/SqliteUserRepo'
import { IntroductionOrchestrator } from '@/lib/domain/introductionFlow/backend/IntroductionOrchestrator'

/**
 * POST /api/introduction/[id]/respond
 * 소개 요청에 응답
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()
    const { stepNumber, accepted, message } = body

    if (stepNumber === undefined || accepted === undefined) {
      return NextResponse.json(
        { error: 'stepNumber and accepted are required' },
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

    await orchestrator.respondToStep(id, stepNumber, user.id, accepted, message)

    const flow = await introRepo.findById(id)

    return NextResponse.json({ flow })
  } catch (error) {
    console.error('Error responding to introduction:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

