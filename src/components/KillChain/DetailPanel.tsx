import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { type KillChainStep } from '../../data/skt-killchain';
import { type KTStep } from '../../data/kt-killchain';

type Step = KillChainStep | KTStep;

interface DetailPanelProps {
  step: Step | null;
  onClose: () => void;
}

export function DetailPanel({ step, onClose }: DetailPanelProps) {
  return (
    <AnimatePresence>
      {step && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 h-full w-full md:w-[420px] bg-slate-950 border-l border-slate-800 z-50 overflow-y-auto"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="font-mono-custom text-xs text-cyan-400/60 tracking-wider mb-1">ATTACK DETAIL</div>
                <h3 className="text-lg font-bold text-white">{step.phase}</h3>
                <div className="text-sm text-slate-400 font-mono-custom">{step.phaseEn}</div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="border border-red-500/30 rounded-lg p-4 bg-red-950/10">
                <div className="font-mono-custom text-xs text-red-400 mb-2">⚠ 핵심 문제점</div>
                <p className="text-sm text-slate-300">{step.keyProblem}</p>
              </div>

              <div className="border border-slate-700 rounded-lg p-4 bg-slate-900/50">
                <div className="font-mono-custom text-xs text-slate-400 mb-2">📋 공격 설명</div>
                <p className="text-sm text-slate-300 leading-relaxed">{step.description}</p>
              </div>

              <div className="border border-cyan-500/30 rounded-lg p-4 bg-cyan-950/10">
                <div className="font-mono-custom text-xs text-cyan-400 mb-2">🔍 기술 상세</div>
                <p className="text-sm text-slate-300 font-mono-custom leading-relaxed">{step.technicalDetail}</p>
              </div>

              {'date' in step && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="text-xs text-slate-400 font-mono-custom">{step.date}</span>
                </div>
              )}

              <div className="border border-amber-500/30 rounded-lg p-4 bg-amber-950/10">
                <div className="font-mono-custom text-xs text-amber-400 mb-3">🛡 차단 가능한 방어 기술</div>
                <div className="space-y-2">
                  {step.defenseIds.map(id => (
                    <div key={id} className="flex items-center gap-2 text-xs text-slate-300 font-mono-custom">
                      <span className="text-amber-400">▸</span>
                      {id}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
