# AIクセ体験ラボ

生成AI講座で使用する体験型Webアプリケーションです。

## アプリ概要

このアプリは、生成AI研修の導入コンテンツとして、参加者に以下の気づきを提供します：

1. **人間のクセを体験** - 記憶の系列位置効果や孤立効果を通じて、人間自身の認知のクセを実感
2. **AIのクセへの接続** - 人間にクセがあるなら、AIにもクセがあるのでは？という問いを自然に生み出す

### 実装済みの実験

- **系列位置効果**：12個の単語を記憶してもらい、最初と最後が覚えやすく、真ん中が忘れやすい傾向を体験
- **孤立効果**：仲間外れの単語が記憶に残りやすいことを体験

### 今後追加予定

- AI実験（ハルシネーション、バイアス、コンテキスト依存性など）
- 講師モード（参加者全体の結果集計・表示）
- データベース連携

## 技術構成

- **Next.js 16.3.5** - App Router
- **React 19.2.8**
- **TypeScript 5**
- **Tailwind CSS 4**
- **Recharts 3.10.1** - グラフ表示
- **localStorage** - 実験結果の保存（MVP）

## ローカル起動方法

### 前提条件

- Node.js 20以上
- npm

### セットアップ

```bash
# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## ビルド方法

```bash
# 本番用ビルド
npm run build

# ビルドしたアプリを起動
npm start
```

## Vercelデプロイ方法

### 方法1: GitHubと連携（推奨）

1. このプロジェクトをGitHubにプッシュ
2. [Vercel](https://vercel.com)にログイン
3. 「New Project」→ GitHubリポジトリをインポート
4. デプロイ設定はデフォルトのまま「Deploy」

### 方法2: Vercel CLIを使用

```bash
# Vercel CLIをインストール
npm i -g vercel

# デプロイ
vercel

# 本番環境へデプロイ
vercel --prod
```

## ディレクトリ構成

```
.
├── app/                      # Next.js App Router
│   ├── page.tsx             # TOPページ
│   ├── select/              # 実験選択ページ
│   ├── experiment/[id]/     # 実験ページ（動的ルート）
│   ├── coming-soon/         # Coming Soonページ
│   ├── layout.tsx           # ルートレイアウト
│   └── globals.css          # グローバルスタイル
├── components/              # UIコンポーネント
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── ExperimentCard.tsx
│   ├── MemoryDisplay.tsx    # 単語表示コンポーネント
│   ├── AnswerInput.tsx      # 回答入力コンポーネント
│   └── ResultChart.tsx      # 結果グラフコンポーネント
├── lib/                     # ビジネスロジック
│   ├── types.ts             # 型定義
│   ├── experiments.ts       # 実験データ・ロジック
│   ├── storage.ts           # localStorage管理
│   └── utils.ts             # ユーティリティ関数
└── public/                  # 静的ファイル
```

## 実験追加方法

### 1. 型定義を拡張

`lib/types.ts`の`ExperimentType`に新しい実験タイプを追加：

```typescript
export type ExperimentType = "serial-position" | "isolation" | "your-new-experiment";
```

### 2. 実験データを追加

`lib/experiments.ts`に新しい実験定義を追加：

```typescript
export const experiments: ExperimentDefinition[] = [
  // 既存の実験...
  {
    id: "your-new-experiment",
    name: "新しい実験名",
    description: "実験の説明",
    type: "your-new-experiment",
  },
];
```

### 3. 実験ロジックを実装

`app/experiment/[id]/page.tsx`に新しい実験のフェーズとロジックを追加。

### 4. 必要に応じてコンポーネントを作成

実験固有のUIが必要な場合は、`components/`に新しいコンポーネントを作成。

## 将来のAI API追加ポイント

### API Route の追加

将来的にAI機能を追加する場合、以下のようなAPI Routeを作成：

```typescript
// app/api/ai/analyze/route.ts
export async function POST(request: Request) {
  const { experimentData } = await request.json();
  
  // Gemini API等を使用した分析
  const response = await fetch('https://api.gemini.com/...', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`,
    },
    body: JSON.stringify(experimentData),
  });
  
  return Response.json(await response.json());
}
```

### 環境変数の設定

`.env.local`ファイルを作成：

```env
GEMINI_API_KEY=your_api_key_here
```

Vercelでは、プロジェクト設定 → Environment Variables からキーを設定。

### AI実験の実装

1. `lib/experiments.ts`にAI実験用のデータを追加
2. `components/`にAI実験用のコンポーネントを作成
3. `app/experiment/[id]/page.tsx`でAI実験のフェーズを実装
4. API Routeを通じてAIと通信

## データベース追加の準備

将来的にSupabase等のデータベースを追加する場合：

1. Supabaseプロジェクトを作成
2. 以下のようなテーブルを作成：
   - `sessions`: 実験セッション
   - `results`: 実験結果
   - `users`: 参加者（講師モード用）

3. `lib/storage.ts`をデータベース版に拡張：

```typescript
// localStorage版とDB版を共存させる
export async function saveSessionToDB(session: ExperimentSession) {
  const { data, error } = await supabase
    .from('sessions')
    .insert([session]);
  
  if (error) throw error;
  return data;
}
```

## 開発時の注意事項

- スマートフォンファーストで設計されています
- `prefers-reduced-motion`に対応しています
- localStorageが利用できない環境でもエラーが出ないように設計
- 回答の正規化ロジック(`lib/utils.ts`)は拡張可能です

## ライセンス

このプロジェクトは生成AI講座用の教材として作成されています。

## サポート

問題が発生した場合は、GitHubのIssuesで報告してください。
