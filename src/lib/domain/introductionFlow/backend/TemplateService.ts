/**
 * Template Service
 * 메시지 템플릿 비즈니스 로직
 */
export class TemplateService {
  /**
   * 요청 메시지 생성
   */
  async generateRequestMessage(
    fromUserId: string,
    toUserId: string,
    targetName: string
  ): Promise<string> {
    // 실제로는 DB에서 템플릿을 가져와서 변수 치환
    return `안녕하세요! ${targetName}님과 연결하고 싶어서 연락드립니다. 소개 부탁드려도 될까요?`
  }
  
  /**
   * 수락 메시지 생성
   */
  generateAcceptedMessage(targetName: string): string {
    return `${targetName}님과의 소개가 진행되고 있습니다.`
  }
  
  /**
   * 거절 메시지 생성
   */
  generateDeclinedMessage(reason?: string): string {
    const base = '소개 요청이 거절되었습니다.'
    return reason ? `${base} 사유: ${reason}` : base
  }
  
  /**
   * 완료 메시지 생성
   */
  generateCompletedMessage(targetName: string): string {
    return `${targetName}님과의 소개가 완료되었습니다! 연락처가 공유되었습니다.`
  }
  
  /**
   * 템플릿 변수 치환
   */
  private replaceVariables(
    template: string,
    variables: Record<string, string>
  ): string {
    let result = template
    
    for (const [key, value] of Object.entries(variables)) {
      result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value)
    }
    
    return result
  }
}

