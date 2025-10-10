'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Mock 데이터
interface NetworkNode {
  id: string;
  name: string;
  company?: string;
  school?: string;
  role?: string;
  cluster: string;
  layer: number; // 0=나, 1=1촌, 2=2촌
  x: number;
  y: number;
  connections: string[]; // 연결된 노드 ID들
}

const MOCK_NODES: NetworkNode[] = [
  // 나 (중심)
  { id: 'me', name: '나', company: '네이버', school: '서울대학교', cluster: 'me', layer: 0, x: 50, y: 50, connections: ['n1', 'n2', 'n3', 'n4', 'n5'] },
  
  // 1촌 - 회사 동료들
  { id: 'n1', name: '김철수', company: '네이버', role: '시니어 개발자', cluster: 'company', layer: 1, x: 30, y: 30, connections: ['me', 'n6', 'n7'] },
  { id: 'n2', name: '이영희', company: '네이버', role: 'PM', cluster: 'company', layer: 1, x: 70, y: 30, connections: ['me', 'n8'] },
  
  // 1촌 - 학교 동기들
  { id: 'n3', name: '박민준', school: '서울대학교', role: '창업가', cluster: 'school', layer: 1, x: 30, y: 70, connections: ['me', 'n9', 'n10'] },
  { id: 'n4', name: '최지혜', school: '서울대학교', company: '카카오', role: '디자이너', cluster: 'school', layer: 1, x: 70, y: 70, connections: ['me', 'n11'] },
  
  // 1촌 - 기타
  { id: 'n5', name: '정수현', company: '토스', role: '데이터 분석가', cluster: 'other', layer: 1, x: 50, y: 20, connections: ['me', 'n12'] },
  
  // 2촌 - 회사 연결
  { id: 'n6', name: '강민호', company: '구글', role: '소프트웨어 엔지니어', cluster: 'company', layer: 2, x: 15, y: 20, connections: ['n1'] },
  { id: 'n7', name: '윤서아', company: '라인', role: '프로덕트 매니저', cluster: 'company', layer: 2, x: 20, y: 40, connections: ['n1'] },
  { id: 'n8', name: '한재민', company: '쿠팡', role: 'VP of Engineering', cluster: 'company', layer: 2, x: 80, y: 20, connections: ['n2'] },
  
  // 2촌 - 학교 연결
  { id: 'n9', name: '송유진', school: 'KAIST', company: 'Y Combinator', role: '파트너', cluster: 'school', layer: 2, x: 20, y: 80, connections: ['n3'] },
  { id: 'n10', name: '임도현', company: '배달의민족', role: 'CTO', cluster: 'school', layer: 2, x: 15, y: 65, connections: ['n3'] },
  { id: 'n11', name: '조아영', company: '무신사', role: 'Head of Design', cluster: 'school', layer: 2, x: 80, y: 80, connections: ['n4'] },
  
  // 2촌 - 기타
  { id: 'n12', name: '백서준', company: 'Tesla', role: 'AI Researcher', cluster: 'other', layer: 2, x: 50, y: 5, connections: ['n5'] },
];

const CLUSTER_COLORS = {
  me: { bg: '#3B82F6', text: 'blue', label: '나' },
  company: { bg: '#8B5CF6', text: 'purple', label: '회사 동료' },
  school: { bg: '#10B981', text: 'green', label: '학교 동기' },
  other: { bg: '#F59E0B', text: 'yellow', label: '기타' },
};

export default function NetworkMapPage() {
  const router = useRouter();
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [visibleClusters, setVisibleClusters] = useState<string[]>(['me', 'company', 'school', 'other']);
  const [searchQuery, setSearchQuery] = useState('');

  // Toast 메시지 표시 (미구현 기능 클릭 시)
  const showComingSoonToast = (featureName: string) => {
    alert(`🚧 "${featureName}" 기능은 곧 출시됩니다!\n\n현재는 프로토타입 단계입니다.`);
  };

  const filteredNodes = MOCK_NODES.filter(node => {
    const matchesCluster = visibleClusters.includes(node.cluster);
    const matchesSearch = !searchQuery || 
      node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.school?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCluster && matchesSearch;
  });

  const toggleCluster = (cluster: string) => {
    if (cluster === 'me') return; // 나는 항상 표시
    setVisibleClusters(prev =>
      prev.includes(cluster)
        ? prev.filter(c => c !== cluster)
        : [...prev, cluster]
    );
  };

  const getNodeSize = (node: NetworkNode) => {
    if (node.layer === 0) return 16; // 나
    if (node.layer === 1) return 12; // 1촌
    return 10; // 2촌
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
              네트워크 맵 🗺️
            </h1>
            <div className="bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 text-xs font-bold px-3 py-1 rounded">
              📝 Mock 데이터
            </div>
          </div>
          
          {/* Search */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="이름, 회사, 학교 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar - Filters & Info */}
        <div className="w-80 bg-white dark:bg-gray-800 border-r dark:border-gray-700 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Cluster Filters */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                네트워크 그룹
              </h3>
              <div className="space-y-2">
                {Object.entries(CLUSTER_COLORS).map(([key, { bg, label }]) => (
                  <label
                    key={key}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={visibleClusters.includes(key)}
                      onChange={() => toggleCluster(key)}
                      disabled={key === 'me'}
                      className="w-4 h-4 rounded"
                    />
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: bg }} />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                    <span className="ml-auto text-xs text-gray-500">
                      {MOCK_NODES.filter(n => n.cluster === key).length}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="pt-6 border-t dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                통계
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">전체 노드</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{filteredNodes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">1촌</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {filteredNodes.filter(n => n.layer === 1).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">2촌</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {filteredNodes.filter(n => n.layer === 2).length}
                  </span>
                </div>
              </div>
            </div>

            {/* Selected Node Info */}
            {selectedNode && (
              <div className="pt-6 border-t dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    선택된 노드
                  </h3>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: CLUSTER_COLORS[selectedNode.cluster as keyof typeof CLUSTER_COLORS].bg }}
                    >
                      {selectedNode.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{selectedNode.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {selectedNode.layer === 0 ? '나' : `${selectedNode.layer}촌`}
                      </p>
                    </div>
                  </div>
                  
                  {selectedNode.role && (
                    <div className="text-sm">
                      <span className="text-gray-600 dark:text-gray-400">역할: </span>
                      <span className="text-gray-900 dark:text-white">{selectedNode.role}</span>
                    </div>
                  )}
                  
                  {selectedNode.company && (
                    <div className="text-sm">
                      <span className="text-gray-600 dark:text-gray-400">회사: </span>
                      <span className="text-gray-900 dark:text-white">{selectedNode.company}</span>
                    </div>
                  )}
                  
                  {selectedNode.school && (
                    <div className="text-sm">
                      <span className="text-gray-600 dark:text-gray-400">학교: </span>
                      <span className="text-gray-900 dark:text-white">{selectedNode.school}</span>
                    </div>
                  )}
                  
                  <div className="text-sm">
                    <span className="text-gray-600 dark:text-gray-400">연결: </span>
                    <span className="text-gray-900 dark:text-white">{selectedNode.connections.length}명</span>
                  </div>

                  <button 
                    onClick={() => showComingSoonToast('경로 보기')}
                    className="w-full mt-2 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  >
                    경로 보기 🚧
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Canvas */}
        <div className="flex-1 bg-gray-100 dark:bg-gray-950 relative overflow-hidden">
          {/* Canvas */}
          <svg className="w-full h-full">
            {/* Connections */}
            <g>
              {filteredNodes.flatMap(node =>
                node.connections
                  .filter(connId => filteredNodes.some(n => n.id === connId))
                  .map(connId => {
                    const target = MOCK_NODES.find(n => n.id === connId);
                    if (!target) return null;
                    
                    // SVG viewBox는 0-100 범위
                    const x1 = `${node.x}%`;
                    const y1 = `${node.y}%`;
                    const x2 = `${target.x}%`;
                    const y2 = `${target.y}%`;
                    
                    const isHighlighted = 
                      hoveredNode === node.id || 
                      hoveredNode === connId ||
                      selectedNode?.id === node.id ||
                      selectedNode?.id === connId;
                    
                    return (
                      <line
                        key={`${node.id}-${connId}`}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke={isHighlighted ? '#60A5FA' : '#E5E7EB'}
                        strokeWidth={isHighlighted ? '2' : '1'}
                        opacity={isHighlighted ? 0.8 : 0.3}
                        className="transition-all duration-200"
                      />
                    );
                  })
              )}
            </g>

            {/* Nodes */}
            <g>
              {filteredNodes.map(node => {
                const size = getNodeSize(node);
                const isHovered = hoveredNode === node.id;
                const isSelected = selectedNode?.id === node.id;
                const color = CLUSTER_COLORS[node.cluster as keyof typeof CLUSTER_COLORS].bg;
                
                return (
                  <g key={node.id}>
                    {/* Node circle */}
                    <circle
                      cx={`${node.x}%`}
                      cy={`${node.y}%`}
                      r={isHovered || isSelected ? size + 2 : size}
                      fill={color}
                      stroke={isSelected ? '#3B82F6' : 'white'}
                      strokeWidth={isSelected ? '3' : '2'}
                      className="cursor-pointer transition-all duration-200"
                      style={{ filter: isHovered ? 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' : 'none' }}
                      onMouseEnter={() => setHoveredNode(node.id)}
                      onMouseLeave={() => setHoveredNode(null)}
                      onClick={() => setSelectedNode(node)}
                    />
                    
                    {/* Label */}
                    {(isHovered || isSelected || node.layer === 0) && (
                      <text
                        x={`${node.x}%`}
                        y={`${node.y + 3}%`}
                        textAnchor="middle"
                        className="text-xs font-medium pointer-events-none select-none"
                        fill={isSelected ? '#3B82F6' : '#374151'}
                        style={{ textShadow: '0 0 3px white, 0 0 3px white' }}
                      >
                        {node.name}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Controls */}
          <div className="absolute bottom-6 right-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 space-y-2">
            <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded shadow">
              🚧
            </div>
            <button 
              onClick={() => showComingSoonToast('확대')}
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              title="확대 (미구현)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <button 
              onClick={() => showComingSoonToast('축소')}
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              title="축소 (미구현)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <div className="border-t dark:border-gray-700 pt-2">
              <button 
                onClick={() => showComingSoonToast('전체 화면')}
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                title="전체 화면 (미구현)"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </button>
            </div>
          </div>

          {/* Legend */}
          <div className="absolute top-6 left-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400">범례</h4>
              <div className="bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 text-xs font-bold px-2 py-0.5 rounded">
                고정 위치
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-4 h-4 rounded-full bg-blue-500" />
                <span className="text-gray-700 dark:text-gray-300">나 (0촌)</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <span className="text-gray-700 dark:text-gray-300">1촌 (직접 아는 사람)</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span className="text-gray-700 dark:text-gray-300">2촌 (친구의 친구)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

