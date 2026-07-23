# Hired Creative Ops

[English](README.md) | [Español](README.es.md) | [Português (Brasil)](README.pt-BR.md) | [한국어](README.ko-KR.md) | [日本語](README.ja.md) | [Русский](README.ru.md) | [简体中文](README.cn.md) | [繁體中文](README.zh-TW.md)

<p align="center">
  <em>기업은 AI로 지원자를 걸러냅니다. 이 도구는 크리에이티브 전문가에게 AI를 주어 <em>기업을 고를 수 있게</em> 합니다.</em><br>
  <a href="https://github.com/santifer/career-ops">career-ops</a>를 포크하여, 크리에이티브 디렉터, 디자이너, 카피라이터 등 크리에이티브 직군에 맞게 재구성했습니다.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Claude_Code-000?style=flat&logo=anthropic&logoColor=white" alt="Claude Code">
  <img src="https://img.shields.io/badge/OpenCode-111827?style=flat&logo=terminal&logoColor=white" alt="OpenCode">
  <img src="https://img.shields.io/badge/Gemini_CLI-4285F4?style=flat&logo=google&logoColor=white" alt="Gemini CLI">
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Go-00ADD8?style=flat&logo=go&logoColor=white" alt="Go">
  <img src="https://img.shields.io/badge/Playwright-2EAD33?style=flat&logo=playwright&logoColor=white" alt="Playwright">
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="MIT">
  <br>
  <img src="https://img.shields.io/badge/EN-blue?style=flat" alt="EN">
  <img src="https://img.shields.io/badge/ES-red?style=flat" alt="ES">
  <img src="https://img.shields.io/badge/PT--BR-green?style=flat" alt="PT-BR">
  <img src="https://img.shields.io/badge/KO-white?style=flat" alt="KO">
  <img src="https://img.shields.io/badge/JA-red?style=flat" alt="JA">
  <img src="https://img.shields.io/badge/RU-blue?style=flat" alt="RU">
  <img src="https://img.shields.io/badge/ZH--CN-red?style=flat" alt="ZH-CN">
  <img src="https://img.shields.io/badge/ZH--TW-blue?style=flat" alt="ZH-TW">
</p>

---

## 이게 뭔가요

Hired Creative Ops는 AI 코딩 CLI를 크리에이티브 전문가 -- 크리에이티브 디렉터, 아트 디렉터, 프로덕트/브랜드/모션 디자이너, 카피라이터 -- 를 위한 완전한 구직 커맨드 센터로 바꿔줍니다. 스프레드시트에서 수동으로 지원 현황을 관리하는 대신, AI 기반 파이프라인이 다음을 자동으로 처리합니다:

- **공고 평가** -- 구조화된 A-F 스코어링 시스템 (10개 가중 평가 항목)
- **맞춤형 PDF 생성** -- JD별로 맞춤화된 ATS 최적화 이력서
- **포털 자동 스캔** -- Greenhouse, Ashby, Lever, 기업 채용 페이지 + 리모트 크리에이티브 공고를 무료로 취합하는 [Hired Creative](https://hiredcreative.com) 통합 기능 내장
- **일괄 처리** -- 서브 에이전트로 10개 이상의 공고를 병렬 평가
- **통합 추적** -- 무결성 검사가 포함된 단일 데이터 소스로 모든 것을 추적

> **중요: 이 도구는 무차별 지원 도구가 아닙니다.** Hired Creative Ops는 필터입니다 -- 수백 개의 공고 중 당신의 시간을 투자할 가치가 있는 소수의 공고를 찾아줍니다. 사용자가 설정한 품질 기준(퀄리티 게이트)에 미달하는 공고에는 지원하지 않을 것을 강력히 권장합니다. 당신의 시간도, 채용 담당자의 시간도 소중합니다. 제출 전에 항상 직접 검토하세요.

Hired Creative Ops는 에이전트 기반으로 작동합니다: Claude Code가 Playwright로 채용 페이지를 탐색하고, 키워드 매칭이 아니라 이력서·포트폴리오와 JD를 비교 분석하여 적합도를 판단하며, 공고별로 이력서를 맞춤 조정합니다.

> **참고: 처음 몇 번의 평가는 완벽하지 않을 수 있습니다.** 시스템이 아직 당신을 모르기 때문입니다. 이력서, 포트폴리오, 커리어 스토리, 주요 성과, 잘하는 것, 피하고 싶은 것 등 맥락 정보를 계속 알려주세요. 정보를 줄수록 시스템은 더 정교해집니다. 새로운 리크루터를 온보딩한다고 생각하면 됩니다: 첫 주는 당신을 파악하는 시간이고, 그 이후부터 진가를 발휘합니다.

## 주요 기능

| 기능 | 설명 |
|---------|-------------|
| **자동 파이프라인** | URL 하나만 붙여넣으면 평가 + PDF 생성 + 트래커 등록까지 전 과정 자동화 |
| **6블록 평가** | 직무 요약, 이력서/포트폴리오 매치, 레벨링 전략, 연봉 리서치, 개인화, 면접 준비 (STAR+R) |
| **면접 스토리 뱅크** | 평가를 거듭할수록 STAR+Reflection 스토리가 축적됩니다 -- 어떤 행동 면접 질문에도 답할 수 있는 5~10개의 마스터 스토리 |
| **협상 스크립트** | 연봉 협상 프레임워크, 지역별 연봉 차등(Geographic Discount) 대응 논리, 경쟁 오퍼 활용 전략 |
| **ATS PDF 생성** | Space Grotesk + DM Sans 디자인의 키워드 주입형 이력서 |
| **Hired Creative 통합** | 리모트 크리에이티브 공고 22개 이상의 소스를 취합한 hiredcreative.com 피드 사전 연동 스캔 |
| **포털 스캐너** | 디자인 중심 기업/에이전시(Figma, IDEO, R/GA, AKQA 등) 기본 목록 + Ashby, Greenhouse, Lever, Workable 전반의 커스텀 검색 |
| **일괄 처리** | `claude -p` 워커를 이용한 병렬 평가 |
| **Dashboard TUI** | 파이프라인을 탐색·필터링·정렬할 수 있는 터미널 UI |
| **Human-in-the-Loop** | AI가 평가하고 추천하면, 당신이 판단하고 행동합니다. 시스템은 절대 지원서를 자동 제출하지 않습니다 -- 최종 결정은 항상 당신의 몫입니다 |
| **파이프라인 무결성** | 자동 병합, 중복 제거, 상태 정규화, 헬스 체크 |

## 빠른 시작

```bash
# 1. 클론 및 설치
git clone https://github.com/yashimosh/hiredcreative-ops.git
cd hiredcreative-ops && npm install
npx playwright install chromium   # PDF 생성을 위해 필요

# 2. 설정 확인
npm run doctor                     # 모든 사전 요구사항 검증

# 3. 설정
cp config/profile.example.yml config/profile.yml  # 사용자 정보로 수정
cp templates/portals.example.yml portals.yml       # 기업 목록 커스터마이즈

# 4. 이력서 추가
# 프로젝트 루트에 cv.md 파일을 생성하고 마크다운으로 이력서를 작성하세요

# 5. Claude로 개인화
claude   # 이 디렉토리에서 Claude Code 실행

# Claude에게 시스템을 맞춤 설정해달라고 요청하세요:
# "Change the archetypes to motion design roles"
# "Translate the modes to English"
# "Add these 5 agencies to portals.yml"
# "Update my profile with this CV I'm pasting"

# 6. 사용 시작
# 채용 공고 URL을 붙여넣거나 /hiredcreative-ops 실행
```

> **이 시스템은 Claude가 직접 커스터마이즈하도록 설계되었습니다.** 모드, 아키타입, 스코어링 가중치, 협상 스크립트 -- 그냥 Claude에게 바꿔달라고 요청하면 됩니다. Claude는 자신이 사용하는 파일을 직접 읽기 때문에, 무엇을 수정해야 하는지 정확히 알고 있습니다.

전체 설정 가이드는 [docs/SETUP.md](docs/SETUP.md)를 참고하세요.

## Gemini CLI 연동

Hired Creative Ops는 Claude Code, OpenCode를 지원하는 것과 동일한 방식으로 [Gemini CLI](https://github.com/google-gemini/gemini-cli)를 네이티브로 지원합니다. 동일한 `modes/*.md` 평가 로직을 사용하여 모든 슬래시 커맨드를 그대로 사용할 수 있습니다.

### 옵션 A -- 네이티브 Gemini CLI (권장)

```bash
# 1. Gemini CLI 설치
npm install -g @google/gemini-cli
# 또는: npx @google/gemini-cli --version

# 2. 인증 (무료 -- Google 계정 사용)
gemini auth

# 3. hiredcreative-ops 디렉토리에서 실행
cd hiredcreative-ops
gemini

# 4. Claude Code와 동일하게 슬래시 커맨드 사용
/hiredcreative-ops "Senior Product Designer at Figma..."
/hiredcreative-ops-evaluate --file ./jds/figma.txt
/hiredcreative-ops-scan
/hiredcreative-ops-pdf
/hiredcreative-ops-tracker
```

`GEMINI.md` 파일이 컨텍스트로 자동 로드됩니다. 모든 명령어는 `.gemini/commands/*.toml`에 정의되어 있습니다.

### 옵션 B -- 독립 실행형 API 스크립트 (CLI 설치 불필요)

```bash
# 1. https://aistudio.google.com/apikey 에서 무료 API 키 발급
cp .env.example .env
# .env 편집 → GEMINI_API_KEY=your_key_here 설정

# 2. 의존성 설치
npm install

# 3. JD 평가
node gemini-eval.mjs "We are looking for a Senior Product Designer..."
node gemini-eval.mjs --file ./jds/my-job.txt
npm run gemini:eval -- "JD text here"
```

> **무료 티어:** 두 방법 모두 결제 없이 사용할 수 있습니다. 네이티브 CLI는 Google OAuth를 사용하며, API 스크립트는 `gemini-2.0-flash`를 사용합니다 (분당 15회 요청, 하루 100만 토큰 무료).

## 사용법

Hired Creative Ops는 다양한 모드를 가진 하나의 슬래시 커맨드입니다:

```
/hiredcreative-ops                → 사용 가능한 모든 명령어 표시
/hiredcreative-ops {JD 붙여넣기}  → 전체 자동 파이프라인 (평가 + PDF + 트래커)
/hiredcreative-ops scan           → 포털에서 새 공고 스캔 (Hired Creative 포함)
/hiredcreative-ops pdf            → ATS 최적화 이력서 생성
/hiredcreative-ops batch          → 여러 공고 일괄 평가
/hiredcreative-ops tracker        → 지원 현황 확인
/hiredcreative-ops apply          → AI로 지원서 양식 작성
/hiredcreative-ops pipeline       → 대기 중인 URL 처리
/hiredcreative-ops contacto       → LinkedIn 아웃리치 메시지
/hiredcreative-ops deep           → 기업 심층 리서치
/hiredcreative-ops training       → 교육 과정/자격증 평가
/hiredcreative-ops project        → 포트폴리오 프로젝트 평가
```

채용 공고 URL이나 설명을 바로 붙여넣어도 됩니다 -- Hired Creative Ops가 자동으로 감지하여 전체 파이프라인을 실행합니다.

## 작동 원리

```
채용 공고 URL 또는 설명을 붙여넣기
        │
        ▼
┌──────────────────┐
│  아키타입 감지     │  분류: Creative Director / Product Designer /
│                  │  Brand Designer / Motion / Copywriter / Design Systems
└────────┬─────────┘
         │
┌────────▼─────────┐
│  A-F 평가         │  매칭도, 갭 분석, 연봉 리서치, STAR 스토리
│  (cv.md +        │
│   포트폴리오 참조)  │
└────────┬─────────┘
         │
    ┌────┼────┐
    ▼    ▼    ▼
 Report  PDF  Tracker
  .md   .pdf   .tsv
```

## 사전 설정된 포털

스캐너에는 잘 알려진 디자인 중심 기업 및 에이전시의 기본 목록과, 그 자체로 22개 이상의 소스를 커버하는 [Hired Creative](https://hiredcreative.com) 사전 연동 통합이 포함되어 있습니다. `templates/portals.example.yml`을 `portals.yml`로 복사하고 원하는 항목을 추가하세요:

**에이전시/스튜디오:** IDEO, Pentagram, R/GA, AKQA, Instrument, Collins
**디자인 중심 프로덕트 기업:** Figma, Airbnb, Notion, Linear, Duolingo, Canva, Webflow, Spotify, Adobe, Mailchimp
**애그리게이터:** Hired Creative (hiredcreative.com) -- Greenhouse, Ashby, Lever, Workable, Dribbble, WeWorkRemotely, Welcome to the Jungle 등 다수를 하나의 피드로 통합

**검색 대상 채용 보드:** Ashby, Greenhouse, Lever, Workable, RemoteOK, WeWorkRemotely, Himalayas, Dribbble Jobs

## Dashboard TUI

내장 터미널 대시보드로 파이프라인을 시각적으로 탐색할 수 있습니다:

```bash
cd dashboard
go build -o hiredcreative-dashboard .
./hiredcreative-dashboard --path ..
```

기능: 6개의 필터 탭, 4가지 정렬 모드, 그룹/플랫 뷰, 지연 로딩 미리보기, 인라인 상태 변경.

## 프로젝트 구조

```
hiredcreative-ops/
├── CLAUDE.md                    # 에이전트 지시사항
├── cv.md                        # 내 이력서 (직접 생성)
├── article-digest.md            # 주요 성과 정리 (선택)
├── config/
│   └── profile.example.yml      # 프로필 템플릿
├── modes/                       # 스킬 모드
│   ├── _shared.md               # 공유 컨텍스트 (커스터마이즈 가능)
│   ├── oferta.md                # 개별 평가
│   ├── pdf.md                   # PDF 생성
│   ├── scan.md                  # 포털 스캐너
│   ├── batch.md                 # 일괄 처리
│   └── ...
├── templates/
│   ├── cv-template.html         # ATS 최적화 이력서 템플릿
│   ├── portals.example.yml      # 스캐너 설정 템플릿
│   └── states.yml               # 정규 상태값
├── batch/
│   ├── batch-prompt.md          # 독립형 워커 프롬프트(Self-contained)
│   └── batch-runner.sh          # 오케스트레이터 스크립트
├── dashboard/                   # Go TUI 파이프라인 뷰어
├── data/                        # 트래킹 데이터 (gitignored)
├── reports/                     # 평가 리포트 (gitignored)
├── output/                      # 생성된 PDF (gitignored)
├── fonts/                       # Space Grotesk + DM Sans
├── docs/                        # 설정, 커스터마이즈, 아키텍처
└── examples/                    # 예시 이력서, 리포트, 성과
```

## Tech Stack

![Claude Code](https://img.shields.io/badge/Claude_Code-000?style=flat&logo=anthropic&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=flat&logo=playwright&logoColor=white)
![Go](https://img.shields.io/badge/Go-00ADD8?style=flat&logo=go&logoColor=white)
![Bubble Tea](https://img.shields.io/badge/Bubble_Tea-FF75B5?style=flat&logo=go&logoColor=white)

- **에이전트**: Claude Code + 커스텀 스킬 및 모드
- **PDF**: Playwright/Puppeteer + HTML 템플릿
- **스캐너**: Playwright + Greenhouse API + WebSearch + Hired Creative API
- **대시보드**: Go + Bubble Tea + Lipgloss (Catppuccin Mocha 테마)
- **데이터**: Markdown 테이블 + YAML 설정 + TSV 배치 파일

## Upstream

Hired Creative Ops는 Santiago Fernández de Valderrama([santifer.io](https://santifer.io))가 만든 [career-ops](https://github.com/santifer/career-ops)의 포크입니다. 그는 이 시스템으로 740개 이상의 채용 공고를 평가하고 100개 이상의 맞춤형 이력서를 생성하여 Head of Applied AI 포지션에 합격했습니다. 이 포크는 동일한 엔진을 그대로 유지하면서, 기본값·예시·채용 소스를 크리에이티브 업계에 맞게 재구성했습니다.

## 이 포크에 대하여

크리에이티브 디렉터인 [yashimosh](https://yashimosh.com)가 관리하고 있습니다. 본인의 구직 활동에 사용하기 위해 만들었고, 이후 다른 크리에이티브 전문가들도 포크하여 자신만의 버전으로 만들 수 있도록 오픈소스로 공개했습니다 -- upstream 프로젝트와 같은 취지입니다.

## Star History

<a href="https://www.star-history.com/?repos=yashimosh%2Fhiredcreative-ops&type=timeline&legend=top-left">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=yashimosh/hiredcreative-ops&type=timeline&theme=dark&legend=top-left" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=yashimosh/hiredcreative-ops&type=timeline&legend=top-left" />
   <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=yashimosh/hiredcreative-ops&type=timeline&legend=top-left" />
 </picture>
</a>

## 면책 조항

**hiredcreative-ops는 로컬 오픈소스 도구이며, 별도의 호스팅 서비스가 아닙니다.** 이 소프트웨어를 사용함으로써 다음 사항에 동의하는 것으로 간주됩니다:

1. **데이터는 사용자가 직접 관리합니다.** 이력서, 연락처, 개인정보는 사용자의 컴퓨터에 남아 있으며, 사용자가 선택한 AI 프로바이더(Anthropic, OpenAI 등)에게 직접 전송됩니다. 저희는 어떤 데이터도 수집, 저장, 접근하지 않습니다.
2. **AI 제어는 사용자 책임입니다.** 기본 프롬프트는 AI가 지원서를 자동 제출하지 않도록 설정되어 있으나, AI 모델은 예측 불가능하게 동작할 수 있습니다. 프롬프트를 수정하거나 다른 모델을 사용하는 경우 그에 따른 책임은 사용자에게 있습니다. **제출 전에는 항상 AI가 생성한 콘텐츠의 정확성을 직접 확인하세요.**
3. **제3자 이용약관을 준수해야 합니다.** 상호작용하는 채용 포털(Greenhouse, Lever, Workday, LinkedIn 등)의 이용약관을 반드시 준수해야 합니다. 본 도구를 고용주에게 스팸을 보내거나 ATS 시스템에 과부하를 주는 용도로 사용하지 마세요.
4. **어떠한 보증도 하지 않습니다.** 평가 결과는 추천일 뿐 사실이 아닙니다. AI 모델은 스킬이나 경력을 허위로 생성(hallucinate)할 수 있습니다. 저자는 채용 결과, 거절된 지원, 계정 제한 또는 그 밖의 어떤 결과에 대해서도 책임지지 않습니다.

자세한 내용은 [LEGAL_DISCLAIMER.md](LEGAL_DISCLAIMER.md)를 참고하세요. 이 소프트웨어는 [MIT 라이선스](LICENSE)에 따라 어떠한 종류의 보증도 없이 "있는 그대로" 제공됩니다.

## 기여자

hiredcreative-ops를 사용해 취업에 성공하셨나요? [여러분의 이야기를 들려주세요!](https://github.com/yashimosh/hiredcreative-ops/issues/new?template=i-got-hired.yml)

이 포크를 만들어가는 사람들은 [CONTRIBUTORS.md](CONTRIBUTORS.md)에서 확인할 수 있습니다. 이 엔진의 기반이 된 [upstream career-ops 기여자들](https://github.com/santifer/career-ops/graphs/contributors)도 함께 확인해보세요.

## 라이선스

MIT

## 소통하기

[![Website](https://img.shields.io/badge/yashimosh.com-000?style=for-the-badge&logo=safari&logoColor=white)](https://yashimosh.com)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/yashimosh)
[![X](https://img.shields.io/badge/X-000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/yashimosh_)
