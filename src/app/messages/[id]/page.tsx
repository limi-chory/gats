"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

interface ChatUser {
  id: string;
  name: string;
  isOnline: boolean;
}

export default function ChatRoomPage() {
  const router = useRouter();
  const params = useParams();
  const chatId = params.id as string;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 현재 사용자 ID (실제로는 인증에서 가져올 것)
  const currentUserId = "current-user";

  // Mock 사용자 데이터 (messages/page.tsx의 데이터와 연동)
  const [chatUsers] = useState<Record<string, ChatUser>>({
    "1": { id: "1", name: "김민수", isOnline: true },
    "2": { id: "2", name: "이지영", isOnline: false },
    "3": { id: "3", name: "엄마", isOnline: true },
    "4": { id: "4", name: "최서연", isOnline: false },
    "5": { id: "5", name: "박준호", isOnline: true },
    "6": { id: "6", name: "이응석", isOnline: false },
    "7": { id: "7", name: "슈카", isOnline: true },
    "8": { id: "8", name: "작은 아버지", isOnline: false },
    "9": { id: "9", name: "최현우", isOnline: true },
  });

  // Mock 채팅 기록 데이터
  const [messages, setMessages] = useState<Message[]>(() => {
    const mockMessages: Record<string, Message[]> = {
      "1": [
        {
          id: "msg-1-1",
          senderId: "1",
          senderName: "김민수",
          content: "안녕하세요! 소개 요청 드립니다.",
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3시간 전
          isRead: true,
        },
        {
          id: "msg-1-2",
          senderId: currentUserId,
          senderName: "나",
          content: "안녕하세요! 어떤 분을 소개해드릴까요?",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2시간 전
          isRead: true,
        },
        {
          id: "msg-1-3",
          senderId: "1",
          senderName: "김민수",
          content: "AI 스타트업 쪽에서 일하시는 개발자분을 찾고 있어요. 혹시 아시는 분 계신가요?",
          timestamp: new Date(Date.now() - 90 * 60 * 1000), // 90분 전
          isRead: false,
        },
        {
          id: "msg-1-4",
          senderId: "1",
          senderName: "김민수",
          content: "특히 머신러닝 백엔드 경험이 있으신 분이면 좋겠어요.",
          timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30분 전
          isRead: false,
        },
      ],
      "2": [
        {
          id: "msg-2-1",
          senderId: currentUserId,
          senderName: "나",
          content: "네트워크 연결 요청 보내드렸습니다!",
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1일 전
          isRead: true,
        },
        {
          id: "msg-2-2",
          senderId: "2",
          senderName: "이지영",
          content: "네트워크 연결 감사합니다 😊",
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5시간 전
          isRead: true,
        },
      ],
      "3": [
        {
          id: "msg-3-1",
          senderId: "3",
          senderName: "엄마",
          content: "제육볶음 해놨어.",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 6시간 전
          isRead: true,
        },
        {
          id: "msg-3-2",
          senderId: "3",
          senderName: "엄마",
          content: "저녁 먹고 들어오니?",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2시간 전
          isRead: false,
        },
      ],
      "4": [
        {
          id: "msg-3-1",
          senderId: "4",
          senderName: "최서연",
          content: "프로젝트 관련해서 문의드립니다.",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 - 1000 * 60 * 60 * 24), // 1일 전
          isRead: true,
        },
      ],
      "5": [
        {
          id: "msg-5-1",
          senderId: "5",
          senderName: "박준호",
          content: "회의 시간 조정 가능할까요?",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 - 1000 * 60 * 60 * 24), // 1일 전
          isRead: false,
        },
      ],
      "6": [
        {
          id: "msg-6-1",
          senderId: currentUserId,
          senderName: "나",
          content: "다음주 평일에 같이 저녁 먹을래?",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 - 1000 * 60 * 60 * 24), // 1일 전
          isRead: true,
        },
        {
          id: "msg-6-2",
          senderId: "6",
          senderName: "이응석",
          content: "그럼 다음주에 수요일에 볼까?",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 - 2 * 1000 * 60 * 60 * 24), // 2일 전
          isRead: false,
        },
      ],
    };
    return mockMessages[chatId] || [];
  });

  const [newMessage, setNewMessage] = useState(() => {
    const mockInput: Record<string, string> = {
      "7": "슈카야, 요즘 새로운 창업 대회 같은게 열리는게 있어?",
      "8": "작은 아버지, 이번 추석에 혹시 계획중이신 일정이 있으신가요?",
      "9": "최현우님, 안녕하세요.\n스테이블 코인 프로젝트 관련 Smart Contract 쪽에 문의드리고 싶은게 있어요.",
    };
    return mockInput[chatId] || "";
  });

  const currentChat = chatUsers[chatId];

  // 메시지 전송 함수
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: `msg-${chatId}-${Date.now()}`,
      senderId: currentUserId,
      senderName: "나",
      content: newMessage.trim(),
      timestamp: new Date(),
      isRead: false,
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");
  };

  // Enter 키로 메시지 전송
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 메시지 목록 끝으로 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 시간 포맷팅 함수
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "방금 전";
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;

    return date.toLocaleDateString("ko-KR", {
      month: "short",
      day: "numeric",
    });
  };

  if (!currentChat) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">채팅을 찾을 수 없습니다.</p>
          <button onClick={() => router.push("/messages")} className="mt-4 text-blue-500 hover:text-blue-600">
            메시지 목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-4 py-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push("/messages")}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-600 dark:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                  {currentChat.name.charAt(0)}
                </div>
                {currentChat.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                )}
              </div>

              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{currentChat.name}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {currentChat.isOnline ? "온라인" : "오프라인"}
                </p>
              </div>
            </div>
          </div>

          {/* 추가 옵션 버튼들 */}
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-600 dark:text-gray-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">아직 메시지가 없습니다.</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">첫 메시지를 보내보세요!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderId === currentUserId ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    message.senderId === currentUserId
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                      : "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm border border-gray-200 dark:border-gray-600"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.senderId === currentUserId ? "text-blue-100" : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="메시지를 입력하세요..."
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                rows={1}
                style={{ minHeight: "60px", maxHeight: "180px" }}
              />
            </div>

            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white rounded-full transition-all transform hover:scale-105 shadow-lg disabled:transform-none disabled:shadow-none"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
