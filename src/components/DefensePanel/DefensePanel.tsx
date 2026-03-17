import { type Defense } from '../../data/defenses';
import { DefenseToggle } from './DefenseToggle';
import { motion } from 'framer-motion';

interface DefensePanelProps {
  defenses: Defense[];
  activeDefenses: Set<string>;
  onToggle: (id: string) => void;
  onReset: () => void;
  carrier: 'SKT' | 'KT';
}

export function DefensePanel({ defenses, activeDefenses, onToggle, onReset, carrier }: DefensePanelProps) {
  const activeCount = defenses.filter(d => activeDefenses.has(d.id)).length;
  const totalCount = defenses.length;
  const defenseRate = Math.round((activeCount / totalCount) * 100);

  const getRating = () => {
    if (activeCount === 0) return { label: 'CRITICAL', color: 'text-red-400', desc: '현실 그 자체. 무방비 상태.' };
    if (activeCount <= 2) return { label: 'HIGH RISK', color: 'text-orange-400', desc: '일부 차단, 우회 가능.' };
    if (activeCount <= 4) return { label: 'MEDIUM', color: 'text-amber-400', desc: '주요 경로 차단, 잔존 리스크.' };
    return { label: 'LOW RISK', color: 'text-green-400', desc: '다중 방어 레이어. 공격 성공 확률 극히 낮음.' };
  };

  const rating = getRating();

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-slate-800">
        <div className="font-mono-custom text-xs text-slate-500 mb-1 tracking-wider">DEFENSE CONTROLS</div>
        <h3 className="text-sm font-bold text-white">{carrier} 방어 기술 토글</h3>

        {/* Score */}
        <div className="mt-3 border border-slate-700 rounded-lg p-3 bg-slate-900/50">
          <div className="flex items-center justify-between mb-2">
            <span className={`font-mono-custom text-sm font-bold ${rating.color}`}>
              {rating.label}
            </span>
            <span className="font-mono-custom text-lg font-bold text-white">{defenseRate}%</span>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${
                activeCount === 0 ? 'bg-red-500' :
                activeCount <= 2 ? 'bg-orange-400' :
                activeCount <= 4 ? 'bg-amber-400' : 'bg-green-400'
              }`}
              animate={{ width: `${defenseRate}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <p className="text-xs text-slate-400 mt-2">{rating.desc}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {defenses.map(defense => (
          <DefenseToggle
            key={defense.id}
            defense={defense}
            isActive={activeDefenses.has(defense.id)}
            onToggle={() => onToggle(defense.id)}
          />
        ))}
      </div>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={onReset}
          className="w-full py-2 font-mono-custom text-xs text-slate-400 border border-slate-700 rounded hover:bg-slate-800 transition-colors"
        >
          모든 방어 해제 (RESET)
        </button>
      </div>
    </div>
  );
}
