"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ChatItem {
  id: string;
  name: string;
  groupColor: string;
  profileImage: string;
  group: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
}

export default function MessagesPage() {
  const router = useRouter();

  // 샘플 채팅 데이터
  const [chats] = useState<ChatItem[]>([
    {
      id: "1",
      name: "김민수",
      group: "서울대학교",
      groupColor: "#a55eea",
      profileImage: "/api/placeholder/40/40",
      lastMessage: "특히 머신러닝 백엔드 경험이 있으신 분이면 좋겠어요.",
      timestamp: "오후 7:30",
      unreadCount: 2,
      isOnline: true,
    },
    {
      id: "2",
      name: "이지영",
      group: "네이버",
      groupColor: "#2ed573",
      profileImage: "/api/placeholder/40/40",
      lastMessage: "네트워크 연결 감사합니다 😊",
      timestamp: "오후 7:15",
      unreadCount: 0,
      isOnline: false,
    },
    {
      id: "3",
      name: "엄마",
      group: "가족",
      groupColor: "#ff6b6b",
      profileImage: "/api/placeholder/40/40",
      lastMessage: "저녁 먹고 들어오니?",
      timestamp: "오후 6:45",
      unreadCount: 2,
      isOnline: true,
    },
    {
      id: "4",
      name: "최서연",
      group: "네이버",
      groupColor: "#2ed573",
      profileImage: "/api/placeholder/40/40",
      lastMessage: "프로젝트 관련해서 문의드립니다.",
      timestamp: "어제",
      unreadCount: 0,
      isOnline: false,
    },
    {
      id: "5",
      name: "박준호",
      group: "네이버",
      groupColor: "#2ed573",
      profileImage: "/api/placeholder/40/40",
      lastMessage: "회의 시간 조정 가능할까요?",
      timestamp: "어제",
      unreadCount: 1,
      isOnline: true,
    },
    {
      id: "6",
      name: "이응석",
      group: "축구동아리",
      groupColor: "#ffa502",
      profileImage: "/api/placeholder/40/40",
      lastMessage: "그럼 다음주에 수요일에 볼까?",
      timestamp: "2일 전",
      unreadCount: 0,
      isOnline: false,
    },
  ]);

  const handleChatClick = (chatId: string) => {
    router.push(`/messages/${chatId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/dashboard")}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-600 dark:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">메시지</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">대화 목록</p>
              </div>
            </div>

            {/* Search and New Message buttons */}
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-600 dark:text-gray-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>새 메시지</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat List */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {chats.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 mx-auto text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <p className="text-gray-500 dark:text-gray-400">아직 대화가 없습니다</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => handleChatClick(chat.id)}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    {/* Profile Image */}
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-md">
                        {chat.name.charAt(0)}
                      </div>
                      {chat.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>

                    {/* Chat Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white truncate">{chat.name}</h3>
                          <span className="text-sm text-gray-500 dark:text-gray-400" style={{ color: chat.groupColor }}>
                            {chat.group}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <span className="text-sm text-gray-500 dark:text-gray-400">{chat.timestamp}</span>
                          {chat.unreadCount > 0 && (
                            <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center">
                              {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{chat.lastMessage}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
