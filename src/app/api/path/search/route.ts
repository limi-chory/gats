import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getDatabase } from '@/lib/sqlite/db'
import { SqlitePathRequestRepo } from '@/lib/domain/pathRequest/backend/SqlitePathRequestRepo'
import { SqliteNetworkNodeRepo } from '@/lib/domain/networkNode/backend/SqliteNetworkNodeRepo'
import { SqliteConnectionRepo } from '@/lib/domain/connection/backend/SqliteConnectionRepo'
import { SqliteUserRepo } from '@/lib/domain/user/backend/SqliteUserRepo'
import { PathFinderService } from '@/lib/domain/pathRequest/backend/PathFinderService'
import { QueryParserService } from '@/lib/domain/pathRequest/backend/QueryParserService'

/**
 * POST /api/path/search
 * 연결 경로 검색
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { query, searchConfig } = body

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }

    const db = getDatabase()
    const pathRequestRepo = new SqlitePathRequestRepo(db)
    const networkNodeRepo = new SqliteNetworkNodeRepo(db)
    const connectionRepo = new SqliteConnectionRepo(db)
    const userRepo = new SqliteUserRepo(db)

    const user = await userRepo.findByClerkUserId(userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // 쿼리 파싱
    const queryParser = new QueryParserService()
    const parsedQuery = queryParser.parseNaturalQuery(query)

    // 검색 요청 생성
    const pathRequest = await pathRequestRepo.create({
      userId: user.id,
      query,
      queryType: 'natural',
      parsedCriteria: {
        companies: parsedQuery.entities.companies,
        schools: [],
        roles: parsedQuery.entities.roles,
        skills: parsedQuery.entities.skills,
        keywords: [],
      },
      searchConfig: {
        maxDepth: searchConfig?.maxDepth || 2,
        maxResults: searchConfig?.maxResults || 10,
        minConfidence: searchConfig?.minConfidence || 50,
        includeNonUsers: searchConfig?.includeNonUsers || false,
      },
      results: [],
      status: 'pending',
    })

    // 경로 검색 실행
    const pathFinderService = new PathFinderService(
      pathRequestRepo,
      networkNodeRepo,
      connectionRepo
    )

    const results = await pathFinderService.searchPath(pathRequest.id)

    return NextResponse.json({ pathRequest: pathRequest.id, results })
  } catch (error) {
    console.error('Error searching path:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

