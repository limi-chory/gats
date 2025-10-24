"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

type OnboardingStep = "welcome" | "profile" | "contacts";

interface ProfileData {
  name: string;
  company: string;
  school: string;
  interests: string[];
  profileFiles: File[];
}

export default function OnboardingPage() {
  const { user } = useUser();
  const router = useRouter();
  const [step, setStep] = useState<OnboardingStep>("welcome");
  const [profile, setProfile] = useState<ProfileData>({
    name: user?.fullName || "",
    company: "",
    school: "",
    interests: [],
    profileFiles: [],
  });
  const [syncing, setSyncing] = useState(false);

  // ============ Step 1: Welcome ============
  if (step === "welcome") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">환영합니다! 👋</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              이제 당신의 연락처 속 숨은 기회를 발견할 시간입니다
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">GATS는 3가지만 하면 끝!</h2>

            <div className="space-y-6 text-left">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">프로필 입력 (1분)</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">이름, 회사, 학교만 알려주세요</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">연락처 동기화 (클릭 한 번)</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">AI가 자동으로 네트워크를 분석해드려요</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">찾고 싶은 사람 말하기</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    &ldquo;구글 다니는 개발자 찾아줘&rdquo; → AI가 경로를 보여줍니다
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setStep("profile")}
            className="w-full max-w-md mx-auto px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            시작하기 🚀
          </button>

          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">2분이면 충분해요!</p>
        </div>
      </div>
    );
  }

  // ============ Step 2: Profile ============
  if (step === "profile") {
    const interestOptions = ["스타트업", "AI/ML", "투자", "개발", "디자인", "마케팅", "영업", "경영", "교육", "부동산"];

    const handleInterestToggle = (interest: string) => {
      setProfile((prev) => ({
        ...prev,
        interests: prev.interests.includes(interest)
          ? prev.interests.filter((i) => i !== interest)
          : [...prev.interests, interest],
      }));
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      const maxFileSize = 10 * 1024 * 1024; // 10MB

      const validFiles = files.filter((file) => {
        // 파일 크기 검증
        if (file.size > maxFileSize) {
          alert(`${file.name}은(는) 10MB를 초과합니다.`);
          return false;
        }

        // 파일 확장자 검증 (MIME 타입이 정확하지 않을 수 있으므로 확장자도 확인)
        const fileExtension = file.name.toLowerCase().split(".").pop();
        const allowedExtensions = ["xlsx", "xls", "csv", "txt", "pdf", "doc", "docx", "hwp"];

        if (!allowedExtensions.includes(fileExtension || "")) {
          alert(`${file.name}은(는) 지원하지 않는 파일 형식입니다.`);
          return false;
        }

        return true;
      });

      if (validFiles.length > 0) {
        setProfile((prev) => ({ ...prev, profileFiles: [...prev.profileFiles, ...validFiles] }));
      }

      // input 값 초기화 (같은 파일을 다시 선택할 수 있도록)
      e.target.value = "";
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const files = Array.from(e.dataTransfer.files);
      const maxFileSize = 10 * 1024 * 1024; // 10MB

      const validFiles = files.filter((file) => {
        // 파일 크기 검증
        if (file.size > maxFileSize) {
          alert(`${file.name}은(는) 10MB를 초과합니다.`);
          return false;
        }

        // 파일 확장자 검증
        const fileExtension = file.name.toLowerCase().split(".").pop();
        const allowedExtensions = ["xlsx", "xls", "csv", "txt", "pdf", "doc", "docx", "hwp"];

        if (!allowedExtensions.includes(fileExtension || "")) {
          alert(`${file.name}은(는) 지원하지 않는 파일 형식입니다.`);
          return false;
        }

        return true;
      });

      if (validFiles.length > 0) {
        setProfile((prev) => ({ ...prev, profileFiles: [...prev.profileFiles, ...validFiles] }));
      }
    };

    const canProceed = profile.name.trim() !== "";

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">2/3 단계</span>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">66%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full transition-all duration-300" style={{ width: "66%" }} />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">당신을 소개해주세요</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">다른 사람들이 당신을 찾을 수 있도록 도와주세요</p>

            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  이름 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="홍길동"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">회사</label>
                <input
                  type="text"
                  value={profile.company}
                  onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                  placeholder="네이버, 카카오, 구글..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* School */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">학교</label>
                <input
                  type="text"
                  value={profile.school}
                  onChange={(e) => setProfile({ ...profile, school: e.target.value })}
                  placeholder="서울대학교, KAIST..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Interests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  관심 분야 (여러 개 선택 가능)
                </label>
                <div className="flex flex-wrap gap-2">
                  {interestOptions.map((interest) => (
                    <button
                      key={interest}
                      onClick={() => handleInterestToggle(interest)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        profile.interests.includes(interest)
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              {/* Profile File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  프로필정보 업로드
                </label>
                <div
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    id="profile-files"
                    multiple
                    accept=".xlsx,.xls,.csv,.txt,.hwp,.pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label htmlFor="profile-files" className="cursor-pointer flex flex-col items-center gap-2">
                    <svg
                      className="w-8 h-8 text-gray-400 dark:text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium text-blue-600 dark:text-blue-400">클릭하여 파일 선택</span> 또는
                      드래그 앤 드롭
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      지원 형식: XLSX, CSV, TXT, HWP, PDF, Word
                    </div>
                  </label>
                </div>

                {/* Selected Files Display */}
                {profile.profileFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      선택된 파일 ({profile.profileFiles.length}개)
                    </div>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {profile.profileFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <svg
                              className="w-4 h-4 text-gray-400 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{file.name}</span>
                            <span className="text-xs text-gray-500 flex-shrink-0">
                              ({(file.size / 1024 / 1024).toFixed(1)}MB)
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              setProfile((prev) => ({
                                ...prev,
                                profileFiles: prev.profileFiles.filter((_, i) => i !== index),
                              }));
                            }}
                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 flex-shrink-0"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={() => setStep("welcome")}
                className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                이전
              </button>
              <button
                onClick={() => setStep("contacts")}
                disabled={!canProceed}
                className={`flex-1 px-6 py-3 font-semibold rounded-lg transition-all ${
                  canProceed
                    ? "text-white bg-blue-600 hover:bg-blue-700 shadow-lg"
                    : "text-gray-400 bg-gray-200 dark:bg-gray-700 cursor-not-allowed"
                }`}
              >
                다음 단계
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============ Step 3: Contacts ============
  if (step === "contacts") {
    const handleSync = () => {
      setSyncing(true);
      // Mock: 실제로는 연락처 동기화 API 호출
      setTimeout(() => {
        setSyncing(false);
        // 온보딩 완료 표시
        localStorage.setItem("onboarding_completed", "true");
        // 완료 후 대시보드로 이동
        router.push("/dashboard");
      }, 2000);
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">3/3 단계</span>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">100%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full transition-all duration-300" style={{ width: "100%" }} />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">연락처로 네트워크 만들기</h2>
              <p className="text-gray-600 dark:text-gray-400">연락처 속 숨은 연결고리를 AI가 찾아드립니다</p>
            </div>

            {/* Privacy Info */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6 relative">
              <div className="absolute top-2 right-2 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 text-xs font-bold px-2 py-1 rounded">
                🚧 프로토타입
              </div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                개인정보 보호
              </h3>
              <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400">✓</span>
                  <span>모든 연락처 정보는 암호화되어 안전하게 저장됩니다</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400">✓</span>
                  <span>당신의 동의 없이는 누구도 당신의 연락처를 볼 수 없습니다</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400">✓</span>
                  <span>언제든 연동을 해제하고 데이터를 삭제할 수 있습니다</span>
                </li>
              </ul>
            </div>

            {/* What Happens */}
            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">동기화하면 무슨 일이 일어나나요?</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-green-600 dark:text-green-400">1</span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    연락처를 암호화해서 안전하게 저장합니다
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-green-600 dark:text-green-400">2</span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    누가 이미 GATS를 쓰고 있는지 자동으로 확인합니다
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-green-600 dark:text-green-400">3</span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    AI가 네트워크 지도를 만들어서 보여드립니다
                  </div>
                </div>
              </div>
            </div>

            {/* Sync Button */}
            <div className="space-y-4">
              <button
                onClick={handleSync}
                disabled={syncing}
                className={`w-full px-8 py-4 text-lg font-semibold rounded-xl transition-all shadow-lg ${
                  syncing
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-xl transform hover:scale-105"
                }`}
              >
                {syncing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    연락처 동기화 중... (프로토타입)
                  </span>
                ) : (
                  "📱 연락처 동기화하기 (프로토타입)"
                )}
              </button>

              <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
                ⚠️ 프로토타입: 실제 연락처는 동기화되지 않습니다
              </p>

              <button
                onClick={() => router.push("/dashboard")}
                className="w-full px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors text-sm"
              >
                나중에 할게요
              </button>
            </div>

            <div className="mt-6 flex gap-4">
              <button
                onClick={() => setStep("profile")}
                disabled={syncing}
                className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                이전
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
