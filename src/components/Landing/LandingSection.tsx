import { useState } from 'react';
import { motion } from 'framer-motion';
import { ParticleBackground } from './ParticleBackground';
import { TerminalText } from '../common/TerminalText';

interface LandingSectionProps {
  onEnter: () => void;
}

const terminalLines = [
  '> 시스템 접속 중...',
  '> 2025년, 대한민국 통신 인프라가 뚫렸다.',
  '> 2,696만 건의 유심정보 유출. 4년간 탐지 실패.',
  '> 공격은 어디서 시작됐고, 어디서 막을 수 있었을까?',
  '> [경고] 이것은 실제로 일어난 일입니다.',
];

export function LandingSection({ onEnter }: LandingSectionProps) {
  const [typingComplete, setTypingComplete] = useState(false);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-grid scanlines overflow-hidden">
      <ParticleBackground />

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan-500/3 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl w-full px-6 text-center">
        {/* Logo / Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="font-mono-custom text-xs text-cyan-400/60 mb-2 tracking-[0.3em]">
            SECURITY EDUCATION PROJECT
          </div>
          <h1 className="text-5xl md:text-7xl font-bold font-mono-custom text-glow-cyan mb-2">
            <span className="text-cyan-400">KILL</span>
            <span className="text-white"> CHAIN</span>
          </h1>
          <h2 className="text-2xl md:text-3xl font-mono-custom text-red-400 text-glow-red">
            BREAKER
          </h2>
          <div className="mt-4 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
        </motion.div>

        {/* Terminal text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mb-12 text-left bg-black/50 border border-cyan-400/20 rounded-lg p-6 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <span className="font-mono-custom text-xs text-slate-500 ml-2">terminal — killchain@warroom</span>
          </div>
          <TerminalText
            lines={terminalLines}
            speed={35}
            onComplete={() => setTypingComplete(true)}
            className="text-sm md:text-base text-green-400"
          />
        </motion.div>

        {/* CTA Button */}
        {typingComplete && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            onClick={onEnter}
            className="
              relative px-8 py-4 font-mono-custom text-lg font-bold
              border-2 border-red-500 text-red-400
              hover:bg-red-500/10 hover:text-red-300
              transition-all duration-200
              glow-red pulse-red
              tracking-widest
            "
          >
            ⚡ ENTER THE WAR ROOM
          </motion.button>
        )}

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-16 grid grid-cols-3 gap-4 text-center"
        >
          {[
            { value: '2,696만', label: '유심정보 유출 건수' },
            { value: '4년', label: '탐지 실패 기간' },
            { value: '103종', label: 'KT 악성코드' },
          ].map((stat, i) => (
            <div key={i} className="border border-slate-700/50 rounded p-3 bg-slate-900/30">
              <div className="font-mono-custom text-xl font-bold text-red-400">{stat.value}</div>
              <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
