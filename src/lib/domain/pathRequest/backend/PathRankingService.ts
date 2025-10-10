import type { PathResult } from '../types'

/**
 * Path Ranking Service
 * 경로 결과 순위 결정 비즈니스 로직
 */
export class PathRankingService {
  /**
   * 경로 결과 순위 매기기
   */
  rankResults(results: PathResult[]): PathResult[] {
    // 점수 계산
    const scoredResults = results.map(result => ({
      result,
      score: this.calculateScore(result),
    }))
    
    // 점수 기준 정렬
    scoredResults.sort((a, b) => b.score - a.score)
    
    // 순위 설정
    return scoredResults.map((item, index) => ({
      ...item.result,
      rank: index + 1,
    }))
  }
  
  /**
   * 종합 점수 계산
   */
  private calculateScore(result: PathResult): number {
    // 가중치 설정
    const weights = {
      confidence: 0.4,      // 매칭 정확도
      pathStrength: 0.3,    // 경로 강도
      depth: 0.2,           // 촌수 (짧을수록 좋음)
      isGatsUser: 0.1,      // GATS 가입자 여부
    }
    
    // 신뢰도 점수
    const confidenceScore = result.confidence * weights.confidence
    
    // 경로 강도 점수
    const strengthScore = result.pathStrength * weights.pathStrength
    
    // 촌수 점수 (짧을수록 높은 점수)
    const depthScore = ((4 - result.depth) / 3) * 100 * weights.depth
    
    // GATS 사용자 점수
    const isUserScore = result.targetNode.userId ? 100 * weights.isGatsUser : 0
    
    const totalScore = confidenceScore + strengthScore + depthScore + isUserScore
    
    return Math.round(totalScore)
  }
  
  /**
   * 결과 필터링
   */
  filterResults(
    results: PathResult[],
    minConfidence: number,
    maxResults: number
  ): PathResult[] {
    return results
      .filter(r => r.confidence >= minConfidence)
      .slice(0, maxResults)
  }
}

