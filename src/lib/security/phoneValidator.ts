/**
 * 전화번호 유효성 검증 유틸리티
 */

/**
 * 한국 전화번호 형식 검증
 * @param phoneNumber - 검증할 전화번호
 * @returns 유효성 여부
 */
export function isValidKoreanPhone(phoneNumber: string): boolean {
  // 숫자만 추출
  const cleaned = phoneNumber.replace(/\D/g, '')
  
  // 한국 전화번호 패턴
  // - 휴대폰: 010, 011, 016, 017, 018, 019로 시작하는 10-11자리
  // - 지역번호: 02(서울), 031-070 등으로 시작
  const patterns = [
    /^01[0-9]\d{7,8}$/,  // 휴대폰 (010, 011, 016, 017, 018, 019)
    /^02\d{7,8}$/,        // 서울 지역번호
    /^0[3-6][0-9]\d{7,8}$/, // 기타 지역번호
    /^070\d{7,8}$/,       // 인터넷 전화
  ]
  
  return patterns.some(pattern => pattern.test(cleaned))
}

/**
 * 국제 전화번호 형식 검증 (기본적인 검증)
 * @param phoneNumber - 검증할 전화번호
 * @returns 유효성 여부
 */
export function isValidInternationalPhone(phoneNumber: string): boolean {
  // 숫자만 추출
  const cleaned = phoneNumber.replace(/\D/g, '')
  
  // 국제 전화번호는 일반적으로 8-15자리
  // + 기호로 시작할 수 있음
  return cleaned.length >= 8 && cleaned.length <= 15
}

/**
 * 전화번호 형식 정규화
 * @param phoneNumber - 원본 전화번호
 * @returns 정규화된 전화번호 (숫자만)
 */
export function normalizePhoneNumber(phoneNumber: string): string {
  return phoneNumber.replace(/\D/g, '')
}

/**
 * 전화번호 마스킹 (보안 표시용)
 * @param phoneNumber - 마스킹할 전화번호
 * @returns 마스킹된 전화번호 (예: 010-****-5678)
 */
export function maskPhoneNumber(phoneNumber: string): string {
  const cleaned = normalizePhoneNumber(phoneNumber)
  
  if (cleaned.length < 8) {
    return '***-****-****'
  }
  
  // 한국 휴대폰 번호 형식 (010-XXXX-YYYY)
  if (cleaned.startsWith('010') && cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}-****-${cleaned.slice(-4)}`
  }
  
  // 한국 지역번호 (02-XXX-YYYY or 0XX-XXXX-YYYY)
  if (cleaned.startsWith('02')) {
    return `${cleaned.slice(0, 2)}-***-${cleaned.slice(-4)}`
  }
  
  // 기타 형식
  const visibleStart = cleaned.slice(0, 3)
  const visibleEnd = cleaned.slice(-4)
  return `${visibleStart}-****-${visibleEnd}`
}

/**
 * 전화번호 포맷팅 (표시용)
 * @param phoneNumber - 포맷팅할 전화번호
 * @returns 포맷팅된 전화번호
 */
export function formatPhoneNumber(phoneNumber: string): string {
  const cleaned = normalizePhoneNumber(phoneNumber)
  
  // 한국 휴대폰 번호 (010-1234-5678)
  if (cleaned.startsWith('010') && cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`
  }
  
  // 서울 지역번호 (02-123-4567 or 02-1234-5678)
  if (cleaned.startsWith('02')) {
    if (cleaned.length === 9) {
      return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 5)}-${cleaned.slice(5)}`
    } else if (cleaned.length === 10) {
      return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 6)}-${cleaned.slice(6)}`
    }
  }
  
  // 기타 지역번호 (031-123-4567 or 031-1234-5678)
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  } else if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`
  }
  
  // 포맷팅 불가능한 경우 원본 반환
  return phoneNumber
}

/**
 * 전화번호 유효성 검증 결과 타입
 */
export interface PhoneValidationResult {
  isValid: boolean
  normalized?: string
  formatted?: string
  error?: string
}

/**
 * 전화번호 전체 검증
 * @param phoneNumber - 검증할 전화번호
 * @param countryCode - 국가 코드 (기본: 'KR')
 * @returns 검증 결과
 */
export function validatePhoneNumber(
  phoneNumber: string,
  countryCode: string = 'KR'
): PhoneValidationResult {
  if (!phoneNumber || phoneNumber.trim() === '') {
    return {
      isValid: false,
      error: '전화번호를 입력해주세요.',
    }
  }
  
  const normalized = normalizePhoneNumber(phoneNumber)
  
  if (normalized.length < 8) {
    return {
      isValid: false,
      error: '전화번호가 너무 짧습니다.',
    }
  }
  
  let isValid = false
  
  if (countryCode === 'KR') {
    isValid = isValidKoreanPhone(phoneNumber)
    if (!isValid) {
      return {
        isValid: false,
        error: '올바른 한국 전화번호 형식이 아닙니다.',
      }
    }
  } else {
    isValid = isValidInternationalPhone(phoneNumber)
    if (!isValid) {
      return {
        isValid: false,
        error: '올바른 전화번호 형식이 아닙니다.',
      }
    }
  }
  
  return {
    isValid: true,
    normalized,
    formatted: formatPhoneNumber(phoneNumber),
  }
}

