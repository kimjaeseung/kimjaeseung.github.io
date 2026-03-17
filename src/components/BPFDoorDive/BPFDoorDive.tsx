import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw } from 'lucide-react';

const steps = [
  {
    id: 0,
    title: '잠복 상태',
    command: '$ ps aux | grep bpfdoor',
    output: '/sbin/udevd -d   # 정상 데몬처럼 위장됨',
    description: 'BPFDoor는 포트를 열지 않고 잠복. 방화벽·포트스캔 완전 우회. 프로세스명을 정상 시스템 데몬으로 위장.',
    detail: 'netstat -tlnp 결과: 아무 포트도 없음. 완벽한 은닉.',
    color: 'cyan',
  },
  {
    id: 1,
    title: '매직 패킷 수신',
    command: '$ tcpdump -i eth0 "udp and len == 256"',
    output: '14:23:11.123456 IP 1.2.3.4.54321 > target.eth0: UDP, length 256\n# Magic bytes: 0x7255 detected',
    description: 'BPF 필터가 커널 레벨에서 모든 패킷 검사. 특정 매직 바이트(0x7255) 포함 패킷만 처리. TCP/UDP/ICMP 모두 감지 가능.',
    detail: 'raw socket + BPF → 일반 방화벽 규칙 우회',
    color: 'amber',
  },
  {
    id: 2,
    title: 'RC4 패스워드 검증',
    command: '# RC4 decrypt(payload[4:], key)',
    output: 'Password verified: ████████\nAccess granted.',
    description: 'RC4 암호화로 페이로드 복호화. 패스워드 일치 시에만 다음 단계 진행. 잘못된 패킷은 조용히 무시.',
    detail: '이중 인증 구조 → 분석 방해',
    color: 'red',
  },
  {
    id: 3,
    title: '셸 연결',
    command: '# Bind shell or Reverse shell',
    output: '> shell_type = REVERSE\n> connecting to C2: 185.xxx.xxx.xxx:443\n> shell established',
    description: '리버스 쉘 또는 바인드 쉘 생성. C2 서버와 암호화 통신. 원격에서 피해 시스템 완전 제어.',
    detail: '443/tcp 사용 → 정상 HTTPS 트래픽으로 위장',
    color: 'red',
  },
  {
    id: 4,
    title: '지속성 확보',
    command: '$ ls -la /dev/shm/',
    output: '-rwxr-xr-x 1 root root 2847392 /dev/shm/.kdevtmpfsi\n# iptables ACCEPT rule injected',
    description: '/dev/shm(메모리 기반 파일시스템)에 자가 복사. iptables에 허용 규칙 주입. 재부팅 후에도 지속.',
    detail: 'tmpfs 사용 → 디스크 포렌식 회피',
    color: 'red',
  },
];

export function BPFDoorDive() {
  const [currentStep, setCurrentStep] = useState(-1);
  const [running, setRunning] = useState(false);

  const runSequence = async () => {
    setRunning(true);
    setCurrentStep(-1);
    for (let i = 0; i < steps.length; i++) {
      await new Promise(r => setTimeout(r, 800));
      setCurrentStep(i);
    }
    setRunning(false);
  };

  const reset = () => {
    setCurrentStep(-1);
    setRunning(false);
  };

  const colorMap = {
    cyan: 'border-cyan-500/40 bg-cyan-950/10',
    amber: 'border-amber-500/40 bg-amber-950/10',
    red: 'border-red-500/40 bg-red-950/10',
  };

  const textColorMap = {
    cyan: 'text-cyan-400',
    amber: 'text-amber-400',
    red: 'text-red-400',
  };

  return (
    <div className="py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="font-mono-custom text-xl font-bold text-white">BPFDoor 딥다이브</h2>
          <p className="text-sm text-slate-400 mt-1">4년간 탐지를 피한 악성코드의 작동 원리</p>
        </div>
        <div className="flex gap-2 sm:ml-auto">
          <button
            onClick={runSequence}
            disabled={running}
            className="flex items-center gap-2 px-4 py-2 font-mono-custom text-xs bg-red-500/20 border border-red-500/50 text-red-400 rounded hover:bg-red-500/30 transition-all disabled:opacity-50"
          >
            <Play size={12} />
            시뮬레이션 실행
          </button>
          <button
            onClick={reset}
            className="flex items-center gap-2 px-3 py-2 font-mono-custom text-xs bg-slate-800 border border-slate-700 text-slate-400 rounded hover:bg-slate-700 transition-all"
          >
            <RotateCcw size={12} />
          </button>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-4">
        {steps.map((step, i) => {
          const isActive = currentStep >= i;
          const isCurrent = currentStep === i;
          const variant = step.color as keyof typeof colorMap;

          return (
            <motion.div
              key={step.id}
              animate={{ opacity: isActive ? 1 : 0.3 }}
              transition={{ duration: 0.4 }}
              className={`border rounded-lg overflow-hidden ${isActive ? colorMap[variant] : 'border-slate-800 bg-slate-900/20'}`}
            >
              <div className="flex items-center gap-3 p-3 border-b border-slate-800/50">
                <div className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center font-mono-custom text-xs font-bold flex-shrink-0
                  ${isActive ? `border-current ${textColorMap[variant]}` : 'border-slate-700 text-slate-500'}
                `}>
                  {i + 1}
                </div>
                <div>
                  <div className={`font-mono-custom text-sm font-bold ${isActive ? textColorMap[variant] : 'text-slate-500'}`}>
                    {step.title}
                  </div>
                </div>
                {isCurrent && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="ml-auto font-mono-custom text-xs text-green-400 flex items-center gap-1"
                  >
                    <span className="cursor-blink">▶</span> 실행 중
                  </motion.div>
                )}
              </div>

              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="p-4 space-y-3"
                  >
                    <div className="bg-black/60 rounded p-3 font-mono-custom text-xs">
                      <div className="text-green-400 mb-1">{step.command}</div>
                      <div className="text-slate-300 whitespace-pre-line">{step.output}</div>
                    </div>
                    <p className="text-sm text-slate-300">{step.description}</p>
                    <div className="text-xs text-slate-500 font-mono-custom border-l-2 border-slate-700 pl-3">
                      {step.detail}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Why undetected */}
      <div className="mt-8 border border-amber-500/30 rounded-lg p-5 bg-amber-950/10">
        <h3 className="font-mono-custom text-sm font-bold text-amber-400 mb-4">⚠ 왜 4년간 탐지되지 않았는가?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { title: '포트리스 통신', desc: 'netstat/포트스캔으로 탐지 불가. 일반 방화벽 규칙 우회.' },
            { title: '커널 레벨 BPF', desc: '사용자 공간 모니터링 도구 우회. 패킷 필터 커널 삽입.' },
            { title: '프로세스 위장', desc: '정상 데몬(udevd, systemd)으로 프로세스명 변경.' },
            { title: '메모리 기반 실행', desc: '/dev/shm 사용으로 디스크 포렌식 회피. tmpfs 삭제 용이.' },
            { title: '리눅스 EDR 부재', desc: '윈도우 중심 보안 운영. 리눅스 서버 행위 기반 탐지 없음.' },
            { title: '사고 은폐', desc: '2022년, 2024년 내부 발견 후 미신고 → 지속 운영 허용.' },
          ].map((item, i) => (
            <div key={i} className="border border-slate-700/50 rounded p-3 bg-slate-900/30">
              <div className="text-xs font-bold text-amber-300 mb-1">{item.title}</div>
              <div className="text-xs text-slate-400">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
