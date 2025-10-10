import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white">
            잠자던 인맥을
            <br />
            <span className="text-blue-600">당신의 최강 무기로</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-4 max-w-3xl mx-auto">
            &ldquo;연락처 속 500명, 당신은 그중 5명만 기억합니다.
            <br />
            나머지 495명이 당신의 기회입니다.&rdquo;
          </p>

          <p className="text-lg text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            투자자를 만나고 싶거나, 구글에 지원하고 싶거나, 특정 업계 전문가와 연결되고 싶을 때
            <br />
            <strong>AI가 당신의 전체 네트워크를 분석해서 가장 짧은 연결 경로를 보여줍니다</strong>
          </p>

          <SignedOut>
            <div className="flex gap-4 justify-center">
              <SignInButton mode="modal">
                <button className="px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl">
                  시작하기
                </button>
              </SignInButton>
              <button className="px-8 py-4 text-lg font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                자세히 알아보기
              </button>
            </div>
          </SignedOut>

          <SignedIn>
            <div className="flex gap-4 justify-center">
              <a 
                href="/onboarding" 
                className="px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
              >
                시작하기
              </a>
            </div>
          </SignedIn>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900 dark:text-white">
            GATS는 이렇게 작동합니다
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                연락처 동기화
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                한 번의 클릭으로 연락처를 동기화하고 AI가 네트워크를 분석합니다
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                AI 경로 탐색
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                &ldquo;네이버 다니는 개발자 찾아줘&rdquo; - 자연어로 검색하면 최단 경로를 찾아줍니다
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                신뢰 기반 소개
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                각 단계마다 동의를 받아 신뢰를 유지하며 연결합니다
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <SignedOut>
        <section className="py-20 bg-blue-600 dark:bg-blue-800">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              지금 바로 시작하세요
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              당신의 네트워크에 숨어있는 기회를 발견하세요
            </p>
            <SignInButton mode="modal">
              <button className="px-8 py-4 text-lg font-semibold text-blue-600 bg-white rounded-lg hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl">
                무료로 시작하기
              </button>
            </SignInButton>
          </div>
        </section>
      </SignedOut>

      {/* Footer */}
      <footer className="py-8 bg-gray-50 dark:bg-gray-900 border-t dark:border-gray-800">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          <p>© 2025 GATS. Powered by 🥝Codekiwi</p>
        </div>
      </footer>
    </div>
  );
}
