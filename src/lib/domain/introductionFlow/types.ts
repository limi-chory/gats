// IntroductionFlow Domain Types

export interface IntroductionFlow {
  id: string
  pathRequestId: string             // 원본 검색 요청
  requesterId: string                // 요청자
  targetNodeId: string               // 최종 목표
  
  // 경로 정보
  path: string[]                    // 사용자 ID 배열
  pathDetails: IntroductionNode[]   // 상세 경로 정보
  
  // 상태 관리
  currentStep: number
  status: IntroductionStatus
  
  // 단계별 진행
  steps: IntroductionStep[]
  
  // 메시지 템플릿
  messageTemplate?: {
    subject: string
    body: string
    variables: Record<string, string>
  }
  
  // 최종 결과
  completionInfo?: {
    sharedContact?: {
      phoneNumber: string
      name: string
    }
    introductionMessage?: string
    completedAt: Date
  }
  
  // 메타데이터
  expiresAt: Date                   // 72시간 후
  createdAt: Date
  updatedAt: Date
}

export type IntroductionStatus = 
  | 'draft'                          // 작성 중
  | 'pending'                        // 대기 중
  | 'in_progress'                    // 진행 중
  | 'completed'                      // 완료
  | 'failed'                         // 실패
  | 'expired'                        // 만료
  | 'cancelled'                      // 취소됨

export interface IntroductionStep {
  stepNumber: number
  fromUserId: string
  toUserId: string
  
  // 요청 정보
  request: {
    message: string
    sentAt: Date
    expiresAt: Date
  }
  
  // 응답 정보
  response?: {
    status: 'accepted' | 'declined'
    message?: string                 // 거절 사유 등
    respondedAt: Date
  }
  
  // 알림 설정
  notifications: {
    reminderSent: boolean
    reminderCount: number
  }
}

export interface IntroductionNode {
  userId: string
  name: string
  company?: string
  role?: string
  relationToNext?: string           // "대학 동기", "전 직장 동료" 등
}

export interface IntroductionTemplate {
  id: string
  name: string
  category: 'business' | 'job' | 'investment' | 'general'
  subject: string
  body: string
  variables: string[]               // ["requesterName", "targetRole", ...]
  isDefault: boolean
}

export interface IntroductionNotification {
  flowId: string
  stepNumber: number
  userId: string                    // 수신자
  type: 'new_request' | 'reminder' | 'accepted' | 'declined' | 'completed'
  sentAt: Date
  channel: 'push' | 'email' | 'sms'
  delivered: boolean
}

export interface IntroductionStats {
  userId: string
  totalRequests: number
  successRate: number
  avgCompletionTime: number         // hours
  topIntroducers: Array<{
    userId: string
    name: string
    successCount: number
  }>
}

