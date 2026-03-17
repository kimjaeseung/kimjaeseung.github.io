import { useState } from 'react';
import { motion } from 'framer-motion';

const sktEvents = [
  { date: '2021.08', label: '최초 침투', desc: 'VPN 취약점 통해 서버 A 침투, CrossC2 설치', severity: 'critical' },
  { date: '2021.12', label: '횡적 이동', desc: '평문 계정정보 탈취 → HSS 관리서버 접근', severity: 'high' },
  { date: '2022.02', label: '자체 발견(미신고)', desc: '내부 감지 후 미신고 은폐', severity: 'warning' },
  { date: '2022.06', label: '고객망 확산', desc: 'BPFDoor 설치, 28대 서버 감염', severity: 'critical' },
  { date: '2025.04.18', label: '이상 트래픽 탐지', desc: '외부 유출 트래픽 최초 탐지', severity: 'warning' },
  { date: '2025.04.19', label: '유출 확정', desc: '2,696만 건 유심정보 유출 확인', severity: 'critical' },
  { date: '2025.07.04', label: '최종 조사', desc: '과기정통부 민관합동조사단 최종 발표', severity: 'info' },
];

const ktEvents = [
  { date: '2022.04', label: '웹셸 침투', desc: '파일 업로드 취약점으로 웹셸 업로드', severity: 'critical' },
  { date: '2022~2024', label: '악성코드 확산', desc: '94대 서버, 103종 악성코드 감염', severity: 'critical' },
  { date: '2024.03~07', label: '자체 발견(미신고)', desc: 'BPFDoor 발견 후 백신만 실행, 미신고', severity: 'warning' },
  { date: '2025.08', label: '소액결제 피해', desc: '368명 / 2.43억원 피해 발생', severity: 'high' },
  { date: '2025.09', label: '해킹 인정', desc: 'KT 공식 해킹 사실 인정', severity: 'warning' },
  { date: '2025.11.06', label: '중간 조사 발표', desc: '과기정통부 중간 조사 결과 발표', severity: 'info' },
  { date: '2025.12.29', label: '최종 조사', desc: '과기정통부 민관합동조사단 최종 발표', severity: 'info' },
];

const severityColors = {
  critical: 'bg-red-500 border-red-500 text-red-400',
  high: 'bg-orange-500 border-orange-500 text-orange-400',
  warning: 'bg-amber-500 border-amber-500 text-amber-400',
  info: 'bg-cyan-500 border-cyan-500 text-cyan-400',
};

interface TimelineEventProps {
  event: typeof sktEvents[0];
  index: number;
  isTop: boolean;
}

function TimelineEvent({ event, index, isTop }: TimelineEventProps) {
  const [hovered, setHovered] = useState(false);
  const dotColor = severityColors[event.severity as keyof typeof severityColors];
  const textColor = dotColor.split(' ')[2];

  return (
    <motion.div
      initial={{ opacity: 0, y: isTop ? -20 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative flex-shrink-0 w-36"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Connector line to timeline */}
      <div className={`absolute left-1/2 w-px bg-slate-700 ${isTop ? 'top-full h-4' : 'bottom-full h-4'}`} />

      {/* Timeline dot */}
      <div className={`absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 ${dotColor} bg-slate-950 ${isTop ? 'top-full mt-4' : 'bottom-full mb-4'}`} />

      {/* Content */}
      <div className={`${isTop ? 'mb-4' : 'mt-4'} text-center`}>
        <div className={`font-mono-custom text-xs font-bold ${textColor}`}>{event.date}</div>
        <div className="text-xs text-slate-200 mt-1 font-medium">{event.label}</div>

        {hovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`
              absolute z-10 left-1/2 -translate-x-1/2 w-52 p-3
              bg-slate-900 border border-slate-700 rounded-lg shadow-xl
              ${isTop ? 'bottom-full mb-2' : 'top-full mt-2'}
            `}
          >
            <div className={`font-mono-custom text-xs font-bold ${textColor} mb-1`}>{event.date}</div>
            <div className="text-xs text-slate-200 font-medium mb-1">{event.label}</div>
            <div className="text-xs text-slate-400">{event.desc}</div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export function TimelineView() {
  const [carrier, setCarrier] = useState<'SKT' | 'KT'>('SKT');
  const events = carrier === 'SKT' ? sktEvents : ktEvents;

  return (
    <div className="py-8">
      <div className="flex items-center gap-4 mb-8">
        <h2 className="font-mono-custom text-xl font-bold text-white">공격 타임라인</h2>
        <div className="flex gap-2">
          {(['SKT', 'KT'] as const).map(c => (
            <button
              key={c}
              onClick={() => setCarrier(c)}
              className={`px-3 py-1 font-mono-custom text-xs rounded transition-all ${
                carrier === c
                  ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-400'
                  : 'bg-slate-800 border border-slate-700 text-slate-400 hover:border-slate-500'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="relative overflow-x-auto pb-8">
        <div className="relative min-w-max px-8">
          {/* Central timeline line */}
          <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-slate-700" />

          <div className="flex gap-6 items-center relative">
            {events.map((event, i) => (
              <TimelineEvent
                key={i}
                event={event}
                index={i}
                isTop={i % 2 === 0}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
