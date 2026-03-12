# Kubernetes & Platform Engineering A to Z 교과서

## 플랫폼 엔지니어 교과서 — 목차·로드맵·아키텍처 개요

---

# 1️⃣ 전체 교과서 목차

## PART 1 — Container Architecture (30~50 장표)

| # | 장표 제목 | 핵심 주제 |
|---|-----------|-----------|
| 1.1 | Container란 무엇인가 | 정의, VM vs Container, 격리와 공유 |
| 1.2 | Container의 등장 배경 | 마이크로서비스, 일관된 환경, 밀도 |
| 1.3 | Container Runtime 개요 | runtime 계층, OCI 표준 |
| 1.4 | OCI (Open Container Initiative) | image-spec, runtime-spec, 표준화 |
| 1.5 | Docker 내부 구조 | Docker daemon, containerd, runc |
| 1.6 | containerd 아키텍처 | CRI, containerd-shim, runc |
| 1.7 | cgroups — 리소스 격리 | CPU, Memory, I/O 제한 |
| 1.8 | cgroups v1 vs v2 | 계층 구조, 통합 모델 |
| 1.9 | namespaces — 격리 영역 | PID, Network, Mount, UTS, IPC, User |
| 1.10 | Linux namespace 상세 | 각 namespace의 역할 |
| 1.11 | rootfs와 이미지 레이어 | Union FS, copy-on-write |
| 1.12 | Container 생명주기 | create, start, stop, delete |
| 1.13 | CRI (Container Runtime Interface) | Kubernetes와 런타임 연동 |
| 1.14 | cri-o, containerd 비교 | K8s에서의 선택지 |
| 1.15 | 보안: capabilities, seccomp | 컨테이너 보안 기초 |
| ... | (1.16~1.50) | 실습, 요약, 인터뷰 |

---

## PART 2 — Kubernetes Architecture (30~50 장표)

| # | 장표 제목 | 핵심 주제 |
|---|-----------|-----------|
| 2.1 | Kubernetes 등장 배경 | Borg, Omega, 선언적 API |
| 2.2 | Kubernetes 전체 구조 | Control Plane + Worker Nodes |
| 2.3 | Control Plane 구성요소 | API Server, Scheduler, CM, etcd |
| 2.4 | Worker Node 구성요소 | kubelet, kube-proxy, container runtime |
| 2.5 | API Server — 클러스터 관문 | REST API, 인증/인가/입원 |
| 2.6 | Scheduler — 파드 배치 | 스케줄링 알고리즘, 바인딩 |
| 2.7 | Controller Manager — desired state | 여러 컨트롤러, reconciliation |
| 2.8 | etcd — 분산 키-값 저장소 | RAFT, watch, lease |
| 2.9 | kubelet — 노드 에이전트 | 파드 생명주기, CRI 호출 |
| 2.10 | kube-proxy — 서비스 프록시 | iptables/ipvs, Service 구현 |
| 2.11 | 왜 이런 구조인가 | 관심사 분리, 확장성, 선언적 |
| 2.12 | 클러스터 부트스트랩 | kubeadm, certificate, join |
| ... | (2.13~2.50) | HA, 장애 시나리오, 요약 |

---

## PART 3 — Kubernetes Core Objects (30~50 장표)

| # | 장표 제목 | 핵심 주제 |
|---|-----------|-----------|
| 3.1 | Pod — 최소 배포 단위 | 왜 Pod인가, 컨테이너 그룹 |
| 3.2 | Pod 사양과 생명주기 | Pending, Running, Succeeded/Failed |
| 3.3 | ReplicaSet — 복제 관리 | selector, replicas, Pod 수 유지 |
| 3.4 | Deployment — 무중단 배포 | rollout, rollback, strategy |
| 3.5 | StatefulSet — 상태 유지 워크로드 | identity, 순서, 스토리지 |
| 3.6 | DaemonSet — 노드당 1 Pod | 로그 수집, 네트워크 에이전트 |
| 3.7 | Job — 일회성 작업 | completions, parallelism |
| 3.8 | CronJob — 주기 작업 | schedule, concurrencyPolicy |
| 3.9 | 객체 관계도 | OwnerReference, GC |
| 3.10 | 왜 Pod abstraction이 필요한가 | 공유 네트워크/스토리지, 조율 |
| ... | (3.11~3.50) | YAML 패턴, 실습, 요약 |

---

## PART 4 — Kubernetes Networking (30~50 장표)

| # | 장표 제목 | 핵심 주제 |
|---|-----------|-----------|
| 4.1 | Pod Network 모델 | 모든 Pod 간 통신, CNI |
| 4.2 | CNI Architecture | plugin, ADD/DEL, IP 할당 |
| 4.3 | kube-proxy 동작 | ClusterIP, NodePort, LoadBalancer |
| 4.4 | Service — 안정된 엔드포인트 | selector, Endpoints, VIP |
| 4.5 | Service 타입 비교 | ClusterIP, NodePort, LB, ExternalName |
| 4.6 | Ingress — L7 라우팅 | host/path, TLS, 컨트롤러 |
| 4.7 | Gateway API — 차세대 Ingress | 계층적, 역할 분리 |
| 4.8 | Network Policy — 마이크로 세그멘테이션 | ingress/egress 규칙 |
| 4.9 | DNS (CoreDNS) | Service discovery, FQDN |
| 4.10 | 네트워크 플러그인 (Calico, Cilium) | 오버레이/언더레이 |
| ... | (4.11~4.50) | 실습, Production 패턴 |

---

## PART 5 — Kubernetes Storage (30~50 장표)

| # | 장표 제목 | 핵심 주제 |
|---|-----------|-----------|
| 5.1 | Volume — 파드 내 스토리지 | ephemeral, persistent |
| 5.2 | Persistent Volume (PV) | 클러스터 리소스, 프로비저너 |
| 5.3 | Persistent Volume Claim (PVC) | 요청, 바인딩, 사용 |
| 5.4 | StorageClass — 동적 프로비저닝 | provisioner, parameters |
| 5.5 | CSI (Container Storage Interface) | 표준 플러그인, RPC |
| 5.6 | 스토리지 수명주기 | Provision → Bind → Use → Release |
| 5.7 | ReadWriteOnce vs ReadOnlyMany | 접근 모드 |
| 5.8 | 스냅샷, Clone | VolumeSnapshot, CSI |
| ... | (5.9~5.50) | DB 연동, 성능, 요약 |

---

## PART 6 — Kubernetes Security (30~50 장표)

| # | 장표 제목 | 핵심 주제 |
|---|-----------|-----------|
| 6.1 | RBAC — 역할 기반 접근 제어 | Role, RoleBinding, ClusterRole |
| 6.2 | Service Account | Pod identity, token |
| 6.3 | Secret — 민감 정보 | 암호화, 사용처 |
| 6.4 | Network Policy | Pod 간 트래픽 제어 |
| 6.5 | Pod Security (PSA) | restricted, baseline, privileged |
| 6.6 | Image Security | 비승인 레지스트리, 스캔 |
| 6.7 | Admission Controller | Validating, Mutating, OPA |
| 6.8 | Pod Security Standards | 보안 컨텍스트 |
| ... | (6.9~6.50) | 정책, 감사, 요약 |

---

## PART 7 — Kubernetes Scheduling (30~50 장표)

| # | 장표 제목 | 핵심 주제 |
|---|-----------|-----------|
| 7.1 | Scheduler 아키텍처 | Filter → Score → Bind |
| 7.2 | Resource scheduling | requests, limits |
| 7.3 | Node affinity / anti-affinity | 배치 제약 |
| 7.4 | Pod affinity / anti-affinity | Pod 간 배치 |
| 7.5 | Taints and Tolerations | 노드 격리, 전용 노드 |
| 7.6 | Resource quotas | Namespace별 제한 |
| 7.7 | LimitRange | 기본값, min/max |
| 7.8 | Scheduler 확장 (Framework) | Filter/Score 플러그인 |
| ... | (7.9~7.50) | 실습, 요약 |

---

## PART 8 — Kubernetes Internal Mechanics (30~50 장표)

| # | 장표 제목 | 핵심 주제 |
|---|-----------|-----------|
| 8.1 | API request lifecycle | 인증 → 인가 → 입원 → 저장 |
| 8.2 | Controller reconciliation loop | watch, diff, reconcile |
| 8.3 | 왜 Controller pattern을 쓰는가 | desired vs actual, eventually consistent |
| 8.4 | kubelet pod lifecycle | sync loop, CRI 호출 |
| 8.5 | container runtime 연동 | CRI, gRPC |
| 8.6 | etcd 데이터 모델 | 키 구조, watch |
| 8.7 | 왜 etcd가 필요한가 | 단일 진실 소스, 분산 합의 |
| 8.8 | List-Watch 메커니즘 | 효율적 동기화 |
| ... | (8.9~8.50) | 디버깅, 요약 |

---

## PART 9 — Observability (30~50 장표)

| # | 장표 제목 | 핵심 주제 |
|---|-----------|-----------|
| 9.1 | Metrics — 지표 수집 | RED, USE |
| 9.2 | Prometheus 아키텍처 | scrape, TSDB, PromQL |
| 9.3 | Logging — 중앙 집중 로그 | stdout, Fluentd, Loki |
| 9.4 | Distributed tracing | span, trace, OpenTelemetry |
| 9.5 | Kubernetes 메트릭 (cAdvisor, kube-state-metrics) | 리소스, 객체 상태 |
| 9.6 | 알림 (Alertmanager) | 라우팅, 억제 |
| 9.7 | 대시보드 (Grafana) | 시각화 |
| ... | (9.8~9.50) | SLO, 요약 |

---

## PART 10 — Production Kubernetes (30~50 장표)

| # | 장표 제목 | 핵심 주제 |
|---|-----------|-----------|
| 10.1 | High availability | Control Plane 다중화 |
| 10.2 | Disaster recovery | 백업, 복구 절차 |
| 10.3 | Backup 전략 | etcd, PV, 선언적 리소스 |
| 10.4 | Multi cluster 개요 | 페더레이션, 배포 전략 |
| 10.5 | 업그레이드 전략 | in-place, cluster replace |
| 10.6 | 노드 운영 | drain, cordon, 업데이트 |
| ... | (10.7~10.50) | 요약, 체크리스트 |

---

## PART 11 — Kubernetes 기반 시스템 아키텍처 (30~50 장표)

| # | 장표 제목 | 핵심 주제 |
|---|-----------|-----------|
| 11.1 | Microservice architecture on Kubernetes | 서비스 단위, 배포 |
| 11.2 | Service communication | 동기 (gRPC/HTTP), 비동기 |
| 11.3 | API Gateway | 라우팅, 인증, 레이트 리밋 |
| 11.4 | Async messaging | Kafka, RabbitMQ, SQS |
| 11.5 | Event driven architecture | 이벤트 소싱, CQRS |
| 11.6 | 아키텍처 예시: Client → CDN → Gateway → Ingress → Services → DB | 레이어별 역할 |
| ... | (11.7~11.50) | 실무 패턴, 요약 |

---

## PART 12 — Database Architecture on Kubernetes (30~50 장표)

| # | 장표 제목 | 핵심 주제 |
|---|-----------|-----------|
| 12.1 | Stateless vs Stateful | 왜 대부분 DB는 K8s 밖에 두는가 |
| 12.2 | K8s에서 DB 운영 전략 | StatefulSet, PV, 성능 |
| 12.3 | DB 종류별 전략: PostgreSQL, MySQL, MongoDB, Redis, Kafka | 운영 패턴 |
| 12.4 | 데이터 아키텍처: Primary, Replica, Sharding | 다이어그램 |
| 12.5 | Connection Pool | 서비스 → 풀 → Primary/Replica |
| ... | (12.6~12.50) | 백업, 장애복구, 요약 |

---

## PART 13 — Scalability Architecture (30~50 장표)

| # | 장표 제목 | 핵심 주제 |
|---|-----------|-----------|
| 13.1 | Horizontal Scaling | Pod, ReplicaSet, HPA |
| 13.2 | HPA (Horizontal Pod Autoscaler) | 메트릭, 동작 |
| 13.3 | VPA (Vertical Pod Autoscaler) | requests/limits 조정 |
| 13.4 | Cluster Autoscaler | 노드 증설/축소 |
| 13.5 | LoadBalancer → Pod 분산 | 다이어그램 |
| ... | (13.6~13.50) | 실무, 요약 |

---

## PART 14 — Reliability Engineering (30~50 장표)

| # | 장표 제목 | 핵심 주제 |
|---|-----------|-----------|
| 14.1 | Failure scenarios | Pod crash, Node failure, Network partition |
| 14.2 | Circuit breaker | 연속 실패 시 차단 |
| 14.3 | Retry, Timeout | 재시도 정책 |
| 14.4 | Bulkhead | 격리로 연쇄 장애 방지 |
| 14.5 | Health check (liveness, readiness) | K8s 프로브 |
| ... | (14.6~14.50) | Chaos Engineering, 요약 |

---

## PART 15 — Multi Cluster Architecture (30~50 장표)

| # | 장표 제목 | 핵심 주제 |
|---|-----------|-----------|
| 15.1 | Multi region | 지역 분산, 지연 |
| 15.2 | Disaster recovery | RTO, RPO, 활성-대기 |
| 15.3 | Traffic routing | 지역별 라우팅 |
| 15.4 | Global load balancing | DNS, Anycast |
| ... | (15.5~15.50) | 실무, 요약 |

---

## PART 16 — Platform Engineering (30~50 장표)

| # | 장표 제목 | 핵심 주제 |
|---|-----------|-----------|
| 16.1 | GitOps | Git as single source of truth |
| 16.2 | ArgoCD | 선언적 배포, 동기화 |
| 16.3 | Helm | 차트, 템플릿, 릴리스 |
| 16.4 | Operator pattern | CRD, Controller, 확장 |
| 16.5 | 플랫폼 제품 사고 | 내부 개발자 경험 |
| ... | (16.6~16.50) | 요약, 인터뷰 |

---

# 2️⃣ 학습 로드맵

## Phase 1: 기초 (PART 1~3) — "컨테이너와 객체 이해"

```
[Container 기초]  →  [Kubernetes 구조]  →  [Core Objects]
     PART 1              PART 2               PART 3
        │                    │                    │
        ▼                    ▼                    ▼
   cgroups/ns          Control Plane           Pod, Deployment
   OCI, Docker         etcd, Scheduler         ReplicaSet, Job
```
- **목표**: 컨테이너가 무엇인지, K8s가 왜 그런 구조인지, Pod/Deployment로 앱을 올리는 방법을 이해한다.
- **산출물**: 로컬(minikube/kind)에서 Deployment로 앱 배포, `kubectl` 기본 사용.

---

## Phase 2: 네트워크·스토리지·보안 (PART 4~6) — "연결과 데이터, 보안"

```
[Networking]  →  [Storage]  →  [Security]
   PART 4         PART 5        PART 6
      │              │             │
      ▼              ▼             ▼
   Service        PV/PVC        RBAC, SA
   Ingress        StorageClass  Network Policy
   CNI            CSI           Admission
```
- **목표**: Pod 간/외부 통신(Service, Ingress), 영구 스토리지(PV/PVC), RBAC·Network Policy로 보안 기초를 다진다.
- **산출물**: Ingress로 HTTPS 서비스 노출, PVC 사용 앱, Role/ClusterRole 적용.

---

## Phase 3: 내부 동작과 스케줄링 (PART 7~8) — "왜 그렇게 동작하는가"

```
[Scheduling]  →  [Internal Mechanics]
   PART 7            PART 8
      │                 │
      ▼                 ▼
   affinity         API lifecycle
   taints           Controller loop
   quotas           kubelet, etcd
```
- **목표**: 스케줄러가 어떻게 노드를 고르는지, Controller가 desired state를 어떻게 맞추는지, API 요청이 어떤 경로로 처리되는지 이해한다.
- **산출물**: Node affinity/taint로 배치 제어, Controller 동작을 로그/코드로 추적.

---

## Phase 4: 관찰과 Production (PART 9~10) — "보고, 복구하고, 운영한다"

```
[Observability]  →  [Production K8s]
    PART 9              PART 10
       │                    │
       ▼                    ▼
   Metrics, Logs       HA, DR
   Tracing             Backup, Multi-cluster
   Prometheus          업그레이드
```
- **목표**: 메트릭/로그/트레이싱으로 장애를 보이고, HA·백업·멀티클러스터로 Production 수준 설계를 이해한다.
- **산출물**: Prometheus+Grafana 대시보드, etcd 백업/복구 시나리오.

---

## Phase 5: 시스템 설계 (PART 11~15) — "K8s 위에 시스템을 설계한다"

```
[시스템 아키텍처]  →  [DB on K8s]  →  [확장성]  →  [신뢰성]  →  [멀티클러스터]
      PART 11           PART 12        PART 13     PART 14      PART 15
         │                 │              │            │            │
         ▼                 ▼              ▼            ▼            ▼
   Microservice      StatefulSet      HPA/VPA     Circuit      Multi-region
   API Gateway       Primary/Replica  CA           Breaker      DR, GLB
   Event driven      Connection Pool
```
- **목표**: 마이크로서비스·API Gateway·이벤트 드리븐, DB 배치 전략, HPA/VPA/CA, 장애 패턴, 멀티 리전/DR을 연결해 end-to-end 설계를 할 수 있게 한다.
- **산출물**: 한 서비스에 대한 아키텍처 문서(네트워크·DB·스케일·장애 대응 포함).

---

## Phase 6: 플랫폼 엔지니어링 (PART 16) — "플랫폼으로 정리한다"

```
[Platform Engineering]
      PART 16
         │
         ▼
   GitOps (ArgoCD)
   Helm, Operator
   IDP 사고방식
```
- **목표**: GitOps로 배포를 선언적으로 관리하고, Helm·Operator로 재사용 가능한 컴포넌트를 만든다. "좋은 K8s 아키텍처"를 Scalability, Reliability, Observability, Security, Cost 관점으로 정리한다.
- **산출물**: ArgoCD 앱, Helm 차트 1개, CRD+Controller 또는 Operator 1개(간단 버전).

---

## 로드맵 요약 다이어그램

```
                    ┌─────────────────────────────────────────────────────────┐
                    │           Kubernetes & Platform Engineering              │
                    └─────────────────────────────────────────────────────────┘
                                              │
        ┌─────────────────────────────────────┼─────────────────────────────────────┐
        │                                     │                                     │
   [Phase 1]                            [Phase 2]                            [Phase 3]
   PART 1~3                             PART 4~6                             PART 7~8
   Container + K8s 구조                 Net + Storage + Security              Scheduling + 내부
   + Core Objects                                                                   │
        │                                     │                                     │
        └─────────────────────────────────────┼─────────────────────────────────────┘
                                              │
        ┌─────────────────────────────────────┼─────────────────────────────────────┐
        │                                     │                                     │
   [Phase 4]                            [Phase 5]                            [Phase 6]
   PART 9~10                            PART 11~15                           PART 16
   Observability + Production           시스템·DB·확장·신뢰성·멀티클러스터     GitOps, Helm, Operator
        │                                     │                                     │
        └─────────────────────────────────────┴─────────────────────────────────────┘
                                              │
                                    "좋은 아키텍처" 기준
                                    Scalability · Reliability · Observability
                                    Security · Cost
```

---

# 3️⃣ Kubernetes 아키텍처 전체 그림

## 3.1 클러스터 전체 구조 (Control Plane + Workers)

```
                              ┌──────────────────────────────────────────────────────────────────┐
                              │                     EXTERNAL USERS / CI-CD                         │
                              │                  kubectl, API clients, GitOps                      │
                              └──────────────────────────────────────────────────────────────────┘
                                                              │
                                                              ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                          CONTROL PLANE (Master)                                                          │
│  ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────────────┐   ┌─────────────────┐   ┌─────────────────┐   │
│  │   API Server    │   │   Scheduler     │   │  Controller Manager     │   │      etcd       │   │  cloud-controller│   │
│  │                 │   │                 │   │  - Deployment           │   │                 │   │  (optional)      │   │
│  │  • REST API     │◄──┤  • Filter       │   │  - ReplicaSet            │   │  • Key-Value   │   │                 │   │
│  │  • AuthN/AuthZ  │   │  • Score        │   │  - Node                  │   │  • RAFT        │   │  • Node         │   │
│  │  • Admission   │   │  • Bind         │   │  - Service/Endpoints     │   │  • Watch       │   │  • LB           │   │
│  │  • Watch       │   │                 │   │  - Namespace, ...        │   │  • Lease       │   │  • Volume       │   │
│  └────────┬────────┘   └────────┬────────┘   └────────────┬────────────┘   └────────┬────────┘   └─────────────────┘   │
│           │                     │                         │                        │                                    │
│           │                     │                         │                        │  ◄─── 단일 진실 소스 (선언적 상태)  │
│           └─────────────────────┴─────────────────────────┴────────────────────────┘                                    │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
           │                     │                         │
           │                     │                         │
           ▼                     ▼                         ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                          WORKER NODES                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐ │
│  │  Node 1                    │  Node 2                    │  Node N                                                    │ │
│  │  ┌─────────────┐           │  ┌─────────────┐           │  ┌─────────────┐                                            │ │
│  │  │  kubelet    │           │  │  kubelet    │           │  │  kubelet    │                                            │ │
│  │  │  • Pod 생명 │           │  │  • Pod 생명 │           │  │  • Pod 생명 │                                            │ │
│  │  │  • CRI 호출 │           │  │  • CRI 호출 │           │  │  • CRI 호출 │                                            │ │
│  │  │  • Probe    │           │  │  • Probe    │           │  │  • Probe    │                                            │ │
│  │  └──────┬──────┘           │  └──────┬──────┘           │  └──────┬──────┘                                            │ │
│  │         │                  │         │                  │         │                                                    │ │
│  │  ┌──────▼──────┐           │  ┌──────▼──────┐           │  ┌──────▼──────┐                                            │ │
│  │  │ kube-proxy  │           │  │ kube-proxy  │           │  │ kube-proxy  │  ◄─── Service (ClusterIP/NodePort) 구현     │ │
│  │  └──────┬──────┘           │  └──────┬──────┘           │  └──────┬──────┘                                            │ │
│  │         │                  │         │                  │         │                                                    │ │
│  │  ┌──────▼──────┐           │  ┌──────▼──────┐           │  ┌──────▼──────┐                                            │ │
│  │  │ Container   │           │  │ Container   │           │  │ Container   │  ◄─── containerd / cri-o + runc           │ │
│  │  │ Runtime     │           │  │ Runtime     │           │  │ Runtime     │                                            │ │
│  │  └──────┬──────┘           │  └──────┬──────┘           │  └──────┬──────┘                                            │ │
│  │         │                  │         │                  │         │                                                    │ │
│  │  ┌──────▼──────┐           │  ┌──────▼──────┐           │  ┌──────▼──────┐                                            │ │
│  │  │ Pod A  Pod B│           │  │ Pod C  Pod D│           │  │ Pod E  Pod F│  ◄─── 워크로드 (사용자 컨테이너)             │ │
│  │  └─────────────┘           │  └─────────────┘           │  └─────────────┘                                            │ │
│  └─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3.2 API 요청·Controller·etcd 흐름

```
  User (kubectl apply)
        │
        ▼
  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
  │ AuthN       │ ──► │ AuthZ       │ ──► │ Admission   │
  │ (x509/OIDC) │     │ (RBAC)      │     │ (Validating  │
  └─────────────┘     └─────────────┘     │  Mutating)   │
        │                   │             └──────┬──────┘
        │                   │                    │
        ▼                   ▼                    ▼
  ┌─────────────────────────────────────────────────────┐
  │                    API Server                         │
  │  • 객체 검증 후 etcd에 저장                            │
  │  • Watch 이벤트 브로드캐스트                          │
  └─────────────────────────┬───────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        ▼                    ▼                    ▼
  ┌──────────┐         ┌──────────┐         ┌──────────┐
  │  etcd    │         │ Scheduler│         │Controller │
  │          │         │ (Unsched │         │ Manager  │
  │ 상태 저장 │         │  Pod 감지)│         │ (desired │
  │ Watch    │         │  Bind    │         │  vs actual│
  └──────────┘         └──────────┘         └─────┬─────┘
        │                    │                    │
        │                    │                    │ Reconcile
        │                    ▼                    ▼
        │              Node에 Pod 할당        kubelet이 Pod 실행
        │                    │                    │
        └────────────────────┴────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  Worker Node     │
                    │  kubelet → CRI   │
                    │  → containers    │
                    └─────────────────┘
```

---

## 3.3 데이터 평면 (Pod ↔ Service ↔ Ingress)

```
                    INTERNET
                        │
                        ▼
                 ┌─────────────┐
                 │ Ingress     │  (L7, host/path, TLS)
                 │ Controller  │
                 └──────┬──────┘
                        │
                        ▼
                 ┌─────────────┐
                 │  Service    │  (ClusterIP/VIP, selector → Endpoints)
                 │  (ClusterIP)│
                 └──────┬──────┘
                        │
            ┌───────────┼───────────┐
            ▼           ▼           ▼
       ┌─────────┐ ┌─────────┐ ┌─────────┐
       │  Pod 1  │ │  Pod 2  │ │  Pod 3  │   ◄── ReplicaSet / Deployment
       │ app     │ │ app     │ │ app     │
       └────┬────┘ └────┬────┘ └────┬────┘
            │           │           │
            └───────────┼───────────┘
                        │
                        ▼
                 ┌─────────────┐
                 │  Database   │  (StatefulSet + PVC 또는 외부)
                 │  / Message  │
                 └─────────────┘
```

---

## 3.4 "좋은 Kubernetes 아키텍처" 기준 (5축)

```
                    ┌─────────────────────────────────────┐
                    │   좋은 Kubernetes 아키텍처란?        │
                    └─────────────────────────────────────┘
                                        │
        ┌───────────────┬───────────────┼───────────────┬───────────────┐
        ▼               ▼               ▼               ▼               ▼
  ┌───────────┐   ┌───────────┐   ┌───────────┐   ┌───────────┐   ┌───────────┐
  │Scalability│   │Reliability│   │Observability│  │ Security  │   │   Cost    │
  │           │   │           │   │            │   │           │   │           │
  │ • HPA/VPA │   │ • Multi   │   │ • Metrics  │   │ • RBAC    │   │ • 요청/   │
  │ • CA      │   │   replica │   │ • Logs     │   │ • NP      │   │   한도 적정│
  │ • 리소스  │   │ • Probe   │   │ • Tracing  │   │ • PSA     │   │ • 노드/   │
  │   요청/한도│   │ • PDB     │   │ • SLO      │   │ • Secret  │   │   클러스터│
  │           │   │ • DR      │   │ • Alert    │   │ • Admission│   │   크기   │
  └───────────┘   └───────────┘   └───────────┘   └───────────┘   └───────────┘
```

---

이 문서는 **전체 교과서의 목차, 학습 로드맵, Kubernetes 아키텍처 전체 그림**을 담고 있습니다.  
각 PART는 별도 파일로 **30~50 장표** 규모로 확장하며, 장표마다 **제목, 핵심 설명, bullet, ASCII 다이어그램**을 넣고,  
PART 종료 시 **핵심 요약, 실습 예제, 실무 설계 팁, 인터뷰 질문**을 제공할 예정입니다.
