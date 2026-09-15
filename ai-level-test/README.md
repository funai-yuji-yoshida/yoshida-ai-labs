# AI活用成熟度診断アプリ

個人と組織のAI活用レベルを5段階で診断し、推奨アクションを提示するWebアプリケーションです。

## 機能

- **個人診断（20問）**: AIリテラシー、AI操作力、業務活用力、業務設計力、価値創造力の5軸で評価
- **組織診断（15問）**: 導入、利用、業務組込み、データ・仕組み、経営活用の5項目で評価
- **5段階レベル判定**: Lv.1「知る」〜Lv.5「変革する」
- **可視化**: レーダーチャートで5軸のスコアを表示
- **分析**: 強み・弱み、ギャップ分析を提供
- **推奨アクション**: レベルとギャップに応じた具体的なアクションを提示
- **PDF出力**: 診断結果をPDFでダウンロード可能
- **データ保存**: localStorageで診断履歴を保存

## 技術スタック

- **Next.js 16.3.5** (App Router)
- **React 19.2.8**
- **TypeScript 5**
- **Tailwind CSS 4**
- **Recharts 2.15** (チャートライブラリ)
- **localStorage** (データ永続化)

## セットアップ

### 必要な環境

- Node.js 20以上

### インストール

```bash
npm install --legacy-peer-deps
```

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:3001 を開きます。

### ビルド

```bash
npm run build
npm start
```

## プロジェクト構造

```
ai-level-test/
├── app/                      # Next.js App Router
│   ├── page.tsx             # トップページ
│   ├── assessment/          # 診断ページ
│   ├── result/              # 結果ページ
│   ├── layout.tsx           # ルートレイアウト
│   └── globals.css          # グローバルスタイル
├── components/
│   ├── ui/                  # 基本UIコンポーネント
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── ProgressBar.tsx
│   └── assessment/          # 診断関連コンポーネント
│       └── QuestionCard.tsx
├── contexts/
│   └── AssessmentContext.tsx # 診断状態管理
├── lib/
│   ├── types.ts             # 型定義
│   ├── questions.ts         # 質問データ
│   ├── scoring.ts           # スコアリングロジック
│   ├── recommendations.ts   # 推奨アクション
│   └── storage.ts           # localStorage管理
├── package.json
└── README.md
```

## 使い方

1. **トップページ**: 「診断を開始する」をクリック
2. **基本情報入力**: 名前を入力（任意）
3. **個人診断**: 20問に5段階で回答（ステップ2〜5）
4. **組織診断**: 15問に5段階で回答（ステップ6〜8）
5. **結果表示**: レベル、チャート、推奨アクションを確認
6. **PDF出力**: 「PDFでダウンロード」をクリック

## レベル定義

- **Lv.1 知る**: AIの基本・特性・リスクを理解
- **Lv.2 使う**: 日常業務でAIを利用
- **Lv.3 改善する**: 自分の業務をAIで効率化・高度化
- **Lv.4 設計する**: AIを組み込んだ業務プロセスを設計
- **Lv.5 変革する**: AIで顧客価値・事業・組織を変革

## ライセンス

Private

## 作成者

AI Level Test Development Team
