import { motion } from 'framer-motion';
import { type KillChainStep } from '../../data/skt-killchain';
import { type KTStep } from '../../data/kt-killchain';
import { GlowCard } from '../common/GlowCard';

type Step = KillChainStep | KTStep;

interface StepNodeProps {
  step: Step;
  index: number;
  blocked: boolean;
  isDownstreamBlocked: boolean;
  onClick: () => void;
  isSelected: boolean;
  pathLabel?: string;
}

export function StepNode({ step, index, blocked, isDownstreamBlocked, onClick, isSelected, pathLabel }: StepNodeProps) {
  const variant = isDownstreamBlocked ? 'gray' : blocked ? 'green' : 'red';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: isDownstreamBlocked ? 0.25 : 1, scale: 1 }}
      transition={{ delay: index * 0.15, duration: 0.4 }}
    >
      <GlowCard
        variant={variant}
        blocked={isDownstreamBlocked}
        onClick={onClick}
        className={`
          min-w-[160px] max-w-[200px] relative
          ${isSelected ? 'ring-2 ring-cyan-400/60' : ''}
        `}
      >
        {pathLabel && (
          <div className="absolute -top-3 left-2 font-mono-custom text-xs px-2 py-0.5 bg-slate-800 border border-slate-600 rounded text-slate-400">
            경로 {pathLabel}
          </div>
        )}

        {blocked && !isDownstreamBlocked && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 text-xl"
          >
            🛡️
          </motion.div>
        )}

        <div className="flex items-start gap-2 mb-2">
          <div className={`
            font-mono-custom text-xs font-bold px-2 py-0.5 rounded flex-shrink-0
            ${blocked && !isDownstreamBlocked ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}
          `}>
            {'step' in step ? step.step : `STEP ${index + 1}`}
          </div>
          <div className="font-mono-custom text-xs text-slate-400">{step.date || ''}</div>
        </div>

        <div className="text-xs font-bold text-slate-200 mb-1">{step.phase}</div>
        <div className="text-xs text-slate-500 font-mono-custom mb-2">{step.phaseEn}</div>
        <div className="text-xs text-slate-300 leading-relaxed line-clamp-2">{step.node}</div>

        <div className="mt-3 text-xs text-cyan-400/60 font-mono-custom">▸ 클릭해서 자세히 보기</div>
      </GlowCard>
    </motion.div>
  );
}
