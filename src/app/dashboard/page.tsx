"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Mock 데이터
const MOCK_PROFILE = {
  name: "김철수",
  company: "네이버",
  school: "서울대학교",
  interests: ["스타트업", "AI/ML", "투자"],
};

const MOCK_NETWORK_STATS = {
  totalContacts: 487,
  connectedUsers: 142,
  clusters: 8,
  strongConnections: 23,
};

const MOCK_RECENT_SEARCHES = [
  {
    id: "1",
    query: "시리즈 A 투자자 찾아줘",
    resultCount: 5,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2시간 전
  },
  {
    id: "2",
    query: "구글 다니는 개발자",
    resultCount: 3,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1일 전
  },
];

const MOCK_SUGGESTED_CONNECTIONS = [
  {
    id: "1",
    name: "이지혜",
    company: "카카오",
    role: "시니어 개발자",
    mutualConnections: 5,
    pathLength: 2,
  },
  {
    id: "2",
    name: "박민수",
    company: "Y Combinator",
    role: "파트너",
    mutualConnections: 3,
    pathLength: 3,
  },
];

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isNewUser] = useState(false);

  // Toast 메시지 표시 (미구현 기능 클릭 시)
  const showComingSoonToast = (featureName: string) => {
    alert(`🚧 "${featureName}" 기능은 곧 출시됩니다!\n\n현재는 프로토타입 단계입니다.`);
  };

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/");
    }
  }, [isLoaded, user, router]);

  // Mock: 실제로는 서버에서 유저 프로필 완료 여부 확인
  useEffect(() => {
    // 여기서 프로필이 완료되지 않았으면 온보딩으로 리다이렉트
    // 개발 중에는 주석 처리
    // const hasCompletedOnboarding = localStorage.getItem('onboarding_completed');
    // if (!hasCompletedOnboarding && isLoaded && user) {
    //   setIsNewUser(true);
    //   router.push('/onboarding');
    // }
  }, [isLoaded, user, router]);

  if (!isLoaded || isNewUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">로딩 중...</p>
        </div>
      </div>
    );
  }

  const formatTimeAgo = (date: Date) => {
    const hours = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60));
    if (hours < 1) return "방금 전";
    if (hours < 24) return `${hours}시간 전`;
    const days = Math.floor(hours / 24);
    return `${days}일 전`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            안녕하세요, {user?.firstName || MOCK_PROFILE.name}님! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">오늘도 새로운 연결을 만들어보세요</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => router.push("/network")}
            className="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl p-6 text-left transition-all transform hover:scale-105 shadow-lg relative"
          >
            <div className="flex items-center justify-between mb-2">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              <span className="text-blue-100 text-sm">→</span>
            </div>
            <h3 className="text-xl font-semibold mb-1">네트워크 맵</h3>
            <p className="text-blue-100 text-sm">내 인맥을 시각적으로 탐색하기</p>
          </button>

          <button
            onClick={() => router.push("/search")}
            className="bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl p-6 text-left transition-all transform hover:scale-105 shadow-lg relative"
          >
            <div className="flex items-center justify-between mb-2">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <span className="text-purple-100 text-sm">→</span>
            </div>
            <h3 className="text-xl font-semibold mb-1">AI 검색</h3>
            <p className="text-purple-100 text-sm">원하는 사람 찾기</p>
          </button>

          <button
            onClick={() => showComingSoonToast("소개 요청")}
            className="bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl p-6 text-left transition-all transform hover:scale-105 shadow-lg relative"
          >
            <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded">
              개발 예정
            </div>
            <div className="flex items-center justify-between mb-2">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <span className="text-green-100 text-sm">🚧</span>
            </div>
            <h3 className="text-xl font-semibold mb-1">소개 요청</h3>
            <p className="text-green-100 text-sm">진행 중인 연결 보기</p>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Stats & Profile */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 relative">
              <div className="absolute top-4 right-4 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 text-xs font-bold px-2 py-1 rounded">
                📝 Mock 데이터
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {(user?.firstName?.[0] || MOCK_PROFILE.name[0]).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {user?.fullName || MOCK_PROFILE.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{MOCK_PROFILE.company}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  {MOCK_PROFILE.company}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  {MOCK_PROFILE.school}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {MOCK_PROFILE.interests.map((interest) => (
                  <span
                    key={interest}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium"
                  >
                    {interest}
                  </span>
                ))}
              </div>

              <button
                onClick={() => showComingSoonToast("프로필 수정")}
                className="w-full mt-4 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                프로필 수정 <span className="text-xs">🚧</span>
              </button>
            </div>

            {/* Network Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 relative">
              <div className="absolute top-4 right-4 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 text-xs font-bold px-2 py-1 rounded">
                📝 Mock 데이터
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">네트워크 통계 📊</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">전체 연락처</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    {MOCK_NETWORK_STATS.totalContacts}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">연결된 사용자</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    {MOCK_NETWORK_STATS.connectedUsers}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">네트워크 그룹</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">{MOCK_NETWORK_STATS.clusters}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">강한 연결</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    {MOCK_NETWORK_STATS.strongConnections}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t dark:border-gray-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">네트워크 강도</span>
                  <span className="text-green-600 dark:text-green-400 font-semibold">양호</span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: "73%" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Searches */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 relative">
              <div className="absolute top-4 right-20 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 text-xs font-bold px-2 py-1 rounded">
                📝 Mock 데이터
              </div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">최근 검색 🔍</h3>
                <button
                  onClick={() => showComingSoonToast("검색 기록 전체 보기")}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  전체 보기 🚧
                </button>
              </div>

              {MOCK_RECENT_SEARCHES.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <svg
                    className="w-12 h-12 mx-auto mb-2 opacity-50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <p>아직 검색 기록이 없어요</p>
                  <p className="text-sm mt-1">AI 검색으로 원하는 사람을 찾아보세요!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {MOCK_RECENT_SEARCHES.map((search) => (
                    <div
                      key={search.id}
                      onClick={() => showComingSoonToast("검색 결과 보기")}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                      <div className="flex-1">
                        <p className="text-gray-900 dark:text-white font-medium mb-1">&ldquo;{search.query}&rdquo;</p>
                        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                          <span>{search.resultCount}개 결과</span>
                          <span>•</span>
                          <span>{formatTimeAgo(search.timestamp)}</span>
                        </div>
                      </div>
                      <button className="ml-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Suggested Connections */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 relative">
              <div className="absolute top-4 right-20 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 text-xs font-bold px-2 py-1 rounded">
                📝 Mock 데이터
              </div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">추천 연결 ✨</h3>
                <button
                  onClick={() => showComingSoonToast("추천 연결 더 보기")}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  더 보기 🚧
                </button>
              </div>

              <div className="space-y-3">
                {MOCK_SUGGESTED_CONNECTIONS.map((connection) => (
                  <div
                    key={connection.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {connection.name[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{connection.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {connection.role} @ {connection.company}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-blue-600 dark:text-blue-400">
                            공통 지인 {connection.mutualConnections}명
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-purple-600 dark:text-purple-400">
                            {connection.pathLength}촌
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => showComingSoonToast("경로 보기")}
                      className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    >
                      경로 보기 🚧
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">💡 팁: AI 검색을 활용해보세요!</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    &ldquo;시리즈 A 투자자 찾아줘&rdquo; 또는 &ldquo;카카오 다니는 디자이너&rdquo;처럼 자연스럽게
                    말해보세요. AI가 당신의 네트워크에서 최적의 경로를 찾아드립니다!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
