"use client";

import React, { useEffect, useRef, useState } from "react";

/* eslint-disable */
// @ts-nocheck
// @ts-ignore

// 5개 그룹으로 명확하게 구분된 네트워크 데이터
const generateNetworkData = () => {
  const nodes = [];
  const links = [];

  // 중심 사용자
  nodes.push({
    id: "user",
    name: "나",
    val: 25,
    group: "self",
    color: "#ff4757",
    fx: 0,
    fy: 0,
    fz: 0, // 중앙에 고정
  });

  // 1. 가족 그룹 (12명) - 빨간색 계열 (위쪽 구역, 자연스럽게 분산)
  const familyMembers = [
    "아빠",
    "엄마",
    "형",
    "누나",
    "동생",
    "할아버지",
    "할머니",
    "삼촌",
    "이모",
    "고모",
    "외삼촌",
    "사촌형",
  ];
  const familyCenter = { x: 0, y: 80, z: 0 }; // 위쪽 (중심에서 더 가까이)
  familyMembers.forEach((name, i) => {
    // 훨씬 더 자유로운 분포 - 큰 랜덤 오프셋
    const angle = (i / familyMembers.length) * 2 * Math.PI + (Math.random() - 0.5) * 1.6;
    const radius = 25 + (Math.random() - 0.5) * 40; // 반지름 변화 2배 증가
    const height = (Math.random() - 0.5) * 60; // 높이 변화 2배 증가

    const id = `family_${i}`;
    nodes.push({
      id,
      name,
      val: 15 + Math.random() * 8,
      group: "가족",
      color: "#ff6b6b",
      fx: familyCenter.x + radius * Math.cos(angle) + (Math.random() - 0.5) * 30,
      fy: familyCenter.y + height + (Math.random() - 0.5) * 40,
      fz: familyCenter.z + radius * Math.sin(angle) + (Math.random() - 0.5) * 30,
    });
    links.push({ source: "user", target: id, strength: 0.9 });
  });

  // 2. 친구 그룹 (15명) - 파란색 계열 (오른쪽 앞 구역, 자연스럽게 분산)
  const friends = [
    "김철수",
    "이영희",
    "박민수",
    "정수진",
    "최동현",
    "한지민",
    "오세훈",
    "윤서연",
    "장민호",
    "송하늘",
    "임도윤",
    "강서진",
    "조예린",
    "신우진",
    "배소영",
  ];
  const friendCenter = { x: 60, y: -20, z: 60 }; // 오른쪽 앞 (중심에서 더 가까이)
  friends.forEach((name, i) => {
    const angle = (i / friends.length) * 2 * Math.PI + (Math.random() - 0.5) * 2.0;
    const radius = 20 + (Math.random() - 0.5) * 50; // 반지름 변화 2배 증가
    const height = (Math.random() - 0.5) * 70; // 높이 변화 2배 증가

    const id = `friend_${i}`;
    nodes.push({
      id,
      name,
      val: 12 + Math.random() * 8,
      group: "서울고등학교",
      color: "#3742fa",
      fx: friendCenter.x + radius * Math.cos(angle) + (Math.random() - 0.5) * 36,
      fy: friendCenter.y + height + (Math.random() - 0.5) * 50,
      fz: friendCenter.z + radius * Math.sin(angle) + (Math.random() - 0.5) * 36,
    });
    links.push({ source: "user", target: id, strength: 0.7 + Math.random() * 0.2 });
  });

  // 3. 회사 그룹 (18명) - 초록색 계열 (왼쪽 앞 구역, 자연스럽게 분산)
  const colleagues = [
    "김현우",
    "김지연",
    "이세현",
    "정지우",
    "김지우",
    "이지우",
    "정지우",
    "김지우",
    "박주임",
    "윤대리",
    "정과장",
    "김차장",
    "남부장",
    "김과장",
    "이차장",
    "정과장",
    "김차장",
    "남부장",
    "김과장",
    "이차장",
  ];
  const companyCenter = { x: -60, y: -20, z: 60 }; // 왼쪽 앞 (중심에서 더 가까이)
  colleagues.forEach((role, i) => {
    const angle = (i / colleagues.length) * 2 * Math.PI + (Math.random() - 0.5) * 1.8;
    const radius = 22 + (Math.random() - 0.5) * 44; // 반지름 변화 2배 증가
    const height = (Math.random() - 0.5) * 64; // 높이 변화 2배 증가

    const id = `company_${i}`;
    nodes.push({
      id,
      name: role,
      val: 10 + Math.random() * 8,
      group: "네이버",
      color: "#2ed573",
      fx: companyCenter.x + radius * Math.cos(angle) + (Math.random() - 0.5) * 32,
      fy: companyCenter.y + height + (Math.random() - 0.5) * 44,
      fz: companyCenter.z + radius * Math.sin(angle) + (Math.random() - 0.5) * 32,
    });
    links.push({ source: "user", target: id, strength: 0.5 + Math.random() * 0.3 });
  });

  // 4. 학교 그룹 (16명) - 보라색 계열 (오른쪽 뒤 구역, 자연스럽게 분산)
  const schoolmates = [
    "이상준",
    "박동현",
    "최지우",
    "이현진",
    "김지우",
    "박서연",
    "최호정",
    "정현우",
    "김서준",
    "이지우",
    "신은혜",
    "최우석",
    "이영수",
    "박서현",
    "이지아",
    "박서준",
  ];
  const schoolCenter = { x: 60, y: -20, z: -60 }; // 오른쪽 뒤 (중심에서 더 가까이)
  schoolmates.forEach((name, i) => {
    const angle = (i / schoolmates.length) * 2 * Math.PI + (Math.random() - 0.5) * 1.4;
    const radius = 18 + (Math.random() - 0.5) * 40; // 반지름 변화 2배 증가
    const height = (Math.random() - 0.5) * 56; // 높이 변화 2배 증가

    const id = `school_${i}`;
    nodes.push({
      id,
      name,
      val: 8 + Math.random() * 8,
      group: "서울대학교",
      color: "#a55eea",
      fx: schoolCenter.x + radius * Math.cos(angle) + (Math.random() - 0.5) * 28,
      fy: schoolCenter.y + height + (Math.random() - 0.5) * 40,
      fz: schoolCenter.z + radius * Math.sin(angle) + (Math.random() - 0.5) * 28,
    });
    links.push({ source: "user", target: id, strength: 0.4 + Math.random() * 0.4 });
  });

  // 5. 동아리 그룹 (14명) - 주황색 계열 (왼쪽 뒤 구역, 자연스럽게 분산)
  const clubMembers = [
    "최안선",
    "김소현",
    "김은지",
    "박혜린",
    "이수아",
    "이지애",
    "박재원",
    "이동준",
    "김지호",
    "박지호",
    "이지수",
    "최정민",
    "이동호",
    "정성호",
  ];
  const clubCenter = { x: -60, y: -20, z: -60 }; // 왼쪽 뒤 (중심에서 더 가까이)
  clubMembers.forEach((name, i) => {
    const angle = (i / clubMembers.length) * 2 * Math.PI + (Math.random() - 0.5) * 1.2;
    const radius = 16 + (Math.random() - 0.5) * 36; // 반지름 변화 2배 증가
    const height = (Math.random() - 0.5) * 52; // 높이 변화 2배 증가

    const id = `club_${i}`;
    nodes.push({
      id,
      name,
      val: 6 + Math.random() * 8,
      group: "축구동아리",
      color: "#ffa502",
      fx: clubCenter.x + radius * Math.cos(angle) + (Math.random() - 0.5) * 24,
      fy: clubCenter.y + height + (Math.random() - 0.5) * 36,
      fz: clubCenter.z + radius * Math.sin(angle) + (Math.random() - 0.5) * 24,
    });
    links.push({ source: "user", target: id, strength: 0.3 + Math.random() * 0.4 });
  });

  // 그룹 내 연결 생성 (2배 증가)
  const createGroupConnections = () => {
    // 가족 그룹 내 연결 (가족끼리는 서로 잘 알고 있음)
    for (let i = 0; i < familyMembers.length; i++) {
      for (let j = i + 1; j < familyMembers.length; j++) {
        if (Math.random() > 0.15) {
          // 85% 확률로 연결 (기존 70%에서 증가)
          links.push({
            source: `family_${i}`,
            target: `family_${j}`,
            strength: 0.6 + Math.random() * 0.3,
          });
        }
      }
    }

    // 친구 그룹 내 연결 (친구들끼리 더 많은 연결)
    for (let i = 0; i < friends.length; i++) {
      for (let j = i + 1; j < friends.length; j++) {
        if (Math.random() > 0.35) {
          // 65% 확률로 연결 (기존 30%에서 2배 이상 증가)
          links.push({
            source: `friend_${i}`,
            target: `friend_${j}`,
            strength: 0.4 + Math.random() * 0.3,
          });
        }
      }
    }

    // 회사 그룹 내 연결 (같은 팀, 부서끼리)
    for (let i = 0; i < colleagues.length; i++) {
      for (let j = i + 1; j < colleagues.length; j++) {
        if (Math.random() > 0.6) {
          // 40% 확률로 연결
          links.push({
            source: `company_${i}`,
            target: `company_${j}`,
            strength: 0.5 + Math.random() * 0.3,
          });
        }
      }
    }

    // 학교 그룹 내 연결 (같은 과, 동아리끼리)
    for (let i = 0; i < schoolmates.length; i++) {
      for (let j = i + 1; j < schoolmates.length; j++) {
        if (Math.random() > 0.8) {
          // 20% 확률로 연결
          links.push({
            source: `school_${i}`,
            target: `school_${j}`,
            strength: 0.3 + Math.random() * 0.3,
          });
        }
      }
    }

    // 동아리 그룹 내 연결 (같은 활동끼리)
    for (let i = 0; i < clubMembers.length; i++) {
      for (let j = i + 1; j < clubMembers.length; j++) {
        if (Math.random() > 0.7) {
          // 30% 확률로 연결
          links.push({
            source: `club_${i}`,
            target: `club_${j}`,
            strength: 0.4 + Math.random() * 0.3,
          });
        }
      }
    }

    // 그룹 간 소수의 연결 (현실적인 크로스 연결)
    // 친구가 회사 사람을 소개하는 경우
    for (let i = 0; i < 3; i++) {
      const friendIndex = Math.floor(Math.random() * friends.length);
      const companyIndex = Math.floor(Math.random() * colleagues.length);
      links.push({
        source: `friend_${friendIndex}`,
        target: `company_${companyIndex}`,
        strength: 0.2 + Math.random() * 0.2,
      });
    }

    // 학교 선후배가 회사에서 만나는 경우
    for (let i = 0; i < 2; i++) {
      const schoolIndex = Math.floor(Math.random() * schoolmates.length);
      const companyIndex = Math.floor(Math.random() * colleagues.length);
      links.push({
        source: `school_${schoolIndex}`,
        target: `company_${companyIndex}`,
        strength: 0.3 + Math.random() * 0.2,
      });
    }

    // 동아리에서 만난 친구
    for (let i = 0; i < 2; i++) {
      const clubIndex = Math.floor(Math.random() * clubMembers.length);
      const friendIndex = Math.floor(Math.random() * friends.length);
      links.push({
        source: `club_${clubIndex}`,
        target: `friend_${friendIndex}`,
        strength: 0.4 + Math.random() * 0.2,
      });
    }
  };

  createGroupConnections();

  console.log(`Generated ${nodes.length} nodes and ${links.length} links`);
  return { nodes, links };
};

export default function NetworkPage() {
  const containerRef = useRef(null);
  const graphRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 데이터 생성
    const data = generateNetworkData();
    setGraphData(data);
    console.log("Graph data generated:", data);
  }, []);

  useEffect(() => {
    const initializeGraph = () => {
      console.log("Checking ForceGraph3D availability...");
      console.log("window.ForceGraph3D:", typeof window !== "undefined" ? window.ForceGraph3D : "undefined");
      console.log("window.THREE:", typeof window !== "undefined" ? window.THREE : "undefined");
      console.log("window.d3:", typeof window !== "undefined" ? window.d3 : "undefined");
      console.log("containerRef.current:", containerRef.current);
      console.log("graphData:", graphData);

      // CDN에서 로드된 ForceGraph3D, THREE, d3가 사용 가능한지 확인
      if (
        typeof window !== "undefined" &&
        window.ForceGraph3D &&
        window.THREE &&
        window.d3 &&
        containerRef.current &&
        graphData
      ) {
        // 기존 그래프 정리
        containerRef.current.innerHTML = "";

        try {
          console.log("Initializing 3D Force Graph...");
          setIsLoading(true);
          setError(null);

          // 3D Force Graph 초기화
          const Graph = window
            .ForceGraph3D()(containerRef.current)
            .graphData(graphData)
            .nodeLabel(
              (node) =>
                `<div style="color: white; background: rgba(0,0,0,0.8); padding: 4px 8px; border-radius: 4px;">${node.name}<br/>그룹: ${node.group}<br/>연결강도: ${node.val}</div>`
            )
            .nodeColor((node) => node.color)
            .nodeVal((node) => node.val)
            .nodeOpacity(0.9)
            .linkColor(() => "rgba(255,255,255,0.4)")
            .linkWidth((link) => link.strength * 2)
            .linkOpacity(0.4)
            .backgroundColor("#0a0a0a")
            .showNavInfo(false)
            .width(containerRef.current.clientWidth)
            .height(containerRef.current.clientHeight)
            .onNodeClick((node) => {
              setSelectedNode(node);
              // 노드 클릭 시 카메라 포커스
              Graph.cameraPosition({ x: node.x + 100, y: node.y + 100, z: node.z + 100 }, node, 1000);
            })
            .onNodeHover((node) => {
              // 호버 시 커서 변경
              if (containerRef.current) {
                containerRef.current.style.cursor = node ? "pointer" : "default";
              }
            })
            .onEngineStop(() => {
              // 시뮬레이션이 완료되면 그래프를 중앙에 맞춤
              Graph.zoomToFit(1000, 50);
            });

          // d3 Force 설정 (그래프 초기화 후)
          try {
            Graph.d3Force("charge", window.d3.forceManyBody().strength(-300));
            Graph.d3Force("link", window.d3.forceLink().distance(50).strength(0.1));
            console.log("d3 Force settings applied successfully");
          } catch (d3Error) {
            console.warn("d3 Force settings failed, using default:", d3Error);
          }

          // 초기 카메라 위치 설정 (구들을 잘 볼 수 있는 각도)
          Graph.cameraPosition({ x: 150, y: 100, z: 200 });

          // 그래프가 로드된 후 중앙 정렬
          setTimeout(() => {
            Graph.zoomToFit(1000, 50);
          }, 2000);

          // 그래프 참조 저장
          graphRef.current = Graph;

          console.log("3D Force Graph initialized successfully");
          setIsLoading(false);

          // 정리 함수
          return () => {
            if (containerRef.current) {
              containerRef.current.innerHTML = "";
            }
          };
        } catch (err) {
          console.error("Error initializing 3D Force Graph:", err);
          setError(err.message);
          setIsLoading(false);
        }
      } else {
        // ForceGraph3D가 아직 로드되지 않은 경우 재시도
        const timer = setTimeout(() => {
          if (typeof window !== "undefined" && !window.ForceGraph3D) {
            setError("3D Force Graph 라이브러리를 로드할 수 없습니다.");
            setIsLoading(false);
          }
        }, 5000);

        return () => clearTimeout(timer);
      }
    };

    // 스크립트가 로드될 때까지 기다리기
    if (typeof window !== "undefined") {
      if (window.ForceGraph3D && window.THREE && window.d3) {
        initializeGraph();
      } else {
        // 스크립트 로딩을 기다림
        const checkInterval = setInterval(() => {
          if (window.ForceGraph3D && window.THREE && window.d3) {
            clearInterval(checkInterval);
            initializeGraph();
          }
        }, 100);

        // 10초 후 타임아웃
        const timeout = setTimeout(() => {
          clearInterval(checkInterval);
          setError("3D Force Graph 라이브러리 로딩 시간 초과");
          setIsLoading(false);
        }, 10000);

        return () => {
          clearInterval(checkInterval);
          clearTimeout(timeout);
        };
      }
    }
  }, [graphData]);

  // 노드 텍스처 생성 함수
  const generateNodeTexture = (text, color, isSpecial = false) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = 64;
    canvas.height = 64;

    // 배경 원 그리기
    context.beginPath();
    context.arc(32, 32, 30, 0, 2 * Math.PI);
    context.fillStyle = color;
    context.fill();

    if (isSpecial) {
      context.strokeStyle = "#ffffff";
      context.lineWidth = 3;
      context.stroke();
    }

    // 텍스트 그리기
    context.fillStyle = "#ffffff";
    context.font = "bold 12px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text, 32, 32);

    return canvas;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">네트워크 맵</h1>
          <p className="text-gray-300">나를 중심으로 네트워크 그래프를 시각화합니다</p>

          {/* WebGL 상태 표시 */}
          <div
            className="mt-4 p-3 rounded-lg border"
            style={{
              backgroundColor: error && error.includes("WebGL") ? "#7f1d1d" : "#065f46",
              borderColor: error && error.includes("WebGL") ? "#dc2626" : "#10b981",
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{error && error.includes("WebGL") ? "❌" : "✅"}</span>
              <span className="font-medium">
                {error && error.includes("WebGL")
                  ? "WebGL 비활성화됨 - 3D 그래프를 사용할 수 없습니다"
                  : "WebGL 활성화됨 - 3D 그래프 사용 가능"}
              </span>
            </div>
            {error && error.includes("WebGL") && (
              <p className="text-sm mt-2 text-gray-300">
                아래 가이드를 따라 WebGL을 활성화하면 3D 네트워크 그래프를 볼 수 있습니다.
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 그래프 영역 */}
          <div className="lg:col-span-3">
            <div className="bg-black rounded-lg overflow-hidden shadow-2xl relative">
              <div
                ref={containerRef}
                style={{
                  width: "100%",
                  height: "70vh",
                  minHeight: "500px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                className="relative"
              />

              {/* 로딩 오버레이 */}
              {isLoading && (
                <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p>3D 네트워크 그래프를 로딩 중...</p>
                  </div>
                </div>
              )}

              {/* WebGL 활성화 가이드 */}
              {error && error.includes("WebGL") && (
                <div className="absolute inset-0 bg-gray-900 bg-opacity-95 flex items-center justify-center p-4 overflow-auto">
                  <div className="max-w-2xl text-white bg-gray-800 rounded-lg p-8">
                    <div className="text-center mb-6">
                      <div className="text-yellow-400 text-5xl mb-4">🔧</div>
                      <h3 className="text-2xl font-bold mb-2">WebGL 활성화 필요</h3>
                      <p className="text-gray-300">3D 그래프를 보려면 WebGL을 활성화해야 합니다</p>
                    </div>

                    <div className="space-y-6">
                      {/* Chrome 설정 */}
                      <div className="bg-gray-700 p-4 rounded-lg">
                        <h4 className="font-bold text-blue-400 mb-3 flex items-center">
                          <span className="mr-2">🌐</span> Chrome 브라우저
                        </h4>
                        <ol className="text-sm space-y-2 list-decimal list-inside">
                          <li>
                            주소창에 <code className="bg-gray-600 px-2 py-1 rounded">chrome://settings/</code> 입력
                          </li>
                          <li>왼쪽 메뉴에서 "고급" → "시스템" 클릭</li>
                          <li>"사용 가능한 경우 하드웨어 가속 사용" 체크</li>
                          <li>Chrome 재시작</li>
                        </ol>
                        <div className="mt-3 p-2 bg-blue-900 bg-opacity-50 rounded text-xs">
                          <strong>추가 설정:</strong>{" "}
                          <code className="bg-gray-600 px-1 rounded">chrome://flags/#ignore-gpu-blocklist</code>에서
                          "Enabled" 설정
                        </div>
                      </div>

                      {/* Firefox 설정 */}
                      <div className="bg-gray-700 p-4 rounded-lg">
                        <h4 className="font-bold text-orange-400 mb-3 flex items-center">
                          <span className="mr-2">🦊</span> Firefox 브라우저
                        </h4>
                        <ol className="text-sm space-y-2 list-decimal list-inside">
                          <li>
                            주소창에 <code className="bg-gray-600 px-2 py-1 rounded">about:config</code> 입력
                          </li>
                          <li>"위험을 감수하겠습니다" 클릭</li>
                          <li>
                            <code className="bg-gray-600 px-1 rounded">webgl.disabled</code> 검색하여{" "}
                            <strong>false</strong>로 설정
                          </li>
                          <li>
                            <code className="bg-gray-600 px-1 rounded">webgl.force-enabled</code> 검색하여{" "}
                            <strong>true</strong>로 설정
                          </li>
                          <li>Firefox 재시작</li>
                        </ol>
                      </div>

                      {/* Safari 설정 */}
                      <div className="bg-gray-700 p-4 rounded-lg">
                        <h4 className="font-bold text-gray-400 mb-3 flex items-center">
                          <span className="mr-2">🧭</span> Safari 브라우저
                        </h4>
                        <ol className="text-sm space-y-2 list-decimal list-inside">
                          <li>Safari 메뉴 → "환경설정" 클릭</li>
                          <li>"고급" 탭 선택</li>
                          <li>"메뉴 막대에서 개발자용 메뉴 보기" 체크</li>
                          <li>"개발자용" 메뉴 → "실험적 기능" → "WebGL 2.0" 활성화</li>
                        </ol>
                      </div>

                      {/* 일반적인 해결책 */}
                      <div className="bg-gray-700 p-4 rounded-lg">
                        <h4 className="font-bold text-green-400 mb-3 flex items-center">
                          <span className="mr-2">💡</span> 일반적인 해결책
                        </h4>
                        <ul className="text-sm space-y-2 list-disc list-inside">
                          <li>
                            <strong>그래픽 드라이버 업데이트:</strong> 최신 GPU 드라이버 설치
                          </li>
                          <li>
                            <strong>시크릿 모드:</strong> 확장 프로그램 없이 시도
                          </li>
                          <li>
                            <strong>다른 브라우저:</strong> Chrome, Firefox, Edge 중 다른 브라우저 사용
                          </li>
                          <li>
                            <strong>컴퓨터 재시작:</strong> 설정 변경 후 재부팅
                          </li>
                        </ul>
                      </div>

                      {/* WebGL 테스트 */}
                      <div className="bg-blue-900 bg-opacity-50 p-4 rounded-lg">
                        <h4 className="font-bold text-blue-300 mb-2">WebGL 테스트</h4>
                        <p className="text-sm mb-3">설정 후 아래 사이트에서 WebGL이 작동하는지 확인하세요:</p>
                        <a
                          href="https://get.webgl.org/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm transition-colors"
                        >
                          WebGL 테스트 사이트 열기
                        </a>
                      </div>
                    </div>

                    <div className="flex gap-3 justify-center mt-8">
                      <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors font-medium"
                      >
                        설정 완료 후 새로고침
                      </button>
                      <button
                        onClick={() => setError(null)}
                        className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        닫기
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 일반 에러 메시지 */}
              {error && !error.includes("WebGL") && (
                <div className="absolute inset-0 bg-red-900 bg-opacity-75 flex items-center justify-center">
                  <div className="text-center text-white p-6">
                    <div className="text-red-400 text-4xl mb-4">⚠️</div>
                    <h3 className="text-lg font-semibold mb-2">그래프 로딩 실패</h3>
                    <p className="text-sm mb-4">{error}</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                    >
                      다시 시도
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 컨트롤 패널 */}
            <div className="mt-4 flex gap-4 flex-wrap">
              <button
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                onClick={() => window.location.reload()}
              >
                🔄 새로고침
              </button>
              <button
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                onClick={() => {
                  if (graphRef.current) {
                    graphRef.current.zoomToFit(1000, 50);
                  }
                }}
              >
                🎯 중앙 정렬
              </button>
              <button
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                onClick={() => {
                  if (graphRef.current) {
                    graphRef.current.cameraPosition({ x: 150, y: 100, z: 200 }, { x: 0, y: 0, z: 0 }, 1000);
                  }
                }}
              >
                🏠 홈 뷰
              </button>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-400">범례:</span>
                <div className="flex gap-2 flex-wrap">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#ff4757" }}></div>
                    <span className="text-xs">나</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#ff6b6b" }}></div>
                    <span className="text-xs">가족</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#3742fa" }}></div>
                    <span className="text-xs">서울고등학교</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#2ed573" }}></div>
                    <span className="text-xs">네이버</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#a55eea" }}></div>
                    <span className="text-xs">서울대학교</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#ffa502" }}></div>
                    <span className="text-xs">축구동아리</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 사이드바 */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">네트워크 정보</h3>

              {selectedNode ? (
                <div className="space-y-4">
                  {/* 선택된 노드 정보 카드 */}
                  <div className="bg-gradient-to-br from-gray-700 to-gray-600 rounded-xl p-4 border border-gray-600">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg"
                        style={{ backgroundColor: selectedNode.color }}
                      >
                        {selectedNode.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-lg">{selectedNode.name}</h4>
                        <p className="text-sm text-gray-300">{selectedNode.group}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">연결 강도</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-600 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                              style={{ width: `${Math.min(selectedNode.val * 4, 100)}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-white">{Math.round(selectedNode.val)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 액션 버튼들 */}
                  <div className="space-y-2">
                    <button
                      className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg text-sm font-medium transition-all transform hover:scale-105 shadow-lg"
                      onClick={() => {
                        alert(`${selectedNode.name}님에게 메시지를 보내는 기능은 준비중 입니다!`);
                      }}
                    >
                      💬 메시지 보내기
                    </button>

                    <button
                      className="w-full px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 rounded-lg text-sm font-medium transition-all transform hover:scale-105 shadow-lg"
                      onClick={() => {
                        alert(`${selectedNode.name}님의 프로필을 보는 기능은 준비중 입니다!`);
                      }}
                    >
                      👤 프로필 보기
                    </button>

                    <button
                      className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
                      onClick={() => {
                        setSelectedNode(null);
                        if (graphRef.current) {
                          graphRef.current.zoomToFit(1000, 50);
                        }
                      }}
                    >
                      ✕ 선택 해제
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-sm text-gray-400">
                    <p>• 노드를 클릭하여 상세 정보를 확인하세요</p>
                    <p>• 마우스로 드래그하여 시점을 변경할 수 있습니다</p>
                    <p>• 스크롤로 확대/축소가 가능합니다</p>
                    <p>• 각 그룹이 구 형태로 클러스터링되어 있습니다</p>
                  </div>

                  <div className="border-t border-gray-700 pt-4">
                    <h4 className="font-medium mb-2">네트워크 통계</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>총 노드:</span>
                        <span className="font-semibold text-blue-400">{graphData?.nodes?.length || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>총 연결:</span>
                        <span className="font-semibold text-green-400">{graphData?.links?.length || 0}</span>
                      </div>
                      <div className="mt-3 space-y-1">
                        <div className="text-xs text-gray-500">그룹별 분포:</div>
                        <div className="flex justify-between text-xs">
                          <span>가족:</span>
                          <span>12명</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>서울고등학교:</span>
                          <span>15명</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>네이버:</span>
                          <span>18명</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>서울대학교:</span>
                          <span>16명</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>축구동아리:</span>
                          <span>14명</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
