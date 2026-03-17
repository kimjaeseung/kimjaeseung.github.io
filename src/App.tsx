import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LandingSection } from './components/Landing/LandingSection';
import { SKTDiagram } from './components/KillChain/SKTDiagram';
import { KTDiagram } from './components/KillChain/KTDiagram';
import { DefensePanel } from './components/DefensePanel/DefensePanel';
import { BPFDoorDive } from './components/BPFDoorDive/BPFDoorDive';
import { TimelineView } from './components/Timeline/TimelineView';
import { ScoreBoard } from './components/ScoreBoard/ScoreBoard';
import { useDefenseState } from './hooks/useDefenseState';
import { sktDefenses, ktDefenses } from './data/defenses';

type Tab = 'killchain' | 'bpfdoor' | 'timeline';

export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [carrier, setCarrier] = useState<'SKT' | 'KT'>('SKT');
  const [activeTab, setActiveTab] = useState<Tab>('killchain');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { activeDefenses, toggleDefense, isStepBlocked, resetDefenses } = useDefenseState();

  const currentDefenses = carrier === 'SKT' ? sktDefenses : ktDefenses;

  if (showLanding) {
    return (
      <div className="min-h-screen bg-[#0a0a0f]">
        <LandingSection onEnter={() => setShowLanding(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] bg-grid scanlines flex flex-col">
      {/* Navigation */}
      <nav className="flex-shrink-0 border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center px-4 h-14">
          <button
            onClick={() => setShowLanding(true)}
            className="font-mono-custom text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors mr-6"
          >
            ⚡ Kill Chain Breaker
          </button>

          {/* Carrier toggle */}
          <div className="flex gap-1 mr-6">
            {(['SKT', 'KT'] as const).map(c => (
              <button
                key={c}
                onClick={() => { setCarrier(c); resetDefenses(); }}
                className={`px-4 py-1.5 font-mono-custom text-sm font-bold rounded transition-all ${
                  carrier === c
                    ? c === 'SKT'
                      ? 'bg-red-500/20 border border-red-500/50 text-red-400'
                      : 'bg-amber-500/20 border border-amber-500/50 text-amber-400'
                    : 'bg-slate-800/50 border border-slate-700 text-slate-500 hover:text-slate-300'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Tabs */}
          <div className="hidden md:flex gap-1">
            {([
              { id: 'killchain', label: '킬체인' },
              { id: 'bpfdoor', label: 'BPFDoor 딥다이브' },
              { id: 'timeline', label: '타임라인' },
            ] as { id: Tab; label: string }[]).map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 font-mono-custom text-xs rounded transition-all ${
                  activeTab === tab.id
                    ? 'bg-cyan-500/10 border border-cyan-500/40 text-cyan-400'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2">
            {activeTab === 'killchain' && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="px-3 py-1.5 font-mono-custom text-xs bg-slate-800 border border-slate-700 text-slate-400 rounded hover:bg-slate-700 transition-all"
              >
                {sidebarOpen ? '방어 패널 닫기' : '방어 패널 열기'}
              </button>
            )}
          </div>
        </div>

        {/* Mobile tabs */}
        <div className="md:hidden flex border-t border-slate-800/50">
          {([
            { id: 'killchain', label: '킬체인' },
            { id: 'bpfdoor', label: 'BPFDoor' },
            { id: 'timeline', label: '타임라인' },
          ] as { id: Tab; label: string }[]).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 font-mono-custom text-xs transition-all ${
                activeTab === tab.id
                  ? 'bg-cyan-500/10 text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-slate-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        <main className={`flex-1 overflow-y-auto transition-all duration-300 ${sidebarOpen && activeTab === 'killchain' ? 'mr-0 lg:mr-80' : ''}`}>
          <div className="max-w-6xl mx-auto px-4 py-6">
            <AnimatePresence mode="wait">
              {activeTab === 'killchain' && (
                <motion.div
                  key={`killchain-${carrier}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-6">
                    <h1 className="font-mono-custom text-2xl font-bold text-white">
                      {carrier === 'SKT' ? 'SKT' : 'KT'} 해킹 킬체인
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">
                      {carrier === 'SKT'
                        ? '2021~2025년 · 유심정보 2,696만 건 유출'
                        : '2022~2025년 · 서버 94대 감염 + 펨토셀 도청'}
                    </p>
                  </div>

                  <div className="mb-6">
                    <ScoreBoard defenses={currentDefenses} activeDefenses={activeDefenses} />
                  </div>

                  {carrier === 'SKT' ? (
                    <SKTDiagram isStepBlocked={isStepBlocked} />
                  ) : (
                    <KTDiagram isStepBlocked={isStepBlocked} />
                  )}

                  <div className="mt-8 text-center">
                    <p className="text-xs text-slate-600 font-mono-custom">
                      노드를 클릭하면 상세 정보를 볼 수 있습니다 · 우측 패널에서 방어 기술을 토글해보세요
                    </p>
                  </div>
                </motion.div>
              )}

              {activeTab === 'bpfdoor' && (
                <motion.div
                  key="bpfdoor"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <BPFDoorDive />
                </motion.div>
              )}

              {activeTab === 'timeline' && (
                <motion.div
                  key="timeline"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <TimelineView />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <footer className="border-t border-slate-800/50 px-4 py-6 mt-8">
            <div className="max-w-6xl mx-auto text-center space-y-2">
              <p className="text-xs text-slate-500 font-mono-custom">
                이 프로젝트는 보안 인식 제고를 위한 교육 목적으로 제작되었습니다.
              </p>
              <p className="text-xs text-slate-600 font-mono-custom">
                데이터 출처: 과기정통부 민관합동조사단 발표 · 보안뉴스 · KISA
              </p>
              <a
                href="https://github.com/kimjaeseung"
                className="text-xs text-cyan-400/50 hover:text-cyan-400 transition-colors font-mono-custom"
              >
                GitHub
              </a>
            </div>
          </footer>
        </main>

        {/* Defense sidebar */}
        <AnimatePresence>
          {sidebarOpen && activeTab === 'killchain' && (
            <motion.aside
              initial={{ x: 320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 320, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-14 bottom-0 w-full lg:w-80 border-l border-slate-800 bg-slate-950/95 backdrop-blur-sm z-30 overflow-hidden flex flex-col"
            >
              <DefensePanel
                defenses={currentDefenses}
                activeDefenses={activeDefenses}
                onToggle={toggleDefense}
                onReset={resetDefenses}
                carrier={carrier}
              />
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
