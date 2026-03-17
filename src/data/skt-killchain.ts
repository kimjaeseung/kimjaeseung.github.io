export interface KillChainStep {
  id: string;
  step: number;
  phase: string;
  phaseEn: string;
  date: string;
  node: string;
  description: string;
  keyProblem: string;
  technicalDetail: string;
  defenseIds: string[];
}

export const sktKillChain: KillChainStep[] = [
  {
    id: 'skt-1',
    step: 1,
    phase: '초기 침투',
    phaseEn: 'Initial Access',
    date: '2021.08.06',
    node: '외부 인터넷 접점 서버 A',
    description: '외부 인터넷과 연결된 시스템 관리망 내 서버에 VPN 취약점(Ivanti 추정)을 통해 침투. CrossC2 악성코드 설치.',
    keyProblem: '외부 접점 서버의 취약점 관리 미흡',
    technicalDetail: 'CVE 기반 VPN 취약점 익스플로잇 → CrossC2(Linux 전용 C2 프레임워크) 설치 → 원격 제어 권한 획득',
    defenseIds: ['patch-mgmt'],
  },
  {
    id: 'skt-2',
    step: 2,
    phase: '횡적 이동',
    phaseEn: 'Lateral Movement',
    date: '2021.12.24',
    node: '서버A → 서버B → HSS 관리서버',
    description: '서버A에 평문 저장된 계정정보 탈취 → 서버B 접속 → 서버B의 HSS 관리서버 계정정보 탈취 → HSS 접속.',
    keyProblem: '계정정보 평문 저장, 네트워크 세그멘테이션 부재',
    technicalDetail: '자격증명 덤핑 → Pass-the-Password 공격 → 관리망에서 코어망으로 비인가 접근',
    defenseIds: ['secret-mgr', 'zero-trust'],
  },
  {
    id: 'skt-3',
    step: 3,
    phase: '거점 확보 & 은닉',
    phaseEn: 'Persistence & Evasion',
    date: '2022.06',
    node: 'HSS 서버 5대 중 3대 + 고객관리망',
    description: 'BPFDoor 백도어 설치. 커널 레벨 BPF 필터로 매직 패킷 수신 시에만 활성화. 총 28대 서버, 33종 악성코드.',
    keyProblem: '리눅스 서버 EDR 미설치, 행위 기반 탐지 부재',
    technicalDetail: 'BPF 필터(매직바이트 0x7255) → 포트리스 통신 → 프로세스명 위장 → iptables 조작 → /dev/shm 자가복사',
    defenseIds: ['linux-edr'],
  },
  {
    id: 'skt-4',
    step: 4,
    phase: '데이터 유출',
    phaseEn: 'Exfiltration',
    date: '2025.04.18 탐지',
    node: '유심정보 25종 / 9.82GB / 2,696만 건',
    description: 'IMSI, MSISDN, 인증키(Ki) 등 유심 핵심 정보 대량 탈취. 약 4년간 탐지 실패.',
    keyProblem: 'DLP 미적용, 아웃바운드 트래픽 모니터링 부재',
    technicalDetail: '9.82GB 대규모 아웃바운드 → 탐지 실패 → IMSI/Ki 복제 가능 → 유심 스와핑 위협',
    defenseIds: ['tee', 'dlp'],
  },
];
