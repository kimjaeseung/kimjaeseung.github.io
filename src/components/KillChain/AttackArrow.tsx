import { motion } from 'framer-motion';

interface AttackArrowProps {
  blocked: boolean;
  vertical?: boolean;
}

export function AttackArrow({ blocked, vertical = false }: AttackArrowProps) {
  if (vertical) {
    return (
      <div className="flex flex-col items-center my-1 relative h-12">
        <svg width="40" height="48" viewBox="0 0 40 48" className="overflow-visible">
          {blocked ? (
            <>
              <line x1="20" y1="0" x2="20" y2="48" stroke="#22c55e" strokeWidth="2" strokeDasharray="4,4" />
              <text x="20" y="24" textAnchor="middle" fill="#22c55e" fontSize="16">🛡️</text>
            </>
          ) : (
            <>
              <line x1="20" y1="0" x2="20" y2="42" stroke="#ff3b30" strokeWidth="2" strokeDasharray="6,3" className="attack-flow" />
              <polygon points="14,38 20,48 26,38" fill="#ff3b30" />
              <motion.circle
                cx="20" cy="0" r="3" fill="#ff3b30"
                animate={{ cy: [0, 42] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              />
            </>
          )}
        </svg>
      </div>
    );
  }

  return (
    <div className="flex items-center mx-1 relative w-16">
      <svg width="64" height="40" viewBox="0 0 64 40" className="overflow-visible">
        {blocked ? (
          <>
            <line x1="0" y1="20" x2="64" y2="20" stroke="#22c55e" strokeWidth="2" strokeDasharray="4,4" />
            <text x="32" y="16" textAnchor="middle" fill="#22c55e" fontSize="12">🛡️</text>
          </>
        ) : (
          <>
            <line x1="0" y1="20" x2="58" y2="20" stroke="#ff3b30" strokeWidth="2" strokeDasharray="6,3" className="attack-flow" />
            <polygon points="54,14 64,20 54,26" fill="#ff3b30" />
            <motion.circle
              cx="0" cy="20" r="3" fill="#ff3b30"
              animate={{ cx: [0, 58] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
          </>
        )}
      </svg>
    </div>
  );
}
