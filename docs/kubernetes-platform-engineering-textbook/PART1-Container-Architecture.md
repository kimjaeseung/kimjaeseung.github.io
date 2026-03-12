# PART 1 — Container Architecture

플랫폼 엔지니어를 위한 컨테이너 아키텍처 교과서 (44장)

---

## Slide 1 — Container란 무엇인가

**핵심 설명**

Container는 **프로세스 + 격리된 환경**이다. VM처럼 전체 OS를 가상화하는 것이 아니라, Linux 커널의 **cgroups**과 **namespaces**를 이용해 하나의 프로세스(및 자식 프로세스) 집합에 대해 리소스 한도와 격리된 뷰(파일시스템, 네트워크, PID 등)를 부여한 실행 단위다. "이미지"에서 파일시스템 레이어를 구성하고, 그 위에서 **단일 진입점 프로세스**가 동작한다.

**핵심 포인트**

• Container = 격리된 프로세스 그룹 + 제한된 리소스 + 루트 파일시스템(rootfs)  
• 호스트 커널을 공유하므로 VM보다 가벼우며 시작/종료가 빠르다
• 이미지는 불변(immutable) 레이어로 구성되며, 실행 시 쓰기 가능한 최상위 레이어가 추가된다  

**아키텍처**

```
+------------------------------------------+
|  Container A          Container B        |  ← 사용자 공간 (격리된 뷰)
|  PID 1 = nginx       PID 1 = redis      |
|  own rootfs          own rootfs          |
|  own network stack   own network stack   |
+------------------------------------------+
|  cgroups (CPU/Memory limit)               |  ← 리소스 한도
+------------------------------------------+
|  Linux Kernel (공유)                      |  ← 단일 커널
+------------------------------------------+
|  Hardware                                |
+------------------------------------------+
```

---

## Slide 2 — Container vs VM: 격리 수준과 리소스

**핵심 설명**

VM은 **하이퍼바이저**가 CPU 가상화(또는 반가상화), 메모리, I/O를 분리하고, 각 VM 안에 **전체 게스트 OS**가 올라간다. Container는 **같은 커널** 위에서 여러 격리된 프로세스 그룹을 돌리므로, 커널 공격 표면과 오버헤드가 작다. 대신 격리 단위는 "커널 내부"이므로, 커널 버그 시 탈출 가능성은 VM보다 높다. 실무에서는 보안 등급에 따라 VM 안에 K8s를 넣거나, 컨테이너만 쓰는 식으로 조합한다.

**핵심 포인트**

• VM: 하드웨어 수준 격리, 게스트 OS 전체, 무거움 / Container: 커널 공유, 프로세스 수준 격리, 가벼움  
• Container 시작은 보통 1초 이내, VM은 수초~수십초  
• 멀티테넌시·밀도(density)는 Container가 유리; 강한 격리·레거시 OS가 필요하면 VM  

**다이어그램**

```
VM:                          Container:
+--------+--------+--------+    +--------------------------------+
|  App   |  App   |  App   |    |  App A  |  App B  |  App C     |
+--------+--------+--------+    +--------------------------------+
|Guest OS|Guest OS|Guest OS|    |      Linux Kernel (공유)        |
+--------+--------+--------+    +--------------------------------+
|     Hypervisor               |  cgroups + namespaces           |
+----------------------+       +--------------------------------+
|      Host OS / HW     |       |      Host OS / HW               |
+----------------------+       +--------------------------------+
```

---

## Slide 3 — Container 등장 배경: 왜 필요한가

**핵심 설명**

"내 로컬에서는 되는데 서버에서는 안 된다"를 없애려면 **실행 환경을 코드처럼 관리**할 필요가 있다. Container는 **이미지**로 "OS 조각 + 앱 + 의존성"을 고정하고, 어떤 환경에서나 동일한 방식으로 실행하게 한다. 마이크로서비스는 서비스별로 배포 단위가 나뉘는데, VM 단위로 나누면 오버헤드가 크므로, 경량 단위인 Container가 자연스럽게 표준이 되었다.

**핵심 포인트**

• 환경 일관성: Dev/Staging/Prod를 동일 이미지로 재현  
• 배포 단위: 서비스 하나 = 이미지 하나 = 스케일/롤백 단위  
• 리소스 효율: 한 노드에 수십~수백 컨테이너 가능(밀도)  

**실제 시스템 동작**

```
개발자                    CI/CD                      프로덕션
   |                         |                           |
   |  Dockerfile / 코드      |  빌드 → 이미지 푸시       |  같은 이미지 풀
   |------------------------>|------------------------->|
   |                         |  registry (동일 이미지)   |
   |  "로컬 = 프로덕션"      |  tag: sha256:abc...      |  동일 digest로 실행
```

---

## Slide 4 — Linux 커널이 제공하는 격리: cgroups + namespaces

**핵심 설명**

Container의 "격리"는 **namespaces**(보이는 것의 경계)와 **cgroups**(쓸 수 있는 양의 경계) 두 가지로 구현된다. Namespace는 프로세스가 보는 PID, 네트워크 인터페이스, 마운트, 호스트명 등을 그룹별로 다르게 보이게 하고, cgroups은 그 그룹에 속한 프로세스들의 CPU·메모리·I/O 사용량을 제한·측정한다. runc 같은 런타임은 컨테이너 생성 시 이 둘을 설정한 뒤 프로세스를 그 환경에서 실행한다.

**핵심 포인트**

• **Namespaces**: "무엇을 보는가" — PID, network, mount, UTS, IPC, User 등 7종  
• **cgroups**: "얼마나 쓸 수 있는가" — CPU, memory, blkio, pids 등  
• 컨테이너 = 새 namespace들 + 새 cgroup에 속한 1번 프로세스(및 자식)  

**아키텍처**

```
                    Container Process (PID 1)
                              |
        +---------------------+---------------------+
        |                     |                     |
   [Namespaces]          [cgroups]            [rootfs]
   - PID (자체 1,2,3..)   - cpu.max           - overlay mount
   - Network (자체 eth0)  - memory.max        - 이미지 레이어
   - Mount (자체 /)       - pids.max          + 쓰기 레이어
   - UTS (자체 hostname)  - io.max
```

---

## Slide 5 — Container Runtime 개요: 계층 구조

**핵심 설명**

"Container를 실행한다"는 일을 **런타임**이 한다. 상위에는 Docker CLI, Kubernetes(kubelet)처럼 **오케스트레이션/UX**가 있고, 그 아래 **containerd**나 **cri-o** 같은 **상위 런타임**이 이미지 풀·언팩·생명주기 관리를 맡는다. 실제로 **namespace + cgroup 설정 후 프로세스 fork**하는 것은 **하위 런타임**(주로 **runc**)이 수행한다. runc는 OCI Runtime Spec을 구현한 CLI로, config.json과 rootfs가 준비된 "번들"을 받아 컨테이너 프로세스를 띄운다.

**핵심 포인트**

• 상위 런타임: 이미지·메타데이터·API (containerd, cri-o)  
• 하위 런타임: OCI Runtime Spec 구현체 (runc, crun, runv)  
• Kubernetes는 CRI를 통해 상위 런타임(containerd/cri-o)과만 대화한다  

**아키텍처**

```
+----------------------+
|  Docker CLI / K8s    |   오케스트레이션·사용자 인터페이스
+----------+-----------+
           |
+----------v-----------+
|  containerd / cri-o  |   이미지, 스냅샷, 생명주기 (CRI 구현)
+----------+-----------+
           |
+----------v-----------+
|  runc / crun        |   OCI Runtime — namespace, cgroup, exec
+----------+-----------+
           |
+----------v-----------+
|  Linux Kernel       |   cgroups, namespaces, overlay, ...
+----------------------+
```

---

## Slide 6 — OCI(Open Container Initiative) 개요

**핵심 설명**

OCI는 **이미지 포맷**과 **런타임 동작**을 표준화해서, 한 번 빌드한 이미지를 어떤 런타임에서든 같은 방식으로 실행할 수 있게 한다. 두 가지 스펙이 있다. **image-spec**: 이미지를 레이어·매니페스트·설정으로 정의한다. **runtime-spec**: "번들"(config.json + rootfs)을 받아서 어떤 프로세스를 어떻게 실행할지(env, cgroups, namespaces, hooks) 정의한다. Docker/containerd/runc/cri-o가 이 스펙을 따르므로, 도구를 바꿔도 이미지와 실행 결과가 호환된다.

**핵심 포인트**

• image-spec: 레이어, manifest, image config (역사·엔트리포인트 등)  
• runtime-spec: config.json (process, root, mounts, linux: namespaces, cgroups, seccomp 등)  
• 표준 덕분에 registry 형식과 실행 방식이 통일되어 이식성이 높아진다  

**다이어그램**

```
        OCI Image Spec                    OCI Runtime Spec
        (저장·배포)                        (실행)

+------------------+                 +------------------+
|  image manifest  |                 |  config.json     |
|  - layers[]      |   unpack       |  - process       |
|  - config digest |  ---------->   |  - root (path)   |
+------------------+                 |  - linux         |
         |                           |    - namespaces  |
         v                           |    - cgroups    |
+------------------+                 |    - devices     |
|  layer tar.gz    |   extract      |  - hooks         |
|  (rootfs 조각)   |  ---------->   +--------+---------+
+------------------+                          |
                                     +--------v---------+
                                     |  rootfs (디렉터리) |
                                     |  /bin, /usr, ...  |
                                     +------------------+
```

---

## Slide 7 — OCI Image Spec: 이미지 포맷

**핵심 설명**

OCI 이미지는 **manifest**와 **레이어**로 구성된다. Manifest는 "이 이미지를 만들려면 어떤 레이어를 어떤 순서로 쌓아야 하는지"와 **config** 블롭의 digest를 가리킨다. Config에는 생성 날짜, 아키텍처, OS, **엔트리포인트**(실행 시 기본 명령/인자), env 등이 들어 있다. 각 레이어는 **tar**(또는 gzip)로 된 diff이며, 적용 순서가 정해져 있다. 레지스트리는 manifest를 이미지 태그에 연결하고, 풀할 때 manifest → config → 레이어들을 순서대로 받는다.

**핵심 포인트**

• index → manifest → config + layers (다단계 참조 가능)  
• 레이어는 immutable; 같은 digest면 내용 동일(캐시·보안 검증에 유리)  
• 엔트리포인트·env는 config에 있어 런타임이 실행 시 참조한다  

**구조**

```
  Tag (e.g. nginx:1.21)
       |
       v
+------------------+
|  Manifest        |
|  schemaVersion 2 |
|  config: digest  |-----> +----------------+
|  layers: [       |       | Config JSON    |
|    {digest,size} |       | - created      |
|    ...           |       | - architecture |
|  ]               |       | - config.Cmd   |
+------------------+       | - config.Env   |
       |                   +----------------+
       v
+------------------+
|  Layer 1 (base)  |
|  Layer 2 (app)   |
|  ...             |
+------------------+
```

---

## Slide 8 — OCI Runtime Spec: config.json과 번들

**핵심 설명**

런타임이 컨테이너를 만들 때 필요한 정보는 **config.json** 한 파일에 담긴다. **process**: 실행할 경로, 인자, env, cwd, capabilities. **root**: rootfs가 있는 디렉터리 경로. **mounts**: bind mount 등 추가 마운트. **linux**: **namespaces** 배열(타입과 path), **cgroups** 경로, **resources**(cpu/memory 등), **seccomp** 프로파일, **devices** 등이다. 이 config.json과 rootfs 디렉터리를 합쳐 **OCI bundle**이라 부른다. runc는 `runc run <bundle-path>`로 이 번들을 읽고, 지정된 namespace/cgroup으로 프로세스를 띄운다.

**핵심 포인트**

• config.json = 단일 진실 소스; 모든 런타임이 같은 필드를 해석  
• root는 호스트 경로; 보통 이미지 레이어를 풀어둔 디렉터리  
• linux.resources에 cgroups v1/v2 제한이 매핑된다  

**번들 구조**

```
  /var/run/containerd/.../  (bundle root)
  |
  +-- config.json
  |     {
  |       "process": { "args": ["nginx"], "env": [...] },
  |       "root": { "path": "rootfs" },
  |       "mounts": [ ... ],
  |       "linux": {
  |         "namespaces": [ {"type": "pid"}, {"type": "network"}, ... ],
  |         "resources": { "memory": { "limit": 134217728 } }
  |       }
  |     }
  |
  +-- rootfs/
        +-- bin/
        +-- usr/
        +-- ...
```

---

## Slide 9 — OCI Runtime Spec: process, root, hooks

**핵심 설명**

**process**는 컨테이너 내 PID 1이 될 실행 파일과 환경을 정의한다. **root.path**는 그 실행 파일이 보게 될 루트(/)가 되는 디렉터리다. **hooks**는 특정 생명주기 시점(prestart, poststart, poststop)에 호스트에서 실행할 바이너리를 지정한다. 예: 네트워크 네임스페이스가 만들어진 직후 **prestart**로 CNI 플러그인을 호출해 veth를 붙인다. 런타임은 시점에 맞춰 hook을 실행하고, 실패 시 컨테이너 생성/시작을 중단할 수 있다.

**핵심 포인트**

• process.args[0]이 실행 파일, 나머지가 인자; env로 환경 변수  
• root.path는 호스트 절대 경로; 컨테이너 프로세스에는 / 로 보임  
• hooks는 주로 네트워크·스토리지 설정에 사용(Kubernetes CNI 등)  

**실행 흐름**

```
  runc create
       |
       v
  +---------+    prestart hook (e.g. CNI)
  | setup   | -> 네트워크 연결, 볼륨 마운트
  +---------+
       |
       v
  +---------+    runc start
  | fork    | -> clone(CLONE_NEWNS|NEWPID|NEWNET|...) + setns
  | exec    | -> execve(process.args[0], rootfs)
  +---------+
       |
       v
  poststart hook (선택)
  ...
  (컨테이너 종료 시) poststop hook
```

---

## Slide 10 — Docker 아키텍처 전체: CLI에서 커널까지

**핵심 설명**

`docker run`을 치면 **Docker CLI**가 dockerd(또는 직접 containerd)에 API 요청을 보낸다. **Docker daemon(dockerd)**은 이미지 빌드/풀, 네트워크/볼륨 관리, REST API를 담당했으나, 현재는 대부분을 **containerd**에 위임한다. containerd는 이미지 풀·언팩·스냅샷을 하고, **containerd-shim**을 통해 **runc**를 호출해 실제 컨테이너 프로세스를 만든다. shim이 있는 이유는 daemon이 재시작돼도 컨테이너가 끊기지 않게 하기 위해서다.

**핵심 포인트**

• Docker CLI ↔ dockerd ↔ containerd ↔ containerd-shim ↔ runc  
• dockerd: 사용자 대면 API·빌드·네트워크/볼륨; containerd: 이미지·컨테이너 생명주기  
• shim이 runc의 부모가 되어 runc가 종료돼도 컨테이너 프로세스는 shim 아래에서 유지된다  

**아키텍처**

```
+----------------------+
|  docker (CLI)        |
+----------+-----------+
           |  REST API (or containerd API)
+----------v-----------+
|  dockerd             |  빌드, 네트워크, 볼륨, API
+----------+-----------+
           |
+----------v-----------+
|  containerd          |  이미지 풀/언팩, 스냅샷, 컨테이너 메타
+----------+-----------+
           |  gRPC (tasks)
+----------v-----------+
|  containerd-shim     |  runc 프로세스의 부모 (1 container = 1 shim)
+----------+-----------+
           |
+----------v-----------+
|  runc                |  create/start → 컨테이너 프로세스
+----------+-----------+
           |
+----------v-----------+
|  Linux Kernel        |
+----------------------+
```

---

## Slide 11 — Docker Daemon(dockerd)의 역할

**핵심 설명**

dockerd는 **REST API**(/var/run/docker.sock)를 제공하고, `docker build`/`docker run`/네트워크/볼륨 요청을 처리한다. 빌드는 Dockerfile을 파싱해 레이어를 만들고 이미지를 containerd에 푸시한다. **네트워크**는 bridge, overlay 등 드라이버로 네트워크를 만들고, 컨테이너를 해당 네트워크에 붙일 때 CNM(Container Network Model)을 사용한다. **볼륨**은 호스트 경로나 named volume을 컨테이너 rootfs에 마운트 정보로 넘긴다. 실제 컨테이너 생성·실행은 containerd에 위임하므로, containerd만 있어도(Kubernetes처럼) 컨테이너는 동작한다.

**핵심 포인트**

• API 서버 + 빌드 오케스트레이션 + 네트워크/볼륨 관리  
• 이미지/컨테이너 CRUD는 내부적으로 containerd API 호출  
• Kubernetes는 dockerd 없이 kubelet → containerd(cri plugin)로 직접 간다  

**동작 흐름 (docker run)**

```
  docker run -p 8080:80 nginx
       |
       v
  dockerd: 이미지 없으면 pull (containerd에게 위임)
       |
       v
  dockerd: 네트워크 "bridge"에 연결할 endpoint 생성
       |
       v
  dockerd: 컨테이너 생성 요청 → containerd (CreateTask)
       |
       v
  containerd: shim 생성 → runc create/start
       |
       v
  dockerd: 포트 바인딩 (iptables 등) - 8080 -> container 80
```

---

## Slide 12 — containerd 아키텍처: CRI, Content Store, Snapshotter

**핵심 설명**

containerd는 **콘텐츠 주소 저장소**(content store)에 이미지 블롭을 두고, **snapshotter**가 레이어를 언팩해 **스냅샷 트리**를 만든다. 각 컨테이너의 읽기/쓰기 레이어는 이 스냅샷으로 관리된다. **CRI plugin**이 있으면 Kubernetes(kubelet)가 CRI gRPC로 "Pod Sandbox 생성", "컨테이너 생성/시작"을 요청하고, containerd가 이미지 풀·스냅샷·runc 호출까지 처리한다. Docker는 containerd를 내장해 쓰고, K8s는 containerd만 설치해 CRI로 쓴다.

**핵심 포인트**

• content store: 이미지 레이어(블롭) 저장  
• snapshotter(overlayfs 등): 레이어를 디스크에 펼쳐서 rootfs 경로 제공  
• CRI plugin: kubelet 요청을 containerd의 이미지/컨테이너 API로 변환  

**아키텍처**

```
+------------------+     +------------------+
|  kubelet (CRI)   |     |  Docker (optional)|
+--------+---------+     +--------+---------+
         |                        |
         |  CRI gRPC              |  containerd API
         v                        v
+----------------------------------------+
|              containerd                 |
|  +------------+  +------------------+  |
|  | CRI plugin |  | Content Store    |  |
|  +------------+  | Snapshotter      |  |
|  +------------+  | (overlayfs)      |  |
|  | Tasks API  |  +------------------+  |
|  +-----+------+                         |
+--------|-------------------------------+
         |  create/start/delete task
         v
+--------+--------+
| containerd-shim | --> runc
+-----------------+
```

---

## Slide 13 — containerd-shim과 runc: 1 container = 1 shim

**핵심 설명**

containerd가 컨테이너를 시작할 때 **containerd-shim** 프로세스를 먼저 띄운다. shim이 **runc create**로 컨테이너를 생성하면 runc는 설정을 적용한 뒤 종료하고, 그때 생성된 **컨테이너 프로세스**의 부모는 shim이 된다. 이후 **runc start**는 이미 만들어진 컨테이너를 시작만 한다. 이렇게 하면 containerd(또는 dockerd)가 죽어도 shim과 컨테이너는 살아 있어 **daemon 재시작에 강하다**. 또한 shim이 stdin/stdout을 처리해 로그를 돌려주고, exit 코드를 containerd에 전달한다.

**핵심 포인트**

• runc는 create 후 곧 종료; 컨테이너 프로세스는 shim의 자식으로 유지  
• 1 컨테이너 = 1 shim 프로세스; shim이 reaper 역할  
• containerd 재시작 시 기존 shim들을 다시 attach해 상태 복구  

**프로세스 트리**

```
  containerd
       |
       +-- containerd-shim (container-id-1)  --> runc (일시적, create 후 exit)
       |         |
       |         +-- nginx (PID 1 in container)
       |
       +-- containerd-shim (container-id-2)
                 |
                 +-- redis-server (PID 1 in container)
```

---

## Slide 14 — runc: OCI Runtime 구현체의 동작

**핵심 설명**

runc는 **config.json**과 **rootfs**가 있는 번들 디렉터리를 받아, `runc create`로 컨테이너를 생성하고 `runc start`로 프로세스를 실행한다(또는 `runc run`으로 한 번에). create 시 **새 cgroup**을 만들고 **linux.resources**를 적용한 뒤, **namespaces**를 열고 **clone(CLONE_NEWNS|NEWPID|NEWNET|...)**로 자식 프로세스를 만든다. 자식은 **pivot_root**로 rootfs로 이동한 뒤 **execve**로 process.args를 실행한다. 이 한 프로세스가 컨테이너의 PID 1이 되고, 여기에 설정된 namespace·cgroup이 적용된다.

**핵심 포인트**

• create: cgroup 생성, namespace 생성, 프로세스 fork 후 대기  
• start: 해당 프로세스에서 rootfs + execve로 앱 실행  
• run = create + start를 한 번에; 데몬 모드가 아니면 run이 블로킹된다  

**내부 흐름**

```
  runc run /bundle
       |
       v
  config.json 파싱, rootfs 검사
       |
       v
  cgroup 생성 (e.g. /sys/fs/cgroup/.../container-id)
  resources 적용 (memory.limit, cpu quota 등)
       |
       v
  clone(CLONE_NEWNS|NEWPID|NEWNET|NEWIPC|NEWUTS|NEWUSER)
       |
       v
  자식: pivot_root(rootfs) -> chdir(/) -> execve(process.args)
       |
       v
  컨테이너 PID 1 실행 중
```

---

## Slide 15 — Container 생명주기와 runc create/start 분리

**핵심 설명**

OCI 스펙은 **create**와 **start**를 나눈다. **create**는 namespace·cgroup·rootfs를 준비하고 "컨테이너"를 만들지만 아직 process.args는 실행하지 않는다. **start**는 그 컨테이너에서 최종 프로세스를 실행한다. 이렇게 나누면 **외부에서 네트워크를 연결**하는 것처럼, create와 start 사이에 훅이나 오케스트레이터가 개입할 수 있다. Kubernetes는 Pod의 "인프라 컨테이너"(pause)를 먼저 create하고, 네트워크를 붙인 뒤 다른 컨테이너들을 같은 네트워크 namespace에서 start한다.

**핵심 포인트**

• create: 환경 준비만; start: 실제 프로세스 기동  
• create 후 start 전에 CNI 등이 네트워크 설정을 주입  
• run = create + start; 데몬이 없으면 run이 포그라운드로 동작  

**타임라인**

```
  create                    start
    |                         |
    v                         v
+--------+   (optional)   +--------+
| cgroup |   CNI hook     | exec   |
| ns     |   설정         | PID 1  |
| rootfs |  --------->   | running|
+--------+               +--------+
                              |
                         (running)
                              |
                         stop/kill
                              |
                         delete (cleanup cgroup, ns)
```

---

## Slide 16 — cgroups 개요: 리소스 제한의 목적

**핵심 설명**

cgroups(control groups)은 **프로세스 그룹**에 대해 CPU·메모리·I/O·프로세스 수 등을 **제한·측정·우선순위** 부여하는 커널 메커니즘이다. 한 프로세스가 노드의 CPU나 메모리를 다 써서 다른 서비스를 방해하는 것을 막기 위해, 컨테이너마다 전용 cgroup을 만들고 그 안에 해당 컨테이너 프로세스들을 넣는다. runc는 config.json의 **linux.resources**를 cgroup v1 또는 v2 인터페이스에 쓰고, 컨테이너 프로세스를 그 그룹에 조인시킨다.

**핵심 포인트**

• 제한(limit): memory.max, cpu.max 등으로 상한 설정  
• 측정(accounting): 사용량을 cgroup 디렉터리 아래 파일에서 읽음  
• 컨테이너 = 프로세스들이 속한 하나의 cgroup (보통 컨테이너 ID로 이름)  

**다이어그램**

```
  /sys/fs/cgroup/  (v1: per-controller; v2: unified)
       |
       +-- system.slice/
       |       +-- docker-abc123.scope/   <- container A
       |       |     memory.limit_in_bytes
       |       |     cpu.cfs_quota_us
       |       |
       |       +-- docker-def456.scope/   <- container B
       |
       +-- kubepods.slice/
             +-- pod-xxx/
                   +-- container-1/
                   +-- container-2/
```

---

## Slide 17 — cgroups v1: 계층 구조와 컨트롤러

**핵심 설명**

cgroups v1은 **컨트롤러별로** 별도 계층을 가진다. 예: **cpu**는 /sys/fs/cgroup/cpu 아래, **memory**는 /sys/fs/cgroup/memory 아래에 디렉터리(그룹)를 만들고, 각 그룹에 프로세스를 넣는다. 자식 그룹은 부모의 제한 안에서 다시 나눌 수 있다. 컨트롤러마다 **해당 서브시스템**이 마운트된 경로에 파일로 제한값을 쓴다. 예: memory.limit_in_bytes, cpu.cfs_quota_us. v1의 단점은 컨트롤러가 서로 다른 계층을 가져서, "같은 프로세스 집합"에 대해 CPU와 메모리를 한 그룹으로 관리하기가 애매해진다는 것이다.

**핵심 포인트**

• cpu, cpuacct, memory, blkio, pids, devices 등 컨트롤러별 디렉터리  
• 프로세스는 각 컨트롤러 계층의 한 그룹에만 속함(같은 경로명으로 여러 계층에 만들면 동기화 유지)  
• 컨테이너 런타임은 보통 "같은 이름"의 그룹을 각 컨트롤러 아래에 만든다  

**v1 계층 예**

```
  /sys/fs/cgroup/
  ├── cpu,cpuacct/          <- 한 마운트에 여러 컨트롤러 가능
  │   └── docker/
  │       └── abc123/
  │           cpu.cfs_quota_us
  │           cpu.cfs_period_us
  ├── memory/
  │   └── docker/
  │       └── abc123/
  │           memory.limit_in_bytes
  │           memory.usage_in_bytes
  ├── pids/
  │   └── docker/
  │       └── abc123/
  │           pids.max
  └── blkio/
      └── ...
```

---

## Slide 18 — cgroups CPU 제한: cpu,cpuacct

**핵심 설명**

CPU 제한은 **cpu** 컨트롤러로 한다. v1에서는 **cpu.cfs_quota_us**와 **cpu.cfs_period_us**로 CFS(Completely Fair Scheduler) 할당량을 준다. period(예: 100000 us) 동안 quota(예: 50000 us)만 CPU를 쓸 수 있으면 "0.5 CPU"와 같다. **cpu.shares**는 상대적 비중(weight)으로, 제한이 아닌 경쟁 시 비율이다. **cpuacct**는 같은 그룹의 CPU 사용량을 누적해서 보여준다. runc는 config.json의 linux.resources.cpu에 period, quota, shares를 받아 이 파일들에 쓴다.

**핵심 포인트**

• cfs_period_us + cfs_quota_us = "이 그룹은 period당 quota만큼만 CPU 사용"  
• 1 CPU = period 100000, quota 100000; 0.5 CPU = quota 50000  
• shares는 제한이 아니라 여러 그룹이 경쟁할 때 비율  

**설정 예**

```
  CPU 0.5 core 제한:
  cpu.cfs_period_us  = 100000
  cpu.cfs_quota_us   = 50000

  CPU 2 core 제한:
  cpu.cfs_quota_us   = 200000  (period 100000 기준)
```

---

## Slide 19 — cgroups Memory 제한과 OOM

**핵심 설명**

**memory.limit_in_bytes**(v1) 또는 **memory.max**(v2)에 바이트 단위 상한을 쓴다. 그룹의 사용량이 이 값을 넘으면 커널이 해당 cgroup 안에서 **OOM killer**를 돌려 프로세스를 종료한다. **memory.oom_control**에서 oom_kill_disable=1로 하면 OOM 시 프로세스를 죽이지 않고 메모리 할당만 블로킹할 수 있지만, 위험할 수 있다. **memory.swappiness**나 swap 제한은 v1의 memory 서브시스템에서 다룬다. Kubernetes의 memory limit은 이 cgroup 제한으로 전달되며, 초과 시 컨테이너가 OOMKilled 된다.

**핵심 포인트**

• limit 설정 시 그룹 합계 사용량이 넘으면 OOM  
• OOM 시 해당 cgroup 내 프로세스 중 하나가 kill됨(보통 메모리를 많이 쓰는 쪽)  
• 컨테이너 메모리 limit = 해당 컨테이너 cgroup의 memory limit  

**동작**

```
  memory.limit_in_bytes = 128M
       |
       v
  프로세스들이 이 cgroup에서 할당한 메모리 합계 > 128M
       |
       v
  kernel: OOM in cgroup → oom_kill (프로세스 선택 후 kill)
       |
       v
  컨테이너 종료 (exit code 137 등)
```

---

## Slide 20 — cgroups I/O (blkio): 읽기/쓰기 제한

**핵심 설명**

**blkio** 컨트롤러로 블록 디바이스 I/O를 제한하거나 비중을 줄 수 있다. v1에서는 **blkio.throttle.read_bps_device**, **blkio.throttle.write_bps_device**에 "major:minor bytes_per_second" 형식으로 쓰면 해당 디바이스에 대한 읽기/쓰기 대역폭이 제한된다. **blkio.weight**는 상대적 비중이다. 주의할 점은 v1 blkio는 **직접 I/O**에만 적용되고, 버퍼 캐시를 거치는 일부 I/O는 **memory** 쪽으로 가거나 별도 정책이 필요할 수 있다는 것이다. 스토리지가 공유되는 환경에서 "시끄러운 이웃"을 막을 때 유용하다.

**핵심 포인트**

• throttle: bps/iops 제한; weight: 비율  
• device별로 major:minor 지정  
• 컨테이너 디스크 I/O 제한은 runc가 config의 linux.resources.blockIO로 전달  

**설정 예 (v1)**

```
  # 8:0 디바이스 읽기 10MB/s 제한
  echo "8:0 10485760" > blkio.throttle.read_bps_device

  # 쓰기 5MB/s 제한
  echo "8:0 5242880" > blkio.throttle.write_bps_device
```

---

## Slide 21 — cgroups v2: 통합 계층과 단일 마운트

**핵심 설명**

cgroups v2는 **단일 계층**(unified hierarchy)이다. 모든 컨트롤러가 **/sys/fs/cgroup** 하나의 트리에서 동작한다. 한 디렉터리가 여러 리소스(CPU, 메모리, I/O, pids)를 함께 제어할 수 있어, "이 그룹"이 곧 "이 컨테이너"와 1:1로 맞기 쉽다. 인터페이스도 바뀌어, **memory.max**, **cpu.max**(quota period 형식), **io.max** 등으로 통일되었다. 최신 커널과 runc는 v2를 지원하며, Kubernetes 노드에서 v2만 쓰는 배포가 늘고 있다.

**핵심 포인트**

• 단일 트리: /sys/fs/cgroup 아래에 모든 제어  
• memory.max, cpu.max, io.max, pids.max 등 통일된 파일명  
• 자식 cgroup은 부모 제한을 넘을 수 없음  

**v2 구조**

```
  /sys/fs/cgroup/
  ├── cgroup.controllers   (cpu memory io pids ...)
  ├── cgroup.subtree_control
  ├── memory.max
  ├── cpu.max
  ├── io.max
  ├── pids.max
  └── system.slice/
        └── kubepods.slice/
              └── pod-xxx/
                    ├── container-1/
                    │     memory.max
                    │     cpu.max
                    └── container-2/
```

---

## Slide 22 — cgroups와 컨테이너: runc가 적용하는 방식

**핵심 설명**

runc는 config.json의 **linux.resources**를 읽어서, 컨테이너 프로세스가 속할 **cgroup 경로**를 만든 뒤 그 안에 제한을 쓴다. v1이면 각 컨트롤러(cpu, memory, ...)마다 같은 상대 경로에 디렉터리를 만들고, v2면 단일 경로에 memory.max, cpu.max 등을 쓴다. 그 다음 **프로세스 PID**를 해당 cgroup의 **cgroup.procs**에 넣으면, 그 프로세스(및 자식)의 리소스 사용이 그 제한에 묶인다. Kubernetes는 Pod/컨테이너별로 요청·한도를 주고, kubelet이 CRI를 통해 런타임에 전달하면, 최종적으로 이 cgroup 설정으로 반영된다.

**핵심 포인트**

• config.json linux.resources → cgroup 파일에 쓰기  
• 컨테이너 초기 프로세스(PID 1)를 cgroup에 등록  
• 자식 프로세스는 같은 cgroup을 상속  

**흐름**

```
  config.json
  "linux": {
    "resources": {
      "memory": { "limit": 134217728 },
      "cpu": { "quota": 50000, "period": 100000 }
    }
  }
       |
       v
  runc: cgroup 생성 (e.g. .../container-id/)
  runc: memory.limit_in_bytes = 134217728
  runc: cpu.cfs_quota_us = 50000, cpu.cfs_period_us = 100000
  runc: echo <pid> > .../container-id/cgroup.procs
       |
       v
  해당 PID(및 자식)의 CPU/메모리 사용이 이 상한에 묶임
```

---

## Slide 23 — namespaces 개요: 격리된 "뷰"

**핵심 설명**

Namespace는 **커널 리소스에 대한 격리된 뷰**를 준다. 같은 PID가 다른 namespace에서는 다른 숫자로 보이고, 한 namespace의 네트워크 인터페이스·라우팅 테이블은 다른 namespace에 보이지 않는다. 프로세스는 **clone()**에 CLONE_NEW* 플래그를 주어 새 namespace에서 생성되거나, **setns()**로 기존 namespace에 조인할 수 있다. 컨테이너는 보통 **PID, NET, MNT, UTS, IPC, USER** namespace를 새로 만들고, 그 안에서 PID 1 프로세스를 실행한다. 그래서 컨테이너 안에서는 "자기만의 PID 1, 자체 eth0, 자체 /"를 보게 된다.

**핵심 포인트**

• PID: 프로세스 ID가 namespace 내부에서만 유일  
• NET: 네트워크 디바이스, 소켓, 라우팅이 namespace별로 분리  
• MNT: 마운트 테이블이 분리되어 자체 rootfs(/)를 가짐  
• UTS: hostname; IPC: 메시지 큐/세마포어; USER: UID/GID 매핑  

**7가지 namespace**

```
  Namespace    격리 대상
  ---------    ----------
  PID          프로세스 ID (컨테이너 내부 1,2,3...)
  NET          네트워크 디바이스, 포트, 라우팅
  MNT          마운트 포인트 (자체 rootfs)
  UTS          hostname, domainname
  IPC          System V IPC, POSIX 메시지 큐
  USER         UID/GID (root in container != root on host)
  CGROUP       cgroup 뷰 (v2에서 활용)
```

---

## Slide 24 — PID namespace: 프로세스 트리 격리

**핵심 설명**

**PID namespace**를 만들면 그 안의 프로세스들은 **자기 namespace 안에서만** PID를 갖는다. 새 namespace의 첫 프로세스는 PID 1이 되고, 그 자식들은 2, 3, ... 이렇게 번호가 매겨진다. 호스트에서는 그 프로세스가 다른 PID(예: 12345)로 보이지만, 컨테이너 안에서는 1로 보인다. 시그널을 보낼 때도 namespace 경계가 있어서, 컨테이너 안의 PID 1에 SIGTERM을 보내면 그 namespace의 init 역할을 하는 프로세스가 종료 처리(자식 정리 등)를 할 수 있다. Zombie 수거도 namespace 단위로 이루어진다.

**핵심 포인트**

• 컨테이너 내 PID 1 = 그 namespace의 "init"; 종료 시 자식 정리  
• 호스트 PID와 컨테이너 PID는 다름; /proc은 namespace에 따라 다르게 보임  
• 부모 namespace는 자식 namespace의 프로세스를 볼 수 있음(역은 안 됨)  

**다이어그램**

```
  Host view:                    Container A view (PID ns):
  - PID 1000 (pause)            - PID 1 (pause)
  - PID 1001 (nginx)            - PID 2 (nginx)
  - PID 1002 (redis)            Container B view (PID ns):
                                - PID 1 (redis)
```

---

## Slide 25 — Network namespace: 네트워크 스택 격리

**핵심 설명**

**Network namespace**는 독립된 네트워크 스택을 준다. 각 namespace는 자체 **네트워크 디바이스**(lo, veth 한쪽 등), **라우팅 테이블**, **iptables**, **소켓**을 가진다. 컨테이너를 만들 때 새 network namespace를 만들면, 처음에는 **lo**만 있다. 그래서 **veth pair**를 사용해 한쪽을 namespace에 넣고, 다른 쪽을 호스트(또는 bridge)에 연결한다. CNI 플러그인은 "컨테이너 network namespace가 생겼다"는 이벤트를 받고, IP 할당·veth 연결·라우팅을 해준다. 그래서 Pod/컨테이너마다 고유 IP와 격리된 L3/L4를 갖게 된다.

**핵심 포인트**

• 네트워크 namespace = 별도의 디바이스·라우팅·소켓  
• veth pair: 한쪽을 컨테이너 ns에, 한쪽을 호스트에; 트래픽이 쌍으로 전달됨  
• CNI는 이 namespace에 들어가서 IP·라우팅·bridge 연결을 설정  

**구조**

```
  Host                          Container netns
  +----------------+            +----------------+
  | docker0 (bridge)|<--veth--> | eth0 (10.0.0.2)|
  | veth123@if5    |            | lo             |
  |                |            | default route  |
  +----------------+            +----------------+
```

---

## Slide 26 — Container Networking (veth pair + bridge)

**핵심 설명**

Container는 **veth pair**를 사용하여 host network와 연결된다. veth pair는 **"virtual ethernet cable"**처럼 동작한다. 한쪽 끝은 host(또는 bridge)에, 다른 한쪽은 container의 **network namespace** 안에 들어간다. Host 쪽에서는 보통 **bridge**(예: docker0)에 veth 한쪽을 붙이고, bridge가 L2 스위치처럼 동작해 컨테이너 간·호스트와의 트래픽을 중계한다. 이 구성을 이해해야 Pod 네트워크, CNI, 포트 매핑이 어떻게 동작하는지 설명할 수 있다.

**핵심 포인트**

• veth pair = 가상 이더넷 케이블; 한쪽에 쓴 패킷이 다른 쪽으로 나옴  
• 한쪽은 container network namespace의 eth0, 다른 쪽은 host의 vethxxxx  
• bridge에 여러 veth를 붙이면 같은 L2 세그먼트에서 컨테이너들이 통신  

**아키텍처**

```
  Host
  +--------------------+
  | docker0 bridge     |
  |                    |
  | veth123            |
  +----+---------------+
       |
       |  veth pair (가상 케이블)
       |
  +----v-------------------+
  | container namespace    |
  | eth0                   |
  | IP 172.17.0.2          |
  +------------------------+
```

---

## Slide 27 — Mount namespace와 rootfs

**핵심 설명**

**Mount namespace**는 **마운트 포인트 테이블**을 분리한다. 그래서 한 namespace에서 /를 다른 경로로 바꿔도 다른 namespace에는 영향이 없다. 컨테이너는 **pivot_root**(또는 chroot)로 **rootfs** 디렉터리를 "/"로 바꾼다. rootfs는 이미지 레이어를 overlay 등으로 합친 디렉터리다. 이렇게 하면 컨테이너 프로세스가 보는 "/"는 호스트의 "/"가 아니라 이미지 내용이다. 추가 볼륨은 **bind mount**로 rootfs 안의 경로에 마운트된다. MNT namespace 덕분에 그 마운트는 해당 컨테이너에만 보인다.

**핵심 포인트**

• Mount namespace로 "어떤 디렉터리가 / 인가"가 프로세스별로 다를 수 있음  
• pivot_root(rootfs) 후 chdir(/) → 컨테이너 입장에선 / 가 이미지 내용  
• 호스트 경로를 bind mount하면 컨테이너 내 특정 경로에 노출  

**흐름**

```
  호스트: /var/lib/containerd/.../rootfs (이미지 레이어 합친 곳)
       |
       v
  clone(CLONE_NEWNS)  --> 새 mount namespace
       |
       v
  pivot_root(rootfs, put_old)
  chdir("/")
       |
       v
  컨테이너 프로세스: "/" = 이미지 파일시스템
  /etc, /bin, /app ... 모두 rootfs 내부
```

---

## Slide 28 — UTS, IPC, User namespace

**핵심 설명**

**UTS** namespace는 **hostname**과 **domainname**을 분리한다. 컨테이너마다 다른 hostname을 줄 수 있어, 같은 호스트명을 쓰는 앱들을 한 노드에 올릴 수 있다. **IPC** namespace는 System V IPC 객체(메시지 큐, 세마포어, 공유 메모리)와 POSIX 메시지 큐를 분리해, 컨테이너 간 실수로 IPC가 섞이지 않게 한다. **User** namespace는 컨테이너 안의 UID/GID를 호스트와 다르게 매핑할 수 있게 한다. "root"(0)로 컨테이너 안에서 돌아도 호스트에서는 비특권 UID로 매핑되어, 탈출 시에도 권한이 제한된다.

**핵심 포인트**

• UTS: hostname - 컨테이너별로 다른 이름  
• IPC: IPC 객체 격리 - 보안 및 충돌 방지  
• User: uid_map/gid_map - 컨테이너 내 root ≠ 호스트 root  

**User namespace 매핑**

```
  Container 내부          Host (실제)
  uid=0 (root)     -->    uid=100000
  uid=1000         -->    uid=101000
  ( mapping in /proc/<pid>/uid_map )
```

---

## Slide 29 — namespace와 컨테이너: unshare, setns

**핵심 설명**

**unshare(CLONE_NEW*)**로 현재 프로세스를 기존 namespace에서 떼어 새 namespace에 넣을 수 있다. **setns(fd)**로 이미 존재하는 namespace(파일 디스크립터로 열어둔)에 조인할 수 있다. runc는 **clone()**에 CLONE_NEWNS|NEWPID|NEWNET|... 를 주어 자식 프로세스를 새 namespace들에서 생성한다. Kubernetes는 **pause** 컨테이너가 Pod의 network namespace를 소유하고, 다른 컨테이너는 **setns**로 그 network namespace에 조인해 같은 네트워크를 공유한다. 이렇게 하면 Pod 내 컨테이너가 localhost로 서로 통신할 수 있다.

**핵심 포인트**

• unshare: 새 namespace 생성 후 그 안에서 실행  
• setns: 기존 namespace에 조인 - "같은 네트워크 공유"에 사용  
• Pod = 공유 network (및 optional IPC) + 각자 별도 PID/mount 등  

**Pod 내 컨테이너 공유 (K8s)**

```
  Pod
  +-- pause (PID 1 in pod, owns network ns)
  +-- app-container  (setns to pause's network ns → same IP, localhost)
  +-- sidecar       (setns to pause's network ns)
```

---

## Slide 30 — Pause Container (Pod Infrastructure)

**핵심 설명**

Kubernetes Pod에는 항상 **pause container**가 존재한다. pause container의 역할은 **Pod의 namespace를 유지**하는 것이다. Pod 내부의 다른 컨테이너들은 pause container의 namespace에 **join**한다. 특히 다음을 유지한다: **network namespace**, **IPC namespace**, **shared resources**. 그래서 Pod 내부 컨테이너는 **같은 IP**, **같은 localhost**를 사용한다. pause는 거의 아무 일도 하지 않는 최소 이미지로, PID 1처럼 동작하며 namespace만 소유하고, 앱 컨테이너들은 setns로 그 namespace에 조인한다.

**핵심 포인트**

• pause container = Pod 인프라; namespace 소유자  
• app 컨테이너들은 pause의 network(·IPC) namespace에 setns로 조인  
• 같은 Pod = 같은 IP, 같은 localhost → sidecar·프록시 패턴의 기반  

**아키텍처**

```
  Pod
  +----------------------+
  | pause container      |
  | owns network ns      |
  +----------+-----------+
             |
     +-------+-------+
     |               |
  +--v----+     +----v--+
  | app1  |     | app2  |
  +-------+     +-------+

  same network namespace
  same localhost
```

---

## Slide 31 — rootfs와 이미지 레이어

**핵심 설명**

컨테이너의 **rootfs**는 **이미지 레이어**를 순서대로 쌓은 결과다. OCI 이미지의 각 레이어는 tar(또는 gzip)로 된 파일 시스템 변경분(diff)이다. 레이어는 **immutable**이라서 여러 컨테이너가 같은 레이어를 공유할 수 있고, 스토리지와 네트워크를 아낀다. 실제로 "쌓는" 것은 **스냅샷터**(overlayfs, aufs 등)가 한다. 읽기는 하위 레이어부터 찾고, 쓰기는 **최상위 레이어**(쓰기 가능)에만 반영된다. 그래서 컨테이너를 지워도 하위 레이어는 그대로고, 최상위 레이어만 지우면 된다.

**핵심 포인트**

• 레이어 = diff; 순서가 정해져 있음  
• 여러 이미지/컨테이너가 같은 레이어를 공유(디스크 절약)  
• 쓰기는 항상 최상위 레이어에만(copy-on-write)  

**레이어 스택**

```
  Upper (writable)   ← 컨테이너가 쓰는 변경분
  +------------------+
  | Layer 3 (app)     |
  +------------------+
  | Layer 2 (deps)    |
  +------------------+
  | Layer 1 (base OS) |
  +------------------+
  (lowerdir)          (이미지 레이어, 읽기 전용)
```

---

## Slide 32 — Union FS (overlay2)와 Copy-on-Write

**핵심 설명**

**OverlayFS**는 **lower** 디렉터리(들)와 **upper** 디렉터리를 합쳐 하나의 디렉터리처럼 보이게 한다. **lower**는 읽기 전용(이미지 레이어), **upper**는 쓰기 가능하다. 파일을 읽을 때는 upper에 없으면 lower에서 찾고, **쓰기**할 때는 upper에 복사한 뒤 수정(copy-on-write)하거나 새 파일이면 upper에만 만든다. containerd의 **overlay** snapshotter는 각 레이어를 lower로 쌓고, 컨테이너별 **upper**와 **work** 디렉터리를 두어 이 동작을 구현한다. 그래서 같은 이미지에서 여러 컨테이너를 띄워도 레이어는 한 번만 있고, 쓰기만 컨테이너별로 분리된다.

**핵심 포인트**

• lower: 읽기 전용 레이어(여러 개 가능); upper: 쓰기 레이어  
• 읽기: upper → lower 순으로 lookup; 쓰기: upper에만  
• work: overlay 내부 메타데이터용 디렉터리  

**동작**

```
  read /etc/hosts
    -> upper에 없음 -> lower1에 없음 -> lower2에 있음 -> 반환

  write /tmp/x
    -> upper에 새 파일 생성 (lower 변경 없음)

  modify /etc/config (lower에 있던 파일)
    -> lower에서 upper로 copy-up 후 upper에서 수정
```

---

## Slide 33 — Container Storage Model

**핵심 설명**

Container filesystem은 **immutable layers + writable layer** 구조이다. 하지만 컨테이너가 삭제되면 **writable layer도 삭제**된다. 그래서 **persistent storage**가 필요하다. 실무에서는 **bind mount**, **volume**, **network storage**를 사용한다. 호스트 경로를 컨테이너 경로에 붙이는 bind mount, Docker/런타임이 관리하는 named volume, NFS·클라우드 블록 등 네트워크 스토리지를 마운트해 데이터를 유지한다. Kubernetes에서는 이 모델이 PV/PVC, CSI로 확장된다.

**핵심 포인트**

• 컨테이너 레이어 = 읽기 전용 이미지 + 쓰기 가능 레이어 → 컨테이너 삭제 시 쓰기 레이어도 사라짐  
• 영속 데이터는 반드시 외부 스토리지(bind mount, volume, network storage)에 둔다  
• 실무: bind mount(개발·단일 노드), volume(로컬 영속), network storage(공유·이동성)  

**구조**

```
  Host filesystem
        |
        v
  +-------------+
  | bind mount  |
  | /host/path  |
  +------+------+
         |
         v
  Container
  /app/data  (같은 inode, 영속)
```

---

## Slide 34 — Container 생명주기: create → start → run → stop → delete

**핵심 설명**

컨테이너 생명주기는 **create → start → (running) → stop → delete**다. **create**: 이미지에서 rootfs 준비, cgroup·namespace 생성, config에 맞게 환경 준비(프로세스는 아직 미실행). **start**: 준비된 컨테이너에서 process.args 실행 → **running**. **stop**: PID 1에 SIGTERM(또는 config의 stop signal) 전송, grace period 후 SIGKILL. **delete**: 프로세스 정리, cgroup 제거, namespace 정리, 쓰기 레이어 삭제. **run**은 create + start를 한 번에 하고, 포그라운드면 프로세스가 끝날 때까지 대기한 뒤 자동으로 delete까지 할 수 있다.

**핵심 포인트**

• create: 환경만; start: 프로세스 기동  
• stop: graceful(SIGTERM) → force(SIGKILL); delete: 리소스 정리  
• 데몬 모드(run -d)는 start만 하고 프로세스는 백그라운드에서 동작  

**상태 전이**

```
  [create] --> (created, no process)
       |
       v
  [start] --> (running)
       |
       v
  [stop/kill] --> (stopped)
       |
       v
  [delete] --> (removed, cleanup)
```

---

## Slide 35 — docker run 내부 흐름: 풀, 생성, 시작

**핵심 설명**

`docker run nginx`를 실행하면 (1) **이미지 확인**: 로컬에 없으면 **pull**(manifest → config → 레이어 다운로드, 스냅샷터로 언팩). (2) **컨테이너 생성**: 네트워크 endpoint 할당, 볼륨 마운트 정보 준비, containerd에 Create 요청 → containerd가 스냅샷에서 쓰기 레이어 만들고 config.json 생성, shim 띄우고 runc create. (3) **시작**: runc start로 nginx 실행. (4) **네트워크**: CNM/CNI에 따라 bridge에 veth 연결, 포트 매핑이면 iptables 규칙 추가. (5) **프로세스**: nginx가 PID 1로 동작. 이 전체가 수백 ms~수 초 안에 끝나야 좋은 UX다.

**핵심 포인트**

• 풀 → 스냅샷(rootfs) → create(환경) → start(프로세스) → 네트워크/볼륨 적용  
• 지연은 주로 이미지 풀과 디스크 I/O; 레이어 캐시 hit이면 빠름  
• 실무에서는 이미지 크기·레이어 수를 줄여 시작 시간을 최적화한다  

**순서도**

```
  docker run nginx
    |
    v
  [Image?] --no--> pull (manifest, layers) --> unpack (snapshotter)
    |
    v
  Create container (network, mounts, config.json)
    |
    v
  runc create (cgroup, namespaces, rootfs)
    |
    v
  (optional) prestart hooks (e.g. network)
    |
    v
  runc start (exec nginx)
    |
    v
  Running (nginx PID 1)
```

---

## Slide 36 — CRI(Container Runtime Interface) 개요

**핵심 설명**

**CRI**는 Kubernetes가 **컨테이너 런타임**과 통신하는 gRPC API다. kubelet은 **CRI client**이고, **containerd**(cri plugin)나 **cri-o**가 CRI server 역할을 한다. 이렇게 하면 K8s가 "어떤 런타임"인지 알 필요 없이 "Pod Sandbox 만들기", "컨테이너 만들기/시작/중지"만 요청하면 된다. Pod는 **Pod Sandbox**(인프라: pause + network namespace)와 그 안의 **여러 컨테이너**로 구성된다. CRI는 이미지 풀, Sandbox/Container 생명주기, 로그 스트림 등을 정의한다.

**핵심 포인트**

• kubelet ↔ CRI gRPC ↔ containerd(cri) / cri-o  
• Pod Sandbox = 네트워크 등 인프라; Container = 실제 앱  
• 이미지 풀, RunPodSandbox, CreateContainer/StartContainer/StopContainer 등  

**아키텍처**

```
  kubelet
     |
     |  CRI gRPC (Unix socket or TCP)
     v
  +------------------+
  | containerd       |
  |  +------------+  |
  |  | cri plugin |  |
  |  +------------+  |
  +------------------+
     |
     v
  containerd-shim, runc (per container/sandbox)
```

---

## Slide 37 — CRI 주요 RPC: RunPodSandbox, CreateContainer

**핵심 설명**

**RunPodSandbox**는 Pod의 "인프라"를 만든다. CRI 구현체는 **pause** 같은 최소 컨테이너를 띄워 Pod의 network namespace(및 optional IPC)를 소유하게 한다. 그 다음 **CNI**를 호출해 그 network namespace에 IP·라우팅을 붙인다. **CreateContainer**는 이미 풀된 이미지와 Pod Sandbox ID를 받아, 해당 Sandbox의 namespace에 조인하는 config로 컨테이너를 만든다. **StartContainer**로 실제 프로세스를 기동한다. Pod의 여러 컨테이너는 같은 Sandbox를 공유하므로, 동일 네트워크를 쓰고 localhost로 통신할 수 있다.

**핵심 포인트**

• RunPodSandbox → pause + network namespace + CNI  
• CreateContainer(sandbox_id, image, spec) → sandbox의 ns에 조인하는 컨테이너  
• StartContainer(container_id) → 프로세스 실행  

**호출 순서 (Pod 1개, 컨테이너 2개)**

```
  1. PullImage(nginx)
  2. RunPodSandbox(pod_id)  --> pause + CNI
  3. CreateContainer(sandbox, nginx spec)
  4. StartContainer(nginx)
  5. CreateContainer(sandbox, sidecar spec)
  6. StartContainer(sidecar)
  --> Pod running (2 containers, 1 network)
```

---

## Slide 38 — cri-o vs containerd: Kubernetes에서의 선택

**핵심 설명**

**containerd**는 Docker가 쪼개면서 나온 상위 런타임으로, 이미지·스냅샷·태스크 API가 풍부하고 CRI 플러그인으로 K8s와 연동된다. **cri-o**는 "Kubernetes만을 위한" 경량 런타임으로, CRI만 구현하고 이미지 풀·스냅샷·OCI 번들 생성만 한다. 내부적으로 **runc**를 쓰고, 이미지 라이브러리는 **containers/image**를 쓸 수 있다. 선택 기준: Docker 호환·다양한 클라이언트가 필요하면 containerd, K8s 전용·최소 의존성이면 cri-o. 성능과 동작은 비슷하며, 둘 다 OCI와 CRI를 따른다.

**핵심 포인트**

• containerd: 범용, Docker 호환, 풀 기능; cri-o: K8s 전용, 경량  
• 둘 다 CRI 구현, runc 사용, OCI 이미지/런타임 스펙 준수  
• OpenShift 등은 cri-o; 많은 K8s 배포는 containerd를 기본으로 쓴다  

**비교**

```
  기능              containerd        cri-o
  ----------------- ----------------- -------
  CRI               plugin            native
  이미지            content store     containers/storage
  스냅샷            overlay 등        overlay
  하위 런타임       runc (기본)       runc
  Docker 호환       yes               no (K8s only)
```

---

## Slide 39 — Container 보안: Linux Capabilities

**핵심 설명**

전통적으로 root(UID 0)는 모든 **capability**를 가진다. 컨테이너는 보통 "root로 돌리지만" 호스트에서는 위험한 capability를 빼서 **최소 권한**으로 돌린다. 예: **CAP_NET_RAW**를 제거하면 raw 소켓을 못 써서 ping이 안 되고, **CAP_SYS_ADMIN**을 제거하면 일부 관리 동작이 막힌다. OCI config.json의 **process.capabilities**에 **bounding**, **effective**, **permitted** 등으로 허용할 capability 목록을 준다. Kubernetes **Pod Security**에서는 "privileged"가 아니면 대부분의 capability가 제거된 프로파일을 적용한다.

**핵심 포인트**

• capability = 세분화된 권한; root여도 특정 capability가 없으면 해당 동작 불가  
• 컨테이너는 CAP_NET_BIND_SERVICE 등 필요한 것만 추가, 나머지는 제거  
• runc가 config의 capabilities를 setcap으로 적용  

**자주 제거하는 capability**

```
  CAP_SYS_ADMIN   (많은 시스템 관리 동작)
  CAP_NET_RAW     (raw socket, ping 등)
  CAP_SYS_PTRACE  (다른 프로세스 디버깅)
  CAP_SYS_MODULE  (커널 모듈 로드)
```

---

## Slide 40 — seccomp: syscall 제한

**핵심 설명**

**seccomp**(secure computing mode)으로 프로세스가 호출할 수 있는 **시스템 콜**을 제한할 수 있다. 화이트리스트 방식으로 "이 syscall만 허용"하면, 알 수 없는 syscall은 차단되어 공격 표면이 줄어든다. OCI runtime config의 **linux.seccomp**에 프로파일(JSON)을 주고, runc가 프로세스 시작 전에 **seccomp_load**로 적용한다. Kubernetes는 **runtime/default** seccomp 프로파일을 지원하며, 최신에는 **SeccompProfile** CRD로 Pod 단위 프로파일을 지정할 수 있다. "unconfined"면 seccomp를 쓰지 않는다.

**핵심 포인트**

• seccomp = syscall 화이트/블랙리스트  
• 컨테이너용 기본 프로파일은 대부분의 syscall 허용, 위험한 것만 제거  
• 프로파일 잘못 짜면 정상 앱이 동작하지 않을 수 있어 테스트 필요  

**프로파일 예 (일부)**

```json
{
  "defaultAction": "SCMP_ACT_ERRNO",
  "architectures": ["SCMP_ARCH_X86_64"],
  "syscalls": [{
    "names": ["read", "write", "open", ...],
    "action": "SCMP_ACT_ALLOW"
  }]
}
```

---

## Slide 41 — Container Security Model

**핵심 설명**

Container security는 다음 **계층**으로 구성된다. **(1) kernel isolation**: 단일 커널 공유이므로 커널 격리는 VM보다 약함. **(2) namespaces**: 프로세스·네트워크·파일시스템 등 뷰 격리. **(3) cgroups**: 리소스 한도로 DoS·시끄러운 이웃 완화. **(4) capabilities**: root 권한을 세분화해 필요한 것만 부여. **(5) seccomp**: 허용 syscall만 사용. **(6) AppArmor / SELinux**: MAC(강제 접근 제어)로 프로세스 행위 제한. **(7) image signing**: 레지스트리 이미지 무결성 검증. 플랫폼에서는 이 계층을 조합해 "최소 권한"과 "침입 시 피해 축소"를 설계한다.

**핵심 포인트**

• 격리·제한·권한·정책·무결성을 여러 레이어로 겹쳐서 적용  
• capabilities + seccomp만으로도 대부분의 컨테이너 탈출 시나리오를 줄일 수 있음  
• Production에서는 PSA(Pod Security) + 이미지 서명 + 런타임 프로파일을 함께 사용  

**Security Layers**

```
  Application
       |
  Container (image, env)
       |
  Runtime (runc, config: caps, seccomp)
       |
  Linux Kernel (namespaces, cgroups, LSM)
       |
  Hardware
```

---

## Slide 42 — 전체 스택 요약: 사용자에서 커널까지

**핵심 설명**

한 번의 `docker run` 또는 Kubernetes Pod 생성이 **어떤 계층을 거치는지** 정리하면 다음과 같다. **(1) 사용자/오케스트레이터**: CLI 또는 kubelet. **(2) 상위 런타임**: containerd/cri-o — 이미지, 스냅샷, CRI/API. **(3) 하위 런타임**: runc — OCI bundle, config.json, cgroup·namespace 설정, exec. **(4) 커널**: cgroups(리소스), namespaces(격리), overlay(파일시스템), veth(네트워크), seccomp/capabilities(보안). 플랫폼 엔지니어는 이 경로에서 병목(이미지 풀, 디스크 I/O, OOM, 네트워크 설정)이 어디서 나는지 알고, 적절한 한도·프로파일·런타임을 선택해야 한다.

**핵심 포인트**

• CLI/Kubelet → containerd/cri-o → runc → kernel (cgroups, namespaces, overlay)  
• 이미지 = 레이어; 실행 = namespace + cgroup + rootfs + process  
• 보안 = capabilities 제거 + seccomp + (선택) user namespace  

**전체 스택**

```
  User / K8s
       |
  containerd / cri-o  (이미지, 스냅샷, CRI)
       |
  runc  (OCI runtime: cgroup, namespace, exec)
       |
  Linux: cgroups, namespaces, overlay, veth, seccomp, capabilities
       |
  Hardware
```

---

## Slide 43 — 실무: 런타임 선택과 노드 구성

**핵심 설명**

프로덕션 Kubernetes 노드에서는 보통 **containerd** 또는 **cri-o** 중 하나만 설치하고, **dockerd는 제거**한다. kubelet의 **--container-runtime-endpoint**가 CRI 소켓(예: unix:///run/containerd/containerd.sock)을 가리키게 한다. 노드 이미지(AMI, GCP image 등)에 runc와 선택한 상위 런타임이 포함되고, **Kubernetes 노드 조인** 시 kubelet이 해당 CRI를 사용한다. 디버깅 시에는 **crictl**로 같은 CRI 소켓에 붙어 Pod/컨테이너 목록, 로그, exec를 확인할 수 있다.

**핵심 포인트**

• 노드당 하나의 CRI 구현체; Docker 없이 containerd/cri-o만으로 충분  
• crictl -r unix:///run/containerd/containerd.sock ps / logs / exec  
• 런타임 버전·커널(cgroup v1/v2)은 노드 OS/이미지에 맞춰 통일  

**체크리스트**

```
  [ ] container runtime: containerd or cri-o
  [ ] kubelet --container-runtime-endpoint pointing to CRI socket
  [ ] runc (or crun) installed and compatible with kernel
  [ ] cgroup driver: cgroupfs or systemd (match kubelet)
  [ ] No dockerd on production nodes (optional, reduce surface)
```

---

## Slide 44 — 실무: 리소스 한도와 이미지 레이어 최적화

**핵심 설명**

**리소스 한도**: Kubernetes의 **requests/limits**가 최종적으로 cgroup에 반영된다. memory limit을 주면 OOM 시 컨테이너가 죽으므로, 앱이 실제로 필요하는 양보다 약간 여유 있게 주고, **liveness/readiness**로 재시작을 유도한다. CPU limit은 CFS quota로 전달되며, burst를 막는 대신 throttling이 생길 수 있어, 지연에 민감한 서비스는 limit을 두지 않고 request만 두는 전략도 있다. **이미지**: 레이어 수와 크기를 줄이면 풀·언팩이 빨라진다. multi-stage 빌드, .dockerignore, 베이스 이미지 경량화가 효과적이다.

**핵심 포인트**

• memory limit 필수 권장(OOM으로 한 컨테이너만 종료); CPU limit은 선택  
• 이미지 레이어 수·크기 ↓ → 배포·스케일아웃 시간 단축  
• multi-stage로 빌드 도구를 최종 이미지에서 제외  

**이미지 최적화**

```
  나쁜 예:  레이어 20개, 베이스 500MB, 빌드 도구 포함
  좋은 예:  multi-stage, alpine/distroless 베이스, 레이어 3~5개
  결과:    풀 시간·디스크 사용 감소, 보안 표면 축소
```

---

# PART 1 마무리

---

## 1️⃣ 핵심 요약

| 주제 | 요약 |
|------|------|
| **Container** | 격리된 프로세스 그룹 + cgroups(리소스) + namespaces(뷰) + rootfs |
| **OCI** | image-spec(레이어·manifest·config), runtime-spec(config.json·bundle)로 이식성 확보 |
| **Docker 구조** | CLI → dockerd → containerd → shim → runc → kernel |
| **containerd** | 이미지·스냅샷·CRI; K8s는 CRI로 containerd/cri-o와 연동 |
| **cgroups** | CPU·memory·I/O·pids 제한/측정; v1(컨트롤러별) vs v2(통합) |
| **namespaces** | PID, NET, MNT, UTS, IPC, USER로 프로세스 뷰 격리 |
| **rootfs** | 이미지 레이어를 overlay 등으로 쌓고, 쓰기는 최상위 레이어만 |
| **생명주기** | create(환경) → start(프로세스) → stop → delete |
| **CRI** | kubelet ↔ containerd(cri)/cri-o; RunPodSandbox, CreateContainer 등 |
| **보안** | capabilities 최소화, seccomp로 syscall 제한 |

---

## 2️⃣ 실습 예제

### 실습 1: runc로 OCI 번들 실행

```bash
# 이미지에서 번들 생성 (containerd 사용)
mkdir -p /tmp/nginx-root
docker export $(docker create nginx:alpine) | tar -C /tmp/nginx-root -xf -

# config.json 생성 (runc spec으로 기본 생성 후 수정)
cd /tmp/nginx-root && runc spec
# config.json에서 "args": ["nginx", "-g", "daemon off;"] 등 확인

# 실행 (root 필요)
runc run nginx-demo
# 다른 터미널: runc list
```

### 실습 2: cgroup 제한 확인

```bash
# 컨테이너 실행 (메모리 128M 제한)
docker run -d --name limit-demo --memory=128m alpine sleep 3600

# cgroup 경로 확인 (containerd인 경우)
CONTAINER_ID=$(docker inspect -f '{{.Id}}' limit-demo)
ls -la /sys/fs/cgroup/memory/docker/$CONTAINER_ID/  # v1
cat /sys/fs/cgroup/memory/docker/$CONTAINER_ID/memory.limit_in_bytes
```

### 실습 3: namespace 확인

```bash
# 컨테이너 내부 PID와 호스트 PID 비교
docker run -d --name ns-demo alpine sleep 3600
docker exec ns-demo ps aux          # 컨테이너 안: PID 1 = sleep
ps aux | grep sleep                 # 호스트: 다른 PID

# 네트워크 namespace
docker exec ns-demo ip addr         # 컨테이너만 보이는 eth0 등
```

### 실습 4: CRI로 Pod 확인 (K8s 노드)

```bash
# crictl로 Pod/컨테이너 목록 (kubelet과 같은 CRI 소켓)
crictl pods
crictl ps
crictl logs <container-id>
```

---

## 3️⃣ 실무 설계 팁

• **노드**: 프로덕션은 dockerd 없이 **containerd** 또는 **cri-o**만 사용해 의존성과 공격 표면을 줄인다.  
• **리소스**: **memory limit**은 반드시 설정해 한 컨테이너가 노드를 먹지 않게 하고, CPU limit은 throttling을 고려해 필요 시 생략한다.  
• **이미지**: **multi-stage 빌드**와 **경량 베이스**(alpine, distroless)로 레이어와 크기를 줄여 배포 속도와 보안을 함께 잡는다.  
• **보안**: **non-root** 사용자·**readOnlyRootFilesystem**·**drop capabilities**·**seccomp**를 기본으로 두고, 필요한 경우만 완화한다.  
• **디버깅**: 컨테이너가 안 뜨면 **이벤트(kubectl describe pod)**와 **런타임 로그**(containerd, kubelet), **crictl inspect**로 CRI 단계와 OCI 단계를 나눠 확인한다.  

---

## 4️⃣ 인터뷰 질문

1. **Container와 VM의 격리 차이를 설명하고, 왜 컨테이너가 더 가벼운지 설명하라.**  
   (커널 공유 vs 게스트 OS, cgroups/namespaces vs 하이퍼바이저)

2. **OCI image-spec과 runtime-spec이 각각 무엇을 정의하는가?**  
   (이미지: 레이어·manifest·config / 런타임: config.json·rootfs·linux resources·hooks)

3. **containerd와 runc의 역할을 구분하고, containerd-shim이 필요한 이유를 설명하라.**  
   (이미지·생명주기 vs 실제 실행; shim = runc 부모로 데몬 재시작 시에도 컨테이너 유지)

4. **cgroups v1과 v2의 차이를 설명하라.**  
   (컨트롤러별 계층 vs 단일 통합 계층, 파일명·경로 차이)

5. **컨테이너에서 PID 1이 중요한 이유와, 네트워크 namespace를 Pod 내 여러 컨테이너가 공유하는 방식(Kubernetes)을 설명하라.**  
   (시그널 수신·자식 정리; pause가 namespace 소유, 나머지는 setns)

6. **OverlayFS에서 copy-on-write가 어떻게 동작하는가?**  
   (읽기: upper→lower lookup; 쓰기/수정: upper에만 반영, lower는 변경 없음)

7. **CRI의 RunPodSandbox와 CreateContainer가 각각 무엇을 만드는가?**  
   (Sandbox = pause + net ns + CNI; Container = 그 ns에 조인한 앱 프로세스)

8. **컨테이너 보안을 위해 capabilities와 seccomp를 어떻게 사용하는가?**  
   (필요한 capability만 추가, 나머지 제거; seccomp로 허용 syscall만 화이트리스트)
