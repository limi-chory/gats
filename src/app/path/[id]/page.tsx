'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';

// Path 타입 정의
interface PathNode {
  step: number;
  name: string;
  company: string;
  role: string;
  relation: string | null;
  bio: string;
  connectionStrength: number;
  mutualConnections?: number;
  lastContact?: string;
  responseRate?: number;
  yearsOfConnection?: number;
  interests?: string[];
  linkedIn?: string;
}

interface AlternativePath {
  id: string;
  firstPerson: string;
  length: number;
  strength: number;
}

interface PathData {
  id: string;
  targetName: string;
  targetCompany: string;
  targetRole: string;
  pathLength: number;
  confidence: number;
  pathStrength: number;
  estimatedSuccessRate: number;
  estimatedResponseTime: string;
  matchedCriteria: string[];
  path: PathNode[];
  alternativePaths?: AlternativePath[];
  insights?: {
    title: string;
    description: string;
    icon: string;
  }[];
  whyThisPath?: string[];
}

// Mock 데이터 (검색 결과에서 선택한 경로)
const MOCK_PATH_DATA: Record<string, PathData> = {
  '1': {
    id: '1',
    targetName: '강민호',
    targetCompany: '구글',
    targetRole: '소프트웨어 엔지니어',
    pathLength: 2,
    confidence: 95,
    pathStrength: 85,
    estimatedSuccessRate: 78,
    estimatedResponseTime: '2-3일',
    matchedCriteria: ['구글', '개발자', '시니어'],
    path: [
      {
        step: 0,
        name: '나',
        company: '네이버',
        role: 'PM',
        relation: null,
        bio: '현재 네이버에서 프로덕트 매니저로 일하고 있습니다.',
        connectionStrength: 100,
      },
      {
        step: 1,
        name: '김철수',
        company: '네이버',
        role: '시니어 개발자',
        relation: '회사 동료',
        bio: '네이버 검색팀에서 7년째 근무 중. 구글 출신 개발자들과 네트워크가 넓습니다.',
        connectionStrength: 90,
        mutualConnections: 12,
        lastContact: '1주 전',
        responseRate: 85,
      },
      {
        step: 2,
        name: '강민호',
        company: '구글',
        role: '소프트웨어 엔지니어',
        relation: '전 직장 동료',
        bio: '구글 서울 오피스에서 검색 인프라 개발. 네이버에서 김철수와 5년간 같은 팀이었습니다.',
        connectionStrength: 80,
        yearsOfConnection: 3,
        interests: ['머신러닝', '분산 시스템', '클라우드'],
      },
    ],
    alternativePaths: [
      {
        id: '1-alt-1',
        length: 3,
        strength: 70,
        firstPerson: '이영희',
      },
    ],
    whyThisPath: [
      '김철수님은 응답률이 85%로 매우 높습니다',
      '강민호님과 5년간 같은 팀에서 근무한 친한 사이입니다',
      '최근 1주일 전에 연락한 활발한 관계입니다',
    ],
  },
  '2': {
    id: '2',
    targetName: '정수현',
    targetCompany: '네이버',
    targetRole: '백엔드 개발자',
    pathLength: 1,
    confidence: 98,
    pathStrength: 95,
    estimatedSuccessRate: 95,
    estimatedResponseTime: '당일',
    matchedCriteria: ['네이버', '개발자', '백엔드'],
    path: [
      {
        step: 0,
        name: '나',
        company: '네이버',
        role: 'PM',
        relation: null,
        bio: '현재 네이버에서 프로덕트 매니저로 일하고 있습니다.',
        connectionStrength: 100,
      },
      {
        step: 1,
        name: '정수현',
        company: '네이버',
        role: '백엔드 개발자',
        relation: '같은 팀',
        bio: '네이버 클라우드팀에서 3년째 근무 중. 마이크로서비스 아키텍처 전문가입니다.',
        connectionStrength: 95,
        mutualConnections: 25,
        lastContact: '어제',
        responseRate: 98,
        interests: ['쿠버네티스', 'Go', '분산 시스템'],
      },
    ],
    alternativePaths: [],
    whyThisPath: [
      '같은 팀에서 일하는 매우 가까운 동료입니다',
      '응답률이 98%로 거의 확실합니다',
      '어제 대화한 활발한 관계입니다',
    ],
  },
  '3': {
    id: '3',
    targetName: '이서연',
    targetCompany: '카카오',
    targetRole: 'UX 디자이너',
    pathLength: 2,
    confidence: 92,
    pathStrength: 88,
    estimatedSuccessRate: 82,
    estimatedResponseTime: '2-3일',
    matchedCriteria: ['카카오', '디자이너', 'UX'],
    path: [
      {
        step: 0,
        name: '나',
        company: '네이버',
        role: 'PM',
        relation: null,
        bio: '현재 네이버에서 프로덕트 매니저로 일하고 있습니다.',
        connectionStrength: 100,
      },
      {
        step: 1,
        name: '박지훈',
        company: '라인',
        role: '디자인 리드',
        relation: '전 직장 동료',
        bio: '라인에서 5년간 디자인팀을 이끌고 있습니다. 디자인 커뮤니티에서 활발히 활동 중.',
        connectionStrength: 85,
        mutualConnections: 8,
        lastContact: '2주 전',
        responseRate: 90,
      },
      {
        step: 2,
        name: '이서연',
        company: '카카오',
        role: 'UX 디자이너',
        relation: '디자인 커뮤니티',
        bio: '카카오에서 모빌리티 서비스 UX를 담당하고 있습니다. 사용자 리서치 전문가입니다.',
        connectionStrength: 80,
        yearsOfConnection: 2,
        interests: ['사용자 리서치', '인터랙션 디자인', '접근성'],
      },
    ],
    alternativePaths: [
      {
        id: '3-alt-1',
        length: 3,
        strength: 72,
        firstPerson: '김민지',
      },
    ],
    whyThisPath: [
      '박지훈님은 디자인 커뮤니티에서 영향력이 큽니다',
      '이서연님과 2년간 꾸준히 교류한 사이입니다',
      '박지훈님의 응답률이 90%로 매우 높습니다',
    ],
  },
  '4': {
    id: '4',
    targetName: '최준영',
    targetCompany: '토스',
    targetRole: '프로덕트 매니저',
    pathLength: 2,
    confidence: 90,
    pathStrength: 82,
    estimatedSuccessRate: 80,
    estimatedResponseTime: '3-4일',
    matchedCriteria: ['토스', 'PM', '프로덕트'],
    path: [
      {
        step: 0,
        name: '나',
        company: '네이버',
        role: 'PM',
        relation: null,
        bio: '현재 네이버에서 프로덕트 매니저로 일하고 있습니다.',
        connectionStrength: 100,
      },
      {
        step: 1,
        name: '김민지',
        company: '네이버',
        role: 'PM',
        relation: '회사 동료',
        bio: '네이버 페이팀에서 4년째 PM으로 일하고 있습니다. 핀테크 경험이 풍부합니다.',
        connectionStrength: 88,
        mutualConnections: 15,
        lastContact: '3일 전',
        responseRate: 87,
      },
      {
        step: 2,
        name: '최준영',
        company: '토스',
        role: '프로덕트 매니저',
        relation: '대학 선배',
        bio: '토스에서 대출 서비스를 담당하고 있습니다. 데이터 기반 의사결정을 중시합니다.',
        connectionStrength: 75,
        yearsOfConnection: 5,
        interests: ['핀테크', 'A/B 테스팅', '그로스'],
      },
    ],
    alternativePaths: [
      {
        id: '4-alt-1',
        length: 3,
        strength: 68,
        firstPerson: '이영희',
      },
    ],
    whyThisPath: [
      '김민지님은 핀테크 경험이 풍부합니다',
      '최준영님과 5년간 알고 지낸 대학 선배입니다',
      '3일 전에 연락한 활발한 관계입니다',
    ],
  },
  '5': {
    id: '5',
    targetName: '박민준',
    targetCompany: '마이스타트업',
    targetRole: '대표 (창업가)',
    pathLength: 1,
    confidence: 96,
    pathStrength: 90,
    estimatedSuccessRate: 92,
    estimatedResponseTime: '1-2일',
    matchedCriteria: ['스타트업', '창업가', '대표'],
    path: [
      {
        step: 0,
        name: '나',
        company: '네이버',
        role: 'PM',
        relation: null,
        bio: '현재 네이버에서 프로덕트 매니저로 일하고 있습니다.',
        connectionStrength: 100,
      },
      {
        step: 1,
        name: '박민준',
        company: '마이스타트업',
        role: '대표',
        relation: '대학 동기',
        bio: 'AI 기반 헬스케어 스타트업을 운영하고 있습니다. 시리즈 A 투자 유치 성공.',
        connectionStrength: 90,
        mutualConnections: 20,
        lastContact: '5일 전',
        responseRate: 95,
        interests: ['AI', '헬스케어', '창업'],
      },
    ],
    alternativePaths: [],
    whyThisPath: [
      '대학 동기로 10년 이상 알고 지낸 사이입니다',
      '응답률이 95%로 매우 높습니다',
      '5일 전에 연락한 활발한 관계입니다',
    ],
  },
  '6': {
    id: '6',
    targetName: '송유진',
    targetCompany: 'Y Combinator',
    targetRole: '파트너',
    pathLength: 3,
    confidence: 85,
    pathStrength: 75,
    estimatedSuccessRate: 70,
    estimatedResponseTime: '5-7일',
    matchedCriteria: ['투자자', '시리즈 A', 'YC'],
    path: [
      {
        step: 0,
        name: '나',
        company: '네이버',
        role: 'PM',
        relation: null,
        bio: '현재 네이버에서 프로덕트 매니저로 일하고 있습니다.',
        connectionStrength: 100,
      },
      {
        step: 1,
        name: '박민준',
        company: '마이스타트업',
        role: '창업가',
        relation: '대학 동기',
        bio: 'AI 기반 헬스케어 스타트업 운영 중. YC 출신 투자자들과 네트워크가 넓습니다.',
        connectionStrength: 90,
        mutualConnections: 20,
        lastContact: '5일 전',
        responseRate: 95,
      },
      {
        step: 2,
        name: '이준호',
        company: 'Sequoia Capital',
        role: '투자 담당',
        relation: '투자자',
        bio: '박민준 스타트업에 투자한 투자자. YC 네트워크에 연결되어 있습니다.',
        connectionStrength: 70,
        yearsOfConnection: 1,
      },
      {
        step: 3,
        name: '송유진',
        company: 'Y Combinator',
        role: '파트너',
        relation: '투자 커뮤니티',
        bio: 'Y Combinator 파트너로 초기 스타트업 투자를 담당합니다. 한국 시장에 관심이 많습니다.',
        connectionStrength: 65,
        yearsOfConnection: 2,
        interests: ['초기 투자', '한국 시장', 'B2B SaaS'],
      },
    ],
    alternativePaths: [
      {
        id: '6-alt-1',
        length: 4,
        strength: 62,
        firstPerson: '김철수',
      },
    ],
    whyThisPath: [
      '박민준님은 YC 출신 투자자들과 네트워크가 넓습니다',
      '이준호님을 통해 송유진님과 연결되어 있습니다',
      '송유진님은 한국 시장에 관심이 많습니다',
    ],
  },
  '7': {
    id: '7',
    targetName: '한재민',
    targetCompany: '쿠팡',
    targetRole: 'VP of Engineering',
    pathLength: 2,
    confidence: 88,
    pathStrength: 80,
    estimatedSuccessRate: 75,
    estimatedResponseTime: '4-5일',
    matchedCriteria: ['쿠팡', '개발', 'VP'],
    path: [
      {
        step: 0,
        name: '나',
        company: '네이버',
        role: 'PM',
        relation: null,
        bio: '현재 네이버에서 프로덕트 매니저로 일하고 있습니다.',
        connectionStrength: 100,
      },
      {
        step: 1,
        name: '이영희',
        company: '네이버',
        role: 'PM',
        relation: '회사 동료',
        bio: '네이버 커머스팀에서 PM으로 일하고 있습니다. 이커머스 분야 경험이 풍부합니다.',
        connectionStrength: 85,
        mutualConnections: 10,
        lastContact: '1주 전',
        responseRate: 82,
      },
      {
        step: 2,
        name: '한재민',
        company: '쿠팡',
        role: 'VP of Engineering',
        relation: '대학 동기',
        bio: '쿠팡에서 물류 시스템 개발을 총괄하고 있습니다. 대규모 시스템 아키텍처 전문가입니다.',
        connectionStrength: 78,
        yearsOfConnection: 8,
        interests: ['물류 시스템', '대규모 인프라', '팀 빌딩'],
      },
    ],
    alternativePaths: [
      {
        id: '7-alt-1',
        length: 3,
        strength: 70,
        firstPerson: '김철수',
      },
    ],
    whyThisPath: [
      '이영희님은 이커머스 분야 경험이 풍부합니다',
      '한재민님과 8년간 알고 지낸 대학 동기입니다',
      '1주일 전에 연락한 활발한 관계입니다',
    ],
  },
};

export default function PathDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [showIntroductionModal, setShowIntroductionModal] = useState(false);

  const pathData = MOCK_PATH_DATA[id];

  if (!pathData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            경로를 찾을 수 없습니다
          </h2>
          <button
            onClick={() => router.push('/search')}
            className="text-blue-600 hover:underline"
          >
            검색으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/search')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              연결 경로 상세
            </h1>
            <div className="bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 text-xs font-bold px-3 py-1 rounded">
              📝 Mock 데이터
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Target Person Card */}
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-4xl font-bold">
                {pathData.targetName[0]}
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">{pathData.targetName}</h2>
                <p className="text-xl text-blue-100 mb-1">
                  {pathData.targetRole}
                </p>
                <p className="text-lg text-blue-100">
                  @ {pathData.targetCompany}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold mb-1">{pathData.pathLength}촌</div>
              <div className="text-blue-100">거리</div>
            </div>
          </div>

          {/* Matched Criteria */}
          <div className="flex flex-wrap gap-2">
            {pathData.matchedCriteria.map((criteria: string) => (
              <span
                key={criteria}
                className="px-4 py-2 bg-white/20 backdrop-blur rounded-full text-sm font-medium"
              >
                ✓ {criteria}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Metrics */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-4">
              예상 성공률
            </h3>
            <div className="text-4xl font-bold text-green-600 mb-2">
              {pathData.estimatedSuccessRate}%
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{ width: `${pathData.estimatedSuccessRate}%` }}
              />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-4">
              경로 강도
            </h3>
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {pathData.pathStrength}%
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${pathData.pathStrength}%` }}
              />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-4">
              예상 응답 시간
            </h3>
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {pathData.estimatedResponseTime}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              각 단계별 평균 응답 시간 기준
            </p>
          </div>
        </div>

        {/* Path Steps */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            연결 경로 ({pathData.pathLength}단계)
          </h3>

          <div className="space-y-6">
            {pathData.path.map((node: PathNode, index: number) => (
              <div key={index} className="relative">
                <div className="flex gap-6">
                  {/* Step Number */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                        index === 0
                          ? 'bg-blue-600'
                          : index === pathData.path.length - 1
                          ? 'bg-purple-600'
                          : 'bg-gray-400'
                      }`}
                    >
                      {index + 1}
                    </div>
                    {index < pathData.path.length - 1 && (
                      <div className="w-0.5 h-full bg-gray-300 dark:bg-gray-600 mt-2" />
                    )}
                  </div>

                  {/* Person Card */}
                  <div className="flex-1 pb-6">
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                            {node.name}
                            {index === 0 && (
                              <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs font-medium">
                                You
                              </span>
                            )}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400">
                            {node.role} {node.company && `@ ${node.company}`}
                          </p>
                          {node.relation && (
                            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                              {node.relation}
                            </div>
                          )}
                        </div>
                        {node.connectionStrength && (
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                              {node.connectionStrength}%
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              연결 강도
                            </div>
                          </div>
                        )}
                      </div>

                      {node.bio && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          {node.bio}
                        </p>
                      )}

                      {/* Additional Info */}
                      {index > 0 && (
                        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t dark:border-gray-600">
                          {node.mutualConnections && (
                            <div className="text-sm">
                              <span className="text-gray-500 dark:text-gray-400">공통 지인:</span>
                              <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                                {node.mutualConnections}명
                              </span>
                            </div>
                          )}
                          {node.lastContact && (
                            <div className="text-sm">
                              <span className="text-gray-500 dark:text-gray-400">최근 연락:</span>
                              <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                                {node.lastContact}
                              </span>
                            </div>
                          )}
                          {node.responseRate && (
                            <div className="text-sm">
                              <span className="text-gray-500 dark:text-gray-400">응답률:</span>
                              <span className="ml-2 font-semibold text-green-600">
                                {node.responseRate}%
                              </span>
                            </div>
                          )}
                          {node.yearsOfConnection && (
                            <div className="text-sm">
                              <span className="text-gray-500 dark:text-gray-400">연결 기간:</span>
                              <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                                {node.yearsOfConnection}년
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {node.interests && (
                        <div className="mt-4">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">관심사:</p>
                          <div className="flex flex-wrap gap-2">
                            {node.interests.map((interest: string) => (
                              <span
                                key={interest}
                                className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded text-xs"
                              >
                                {interest}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why This Path */}
        <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            왜 이 경로가 좋은가요?
          </h3>
          <ul className="space-y-2">
            {pathData.whyThisPath?.map((reason: string, index: number) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Alternative Paths */}
        {pathData.alternativePaths && pathData.alternativePaths.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              대안 경로
            </h3>
            <div className="space-y-3">
              {pathData.alternativePaths.map((alt: AlternativePath) => (
                <div
                  key={alt.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">🔄</div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {alt.firstPerson}님을 통한 경로
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {alt.length}단계 · 강도 {alt.strength}%
                      </p>
                    </div>
                  </div>
                  <button className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                    보기 🚧
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="sticky bottom-6 bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 border-2 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                이 경로로 소개를 요청하시겠어요?
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {pathData.path[1].name}님에게 먼저 연락이 갑니다
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/search')}
                className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
              >
                다른 경로 찾기
              </button>
              <button
                onClick={() => setShowIntroductionModal(true)}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl"
              >
                소개 요청 시작하기 →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Introduction Modal */}
      {showIntroductionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                🚧 기능 개발 중
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                소개 요청 기능은 곧 출시됩니다!
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                현재는 프로토타입 단계입니다.
              </p>
            </div>
            <button
              onClick={() => setShowIntroductionModal(false)}
              className="w-full px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

