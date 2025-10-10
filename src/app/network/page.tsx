"use client";

import React, { useEffect, useRef, useState } from "react";

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

  // 1. 가족 그룹 (12명) - 빨간색 계열 (위쪽 구)
  const familyMembers = [
    "아버지",
    "어머니",
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
  const familyCenter = { x: 0, y: 120, z: 0 }; // 위쪽
  familyMembers.forEach((name, i) => {
    // 구 표면에 균등하게 분포
    const phi = Math.acos(1 - (2 * (i + 0.5)) / familyMembers.length); // 위도
    const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5); // 경도 (황금비)
    const sphereRadius = 40;

    const id = `family_${i}`;
    nodes.push({
      id,
      name,
      val: 15 + Math.random() * 8,
      group: "family",
      color: "#ff6b6b",
      fx: familyCenter.x + sphereRadius * Math.sin(phi) * Math.cos(theta),
      fy: familyCenter.y + sphereRadius * Math.sin(phi) * Math.sin(theta),
      fz: familyCenter.z + sphereRadius * Math.cos(phi),
    });
    links.push({ source: "user", target: id, strength: 0.9 });
  });

  // 2. 친구 그룹 (15명) - 파란색 계열 (오른쪽 앞 구)
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
  const friendCenter = { x: 85, y: -40, z: 85 }; // 오른쪽 앞
  friends.forEach((name, i) => {
    const phi = Math.acos(1 - (2 * (i + 0.5)) / friends.length);
    const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
    const sphereRadius = 35;

    const id = `friend_${i}`;
    nodes.push({
      id,
      name,
      val: 12 + Math.random() * 8,
      group: "friend",
      color: "#3742fa",
      fx: friendCenter.x + sphereRadius * Math.sin(phi) * Math.cos(theta),
      fy: friendCenter.y + sphereRadius * Math.sin(phi) * Math.sin(theta),
      fz: friendCenter.z + sphereRadius * Math.cos(phi),
    });
    links.push({ source: "user", target: id, strength: 0.7 + Math.random() * 0.2 });
  });

  // 3. 회사 그룹 (18명) - 초록색 계열 (왼쪽 앞 구)
  const colleagues = [
    "팀장",
    "선임개발자",
    "주임",
    "대리",
    "과장",
    "차장",
    "부장",
    "디자이너",
    "기획자",
    "마케터",
    "HR담당",
    "재무팀원",
    "총무",
    "신입사원A",
    "신입사원B",
    "인턴A",
    "프로젝트매니저",
    "QA엔지니어",
  ];
  const companyCenter = { x: -85, y: -40, z: 85 }; // 왼쪽 앞
  colleagues.forEach((role, i) => {
    const phi = Math.acos(1 - (2 * (i + 0.5)) / colleagues.length);
    const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
    const sphereRadius = 38;

    const id = `company_${i}`;
    nodes.push({
      id,
      name: role,
      val: 10 + Math.random() * 8,
      group: "company",
      color: "#2ed573",
      fx: companyCenter.x + sphereRadius * Math.sin(phi) * Math.cos(theta),
      fy: companyCenter.y + sphereRadius * Math.sin(phi) * Math.sin(theta),
      fz: companyCenter.z + sphereRadius * Math.cos(phi),
    });
    links.push({ source: "user", target: id, strength: 0.5 + Math.random() * 0.3 });
  });

  // 4. 학교 그룹 (16명) - 보라색 계열 (오른쪽 뒤 구)
  const schoolmates = [
    "고등학교동창A",
    "고등학교동창B",
    "고등학교동창C",
    "대학교동창A",
    "대학교동창B",
    "대학교동창C",
    "같은과동기A",
    "같은과동기B",
    "같은과동기C",
    "선배A",
    "선배B",
    "후배A",
    "후배B",
    "교수님",
    "조교",
    "스터디그룹장",
  ];
  const schoolCenter = { x: 85, y: -40, z: -85 }; // 오른쪽 뒤
  schoolmates.forEach((name, i) => {
    const phi = Math.acos(1 - (2 * (i + 0.5)) / schoolmates.length);
    const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
    const sphereRadius = 36;

    const id = `school_${i}`;
    nodes.push({
      id,
      name,
      val: 8 + Math.random() * 8,
      group: "school",
      color: "#a55eea",
      fx: schoolCenter.x + sphereRadius * Math.sin(phi) * Math.cos(theta),
      fy: schoolCenter.y + sphereRadius * Math.sin(phi) * Math.sin(theta),
      fz: schoolCenter.z + sphereRadius * Math.cos(phi),
    });
    links.push({ source: "user", target: id, strength: 0.4 + Math.random() * 0.4 });
  });

  // 5. 동아리 그룹 (14명) - 주황색 계열 (왼쪽 뒤 구)
  const clubMembers = [
    "축구동아리장",
    "축구동아리A",
    "축구동아리B",
    "등산모임장",
    "등산모임A",
    "독서모임장",
    "독서모임A",
    "사진동아리장",
    "사진동아리A",
    "요리모임장",
    "게임길드장",
    "운동친구A",
    "운동친구B",
    "여행동호회장",
  ];
  const clubCenter = { x: -85, y: -40, z: -85 }; // 왼쪽 뒤
  clubMembers.forEach((name, i) => {
    const phi = Math.acos(1 - (2 * (i + 0.5)) / clubMembers.length);
    const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
    const sphereRadius = 34;

    const id = `club_${i}`;
    nodes.push({
      id,
      name,
      val: 6 + Math.random() * 8,
      group: "club",
      color: "#ffa502",
      fx: clubCenter.x + sphereRadius * Math.sin(phi) * Math.cos(theta),
      fy: clubCenter.y + sphereRadius * Math.sin(phi) * Math.sin(theta),
      fz: clubCenter.z + sphereRadius * Math.cos(phi),
    });
    links.push({ source: "user", target: id, strength: 0.3 + Math.random() * 0.4 });
  });

  // 그룹 내 연결 생성
  const createGroupConnections = () => {
    // 가족 그룹 내 연결 (가족끼리는 서로 잘 알고 있음)
    for (let i = 0; i < familyMembers.length; i++) {
      for (let j = i + 1; j < familyMembers.length; j++) {
        if (Math.random() > 0.3) {
          // 70% 확률로 연결
          links.push({
            source: `family_${i}`,
            target: `family_${j}`,
            strength: 0.6 + Math.random() * 0.3,
          });
        }
      }
    }

    // 친구 그룹 내 연결 (친구들끼리 일부 연결)
    for (let i = 0; i < friends.length; i++) {
      for (let j = i + 1; j < friends.length; j++) {
        if (Math.random() > 0.7) {
          // 30% 확률로 연결
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
              Graph.cameraPosition({ x: node.x + 50, y: node.y + 50, z: node.z + 50 }, node, 1000);
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
          <p className="text-gray-300">나를 중심으로 5개 방향에 구 형태로 배치된 인맥 네트워크를 3D로 시각화합니다</p>
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

              {/* 에러 메시지 */}
              {error && (
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
                    <span className="text-xs">친구</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#2ed573" }}></div>
                    <span className="text-xs">회사</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#a55eea" }}></div>
                    <span className="text-xs">학교</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#ffa502" }}></div>
                    <span className="text-xs">동아리</span>
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
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-blue-400">{selectedNode.name}</h4>
                    <p className="text-sm text-gray-400">그룹: {selectedNode.group}</p>
                    <p className="text-sm text-gray-400">연결 강도: {selectedNode.val}</p>
                  </div>
                  <button
                    className="w-full px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
                    onClick={() => setSelectedNode(null)}
                  >
                    선택 해제
                  </button>
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
                          <span>친구:</span>
                          <span>15명</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>회사:</span>
                          <span>18명</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>학교:</span>
                          <span>16명</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>동아리:</span>
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
