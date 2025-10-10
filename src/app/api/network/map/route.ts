import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getDatabase } from '@/lib/sqlite/db'
import { SqliteNetworkNodeRepo } from '@/lib/domain/networkNode/backend/SqliteNetworkNodeRepo'
import { SqliteContactRepo } from '@/lib/domain/contact/backend/SqliteContactRepo'
import { SqliteUserRepo } from '@/lib/domain/user/backend/SqliteUserRepo'
import { NetworkMapService } from '@/lib/domain/networkNode/backend/NetworkMapService'

/**
 * GET /api/network/map
 * 네트워크 맵 데이터 조회
 */
export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = getDatabase()
    const networkNodeRepo = new SqliteNetworkNodeRepo(db)
    const contactRepo = new SqliteContactRepo(db)
    const userRepo = new SqliteUserRepo(db)

    const user = await userRepo.findByClerkUserId(userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const networkMapService = new NetworkMapService(
      networkNodeRepo,
      contactRepo,
      userRepo
    )

    const mapData = await networkMapService.getNetworkMapData(user.id)

    return NextResponse.json({ mapData })
  } catch (error) {
    console.error('Error getting network map:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/network/map
 * 네트워크 맵 생성/재생성
 */
export async function POST() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = getDatabase()
    const networkNodeRepo = new SqliteNetworkNodeRepo(db)
    const contactRepo = new SqliteContactRepo(db)
    const userRepo = new SqliteUserRepo(db)

    const user = await userRepo.findByClerkUserId(userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const networkMapService = new NetworkMapService(
      networkNodeRepo,
      contactRepo,
      userRepo
    )

    await networkMapService.buildNetworkMap(user.id)

    const mapData = await networkMapService.getNetworkMapData(user.id)

    return NextResponse.json({ mapData })
  } catch (error) {
    console.error('Error building network map:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

