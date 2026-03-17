import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GlowCardProps {
  children: ReactNode;
  variant?: 'red' | 'cyan' | 'green' | 'amber' | 'gray';
  className?: string;
  onClick?: () => void;
  blocked?: boolean;
}

const variantStyles = {
  red: 'border-red-500/40 glow-red bg-red-950/20',
  cyan: 'border-cyan-400/40 glow-cyan bg-cyan-950/20',
  green: 'border-green-400/40 glow-green bg-green-950/20',
  amber: 'border-amber-400/40 glow-amber bg-amber-950/20',
  gray: 'border-slate-700/40 bg-slate-900/20',
};

export function GlowCard({ children, variant = 'cyan', className = '', onClick, blocked = false }: GlowCardProps) {
  const effectiveVariant = blocked ? 'gray' : variant;
  return (
    <motion.div
      className={`
        border rounded-lg p-4 backdrop-blur-sm transition-all duration-500
        ${variantStyles[effectiveVariant]}
        ${onClick ? 'cursor-pointer hover:scale-[1.02]' : ''}
        ${blocked ? 'opacity-30 grayscale' : ''}
        ${className}
      `}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.02 } : {}}
    >
      {children}
    </motion.div>
  );
}
