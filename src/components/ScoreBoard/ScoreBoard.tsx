import { motion } from 'framer-motion';
import { type Defense } from '../../data/defenses';

interface ScoreBoardProps {
  defenses: Defense[];
  activeDefenses: Set<string>;
}

export function ScoreBoard({ defenses, activeDefenses }: ScoreBoardProps) {
  const activeCount = defenses.filter(d => activeDefenses.has(d.id)).length;
  const totalCount = defenses.length;
  const defenseRate = Math.round((activeCount / totalCount) * 100);

  const getRating = () => {
    if (activeCount === 0) return { emoji: '🔴', label: 'CRITICAL', color: 'text-red-400', borderColor: 'border-red-500/50', bgColor: 'bg-red-950/20', desc: '현실 그 자체. 4년간 무방비.' };
    if (activeCount <= 2) return { emoji: '🟠', label: 'HIGH RISK', color: 'text-orange-400', borderColor: 'border-orange-500/50', bgColor: 'bg-orange-950/20', desc: '일부 차단, 우회 가능.' };
    if (activeCount <= 4) return { emoji: '🟡', label: 'MEDIUM', color: 'text-amber-400', borderColor: 'border-amber-500/50', bgColor: 'bg-amber-950/20', desc: '주요 경로 차단, 잔존 리스크.' };
    return { emoji: '🟢', label: 'LOW RISK', color: 'text-green-400', borderColor: 'border-green-500/50', bgColor: 'bg-green-950/20', desc: '다중 방어 레이어. 공격 성공 확률 극히 낮음.' };
  };

  const rating = getRating();

  return (
    <motion.div
      layout
      className={`border ${rating.borderColor} ${rating.bgColor} rounded-lg p-4`}
    >
      <div className="font-mono-custom text-xs text-slate-500 mb-3 tracking-wider">DEFENSE SCOREBOARD</div>

      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">{rating.emoji}</span>
        <div>
          <div className={`font-mono-custom text-lg font-bold ${rating.color}`}>{rating.label}</div>
          <div className="text-xs text-slate-400">{rating.desc}</div>
        </div>
        <div className="ml-auto text-right">
          <div className={`font-mono-custom text-2xl font-bold ${rating.color}`}>{defenseRate}%</div>
          <div className="text-xs text-slate-500">{activeCount}/{totalCount} 방어 활성</div>
        </div>
      </div>

      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${
            activeCount === 0 ? 'bg-red-500' :
            activeCount <= 2 ? 'bg-orange-400' :
            activeCount <= 4 ? 'bg-amber-400' : 'bg-green-400'
          }`}
          animate={{ width: `${defenseRate}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  );
}
