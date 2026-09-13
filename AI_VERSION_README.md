# AI使用版 セットアップガイド

## このバージョンについて

このブランチ（`with-ai`）は、Gemini APIを使用したAI実験を含むバージョンです。

## 主な追加機能

### 実装済み
- ✅ ハルシネーション実験
  - AIに存在しない情報について質問
  - AIの「知ったかぶり」を体験
  - もっともらしい嘘を見抜く重要性を学ぶ

### 今後追加予定
- コンテキスト長の制限実験
- プロンプト依存性実験
- バイアス実験

## セットアップ手順

### 1. Gemini APIキーの取得

1. [Google AI Studio](https://makersuite.google.com/app/apikey) にアクセス
2. 「Get API Key」をクリック
3. APIキーをコピー

### 2. 環境変数の設定

```bash
# .env.local ファイルを作成
cp .env.local.example .env.local

# .env.local を編集してAPIキーを設定
# GEMINI_API_KEY=your_actual_api_key_here
```

### 3. 依存関係のインストール

```bash
npm install
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

http://localhost:3000 でアクセス

### 5. AI実験の動作確認

1. TOPページから「体験をはじめる」
2. 記憶の実験を完了
3. 「AIのハルシネーションを体験」をクリック
4. AI実験が正常に動作するか確認

## Vercelへのデプロイ

### 環境変数の設定

Vercel Dashboard で以下の環境変数を設定：

| 変数名 | 値 | 環境 |
|-------|-----|------|
| `GEMINI_API_KEY` | あなたのAPIキー | Production, Preview, Development |

### デプロイ手順

1. GitHubに `with-ai` ブランチをプッシュ
   ```bash
   git push -u origin with-ai
   ```

2. Vercelで新規プロジェクトを作成
   - Project Name: `ai-kuse-lab-ai`
   - Git Branch: `with-ai`
   - Environment Variables: `GEMINI_API_KEY` を設定

3. Deploy

## API使用量の管理

### 無料枠
- Gemini API（gemini-1.5-flash）は無料枠があります
- 詳細: https://ai.google.dev/pricing

### コスト管理
- Google Cloud Console で使用量を監視
- 必要に応じてレート制限を設定
- 本番環境では適切なエラーハンドリングを実装

## トラブルシューティング

### API_KEY_NOT_SET エラー
- `.env.local` ファイルが正しく作成されているか確認
- ファイル名が `.env.local` であることを確認（`.env.local.example` ではない）
- 開発サーバーを再起動

### AI実験でエラーが発生
1. ブラウザのコンソールでエラーを確認
2. APIキーが有効か確認
3. Google AI Studioで使用量を確認
4. ネットワーク接続を確認

### Vercelでビルドエラー
- 環境変数が正しく設定されているか確認
- ローカルで `npm run build` が成功するか確認

## セキュリティ

### 重要
- ❌ `.env.local` をGitにコミットしない
- ❌ APIキーをコードに直接書かない
- ✅ サーバーサイド（API Routes）でのみAPIキーを使用
- ✅ クライアントサイドからは `/api/ai/*` を経由

### .gitignore
`.env*` は既に `.gitignore` に含まれています。

## 開発者向けメモ

### AI関連ファイル
- `lib/ai.ts` - Gemini API のラッパー関数
- `app/api/ai/*` - API Routes
- `app/ai-experiment/*` - AI実験ページ

### 新しいAI実験の追加

1. `lib/ai.ts` に実験用の関数を追加
2. `app/api/ai/[experiment-name]/route.ts` を作成
3. `app/ai-experiment/[experiment-name]/page.tsx` を作成
4. `lib/experiments.ts` に実験定義を追加

## 2つのバージョンの管理

| バージョン | ブランチ | 含まれる実験 | API使用 |
|----------|---------|------------|--------|
| 基本版 | `main` | 記憶のクセ | なし |
| AI版 | `with-ai` | 記憶のクセ + AIのクセ | Gemini API |

### 共通機能の更新

```bash
# mainで共通機能を更新
git checkout main
git add .
git commit -m "共通機能の更新"
git push origin main

# with-aiにマージ
git checkout with-ai
git merge main
git push origin with-ai
```

## まとめ

このAI使用版では、参加者が：

1. **人間のクセ**を体験（記憶の実験）
2. **AIのクセ**を体験（ハルシネーション実験）
3. **両者の違い**を理解

という流れで、生成AIの特性を実感的に学べます。
