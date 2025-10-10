'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Mock 데이터
interface SearchResult {
  id: string;
  targetName: string;
  targetCompany?: string;
  targetRole?: string;
  pathLength: number; // 촌수
  confidence: number; // 매칭 정확도 0-100
  pathStrength: number; // 경로 강도 0-100
  path: PathNode[];
  matchedCriteria: string[];
}

interface PathNode {
  name: string;
  company?: string;
  role?: string;
  relation?: string;
}

const MOCK_SEARCH_RESULTS: SearchResult[] = [
  {
    id: '1',
    targetName: '강민호',
    targetCompany: '구글',
    targetRole: '소프트웨어 엔지니어',
    pathLength: 2,
    confidence: 95,
    pathStrength: 85,
    matchedCriteria: ['구글', '개발자', '소프트웨어 엔지니어', '시니어', 'Google'],
    path: [
      { name: '나', company: '네이버' },
      { name: '김철수', company: '네이버', role: '시니어 개발자', relation: '회사 동료' },
      { name: '강민호', company: '구글', role: '소프트웨어 엔지니어', relation: '전 직장 동료' },
    ],
  },
  {
    id: '2',
    targetName: '정수현',
    targetCompany: '네이버',
    targetRole: '백엔드 개발자',
    pathLength: 1,
    confidence: 98,
    pathStrength: 95,
    matchedCriteria: ['네이버', '개발자', '백엔드', '시니어', 'Naver'],
    path: [
      { name: '나', company: '네이버' },
      { name: '정수현', company: '네이버', role: '백엔드 개발자', relation: '같은 팀' },
    ],
  },
  {
    id: '3',
    targetName: '이서연',
    targetCompany: '카카오',
    targetRole: 'UX 디자이너',
    pathLength: 2,
    confidence: 92,
    pathStrength: 88,
    matchedCriteria: ['카카오', '디자이너', 'UX', 'UI', 'Kakao'],
    path: [
      { name: '나', company: '네이버' },
      { name: '박지훈', company: '라인', role: '디자인 리드', relation: '전 직장 동료' },
      { name: '이서연', company: '카카오', role: 'UX 디자이너', relation: '디자인 커뮤니티' },
    ],
  },
  {
    id: '4',
    targetName: '최준영',
    targetCompany: '토스',
    targetRole: '프로덕트 매니저',
    pathLength: 2,
    confidence: 90,
    pathStrength: 82,
    matchedCriteria: ['토스', 'PM', '프로덕트', '매니저', 'Toss', '비바리퍼블리카'],
    path: [
      { name: '나', company: '네이버' },
      { name: '김민지', company: '네이버', role: 'PM', relation: '회사 동료' },
      { name: '최준영', company: '토스', role: '프로덕트 매니저', relation: '대학 선배' },
    ],
  },
  {
    id: '5',
    targetName: '박민준',
    targetCompany: '마이스타트업',
    targetRole: '대표 (창업가)',
    pathLength: 1,
    confidence: 96,
    pathStrength: 90,
    matchedCriteria: ['스타트업', '창업가', '대표', 'CEO', '창업'],
    path: [
      { name: '나', company: '네이버' },
      { name: '박민준', company: '마이스타트업', role: '대표', relation: '대학 동기' },
    ],
  },
  {
    id: '6',
    targetName: '송유진',
    targetCompany: 'Y Combinator',
    targetRole: '파트너',
    pathLength: 3,
    confidence: 85,
    pathStrength: 75,
    matchedCriteria: ['투자자', '스타트업', 'Y Combinator', 'YC', '파트너', '벤처캐피탈', '시리즈 A', 'VC'],
    path: [
      { name: '나', company: '네이버' },
      { name: '박민준', company: '마이스타트업', role: '창업가', relation: '대학 동기' },
      { name: '송유진', company: 'Y Combinator', role: '파트너', relation: '투자자' },
    ],
  },
  {
    id: '7',
    targetName: '한재민',
    targetCompany: '쿠팡',
    targetRole: 'VP of Engineering',
    pathLength: 2,
    confidence: 88,
    pathStrength: 80,
    matchedCriteria: ['쿠팡', '개발', 'VP', 'Engineering', '임원', 'Coupang'],
    path: [
      { name: '나', company: '네이버' },
      { name: '이영희', company: '네이버', role: 'PM', relation: '회사 동료' },
      { name: '한재민', company: '쿠팡', role: 'VP of Engineering', relation: '대학 동기' },
    ],
  },
];

const SUGGESTED_QUERIES = [
  '네이버 다니는 개발자',
  '시리즈 A 투자자',
  '카카오 디자이너',
  '구글 소프트웨어 엔지니어',
  '스타트업 창업가',
  '토스 프로덕트 매니저',
];

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (!query.trim()) return;

    setIsSearching(true);
    setHasSearched(false);

    // Mock: AI 검색 시뮬레이션
    setTimeout(() => {
      // 쿼리를 단어로 분리해서 필터링 (간단한 키워드 매칭)
      const searchWords = query.toLowerCase().split(/\s+/);
      const filtered = MOCK_SEARCH_RESULTS.filter(result => {
        const targetText = [
          result.targetCompany || '',
          result.targetRole || '',
          result.targetName || '',
          ...result.matchedCriteria
        ].join(' ').toLowerCase();
        
        // 검색어의 모든 단어가 포함되어 있으면 매칭
        return searchWords.every(word => targetText.includes(word));
      });

      setResults(filtered);
      setIsSearching(false);
      setHasSearched(true);
    }, 1500);
  };

  const handleSuggestedQuery = (suggestedQuery: string) => {
    setQuery(suggestedQuery);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              AI 연결 검색 🔍
            </h1>
            <div className="bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 text-xs font-bold px-3 py-1 rounded">
              📝 Mock 데이터
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Search Box */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              누구를 만나고 싶으세요?
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              자연스럽게 말해보세요. AI가 당신의 네트워크에서 찾아드립니다.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative mb-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="예: 구글 다니는 개발자, 시리즈 A 투자자..."
              className="w-full px-6 py-4 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={handleSearch}
              disabled={isSearching || !query.trim()}
              className={`absolute right-2 top-2 px-6 py-2 rounded-lg font-semibold transition-all ${
                isSearching || !query.trim()
                  ? 'bg-gray-200 dark:bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isSearching ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  검색 중...
                </span>
              ) : (
                '검색'
              )}
            </button>
          </div>

          {/* Suggested Queries */}
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">추천 검색어:</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_QUERIES.map((sq) => (
                <button
                  key={sq}
                  onClick={() => handleSuggestedQuery(sq)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {sq}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search Results */}
        {isSearching && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              네트워크를 분석하고 있습니다...
            </p>
          </div>
        )}

        {!isSearching && hasSearched && results.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              검색 결과가 없습니다
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              &ldquo;{query}&rdquo;에 해당하는 사람을 찾지 못했어요.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              다른 키워드로 검색해보시거나, 연락처를 더 추가해보세요!
            </p>
          </div>
        )}

        {!isSearching && results.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {results.length}개의 연결 경로를 찾았습니다
              </h3>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                신뢰도 높은 순
              </div>
            </div>

            {results.map((result, index) => (
              <div
                key={result.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        #{index + 1}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                          {result.targetName}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          {result.targetRole} @ {result.targetCompany}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold mb-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        {result.confidence}% 일치
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {result.pathLength}촌
                      </div>
                    </div>
                  </div>

                  {/* Matched Criteria */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {result.matchedCriteria.map((criteria) => (
                      <span
                        key={criteria}
                        className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-xs font-medium"
                      >
                        ✓ {criteria}
                      </span>
                    ))}
                  </div>

                  {/* Path Visualization */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-3">
                      연결 경로:
                    </p>
                    <div className="flex items-center gap-2 overflow-x-auto">
                      {result.path.map((node, idx) => (
                        <div key={idx} className="flex items-center gap-2 flex-shrink-0">
                          <div className="text-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                              idx === 0 ? 'bg-blue-600' :
                              idx === result.path.length - 1 ? 'bg-purple-600' :
                              'bg-gray-400'
                            }`}>
                              {node.name[0]}
                            </div>
                            <p className="text-xs font-medium text-gray-900 dark:text-white mt-1">
                              {node.name}
                            </p>
                            {node.relation && (
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {node.relation}
                              </p>
                            )}
                          </div>
                          {idx < result.path.length - 1 && (
                            <svg className="w-6 h-6 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">매칭 정확도</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${result.confidence}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {result.confidence}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">경로 강도</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${result.pathStrength}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {result.pathStrength}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => router.push(`/path/${result.id}`)}
                    className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    이 경로로 소개 요청하기 →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Box */}
        {!hasSearched && (
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              💡 검색 팁
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400">✓</span>
                <span><strong>회사 이름:</strong> &ldquo;네이버&rdquo;, &ldquo;구글&rdquo;, &ldquo;카카오&rdquo;</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400">✓</span>
                <span><strong>직무:</strong> &ldquo;개발자&rdquo;, &ldquo;디자이너&rdquo;, &ldquo;PM&rdquo;</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400">✓</span>
                <span><strong>조합:</strong> &ldquo;토스 다니는 프로덕트 매니저&rdquo;</span>
              </li>
            </ul>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-3">
              ⚠️ 프로토타입: 실제 AI 검색은 구현되지 않았습니다. Mock 데이터로 시연합니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

