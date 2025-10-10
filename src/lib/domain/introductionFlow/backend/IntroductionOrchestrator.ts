import type { IIntroductionRepo } from './IntroductionRepo.interface'
import type { IPathRequestRepo } from '../../pathRequest/backend/PathRequestRepo.interface'
import type { IUserRepo } from '../../user/backend/UserRepo.interface'
import type { IntroductionFlow, IntroductionStep } from '../types'
import { NotificationService } from './NotificationService'
import { TemplateService } from './TemplateService'

/**
 * Introduction Orchestrator
 * 소개 플로우 오케스트레이션 비즈니스 로직
 */
export class IntroductionOrchestrator {
  private notificationService: NotificationService
  private templateService: TemplateService
  
  constructor(
    private introRepo: IIntroductionRepo,
    private pathRequestRepo: IPathRequestRepo,
    private userRepo: IUserRepo
  ) {
    this.notificationService = new NotificationService()
    this.templateService = new TemplateService()
  }
  
  /**
   * 소개 플로우 시작
   */
  async startIntroduction(
    requesterId: string,
    pathRequestId: string,
    pathResultIndex: number
  ): Promise<IntroductionFlow> {
    // 경로 요청 조회
    const pathRequest = await this.pathRequestRepo.findById(pathRequestId)
    if (!pathRequest) {
      throw new Error('Path request not found')
    }
    
    const pathResult = pathRequest.results[pathResultIndex]
    if (!pathResult) {
      throw new Error('Path result not found')
    }
    
    // 경로에서 사용자 ID 추출
    const path = pathResult.path
      .filter(node => node.userId)
      .map(node => node.userId!)
    
    if (path.length < 2) {
      throw new Error('Invalid path: not enough users')
    }
    
    // 단계 생성
    const steps: IntroductionStep[] = []
    for (let i = 0; i < path.length - 1; i++) {
      const fromUserId = path[i]
      const toUserId = path[i + 1]
      
      steps.push({
        stepNumber: i,
        fromUserId,
        toUserId,
        request: {
          message: await this.templateService.generateRequestMessage(
            fromUserId,
            toUserId,
            pathResult.targetNode.name
          ),
          sentAt: new Date(),
          expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000), // 72시간
        },
        notifications: {
          reminderSent: false,
          reminderCount: 0,
        },
      })
    }
    
    // 소개 플로우 생성
    const flow = await this.introRepo.create({
      pathRequestId,
      requesterId,
      targetNodeId: pathResult.targetNode.nodeId,
      path,
      pathDetails: pathResult.path.map(node => ({
        userId: node.userId!,
        name: node.name,
        company: node.company,
        role: node.role,
      })),
      currentStep: 0,
      status: 'pending',
      steps,
      expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000),
    })
    
    // 첫 단계 시작
    await this.sendStepRequest(flow.id, 0)
    
    return flow
  }
  
  /**
   * 단계 요청 전송
   */
  async sendStepRequest(flowId: string, stepNumber: number): Promise<void> {
    const flow = await this.introRepo.findById(flowId)
    if (!flow) {
      throw new Error('Introduction flow not found')
    }
    
    const step = flow.steps[stepNumber]
    if (!step) {
      throw new Error('Step not found')
    }
    
    // 알림 전송
    await this.notificationService.sendNewRequest(
      flowId,
      stepNumber,
      step.toUserId,
      step.request.message
    )
    
    // 상태 업데이트
    await this.introRepo.updateStatus(flowId, 'in_progress')
    await this.introRepo.updateCurrentStep(flowId, stepNumber)
  }
  
  /**
   * 단계 응답 처리
   */
  async respondToStep(
    flowId: string,
    stepNumber: number,
    userId: string,
    accepted: boolean,
    message?: string
  ): Promise<void> {
    const flow = await this.introRepo.findById(flowId)
    if (!flow) {
      throw new Error('Introduction flow not found')
    }
    
    const step = flow.steps[stepNumber]
    if (!step) {
      throw new Error('Step not found')
    }
    
    if (step.toUserId !== userId) {
      throw new Error('User is not authorized to respond to this step')
    }
    
    // 응답 업데이트
    step.response = {
      status: accepted ? 'accepted' : 'declined',
      message,
      respondedAt: new Date(),
    }
    
    await this.introRepo.updateSteps(flowId, flow.steps)
    
    if (accepted) {
      // 수락: 다음 단계로 진행
      await this.notificationService.sendAccepted(flowId, stepNumber, flow.requesterId)
      
      if (stepNumber === flow.steps.length - 1) {
        // 마지막 단계 완료
        await this.completeIntroduction(flowId)
      } else {
        // 다음 단계 시작
        await this.sendStepRequest(flowId, stepNumber + 1)
      }
    } else {
      // 거절: 플로우 실패
      await this.introRepo.updateStatus(flowId, 'failed')
      await this.notificationService.sendDeclined(
        flowId,
        stepNumber,
        flow.requesterId,
        message
      )
    }
  }
  
  /**
   * 소개 완료
   */
  private async completeIntroduction(flowId: string): Promise<void> {
    const flow = await this.introRepo.findById(flowId)
    if (!flow) {
      throw new Error('Introduction flow not found')
    }
    
    // 최종 타겟의 연락처 정보 전달 (실제로는 더 복잡한 로직 필요)
    await this.introRepo.updateCompletionInfo(flowId, {
      introductionMessage: '소개가 완료되었습니다!',
      completedAt: new Date(),
    })
    
    await this.introRepo.updateStatus(flowId, 'completed')
    
    // 완료 알림
    await this.notificationService.sendCompleted(flowId, flow.requesterId)
  }
  
  /**
   * 만료된 소개 플로우 처리
   */
  async handleExpiredFlows(): Promise<void> {
    const expiredFlows = await this.introRepo.findExpired()
    
    for (const flow of expiredFlows) {
      await this.introRepo.updateStatus(flow.id, 'expired')
      // 만료 알림 전송
    }
  }
}

