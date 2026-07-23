# Hired Creative Ops

[English](README.md) | [Español](README.es.md) | [Português (Brasil)](README.pt-BR.md) | [한국어](README.ko-KR.md) | [日本語](README.ja.md) | [Русский](README.ru.md) | [简体中文](README.cn.md) | [繁體中文](README.zh-TW.md)

<p align="center">
  <em>企業はAIを使って候補者をフィルタリングする。本ツールは、クリエイティブ職の人々にも企業を<em>選ぶ</em>側になるためのAIを与える。</em><br>
  <a href="https://github.com/santifer/career-ops">career-ops</a>のフォークであり、クリエイティブディレクター、デザイナー、コピーライターなど、クリエイティブ職向けに再設計されている。
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

## これは何？

Hired Creative Opsは、あらゆるAIコーディングCLIを、クリエイティブディレクター、アートディレクター、プロダクト/ブランド/モーションデザイナー、コピーライターなど、クリエイティブ職のための本格的な求職コマンドセンターに変えます。スプレッドシートで応募を手動管理する代わりに、AIによる以下のパイプラインが手に入ります:

- **オファーを評価** -- 構造化されたA-Fスコアリングシステム（10項目の重み付け評価軸）
- **テーラーメイドPDFを生成** -- 各求人票に合わせてATS最適化されたCV
- **求人ポータルを自動スキャン** （Greenhouse、Ashby、Lever、企業ページ）-- さらに、リモート勤務のクリエイティブ求人を無料で集約する[Hired Creative](https://hiredcreative.com)との統合を標準搭載
- **バッチ処理** -- サブエージェントで10件以上のオファーを並列評価
- **すべてを一元管理** -- 整合性チェック付きの単一のデータソース

> **重要: これは「とにかく数を撃つ」ツールではありません。** Hired Creative Opsはフィルターです -- 何百もの求人の中から、あなたの時間を割く価値のある数件を見つけ出すためのツールです。本システムは、あなたが設定した品質ゲートを下回るスコアの求人への応募を強く非推奨としています。あなたの時間もリクルーターの時間も貴重です。送信前に必ず内容を確認してください。

Hired Creative Opsはエージェンティックです: Claude CodeがPlaywrightで求人ページを操作し、（キーワードマッチではなく）あなたのCVとポートフォリオを求人票と突き合わせて適合度を推論し、求人ごとにレジュメを最適化します。

> **ご注意: 最初の評価はあまり良くありません。** システムはまだあなたのことを知らないからです。コンテキストを与えてください -- CV、ポートフォリオ、キャリアストーリー、実績の裏付け、得意なこと、避けたいこと。育てれば育てるほど精度が上がります。新人リクルーターをオンボーディングするのと同じです: 最初の1週間はあなたについて学ぶ必要があり、その後かけがえのない存在になります。

## 機能

| 機能 | 説明 |
|---------|-------------|
| **自動パイプライン** | URLを貼るだけで、評価 + PDF + トラッカー記録が完了 |
| **6ブロック評価** | 役割サマリー、CV/ポートフォリオマッチ、レベル戦略、報酬調査、パーソナライズ、面接準備（STAR+R） |
| **面接ストーリーバンク** | 評価を重ねるごとにSTAR+Reflectionストーリーを蓄積 -- あらゆる行動面接質問に答える5〜10のマスターストーリー |
| **交渉スクリプト** | 給与交渉のフレームワーク、地域ディスカウント反論、競合オファーの活用 |
| **ATS向けPDF生成** | Space Grotesk + DM Sansデザインのキーワード注入型CV |
| **Hired Creative連携** | リモート勤務のクリエイティブ求人を集約する[hiredcreative.com](https://hiredcreative.com)のフィード（22以上のソース）を事前設定済みでスキャン |
| **ポータルスキャナー** | デザイン先進企業・エージェンシー（Figma、IDEO、R/GA、AKQA...）のスターターリスト + Ashby、Greenhouse、Lever、Workable横断のカスタムクエリ |
| **バッチ処理** | `claude -p`ワーカーによる並列評価 |
| **ダッシュボードTUI** | パイプラインを閲覧・フィルター・ソートするターミナルUI |
| **Human-in-the-Loop** | AIは評価と推奨を行い、決定と実行はあなたが行います。システムが応募を自動送信することは絶対になく、最終判断は常にあなたが下します |
| **パイプラインの整合性** | 自動マージ、重複排除、ステータス正規化、ヘルスチェック |

## クイックスタート

```bash
# 1. クローンとインストール
git clone https://github.com/yashimosh/hiredcreative-ops.git
cd hiredcreative-ops && npm install
npx playwright install chromium   # PDF生成に必要

# 2. セットアップ確認
npm run doctor                     # 前提条件をすべて検証

# 3. 設定
cp config/profile.example.yml config/profile.yml  # 自身の情報に編集
cp templates/portals.example.yml portals.yml       # 対象企業をカスタマイズ

# 4. CVを追加
# プロジェクトルートにcv.mdを作成し、CVをマークダウンで記述

# 5. Claudeでパーソナライズ
claude   # このディレクトリでClaude Codeを起動

# そしてClaudeにシステムを自分向けに調整してもらう:
# 「アーキタイプをモーションデザインの役割に変更して」
# 「モードを英語に翻訳して」
# 「これら5社のエージェンシーをportals.ymlに追加して」
# 「貼り付けるこのCVでプロフィールを更新して」

# 6. 使い始める
# 求人URLを貼るか、/hiredcreative-opsを実行
```

> **このシステムはClaude自身がカスタマイズする前提で設計されています。** モード、アーキタイプ、スコアリング重み、交渉スクリプト -- すべてClaudeに依頼すれば変更してくれます。Claudeは自分が使うのと同じファイルを読むので、どこを編集すればよいか正確に把握しています。

完全なセットアップガイドは [docs/SETUP.md](docs/SETUP.md) を参照してください。

## Gemini CLI連携

Hired Creative Opsは[Gemini CLI](https://github.com/google-gemini/gemini-cli)をネイティブにサポートしています -- Claude CodeやOpenCodeと同様の形です。すべてのスラッシュコマンドが利用可能で、同じ`modes/*.md`の評価ロジックを使用します。

### オプションA -- ネイティブGemini CLI（推奨）

```bash
# 1. Gemini CLIをインストール
npm install -g @google/gemini-cli
# または: npx @google/gemini-cli --version

# 2. 認証（無料 -- Googleアカウントを使用）
gemini auth

# 3. hiredcreative-opsディレクトリで実行
cd hiredcreative-ops
gemini

# 4. Claude Codeと同様にスラッシュコマンドを使用
/hiredcreative-ops "Senior Product Designer at Figma..."
/hiredcreative-ops-evaluate --file ./jds/figma.txt
/hiredcreative-ops-scan
/hiredcreative-ops-pdf
/hiredcreative-ops-tracker
```

`GEMINI.md`ファイルはコンテキストとして自動的に読み込まれます。すべてのコマンドは`.gemini/commands/*.toml`で定義されています。

### オプションB -- スタンドアロンAPIスクリプト（CLIインストール不要）

```bash
# 1. https://aistudio.google.com/apikey で無料のAPIキーを取得
cp .env.example .env
# .envを編集 → GEMINI_API_KEY=your_key_here を設定

# 2. 依存関係をインストール
npm install

# 3. 求人票を評価
node gemini-eval.mjs "We are looking for a Senior Product Designer..."
node gemini-eval.mjs --file ./jds/my-job.txt
npm run gemini:eval -- "JD text here"
```

> **無料枠:** どちらのオプションも課金なしで利用できます。ネイティブCLIはGoogle OAuthを使用し、APIスクリプトは`gemini-2.0-flash`を使用します（15 RPM、1日100万トークンまで無料）。

## 使い方

Hired Creative Opsは複数のモードを持つ単一のスラッシュコマンドです:

```
/hiredcreative-ops                → 利用可能なすべてのコマンドを表示
/hiredcreative-ops {求人票を貼る}  → 完全自動パイプライン（評価 + PDF + トラッカー）
/hiredcreative-ops scan           → ポータルをスキャンして新しい求人を探す（Hired Creativeを含む）
/hiredcreative-ops pdf            → ATS最適化CVを生成
/hiredcreative-ops batch          → 複数オファーをバッチ評価
/hiredcreative-ops tracker        → 応募ステータスを表示
/hiredcreative-ops apply          → AIで応募フォームを入力
/hiredcreative-ops pipeline       → 保留中のURLを処理
/hiredcreative-ops contacto       → LinkedInアウトリーチメッセージ
/hiredcreative-ops deep           → 企業の深掘りリサーチ
/hiredcreative-ops training       → コース/資格を評価
/hiredcreative-ops project        → ポートフォリオプロジェクトを評価
```

または、単に求人URLや記述を直接貼り付けるだけ -- Hired Creative Opsが自動検知してフルパイプラインを実行します。

## 仕組み

```
求人URLまたは記述を貼り付け
        │
        ▼
┌──────────────────┐
│  アーキタイプ    │  分類: クリエイティブディレクター / プロダクトデザイナー /
│  検出            │  ブランドデザイナー / モーション / コピーライター / デザインシステム
└────────┬─────────┘
         │
┌────────▼─────────┐
│  A-F 評価        │  マッチ度、ギャップ、報酬調査、STARストーリー
│  (cv.md +        │
│   ポートフォリオ)│
└────────┬─────────┘
         │
    ┌────┼────┐
    ▼    ▼    ▼
 レポート PDF トラッカー
  .md   .pdf   .tsv
```

## 事前設定済みポータル

スキャナーには、有名なデザイン先進企業・エージェンシーのスターターリストに加え、それ単体で22以上のソースをカバーする[Hired Creative](https://hiredcreative.com)との統合が事前設定されています。`templates/portals.example.yml`を`portals.yml`にコピーして、独自の企業を追加してください:

**エージェンシー/スタジオ:** IDEO、Pentagram、R/GA、AKQA、Instrument、Collins
**デザイン先進プロダクト企業:** Figma、Airbnb、Notion、Linear、Duolingo、Canva、Webflow、Spotify、Adobe、Mailchimp
**アグリゲーター:** Hired Creative (hiredcreative.com) -- Greenhouse、Ashby、Lever、Workable、Dribbble、WeWorkRemotely、Welcome to the Jungleなど、多数のソースを1つのフィードに集約

**検索対象の求人ボード:** Ashby、Greenhouse、Lever、Workable、RemoteOK、WeWorkRemotely、Himalayas、Dribbble Jobs

## ダッシュボードTUI

内蔵のターミナルダッシュボードで、パイプラインを視覚的に閲覧できます:

```bash
cd dashboard
go build -o hiredcreative-dashboard .
./hiredcreative-dashboard --path ..
```

機能: 6つのフィルタータブ、4つのソートモード、グループ表示/フラット表示、遅延読み込みプレビュー、インラインステータス変更。

## プロジェクト構成

```
hiredcreative-ops/
├── CLAUDE.md                    # エージェントの指示
├── cv.md                        # あなたのCV（自分で作成）
├── article-digest.md            # あなたの実績の裏付け（任意）
├── config/
│   └── profile.example.yml      # プロフィールのテンプレート
├── modes/                       # スキルモード
│   ├── _shared.md               # 共有コンテキスト（ここをカスタマイズ）
│   ├── oferta.md                # 単一オファー評価
│   ├── pdf.md                   # PDF生成
│   ├── scan.md                  # ポータルスキャナー
│   ├── batch.md                 # バッチ処理
│   └── ...
├── templates/
│   ├── cv-template.html         # ATS最適化CVテンプレート
│   ├── portals.example.yml      # スキャナー設定テンプレート
│   └── states.yml               # 正規ステータス
├── batch/
│   ├── batch-prompt.md          # 自己完結型ワーカープロンプト
│   └── batch-runner.sh          # オーケストレータースクリプト
├── dashboard/                   # Go製TUIパイプラインビューア
├── data/                        # 追跡データ（gitignore対象）
├── reports/                     # 評価レポート（gitignore対象）
├── output/                      # 生成PDF（gitignore対象）
├── fonts/                       # Space Grotesk + DM Sans
├── docs/                        # セットアップ、カスタマイズ、アーキテクチャ
└── examples/                    # サンプルCV、レポート、実績の裏付け
```

## 技術スタック

![Claude Code](https://img.shields.io/badge/Claude_Code-000?style=flat&logo=anthropic&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=flat&logo=playwright&logoColor=white)
![Go](https://img.shields.io/badge/Go-00ADD8?style=flat&logo=go&logoColor=white)
![Bubble Tea](https://img.shields.io/badge/Bubble_Tea-FF75B5?style=flat&logo=go&logoColor=white)

- **エージェント**: Claude Code（カスタムスキルとモード付き）
- **PDF**: Playwright/Puppeteer + HTMLテンプレート
- **スキャナー**: Playwright + Greenhouse API + WebSearch + Hired Creative API
- **ダッシュボード**: Go + Bubble Tea + Lipgloss（Catppuccin Mochaテーマ）
- **データ**: Markdownテーブル + YAML設定 + TSVバッチファイル

## アップストリーム

Hired Creative Opsは、Santiago Fernández de Valderrama氏（[santifer.io](https://santifer.io)）による[career-ops](https://github.com/santifer/career-ops)のフォークです。同氏はcareer-opsを構築し、740件以上の求人オファーを評価し、100件以上のテーラーメイドCVを生成し、Head of Applied AIのポジションを獲得しました。本フォークは同じエンジンを維持しつつ、デフォルト設定・サンプル・求人ソースをクリエイティブ業界向けに再設計しています。

## このフォークについて

[yashimosh](https://yashimosh.com)（クリエイティブディレクター）がメンテナンスしています。自身の求職活動のために構築し、その後、他のクリエイティブ職の人々がフォークして自分のものにできるようオープンソース化しました -- アップストリームプロジェクトと同じ精神です。

## Star History

<a href="https://www.star-history.com/?repos=yashimosh%2Fhiredcreative-ops&type=timeline&legend=top-left">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=yashimosh/hiredcreative-ops&type=timeline&theme=dark&legend=top-left" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=yashimosh/hiredcreative-ops&type=timeline&legend=top-left" />
   <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=yashimosh/hiredcreative-ops&type=timeline&legend=top-left" />
 </picture>
</a>

## 免責事項

**hiredcreative-opsはローカルで動作するオープンソースツールです — ホステッドサービスではありません。** 本ソフトウェアを使用することにより、以下を承諾したものとみなされます:

1. **データはあなたが管理します。** CV、連絡先、個人情報はあなたのマシン上にとどまり、あなたが選択したAIプロバイダー（Anthropic、OpenAIなど）に直接送信されます。当方はあなたのデータを収集、保存、アクセスすることは一切ありません。
2. **AIはあなたが管理します。** デフォルトのプロンプトはAIに応募の自動送信を行わないよう指示していますが、AIモデルは予測できない挙動をする場合があります。プロンプトを変更したり、別のモデルを使用する場合は自己責任でお願いします。**送信前に必ずAI生成コンテンツの正確性を確認してください。**
3. **第三者の利用規約を遵守してください。** 本ツールは、あなたが操作する求人ポータル（Greenhouse、Lever、Workday、LinkedInなど）の利用規約に従って使用する必要があります。本ツールを使って雇用主にスパムを送ったり、ATSシステムに過負荷をかけたりしてはいけません。
4. **保証はありません。** 評価はあくまで推奨であり、真実ではありません。AIモデルはスキルや経験を幻覚（ハルシネーション）する可能性があります。作成者は雇用結果、応募の不採用、アカウント制限、その他いかなる結果についても責任を負いません。

詳細は [LEGAL_DISCLAIMER.md](LEGAL_DISCLAIMER.md) を参照してください。本ソフトウェアは [MITライセンス](LICENSE) のもと「現状のまま」提供され、いかなる保証もありません。

## コントリビューター

hiredcreative-opsを使って採用されましたか？ [あなたのストーリーをシェアしてください！](https://github.com/yashimosh/hiredcreative-ops/issues/new?template=i-got-hired.yml)

このフォークを作っている人々については [CONTRIBUTORS.md](CONTRIBUTORS.md) を、その土台となっているエンジンについては [アップストリームcareer-opsのコントリビューター](https://github.com/santifer/career-ops/graphs/contributors) をご覧ください。

## ライセンス

MIT

## つながりましょう

[![Website](https://img.shields.io/badge/yashimosh.com-000?style=for-the-badge&logo=safari&logoColor=white)](https://yashimosh.com)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/yashimosh)
[![X](https://img.shields.io/badge/X-000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/yashimosh_)
