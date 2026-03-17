export interface KTStep {
  id: string;
  path: 'A' | 'B';
  step: string;
  phase: string;
  phaseEn: string;
  date: string;
  node: string;
  description: string;
  keyProblem: string;
  technicalDetail: string;
  defenseIds: string[];
}

export const ktKillChain: KTStep[] = [
  {
    id: 'kt-a1',
    path: 'A',
    step: 'A-1',
    phase: '웹 취약점 침투',
    phaseEn: 'Web Exploitation',
    date: '2022.04.02~',
    node: '인터넷 접점 서버',
    description: '파일 업로드 취약점을 통해 웹셸 업로드. 서버 원격 제어 권한 획득.',
    keyProblem: 'WAF 부재, 파일 업로드 검증 미흡',
    technicalDetail: '악성 PHP/JSP 웹셸 업로드 → 서버사이드 코드 실행 → 초기 접근 권한 획득',
    defenseIds: ['waf'],
  },
  {
    id: 'kt-a2',
    path: 'A',
    step: 'A-2',
    phase: '악성코드 확산',
    phaseEn: 'Malware Spread',
    date: '2022~2025',
    node: '서버 94대 감염 / 악성코드 103종',
    description: '웹셸 → BPFDoor, 루트킷 등 확산. 2024년 자체 발견했으나 미신고, 백신만 실행 후 은폐.',
    keyProblem: '서버 EDR 부재, 사고 미신고',
    technicalDetail: 'BPFDoor + 루트킷 설치 → 94대 서버 감염 → 2024년 내부 발견 후 미신고 → 지속 운영',
    defenseIds: ['server-edr'],
  },
  {
    id: 'kt-b1',
    path: 'B',
    step: 'B-1',
    phase: '불법 펨토셀 제작',
    phaseEn: 'Femtocell Cloning',
    date: '2024~2025',
    node: '동일 제조사 인증서 복제',
    description: 'KT 납품 펨토셀이 모두 동일 제조사 인증서 사용(유효기간 10년). 인증서 복사만으로 불법 장비도 코어망 접속 가능.',
    keyProblem: '장비별 고유 인증서 미적용 (공유 인증서)',
    technicalDetail: '단일 공유 X.509 인증서 → 불법 펨토셀 20대 제작 → 동일 인증서로 mTLS 인증 우회',
    defenseIds: ['pki'],
  },
  {
    id: 'kt-b2',
    path: 'B',
    step: 'B-2',
    phase: '망 접속 & 도청',
    phaseEn: 'Network Interception',
    date: '2025.08~',
    node: '불법 펨토셀 20대 → KT 코어망',
    description: '가입자 22,227명의 IMSI·IMEI·전화번호 유출. IPsec 핸드셰이크 방해 → 암호화 다운그레이드 → SMS/ARS 평문 탈취.',
    keyProblem: '암호화 다운그레이드 허용, 이상 장비 탐지 부재',
    technicalDetail: 'IPsec 협상 실패 유도 → 평문 GTP 통신 폴백 → SMS/ARS 감청 → IMSI/IMEI 수집',
    defenseIds: ['ipsec-strict'],
  },
  {
    id: 'kt-b3',
    path: 'B',
    step: 'B-3',
    phase: '소액결제 사기',
    phaseEn: 'Financial Fraud',
    date: '2025.08~',
    node: '368명 / 2.43억원 피해',
    description: '탈취한 인증정보 + 개인정보 결합 → 상품권 구매 등 무단 소액결제.',
    keyProblem: '이상 결제 탐지 시스템(FDS) 부재',
    technicalDetail: 'IMSI + 개인정보 결합 → SMS 인증 우회 → 비대면 소액결제 → 상품권 현금화',
    defenseIds: ['fds'],
  },
];
