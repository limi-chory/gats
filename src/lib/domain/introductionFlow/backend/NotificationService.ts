/**
 * Notification Service
 * 알림 전송 비즈니스 로직 (Placeholder)
 */
export class NotificationService {
  /**
   * 새 요청 알림
   */
  async sendNewRequest(
    flowId: string,
    stepNumber: number,
    userId: string,
    message: string
  ): Promise<void> {
    console.log(`[Notification] New request to user ${userId}`)
    console.log(`  Flow: ${flowId}, Step: ${stepNumber}`)
    console.log(`  Message: ${message}`)
    
    // TODO: 실제 푸시/이메일/SMS 전송 구현
  }
  
  /**
   * 수락 알림
   */
  async sendAccepted(
    flowId: string,
    stepNumber: number,
    userId: string
  ): Promise<void> {
    console.log(`[Notification] Request accepted`)
    console.log(`  Flow: ${flowId}, Step: ${stepNumber}`)
    console.log(`  To user: ${userId}`)
    
    // TODO: 실제 알림 전송 구현
  }
  
  /**
   * 거절 알림
   */
  async sendDeclined(
    flowId: string,
    stepNumber: number,
    userId: string,
    message?: string
  ): Promise<void> {
    console.log(`[Notification] Request declined`)
    console.log(`  Flow: ${flowId}, Step: ${stepNumber}`)
    console.log(`  To user: ${userId}`)
    console.log(`  Reason: ${message || 'No reason provided'}`)
    
    // TODO: 실제 알림 전송 구현
  }
  
  /**
   * 완료 알림
   */
  async sendCompleted(flowId: string, userId: string): Promise<void> {
    console.log(`[Notification] Introduction completed`)
    console.log(`  Flow: ${flowId}`)
    console.log(`  To user: ${userId}`)
    
    // TODO: 실제 알림 전송 구현
  }
  
  /**
   * 리마인더 알림
   */
  async sendReminder(
    flowId: string,
    stepNumber: number,
    userId: string
  ): Promise<void> {
    console.log(`[Notification] Reminder`)
    console.log(`  Flow: ${flowId}, Step: ${stepNumber}`)
    console.log(`  To user: ${userId}`)
    
    // TODO: 실제 알림 전송 구현
  }
}

