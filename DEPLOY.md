# Vercel デプロイガイド

## 2つのバージョン

このプロジェクトは2つのバージョンを別々のURLでデプロイします：

1. **AI不使用版** (`main`ブランチ) - 現在完成
2. **AI使用版** (`with-ai`ブランチ) - 次のステップで作成

## STEP 1: GitHubにリポジトリを作成

### 1-1. GitHubで新規リポジトリを作成

https://github.com/new にアクセスして：

- Repository name: `ai-kuse-lab`
- Description: `AIクセ体験ラボ - 生成AI講座用の体験型Webアプリ`
- Public または Private
- ✅ **Add a README は選択しない**（既にREADME.mdがあるため）
- Create repository

### 1-2. ローカルからプッシュ

GitHubで表示されるコマンドを実行：

```bash
# リモートリポジトリを追加
git remote add origin https://github.com/YOUR_USERNAME/ai-kuse-lab.git

# mainブランチにプッシュ
git push -u origin main
```

## STEP 2: Vercel で AI不使用版をデプロイ

### 2-1. Vercelにログイン

https://vercel.com にアクセスしてログイン

### 2-2. 新規プロジェクトを作成

1. 「Add New...」→「Project」
2. GitHubリポジトリ `ai-kuse-lab` をインポート
3. Configure Project:
   - **Project Name**: `ai-kuse-lab`（AI不使用版）
   - **Framework Preset**: Next.js（自動検出）
   - **Root Directory**: `./`（デフォルト）
   - **Build Command**: `npm run build`（デフォルト）
   - **Output Directory**: `.next`（デフォルト）
4. 「Deploy」ボタンをクリック

### 2-3. デプロイ完了

数分後、以下のようなURLでデプロイされます：

```
https://ai-kuse-lab.vercel.app
```

または

```
https://ai-kuse-lab-your-username.vercel.app
```

## STEP 3: AI使用版のブランチを作成

ローカルで以下のコマンドを実行：

```bash
# with-ai ブランチを作成
git checkout -b with-ai

# GitHubにプッシュ
git push -u origin with-ai
```

## STEP 4: Vercel で AI使用版をデプロイ

### 4-1. 新規プロジェクトを作成（2つ目）

1. Vercelで「Add New...」→「Project」
2. 同じGitHubリポジトリ `ai-kuse-lab` を選択
3. Configure Project:
   - **Project Name**: `ai-kuse-lab-ai`（AI使用版）
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Git Branch**: `with-ai`（重要！）
   - **Environment Variables**: AI APIキーを追加
     ```
     GEMINI_API_KEY=your_api_key_here
     ```
4. 「Deploy」ボタンをクリック

### 4-2. デプロイ完了

AI使用版は以下のようなURLでデプロイされます：

```
https://ai-kuse-lab-ai.vercel.app
```

## 環境変数の設定（AI使用版のみ）

AI使用版では、Gemini APIキーが必要です。

### Vercel Dashboard で設定

1. プロジェクト `ai-kuse-lab-ai` を選択
2. 「Settings」→「Environment Variables」
3. 以下を追加：
   - **Name**: `GEMINI_API_KEY`
   - **Value**: あなたのAPIキー
   - **Environment**: Production, Preview, Development
4. 「Save」

## デプロイ後の更新

### AI不使用版を更新

```bash
git checkout main
# 変更を加える
git add .
git commit -m "更新内容"
git push origin main
```

→ Vercelが自動的に `ai-kuse-lab.vercel.app` を再デプロイ

### AI使用版を更新

```bash
git checkout with-ai
# 変更を加える
git add .
git commit -m "更新内容"
git push origin with-ai
```

→ Vercelが自動的に `ai-kuse-lab-ai.vercel.app` を再デプロイ

## 両方のバージョンに共通の変更を反映

```bash
# mainで変更
git checkout main
# 変更を加える
git add .
git commit -m "共通機能の更新"
git push origin main

# with-aiにマージ
git checkout with-ai
git merge main
git push origin with-ai
```

## カスタムドメインの設定（オプション）

Vercelで独自ドメインを設定できます：

1. プロジェクトの「Settings」→「Domains」
2. ドメインを追加：
   - AI不使用版: `lab.example.com`
   - AI使用版: `lab-ai.example.com`

## トラブルシューティング

### ビルドエラー

- Vercelのビルドログを確認
- ローカルで `npm run build` が成功するか確認

### 環境変数が反映されない

- Vercel Dashboard で環境変数を再確認
- プロジェクトを再デプロイ（Deployments → 最新のデプロイ → Redeploy）

### ブランチが自動デプロイされない

- Vercel プロジェクトの「Settings」→「Git」で該当ブランチが有効か確認

## まとめ

| バージョン | ブランチ | Vercel プロジェクト名 | URL例 |
|----------|---------|---------------------|------|
| AI不使用版 | `main` | `ai-kuse-lab` | `ai-kuse-lab.vercel.app` |
| AI使用版 | `with-ai` | `ai-kuse-lab-ai` | `ai-kuse-lab-ai.vercel.app` |

両方のバージョンは独立してデプロイ・管理されます。
