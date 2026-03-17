import { motion } from 'framer-motion';
import { type Defense } from '../../data/defenses';
import { Shield, Lock, Network, Scan, Cpu, Activity, Key, AlertTriangle } from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ size: number }>> = {
  shield: Shield,
  lock: Lock,
  network: Network,
  scan: Scan,
  cpu: Cpu,
  activity: Activity,
  key: Key,
  alertTriangle: AlertTriangle,
};

interface DefenseToggleProps {
  defense: Defense;
  isActive: boolean;
  onToggle: () => void;
}

export function DefenseToggle({ defense, isActive, onToggle }: DefenseToggleProps) {
  const Icon = iconMap[defense.icon] || Shield;

  return (
    <motion.div
      layout
      className={`
        border rounded-lg p-3 cursor-pointer transition-all duration-300
        ${isActive
          ? 'border-cyan-400/50 bg-cyan-950/20 glow-cyan'
          : 'border-slate-700/50 bg-slate-900/20 hover:border-slate-600'
        }
      `}
      onClick={onToggle}
    >
      <div className="flex items-start gap-3">
        <div className={`
          mt-0.5 p-1.5 rounded flex-shrink-0
          ${isActive ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-500'}
        `}>
          <Icon size={14} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="text-xs font-bold text-slate-200 leading-tight">{defense.nameKo}</div>
              <div className="text-xs text-slate-500 font-mono-custom mt-0.5">{defense.name}</div>
            </div>

            {/* Toggle switch */}
            <div
              className={`
                relative w-10 h-5 rounded-full flex-shrink-0 transition-colors duration-200
                ${isActive ? 'bg-cyan-500' : 'bg-slate-700'}
              `}
            >
              <motion.div
                className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow"
                animate={{ x: isActive ? 20 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </div>
          </div>

          <p className="text-xs text-slate-400 mt-2 leading-relaxed">{defense.description}</p>

          <div className="mt-1 flex flex-wrap gap-1">
            {defense.blocksAt.map(id => (
              <span key={id} className={`
                text-xs font-mono-custom px-1.5 py-0.5 rounded
                ${isActive ? 'bg-cyan-900/50 text-cyan-400' : 'bg-slate-800 text-slate-500'}
              `}>
                차단: {id}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
