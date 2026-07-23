# Hired Creative Ops

[English](README.md) | [Español](README.es.md) | [Português (Brasil)](README.pt-BR.md) | [한국어](README.ko-KR.md) | [日本語](README.ja.md) | [Русский](README.ru.md) | [简体中文](README.cn.md) | [繁體中文](README.zh-TW.md)

<p align="center">
  <em>企業用 AI 篩選候選人。這個專案把 AI 交給創意工作者，讓他們來<em>挑選</em>企業。</em><br>
  Fork 自 <a href="https://github.com/santifer/career-ops">career-ops</a>，重新定位服務於創意總監、設計師、文案等創意職務工作者。
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

## 這是什麼

Hired Creative Ops 能將任何 AI 程式碼 CLI 轉化為專為創意工作者打造的完整求職指揮中心——創意總監、藝術指導、產品/品牌/動態設計師、文案。不再需要手動用試算表追蹤應徵紀錄，而是獲得一個 AI 驅動的管道，能夠：

- **評估職缺**——結構化的 A-F 評分系統（10 個加權評估維度）
- **生成客製化 PDF**——針對每份職缺描述進行 ATS 最佳化的履歷
- **自動掃描平台**（Greenhouse、Ashby、Lever、企業官網）——並內建整合 [Hired Creative](https://hiredcreative.com)，一個免費的遠端創意職缺聚合平台
- **批次處理**——用子代理平行評估 10 份以上的職缺
- **統一追蹤**——單一資料來源，並具備完整性檢查

> **重要提醒：這不是「亂槍打鳥」的工具。** Hired Creative Ops 是一個過濾器——它幫你從數百個機會中，篩出真正值得投入時間的那幾個。系統會強烈建議你不要投遞低於你所設定品質門檻的職缺。你的時間很寶貴，招募方的時間也是。送出前務必自行檢查。

Hired Creative Ops 具備代理能力：Claude Code 會用 Playwright 瀏覽職缺頁面，透過推理（而非關鍵字比對）評估你的履歷與作品集是否符合職缺描述，並針對每個職缺調整你的履歷。

> **提醒：一開始的評估不會太準確。** 系統還不了解你。餵給它足夠的背景資訊——你的履歷、作品集、職涯故事、代表作、你擅長什麼、想避開什麼。你投入越多脈絡，它就會越準確。把它想像成在培訓一位新的獵頭顧問：第一週需要先認識你，之後就會變得無可取代。

## 功能特色

| 功能 | 說明 |
|---------|-------------|
| **自動化管道（Auto-Pipeline）** | 貼上網址，即可獲得完整評估 + PDF + 追蹤紀錄 |
| **六大區塊評估** | 職位摘要、履歷/作品集匹配度、職級策略、薪資研究、個人化建議、面試準備（STAR+R） |
| **面試故事庫** | 累積歷次評估產生的 STAR+反思故事——5-10 個核心故事，足以應付各種行為面試問題 |
| **談判腳本** | 薪資談判框架、地區折價反駁話術、多重錄取槓桿運用 |
| **ATS 履歷生成** | 使用 Space Grotesk + DM Sans 字體設計、含關鍵字最佳化的履歷 |
| **Hired Creative 整合** | 內建掃描 [hiredcreative.com](https://hiredcreative.com) 聚合的遠端創意職缺（涵蓋 22+ 個來源） |
| **平台掃描器** | 預設一批具設計代表性的公司與代理商（Figma、IDEO、R/GA、AKQA...）+ 跨 Ashby、Greenhouse、Lever、Workable 的自訂搜尋 |
| **批次處理** | 使用 `claude -p` 工作程序平行評估 |
| **儀表板 TUI** | 終端機介面，瀏覽、篩選、排序你的求職管道 |
| **人在迴路中（Human-in-the-Loop）** | AI 負責評估與建議，你負責決定與行動。系統絕不會自動送出應徵——最終決定權永遠在你手上 |
| **管道完整性** | 自動合併、去重、狀態正規化、健康檢查 |

## 快速開始

```bash
# 1. 複製並安裝
git clone https://github.com/yashimosh/hiredcreative-ops.git
cd hiredcreative-ops && npm install
npx playwright install chromium   # PDF 生成所需

# 2. 檢查環境設定
npm run doctor                     # 驗證所有前置需求

# 3. 設定
cp config/profile.example.yml config/profile.yml  # 編輯填入你的資料
cp templates/portals.example.yml portals.yml       # 自訂公司清單

# 4. 加入你的履歷
# 在專案根目錄建立 cv.md，用 Markdown 撰寫你的履歷

# 5. 讓 Claude 幫你個人化設定
claude   # 在此目錄開啟 Claude Code

# 接著請 Claude 依照你的需求調整系統：
# 「把角色原型改成動態設計相關職位」
# 「把模式翻譯成英文」
# 「把這 5 間代理商加進 portals.yml」
# 「用我貼上的這份履歷更新我的個人檔案」

# 6. 開始使用
# 貼上職缺網址，或執行 /hiredcreative-ops
```

> **系統設計上就是要讓 Claude 自己來客製化。** 模式、角色原型、評分權重、談判腳本——只要請 Claude 幫你修改即可。它讀的就是它自己在用的檔案，所以完全知道該改哪裡。

完整設定指南請見 [docs/SETUP.md](docs/SETUP.md)。

## Gemini CLI 整合

Hired Creative Ops 原生支援 [Gemini CLI](https://github.com/google-gemini/gemini-cli)——就像它支援 Claude Code 與 OpenCode 一樣。所有斜線指令皆可使用，共用同一套 `modes/*.md` 評估邏輯。

### 方案 A——原生 Gemini CLI（建議）

```bash
# 1. 安裝 Gemini CLI
npm install -g @google/gemini-cli
# 或：npx @google/gemini-cli --version

# 2. 驗證身分（免費——使用你的 Google 帳號）
gemini auth

# 3. 在 hiredcreative-ops 目錄中執行
cd hiredcreative-ops
gemini

# 4. 像在 Claude Code 一樣使用斜線指令
/hiredcreative-ops "Figma 資深產品設計師..."
/hiredcreative-ops-evaluate --file ./jds/figma.txt
/hiredcreative-ops-scan
/hiredcreative-ops-pdf
/hiredcreative-ops-tracker
```

`GEMINI.md` 檔案會自動被載入作為上下文。所有指令定義於 `.gemini/commands/*.toml`。

### 方案 B——獨立 API 腳本（免安裝 CLI）

```bash
# 1. 前往 https://aistudio.google.com/apikey 取得免費 API 金鑰
cp .env.example .env
# 編輯 .env → 設定 GEMINI_API_KEY=你的金鑰

# 2. 安裝相依套件
npm install

# 3. 評估職缺描述
node gemini-eval.mjs "We are looking for a Senior Product Designer..."
node gemini-eval.mjs --file ./jds/my-job.txt
npm run gemini:eval -- "職缺描述文字"
```

> **免費方案：** 兩種方式皆無需付費即可使用。原生 CLI 使用 Google OAuth；API 腳本則使用 `gemini-2.0-flash`（每分鐘 15 次請求、每日 100 萬 token，皆為免費額度）。

## 使用方式

Hired Creative Ops 是單一斜線指令，具備多種模式：

```
/hiredcreative-ops                → 顯示所有可用指令
/hiredcreative-ops {貼上職缺}     → 完整自動化管道（評估 + PDF + 追蹤紀錄）
/hiredcreative-ops scan           → 掃描平台尋找新職缺（含 Hired Creative）
/hiredcreative-ops pdf            → 生成 ATS 最佳化履歷
/hiredcreative-ops batch          → 批次評估多個職缺
/hiredcreative-ops tracker        → 查看應徵狀態
/hiredcreative-ops apply          → 用 AI 填寫應徵表單
/hiredcreative-ops pipeline       → 處理待處理網址
/hiredcreative-ops contacto       → LinkedIn 開發訊息
/hiredcreative-ops deep           → 深入研究公司
/hiredcreative-ops training       → 評估課程/證照
/hiredcreative-ops project        → 評估作品集專案
```

或者直接貼上職缺網址或描述——Hired Creative Ops 會自動偵測並執行完整管道。

## 運作原理

```
你貼上職缺網址或描述
        │
        ▼
┌──────────────────┐
│  角色原型         │  分類：創意總監 / 產品設計師 /
│  偵測             │  品牌設計師 / 動態設計 / 文案 / 設計系統
└────────┬─────────┘
         │
┌────────▼─────────┐
│  A-F 評估         │  匹配度、落差、薪資研究、STAR 故事
│  （讀取 cv.md +   │
│   作品集）        │
└────────┬─────────┘
         │
    ┌────┼────┐
    ▼    ▼    ▼
  報告   PDF  追蹤表
  .md   .pdf   .tsv
```

## 預設平台清單

掃描器內建一批具設計代表性的知名公司與代理商，並內建整合 [Hired Creative](https://hiredcreative.com)，本身就涵蓋 22+ 個來源。將 `templates/portals.example.yml` 複製為 `portals.yml`，再加入你自己的清單：

**代理商/工作室：** IDEO、Pentagram、R/GA、AKQA、Instrument、Collins
**具設計代表性的產品公司：** Figma、Airbnb、Notion、Linear、Duolingo、Canva、Webflow、Spotify、Adobe、Mailchimp
**聚合平台：** Hired Creative（hiredcreative.com）——整合 Greenhouse、Ashby、Lever、Workable、Dribbble、WeWorkRemotely、Welcome to the Jungle 等多個來源於單一動態

**搜尋的求職平台：** Ashby、Greenhouse、Lever、Workable、RemoteOK、WeWorkRemotely、Himalayas、Dribbble Jobs

## 儀表板 TUI

內建的終端機儀表板讓你能以視覺化方式瀏覽求職管道：

```bash
cd dashboard
go build -o hiredcreative-dashboard .
./hiredcreative-dashboard --path ..
```

功能特色：6 個篩選分頁、4 種排序模式、分組/平面檢視、延遲載入預覽、即時狀態變更。

## 專案結構

```
hiredcreative-ops/
├── CLAUDE.md                    # 代理指令
├── cv.md                        # 你的履歷（需自行建立）
├── article-digest.md            # 你的代表作（選填）
├── config/
│   └── profile.example.yml      # 個人檔案範本
├── modes/                       # 技能模式
│   ├── _shared.md               # 共用內容（可自訂）
│   ├── oferta.md                # 單一評估
│   ├── pdf.md                   # PDF 生成
│   ├── scan.md                  # 平台掃描器
│   ├── batch.md                 # 批次處理
│   └── ...
├── templates/
│   ├── cv-template.html         # ATS 最佳化履歷範本
│   ├── portals.example.yml      # 掃描器設定範本
│   └── states.yml               # 標準狀態定義
├── batch/
│   ├── batch-prompt.md          # 獨立的工作程序提示詞
│   └── batch-runner.sh          # 協調腳本
├── dashboard/                   # Go 終端機介面工具
├── data/                        # 你的追蹤資料（已加入 .gitignore）
├── reports/                     # 評估報告（已加入 .gitignore）
├── output/                      # 生成的 PDF（已加入 .gitignore）
├── fonts/                       # Space Grotesk + DM Sans
├── docs/                        # 設定、客製化、架構說明
└── examples/                    # 履歷、報告、代表作範例
```

## 技術棧

![Claude Code](https://img.shields.io/badge/Claude_Code-000?style=flat&logo=anthropic&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=flat&logo=playwright&logoColor=white)
![Go](https://img.shields.io/badge/Go-00ADD8?style=flat&logo=go&logoColor=white)
![Bubble Tea](https://img.shields.io/badge/Bubble_Tea-FF75B5?style=flat&logo=go&logoColor=white)

- **代理**：Claude Code + 自訂技能與模式
- **PDF**：Playwright/Puppeteer + HTML 範本
- **掃描器**：Playwright + Greenhouse API + WebSearch + Hired Creative API
- **儀表板**：Go + Bubble Tea + Lipgloss（Catppuccin Mocha 主題）
- **資料**：Markdown 表格 + YAML 設定 + TSV 批次檔案

## 上游專案

Hired Creative Ops 是 Santiago Fernández de Valderrama（[santifer.io](https://santifer.io)）所打造的 [career-ops](https://github.com/santifer/career-ops) 的 fork 專案，他當初用這套系統評估了超過 740 份職缺、生成超過 100 份客製化履歷，並成功獲得 Head of Applied AI 職位。本 fork 保留了相同的核心引擎，並將預設內容、範例與職缺來源重新定位到創意產業。

## 關於本 Fork

由 [yashimosh](https://yashimosh.com)（一位創意總監）維護。最初是為了自己的求職打造，之後開源出來，讓其他創意工作者也能 fork 並打造屬於自己的版本——秉持與上游專案相同的精神。

## Star 歷史

<a href="https://www.star-history.com/?repos=yashimosh%2Fhiredcreative-ops&type=timeline&legend=top-left">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=yashimosh/hiredcreative-ops&type=timeline&theme=dark&legend=top-left" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=yashimosh/hiredcreative-ops&type=timeline&legend=top-left" />
   <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=yashimosh/hiredcreative-ops&type=timeline&legend=top-left" />
 </picture>
</a>

## 免責聲明

**hiredcreative-ops 是本地端的開源工具——並非託管服務。** 使用本軟體即表示你同意以下事項：

1. **你掌控自己的資料。** 你的履歷、聯絡資訊與個人資料都留在你自己的電腦上，並直接傳送給你選擇的 AI 供應商（Anthropic、OpenAI 等）。我們不會收集、儲存或存取你的任何資料。
2. **你掌控 AI 的行為。** 預設提示詞會指示 AI 不要自動送出應徵，但 AI 模型的行為可能無法完全預測。若你修改提示詞或使用不同模型，須自行承擔風險。**送出前務必自行檢查 AI 生成內容的正確性。**
3. **你須遵守第三方服務條款。** 你必須遵守所使用的求職平台（Greenhouse、Lever、Workday、LinkedIn 等）的服務條款。請勿使用本工具騷擾雇主或對 ATS 系統造成過度負擔。
4. **不提供任何保證。** 評估結果僅供參考，並非絕對真實。AI 模型可能會虛構技能或經歷。作者對於求職結果、應徵被拒、帳號限制或其他任何後果概不負責。

完整內容請見 [LEGAL_DISCLAIMER.md](LEGAL_DISCLAIMER.md)。本軟體依 [MIT 授權條款](LICENSE) 提供，「按現狀」提供，不含任何形式的保證。

## 貢獻者

使用 hiredcreative-ops 找到工作了嗎？[分享你的故事！](https://github.com/yashimosh/hiredcreative-ops/issues/new?template=i-got-hired.yml)

參與本 fork 開發的貢獻者請見 [CONTRIBUTORS.md](CONTRIBUTORS.md)；本專案所奠基的核心引擎的貢獻者，請見[上游 career-ops 貢獻者名單](https://github.com/santifer/career-ops/graphs/contributors)。

## 授權條款

MIT

## 聯絡方式

[![Website](https://img.shields.io/badge/yashimosh.com-000?style=for-the-badge&logo=safari&logoColor=white)](https://yashimosh.com)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/yashimosh)
[![X](https://img.shields.io/badge/X-000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/yashimosh_)
