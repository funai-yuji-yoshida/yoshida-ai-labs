# 開発メモ

## 実装完了事項

### STEP 1: プロジェクト構成
✅ Next.js 16.3.5 + TypeScript + Tailwind CSS + Recharts で構築
✅ Vercelへのデプロイに対応した構成

### STEP 2-3: 基本ページと系列位置効果
✅ TOPページ（グラデーション背景、AIクセ体験ラボのタイトル）
✅ 実験選択ページ（カード形式で2つの実験を表示）
✅ 系列位置効果の完全実装
  - 実験説明
  - 12単語の順次表示（1.5秒/単語）
  - 回答入力（複数区切り文字対応）
  - 回答の正規化処理

### STEP 4: 結果グラフ
✅ Rechartsを使用した棒グラフ
✅ 位置ごとの正解/不正解の可視化
✅ レスポンシブ対応

### STEP 5: 振り返り・解説
✅ 振り返り選択肢（複数選択可能）
✅ 系列位置効果の解説（初頭効果・新近効果）
✅ AIへの接続（「AIにもクセがあるか？」という問い）

### STEP 6: 孤立効果
✅ 11個の同カテゴリ単語 + 1個の孤立語
✅ 孤立語を2-11番目にランダム配置
✅ 通常語と孤立語の正答率比較グラフ
✅ 孤立効果の解説

### STEP 7: UI/UX調整
✅ スマートフォンファーストデザイン
✅ 大きな文字とタップしやすいボタン
✅ グラデーション背景
✅ カード型UI
✅ 実験中の余計な情報を非表示

### STEP 8: エラー処理
✅ localStorageが利用できない場合の対応
✅ 空の回答への対応
✅ 不正なexperimentIdのハンドリング
✅ try-catchによるエラーキャッチ

### STEP 9: 品質チェック
✅ TypeScriptエラーなし
✅ ESLint準拠
✅ npm run build 成功
✅ すべてのページが正常にビルド

### STEP 10: README
✅ アプリ概要
✅ 技術構成
✅ ローカル起動方法
✅ ビルド・デプロイ方法
✅ ディレクトリ構成
✅ 実験追加方法
✅ AI API追加ポイント

## 仕様からの変更点

特になし。すべての要件を実装済み。

## 技術的な実装詳細

### 単語のランダム化

系列位置効果実験：
- WordSet内の単語をシャッフル
- 表示順序をsession.displayedWordsに保存

孤立効果実験：
- 最後の単語を孤立語として扱う
- 孤立語を除いた通常語をシャッフル
- 孤立語を2-11番目のランダムな位置に挿入
- 孤立語の位置をresultsのisIsolatedフラグで記録

### 回答の正規化

以下の処理を実施：
- 前後の空白削除
- 全角・半角の統一
- 英字の大文字・小文字統一
- ひらがなをカタカナに変換
- 全角英数字を半角に変換
- 重複除去

### localStorage管理

- セッションIDを自動生成
- 全セッションを配列で保存
- 実験結果を自動保存
- localStorageが利用できない場合はconsole.warn

## 今後の拡張ポイント

### AI実験の追加

将来的に以下のAI実験を追加予定：
1. ハルシネーション実験
2. コンテキスト依存性
3. プロンプト依存性
4. バイアス
5. 過信

実装方針：
- `lib/experiments.ts`に実験定義を追加
- `components/`にAI実験用コンポーネントを作成
- API Routes (`app/api/ai/`)でAI APIと通信
- Gemini API等を使用

### 講師モード

実装予定：
- 参加者全体の結果集計
- 系列位置ごとの平均正答率
- リアルタイム表示
- QRコードによる参加
- プロジェクター向け画面

必要な変更：
- データベース導入（Supabase等）
- セッション管理
- リアルタイム通信（WebSocket等）

### データベース移行

Supabaseを使用する場合のテーブル設計：

```sql
-- sessions テーブル
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  experiment_id TEXT NOT NULL,
  word_set_id TEXT NOT NULL,
  started_at TIMESTAMP NOT NULL,
  completed_at TIMESTAMP,
  displayed_words JSONB NOT NULL,
  answers JSONB,
  results JSONB,
  phase TEXT NOT NULL
);

-- users テーブル（講師モード用）
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## パフォーマンス最適化

現状の構成：
- 静的ページ: `/`, `/select`, `/coming-soon`
- 動的ページ: `/experiment/[id]`

将来的な最適化：
- 実験結果画像のキャッシュ
- グラフのSVG出力
- Web Vitalsの監視

## アクセシビリティ

実装済み：
- キーボード操作可能
- 十分な文字サイズ
- 色だけで判断させない（○×マークも表示）
- prefers-reduced-motion対応

## セキュリティ

現状：
- 個人情報を収集しない
- APIキーなし
- localStorage のみ使用

将来的な考慮事項：
- AI APIキーは環境変数で管理
- CSRFトークン（講師モード導入時）
- レート制限（API使用時）

## ブラウザサポート

対応ブラウザ：
- Chrome/Edge（最新版）
- Safari（最新版）
- Firefox（最新版）
- モバイルブラウザ（iOS Safari, Chrome Mobile）

## 既知の制限事項

1. localStorageのみなので、ブラウザ間でデータ共有不可
2. プライベートブラウジングでlocalStorageが使えない場合がある
3. 1人分のデータなので統計的な分析は不可

これらは将来のデータベース導入で解決予定。

## テスト計画（今後）

必要なテスト：
- [ ] ユニットテスト（正規化関数、評価関数）
- [ ] E2Eテスト（実験の完走）
- [ ] スマートフォン実機テスト
- [ ] アクセシビリティテスト
- [ ] パフォーマンステスト

## デプロイチェックリスト

- [x] `npm run build` 成功
- [x] TypeScriptエラーなし
- [x] ESLintエラーなし
- [ ] 本番環境でスマートフォン実機テスト
- [ ] 本番環境でPC実機テスト
- [ ] Lighthouseスコア確認
- [ ] 実験の完走テスト

## 開発者向けメモ

### 新しい実験を追加する手順

1. `lib/types.ts`に実験タイプを追加
2. `lib/experiments.ts`に実験定義とWordSetを追加
3. `components/`に必要なコンポーネントを作成
4. `app/experiment/[id]/page.tsx`に実験フェーズを実装
5. 結果グラフ用のコンポーネントを作成または拡張
6. README.mdを更新

### コンポーネントの責務

- `Button`, `Card`: 汎用UIコンポーネント
- `ExperimentCard`: 実験選択カード
- `MemoryDisplay`: 単語表示（タイマー管理）
- `AnswerInput`: 回答入力
- `ResultChart`: 結果グラフ（Recharts）

### 状態管理

現在はuseStateのみ。
将来的に複雑になったら、Zustandやjotai等を検討。

## 変更履歴

- 2026-09-13: 初版リリース（MVP）
