export interface Defense {
  id: string;
  name: string;
  nameKo: string;
  description: string;
  blocksAt: string[];
  carrier: 'SKT' | 'KT' | 'BOTH';
  icon: string;
}

export const sktDefenses: Defense[] = [
  {
    id: 'patch-mgmt',
    name: 'Patch Management',
    nameKo: '취약점 관리',
    description: 'VPN 장비 취약점 정기 패치 및 노출 면 최소화로 초기 침투 차단',
    blocksAt: ['skt-1'],
    carrier: 'SKT',
    icon: 'shield',
  },
  {
    id: 'secret-mgr',
    name: 'Secret Manager (Vault)',
    nameKo: '비밀 관리 (Vault)',
    description: '계정정보 암호화 저장. 평문 탈취 불가 → 횡적 이동 차단',
    blocksAt: ['skt-2'],
    carrier: 'SKT',
    icon: 'lock',
  },
  {
    id: 'zero-trust',
    name: 'Zero Trust / 마이크로세그멘테이션',
    nameKo: '제로 트러스트',
    description: '서버간 최소 권한 접근 정책. 관리망→코어망 접근 원천 차단',
    blocksAt: ['skt-2'],
    carrier: 'SKT',
    icon: 'network',
  },
  {
    id: 'linux-edr',
    name: 'Linux EDR',
    nameKo: '리눅스 EDR (행위 기반 탐지)',
    description: 'AF_PACKET 소켓, iptables 변조, /dev/shm 복사 등 비정상 행위 탐지 → BPFDoor 초기 탐지',
    blocksAt: ['skt-3'],
    carrier: 'SKT',
    icon: 'scan',
  },
  {
    id: 'tee',
    name: 'Confidential Computing (TEE)',
    nameKo: '기밀 컴퓨팅 (TEE)',
    description: 'Intel SGX/AMD SEV 기반 메모리 암호화. OS 장악되어도 enclave 내 인증키 유출 불가',
    blocksAt: ['skt-4'],
    carrier: 'SKT',
    icon: 'cpu',
  },
  {
    id: 'dlp',
    name: 'DLP + 이상 트래픽 모니터링',
    nameKo: 'DLP + 트래픽 모니터링',
    description: '9.82GB 대량 데이터 반출 실시간 탐지·차단',
    blocksAt: ['skt-4'],
    carrier: 'SKT',
    icon: 'activity',
  },
];

export const ktDefenses: Defense[] = [
  {
    id: 'waf',
    name: 'WAF + 업로드 검증',
    nameKo: 'WAF + 파일 업로드 검증',
    description: '웹셸 업로드 차단. 파일 화이트리스트 검증 및 실행 권한 제어',
    blocksAt: ['kt-a1'],
    carrier: 'KT',
    icon: 'shield',
  },
  {
    id: 'server-edr',
    name: '서버 EDR + 무결성 모니터링',
    nameKo: '서버 EDR + 무결성 모니터링',
    description: '루트킷·BPFDoor 설치 행위 실시간 탐지 및 파일 무결성 검증',
    blocksAt: ['kt-a2'],
    carrier: 'KT',
    icon: 'scan',
  },
  {
    id: 'pki',
    name: '개별 PKI 인증서 (mTLS)',
    nameKo: '장비별 고유 인증서',
    description: '펨토셀별 고유 X.509 인증서 → 불법 장비 코어망 접속 불가',
    blocksAt: ['kt-b1'],
    carrier: 'KT',
    icon: 'key',
  },
  {
    id: 'ipsec-strict',
    name: '암호화 다운그레이드 방지',
    nameKo: 'IPsec Strict Mode',
    description: 'IPsec 협상 실패 시 연결 거부 → 평문 통신 원천 차단',
    blocksAt: ['kt-b2'],
    carrier: 'KT',
    icon: 'lock',
  },
  {
    id: 'fds',
    name: '이상 결제 탐지 (FDS)',
    nameKo: '이상 금융 거래 탐지',
    description: '비정상 소액결제 패턴 실시간 탐지 및 차단',
    blocksAt: ['kt-b3'],
    carrier: 'KT',
    icon: 'alertTriangle',
  },
];
