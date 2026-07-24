# Hired Creative Ops

[English](README.md) | [Español](README.es.md) | [Português (Brasil)](README.pt-BR.md) | [한국어](README.ko-KR.md) | [日本語](README.ja.md) | [Русский](README.ru.md) | [简体中文](README.cn.md) | [繁體中文](README.zh-TW.md)

<p align="center">
  <em>公司用 AI 筛选候选人。这个项目把 AI 交给创意从业者，让他们来<em>挑选</em>公司。</em><br>
  Fork 自 <a href="https://github.com/santifer/career-ops">career-ops</a>，重新定位服务于创意总监、设计师、文案等创意岗位从业者。
</p>

<p align="center">
  <a href="https://github.com/yashimosh/hiredcreative-ops/actions/workflows/test.yml"><img src="https://img.shields.io/github/actions/workflow/status/yashimosh/hiredcreative-ops/test.yml?branch=main&label=tests" alt="Tests"></a>
  <a href="https://github.com/yashimosh/hiredcreative-ops/blob/main/LICENSE"><img src="https://img.shields.io/github/license/yashimosh/hiredcreative-ops" alt="License"></a>
  <a href="https://github.com/yashimosh/hiredcreative-ops/commits/main"><img src="https://img.shields.io/github/last-commit/yashimosh/hiredcreative-ops" alt="Last commit"></a>
  <a href="https://github.com/yashimosh/hiredcreative-ops/stargazers"><img src="https://img.shields.io/github/stars/yashimosh/hiredcreative-ops?style=flat" alt="Stars"></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Claude_Code-000?style=flat&logo=anthropic&logoColor=white" alt="Claude Code">
  <img src="https://img.shields.io/badge/OpenCode-111827?style=flat&logo=terminal&logoColor=white" alt="OpenCode">
  <img src="https://img.shields.io/badge/Gemini_CLI-4285F4?style=flat&logo=google&logoColor=white" alt="Gemini CLI">
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Go-00ADD8?style=flat&logo=go&logoColor=white" alt="Go">
  <img src="https://img.shields.io/badge/Playwright-2EAD33?style=flat&logo=playwright&logoColor=white" alt="Playwright">
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

## 这是什么

Hired Creative Ops 能把任何 AI 编码 CLI 变成面向创意从业者的完整求职指挥中心——创意总监、艺术指导、产品/品牌/动效设计师、文案。你不需要再手动用电子表格追踪申请流程，而是获得一个 AI 驱动的管道，能够：

- **评估职位**，使用结构化的 A-F 评分系统（10 个加权维度）
- **生成定制 PDF**——针对每份职位描述输出 ATS 优化简历
- **自动扫描招聘平台**（Greenhouse、Ashby、Lever、公司招聘页）——并内置与 [Hired Creative](https://hiredcreative.com) 的集成，这是一个免费的远程创意岗位聚合平台
- **批量处理**——通过子代理并行评估 10 份以上职位
- **集中管理一切**，用单一事实来源配合完整性检查

> **重要提示：这不是海投工具。** Hired Creative Ops 是一个过滤器——帮你从数百个职位里找出真正值得投入时间的少数机会。系统强烈建议不要申请评分低于你所设定质量门槛的职位。你的时间很宝贵，招聘方的时间也一样。提交前一定要自己复核。

Hired Creative Ops 具备代理式工作能力：Claude Code 会用 Playwright 浏览招聘页面，通过推理你的简历与作品集同职位描述的匹配程度来评估契合度（而不是做关键词匹配），并根据每个职位调整你的简历。

> **提醒：最开始几次评估不会特别准。** 系统还不了解你。请给它更多上下文——你的简历、作品集、职业故事、成果证明、擅长的事、想避开的事。你喂给它的信息越多，它就越准确。把它当成在培养一个新招聘顾问：第一周它需要先了解你，之后就会变得非常有价值。

## 功能特性

| 功能 | 说明 |
|------|------|
| **自动管道** | 粘贴一个 URL，即可获得完整评估 + PDF + 追踪记录 |
| **6 个评估模块** | 职位总结、简历/作品集匹配、职级策略、薪酬调研、个性化建议、面试准备（STAR+R） |
| **面试故事库** | 跨多次评估积累 STAR+Reflection 故事——沉淀出 5-10 个可回答任意行为面试题的主线故事 |
| **谈薪脚本** | 薪资谈判框架、地域折扣反驳话术、竞品 offer 杠杆策略 |
| **ATS PDF 生成** | 注入关键词的简历，采用 Space Grotesk + DM Sans 设计 |
| **Hired Creative 集成** | 预置对接 [hiredcreative.com](https://hiredcreative.com) 聚合的远程创意岗位信息流（22+ 个来源） |
| **平台扫描器** | 预配置一批设计驱动型公司和代理商（Figma、IDEO、R/GA、AKQA...），支持跨 Ashby、Greenhouse、Lever、Workable 的自定义查询 |
| **批量处理** | 使用 `claude -p` worker 并行评估 |
| **Dashboard TUI** | 在终端 UI 中浏览、筛选和排序你的求职管道 |
| **人类在环** | AI 负责评估和建议，你负责决定和行动。系统绝不会自动提交申请——最终决定始终在你手上 |
| **管道完整性** | 自动合并、去重、状态标准化和健康检查 |

## 快速开始

```bash
# 1. 克隆并安装
git clone https://github.com/yashimosh/hiredcreative-ops.git
cd hiredcreative-ops && npm install
npx playwright install chromium   # 生成 PDF 所需

# 2. 检查环境
npm run doctor                     # 验证所有前置条件

# 3. 配置
cp config/profile.example.yml config/profile.yml  # 填入你的信息
cp templates/portals.example.yml portals.yml       # 自定义目标公司

# 4. 添加你的简历
# 在项目根目录创建 cv.md，并用 Markdown 写入你的简历

# 5. 用 Claude 做个性化配置
claude   # 在当前目录打开 Claude Code

# 然后让 Claude 帮你把系统调成适合你的版本：
# "把职业原型改成动效设计岗位"
# "把 modes 翻译成简体中文"
# "把这 5 家代理商加入 portals.yml"
# "用我贴过来的这份简历更新个人档案"

# 6. 开始使用
# 粘贴一个职位 URL，或运行 /hiredcreative-ops
```

> **这个系统本来就是设计给 Claude 直接定制的。** modes、职业原型、评分权重、谈判脚本，直接告诉 Claude 要改什么就行。Claude 读取的正是它自己会使用的那些文件，所以它知道该改哪里。

完整配置指南见 [docs/SETUP.md](docs/SETUP.md)。

## Gemini CLI 集成

Hired Creative Ops 原生支持 [Gemini CLI](https://github.com/google-gemini/gemini-cli)——支持方式与 Claude Code、OpenCode 相同。所有斜杠命令均可使用，且共用同一套 `modes/*.md` 评估逻辑。

### 方式 A：原生 Gemini CLI（推荐）

```bash
# 1. 安装 Gemini CLI
npm install -g @google/gemini-cli
# 或者: npx @google/gemini-cli --version

# 2. 认证（免费——使用你的 Google 账号）
gemini auth

# 3. 在 hiredcreative-ops 目录下运行
cd hiredcreative-ops
gemini

# 4. 像在 Claude Code 里一样使用斜杠命令
/hiredcreative-ops "Senior Product Designer at Figma..."
/hiredcreative-ops-evaluate --file ./jds/figma.txt
/hiredcreative-ops-scan
/hiredcreative-ops-pdf
/hiredcreative-ops-tracker
```

`GEMINI.md` 文件会被自动加载为上下文。所有命令定义在 `.gemini/commands/*.toml` 中。

### 方式 B：独立 API 脚本（无需安装 CLI）

```bash
# 1. 在 https://aistudio.google.com/apikey 获取免费 API key
cp .env.example .env
# 编辑 .env → 设置 GEMINI_API_KEY=your_key_here

# 2. 安装依赖
npm install

# 3. 评估一份职位描述
node gemini-eval.mjs "We are looking for a Senior Product Designer..."
node gemini-eval.mjs --file ./jds/my-job.txt
npm run gemini:eval -- "JD text here"
```

> **免费额度：** 两种方式都无需付费即可使用。原生 CLI 使用 Google OAuth；API 脚本使用 `gemini-2.0-flash`（每分钟 15 次请求，每天 100 万 token 免费额度）。

## 用法

Hired Creative Ops 是一个单一斜杠命令，带有多种模式：

```
/hiredcreative-ops                → 显示所有可用命令
/hiredcreative-ops {粘贴职位描述}  → 完整自动管道（评估 + PDF + 追踪）
/hiredcreative-ops scan           → 扫描平台上的新职位（含 Hired Creative）
/hiredcreative-ops pdf            → 生成 ATS 优化简历
/hiredcreative-ops batch          → 批量评估多个职位
/hiredcreative-ops tracker        → 查看申请状态
/hiredcreative-ops apply          → 用 AI 协助填写申请表
/hiredcreative-ops pipeline       → 处理待办 URL
/hiredcreative-ops contacto       → 生成 LinkedIn 外联消息
/hiredcreative-ops deep           → 深度公司研究
/hiredcreative-ops training       → 评估课程/证书
/hiredcreative-ops project        → 评估作品集项目
```

或者直接粘贴职位 URL 或职位描述，Hired Creative Ops 会自动识别并运行完整流程。

## 工作原理

```
粘贴职位 URL 或职位描述
        │
        ▼
┌──────────────────┐
│  职业原型        │  分类：创意总监 / 产品设计师 /
│  检测            │  品牌设计师 / 动效设计师 / 文案 / 设计系统
└────────┬─────────┘
         │
┌────────▼─────────┐
│  A-F 评估        │  匹配度、能力缺口、薪酬调研、STAR 故事
│  （读取 cv.md +  │
│   作品集）       │
└────────┬─────────┘
         │
    ┌────┼────┐
    ▼    ▼    ▼
  报告  PDF  追踪
  .md  .pdf  .tsv
```

## 预配置平台

扫描器默认内置一批知名的设计驱动型公司和代理商，外加预置对接的 [Hired Creative](https://hiredcreative.com) 集成——它自身就覆盖了 22+ 个来源。把 `templates/portals.example.yml` 复制成 `portals.yml` 后，你可以继续添加自己的目标公司：

**代理商/工作室：** IDEO、Pentagram、R/GA、AKQA、Instrument、Collins
**设计驱动型产品公司：** Figma、Airbnb、Notion、Linear、Duolingo、Canva、Webflow、Spotify、Adobe、Mailchimp
**聚合平台：** Hired Creative（hiredcreative.com）——一站式聚合 Greenhouse、Ashby、Lever、Workable、Dribbble、WeWorkRemotely、Welcome to the Jungle 等多个来源

**覆盖的招聘平台：** Ashby、Greenhouse、Lever、Workable、RemoteOK、WeWorkRemotely、Himalayas、Dribbble Jobs

## Dashboard TUI

内置终端仪表盘可以让你更直观地浏览整个求职管道：

```bash
cd dashboard
go build -o hiredcreative-dashboard .
./hiredcreative-dashboard --path ..
```

功能包括：6 个筛选标签、4 种排序模式、分组/平铺视图、懒加载预览、行内状态修改。

## 项目结构

```
hiredcreative-ops/
├── CLAUDE.md                    # 代理说明
├── cv.md                        # 你的简历（需要自行创建）
├── article-digest.md            # 你的成果证明（可选）
├── config/
│   └── profile.example.yml      # 个人档案模板
├── modes/                       # 技能模式
│   ├── _shared.md               # 共享上下文（在这里自定义）
│   ├── oferta.md                # 单个职位评估
│   ├── pdf.md                   # PDF 生成
│   ├── scan.md                  # 平台扫描器
│   ├── batch.md                 # 批量处理
│   └── ...
├── templates/
│   ├── cv-template.html         # ATS 优化简历模板
│   ├── portals.example.yml      # 扫描器配置模板
│   └── states.yml               # 规范状态列表
├── batch/
│   ├── batch-prompt.md          # 自包含 worker 提示词
│   └── batch-runner.sh          # 编排脚本
├── dashboard/                   # Go TUI 管道查看器
├── data/                        # 你的追踪数据（已 gitignore）
├── reports/                     # 评估报告（已 gitignore）
├── output/                      # 生成的 PDF（已 gitignore）
├── fonts/                       # Space Grotesk + DM Sans
├── docs/                        # 配置、定制、架构说明
└── examples/                    # 示例简历、报告、成果证明
```

## 技术栈

![Claude Code](https://img.shields.io/badge/Claude_Code-000?style=flat&logo=anthropic&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=flat&logo=playwright&logoColor=white)
![Go](https://img.shields.io/badge/Go-00ADD8?style=flat&logo=go&logoColor=white)
![Bubble Tea](https://img.shields.io/badge/Bubble_Tea-FF75B5?style=flat&logo=go&logoColor=white)

- **代理**：Claude Code，配合自定义技能与 modes
- **PDF**：Playwright/Puppeteer + HTML 模板
- **扫描器**：Playwright + Greenhouse API + WebSearch + Hired Creative API
- **Dashboard**：Go + Bubble Tea + Lipgloss（Catppuccin Mocha 主题）
- **数据**：Markdown 表格 + YAML 配置 + TSV 批处理文件

## 上游项目

Hired Creative Ops fork 自 Santiago Fernández de Valderrama（[santifer.io](https://santifer.io)）开发的 [career-ops](https://github.com/santifer/career-ops)。他构建并使用这套系统评估了 740 多个职位、生成 100 多份定制简历，并借此拿到一份 Head of Applied AI 的工作。这个 fork 保留了同一套引擎，把默认配置、示例和职位来源重新定位到创意行业。

## 关于这个 Fork

由创意总监 [yashimosh](https://yashimosh.com) 维护。最初构建用来跑他自己的求职流程，随后开源出来，让其他创意从业者也能 fork 并改造成自己的版本——延续与上游项目一致的精神。

## Star 历史

<a href="https://www.star-history.com/?repos=yashimosh%2Fhiredcreative-ops&type=timeline&legend=top-left">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=yashimosh/hiredcreative-ops&type=timeline&theme=dark&legend=top-left" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=yashimosh/hiredcreative-ops&type=timeline&legend=top-left" />
   <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=yashimosh/hiredcreative-ops&type=timeline&legend=top-left" />
 </picture>
</a>

## 免责声明

**hiredcreative-ops 是一个本地开源工具，不是托管服务。** 使用本软件即表示你确认：

1. **数据由你掌控。** 你的简历、联系方式和个人数据都保留在你的设备上，并直接发送给你选择的 AI 提供商（Anthropic、OpenAI 等）。我们不会收集、存储或访问你的任何数据。
2. **AI 由你掌控。** 默认提示词会明确要求 AI 不要自动提交申请，但 AI 模型的行为可能不可预测。如果你修改提示词或使用不同模型，风险由你自行承担。**提交前务必核查 AI 生成内容的准确性。**
3. **你需要遵守第三方服务条款。** 你必须按照所使用招聘平台（Greenhouse、Lever、Workday、LinkedIn 等）的服务条款来使用本工具。不要用它向雇主发送垃圾申请，也不要对 ATS 系统造成过载。
4. **不提供任何保证。** 评估结果只是建议，不是真相。AI 模型可能会幻觉出并不存在的技能或经历。作者不对任何求职结果、申请被拒、账号受限或其他后果承担责任。

完整内容见 [LEGAL_DISCLAIMER.md](LEGAL_DISCLAIMER.md)。本软件依据 [MIT License](LICENSE) 以"按现状"方式提供，不附带任何形式的担保。

## 贡献者

用 hiredcreative-ops 找到工作了？[分享你的故事！](https://github.com/yashimosh/hiredcreative-ops/issues/new?template=i-got-hired.yml)

参与构建这个 fork 的人员名单见 [CONTRIBUTORS.md](CONTRIBUTORS.md)，这套引擎背后的贡献者见 [上游 career-ops 贡献者列表](https://github.com/santifer/career-ops/graphs/contributors)。

## 许可证

MIT

## 联系我们

[![Website](https://img.shields.io/badge/yashimosh.com-000?style=for-the-badge&logo=safari&logoColor=white)](https://yashimosh.com)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/yashimosh)
[![X](https://img.shields.io/badge/X-000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/yashimosh_)
