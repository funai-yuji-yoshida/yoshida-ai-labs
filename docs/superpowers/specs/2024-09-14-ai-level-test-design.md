# AI活用成熟度診断アプリ 設計書

**作成日:** 2024-09-14  
**プロジェクト名:** AI Level Test (ai-level-test)  
**目的:** 従業員個人と組織のAI活用状況を5段階で診断し、現在のレベル、強み・弱み、ギャップ、推奨アクションを可視化する

---

## 1. プロジェクト概要

### 1.1 目的と背景

AI活用成熟度診断アプリは、「AIを知っているか」ではなく「AIで仕事・組織をどこまで変えられるか」を測定するための診断ツールです。

**主要な価値提供:**
- 個人のAI活用レベルを5段階で可視化
- 組織のAI活用レベルを5段階で可視化
- 個人と組織のギャップを分析
- 次に取り組むべき推奨アクションを提示
- 研修前後の成長を測定可能

### 1.2 MVP範囲

**実装する機能:**
- 個人診断（20問）
- 組織診断（15問）
- ステップ形式の診断UI（プログレスバー付き）
- 結果画面（レベル、チャート、分析、推奨アクション）
- PDF出力機能
- 簡易的な診断履歴一覧

**後回しにする機能:**
- データベース連携（まずはlocalStorage）
- 詳細な管理者機能（質問編集、部門別比較など）
- AI生成による推奨アクション

### 1.3 配置

```
AI_apps/
├── (既存のAIクセ体験ラボ)
└── ai-level-test/          ← 新規独立プロジェクト
    ├── package.json
    ├── app/
    └── ...
```

完全に独立したNext.jsプロジェクトとして実装。

---

## 2. 技術スタック

- **Next.js 16.3.5** (App Router)
- **React 19.2.8**
- **TypeScript 5**
- **Tailwind CSS 4**
- **Tremor** (チャートライブラリ)
- **localStorage** (データ保存、後でDB移行予定)

---

## 3. プロジェクト構造

```
ai-level-test/
├── app/
│   ├── page.tsx                    # トップページ
│   ├── assessment/
│   │   └── page.tsx                # 診断画面（ステップ形式）
│   ├── result/
│   │   └── page.tsx                # 結果画面
│   ├── history/
│   │   └── page.tsx                # 診断履歴一覧
│   ├── layout.tsx                  # ルートレイアウト
│   └── globals.css                 # グローバルスタイル
├── components/
│   ├── ui/                         # 基本UIコンポーネント
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── ProgressBar.tsx
│   ├── assessment/                 # 診断関連
│   │   ├── QuestionCard.tsx        # 質問カード
│   │   └── StepIndicator.tsx      # ステップインジケーター
│   └── result/                     # 結果表示関連
│       ├── LevelBadge.tsx          # レベル表示
│       ├── RadarChart.tsx          # レーダーチャート
│       ├── MatrixChart.tsx         # 個人×組織マトリクス
│       ├── GapAnalysis.tsx         # ギャップ分析
│       ├── Recommendations.tsx     # 推奨アクション
│       └── StrengthWeakness.tsx    # 強み・弱み
├── lib/
│   ├── types.ts                    # 型定義
│   ├── questions.ts                # 質問データ
│   ├── scoring.ts                  # スコアリングロジック
│   ├── recommendations.ts          # 推奨アクション生成
│   └── storage.ts                  # localStorage管理
├── contexts/
│   └── AssessmentContext.tsx       # 診断状態管理
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

### 主要な設計判断

1. **App Router使用** - 最新のNext.js機能を活用
2. **コンポーネント分割** - 機能ごとにディレクトリ分け（ui/assessment/result）
3. **Context API** - 診断中の状態管理はシンプルにContext
4. **lib/で分離** - ビジネスロジックとUIを分離

---

## 4. データモデル

### 4.1 TypeScript型定義 (`lib/types.ts`)

```typescript
// 評価軸
export type AssessmentAxis = 
  | 'literacy'      // AIリテラシー
  | 'operation'     // AI操作力
  | 'application'   // 業務活用力
  | 'design'        // 業務設計力
  | 'innovation';   // 価値創造力

// 組織評価項目
export type OrganizationCategory =
  | 'adoption'      // 導入
  | 'usage'         // 利用
  | 'integration'   // 業務組込み
  | 'infrastructure' // データ・仕組み
  | 'management';   // 経営活用

// 質問タイプ
export type QuestionType = 'personal' | 'organization';

// 質問データ
export interface Question {
  id: string;
  type: QuestionType;
  category: AssessmentAxis | OrganizationCategory;
  text: string;
  order: number;
}

// 回答データ（1-5のスケール）
export interface Answer {
  questionId: string;
  score: 1 | 2 | 3 | 4 | 5;
}

// 基本情報
export interface BasicInfo {
  name?: string;  // 任意
  timestamp: number;
}

// 診断結果
export interface AssessmentResult {
  id: string;  // UUID
  basicInfo: BasicInfo;
  personalAnswers: Answer[];
  organizationAnswers: Answer[];
  
  // 計算済みスコア
  personalLevel: 1 | 2 | 3 | 4 | 5;
  organizationLevel: 1 | 2 | 3 | 4 | 5;
  
  // 5軸スコア（個人）
  axisScores: {
    literacy: number;
    operation: number;
    application: number;
    design: number;
    innovation: number;
  };
  
  // 組織スコア
  orgScores: {
    adoption: number;
    usage: number;
    integration: number;
    infrastructure: number;
    management: number;
  };
  
  createdAt: string;  // ISO 8601
}
```

### 4.2 localStorage構造

**キー:** `ai-level-test:assessments`  
**値:** `AssessmentResult[]`

```json
{
  "ai-level-test:assessments": [
    {
      "id": "uuid-1",
      "basicInfo": { "name": "山田太郎", "timestamp": 1726290000000 },
      "personalAnswers": [...],
      "organizationAnswers": [...],
      "personalLevel": 3,
      "organizationLevel": 2,
      "axisScores": { ... },
      "orgScores": { ... },
      "createdAt": "2024-09-14T10:00:00Z"
    }
  ]
}
```

### 4.3 storage.ts の主要関数

```typescript
// 診断結果を保存
saveAssessment(result: AssessmentResult): void

// 全診断結果を取得
getAssessments(): AssessmentResult[]

// IDで特定の診断結果を取得
getAssessmentById(id: string): AssessmentResult | null

// 診断結果を削除
deleteAssessment(id: string): void
```

**設計判断:**
1. **シンプルな配列構造** - localStorageなので複雑なリレーションは不要
2. **計算済みスコアも保存** - 再計算不要、表示が高速
3. **ISO 8601形式** - 日時は標準形式で保存

---

## 5. 診断フロー

### 5.1 画面遷移

```
[トップページ /]
    ↓ 「診断を開始」ボタン
[診断画面 /assessment]
    ├─ ステップ1: 基本情報（氏名入力）
    ├─ ステップ2-5: 個人診断（20問、5問ずつ表示）
    └─ ステップ6-8: 組織診断（15問、5問ずつ表示）
    ↓ 「診断結果を見る」ボタン
[結果画面 /result]
    └─ PDFダウンロード可能
```

### 5.2 ステップ構成（全8ステップ）

| ステップ | 内容 | 質問数 |
|---------|------|--------|
| 1 | 基本情報入力 | - |
| 2 | AIリテラシー(4問) + AI操作力(1問) | 5問 |
| 3 | AI操作力(3問) + 業務活用力(2問) | 5問 |
| 4 | 業務活用力(2問) + 業務設計力(3問) | 5問 |
| 5 | 業務設計力(1問) + 価値創造力(4問) | 5問 |
| 6 | 導入(3問) + 利用(2問) | 5問 |
| 7 | 利用(1問) + 業務組込み(3問) + データ・仕組み(1問) | 5問 |
| 8 | データ・仕組み(2問) + 経営活用(3問) | 5問 |

### 5.3 状態管理（AssessmentContext）

```typescript
interface AssessmentState {
  currentStep: number;          // 1-8
  totalSteps: number;           // 8
  basicInfo: BasicInfo;
  answers: Answer[];
  isComplete: boolean;
}

interface AssessmentContextValue {
  state: AssessmentState;
  
  // アクション
  setBasicInfo: (info: BasicInfo) => void;
  answerQuestion: (questionId: string, score: 1|2|3|4|5) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
  submitAssessment: () => AssessmentResult;
}
```

### 5.4 プログレスバー

```typescript
// 進捗率の計算
function calculateProgress(currentStep: number, totalSteps: number): number {
  return Math.round((currentStep / totalSteps) * 100);
}

// 例: ステップ3/8 → 37.5% → 38%
```

**設計判断:**
1. **8ステップ構成** - 長すぎず短すぎず、各5問ずつで集中力を保つ
2. **Context API** - グローバルな状態管理で各ステップから参照可能
3. **戻るボタン対応** - prevStep()で前のステップに戻れる
4. **進捗の可視化** - プログレスバーで完了度を表示

---

## 6. スコアリングロジック

### 6.1 各軸のスコア計算

```typescript
function calculateAxisScore(answers: Answer[], axis: AssessmentAxis): number {
  const axisAnswers = answers.filter(a => 
    getQuestionById(a.questionId).category === axis
  );
  const sum = axisAnswers.reduce((acc, a) => acc + a.score, 0);
  return sum / axisAnswers.length; // 例: 3.75
}
```

### 6.2 総合レベル判定

仕様書に基づき、**平均スコアだけでなく最低スコアも考慮**する：

```typescript
function calculatePersonalLevel(axisScores: AxisScores): 1|2|3|4|5 {
  const average = Object.values(axisScores).reduce((a, b) => a + b) / 5;
  const minScore = Math.min(...Object.values(axisScores));
  
  // レベル5: 平均4.5以上 かつ 全軸4.0以上
  if (average >= 4.5 && minScore >= 4.0) return 5;
  
  // レベル4: 平均3.5以上 かつ 全軸3.0以上
  if (average >= 3.5 && minScore >= 3.0) return 4;
  
  // レベル3: 平均2.5以上 かつ 全軸2.0以上
  if (average >= 2.5 && minScore >= 2.0) return 3;
  
  // レベル2: 平均1.5以上
  if (average >= 1.5) return 2;
  
  // レベル1
  return 1;
}
```

**レベル定義:**

| レベル | 名称 | 説明 |
|--------|------|------|
| Lv.1 | 知る | AIの基本・特性・リスクを理解 |
| Lv.2 | 使う | 日常業務でAIを利用 |
| Lv.3 | 改善する | 自分の業務をAIで効率化・高度化 |
| Lv.4 | 設計する | AIを組み込んだ業務プロセスを設計 |
| Lv.5 | 変革する | AIで顧客価値・事業・組織を変革 |

### 6.3 ギャップ分析

```typescript
type GapPattern = 
  | 'balanced'          // バランス型（差が±1以内）
  | 'personal-leading'  // 個人先行型（個人 > 組織+1）
  | 'org-leading'       // 組織先行型（組織 > 個人+1）
  | 'both-low'          // 停滞型（両方Lv.2以下）
  | 'both-high';        // 変革型（両方Lv.4以上）

function analyzeGap(personalLv: number, orgLv: number): GapPattern {
  const diff = personalLv - orgLv;
  
  if (personalLv <= 2 && orgLv <= 2) return 'both-low';
  if (personalLv >= 4 && orgLv >= 4) return 'both-high';
  if (diff >= 2) return 'personal-leading';
  if (diff <= -2) return 'org-leading';
  return 'balanced';
}
```

### 6.4 強み・弱み分析

```typescript
function analyzeStrengthWeakness(axisScores: AxisScores) {
  const entries = Object.entries(axisScores);
  const sorted = entries.sort((a, b) => b[1] - a[1]);
  
  return {
    strengths: sorted.slice(0, 2),  // トップ2
    weaknesses: sorted.slice(-2),   // ボトム2
  };
}
```

---

## 7. 推奨アクション

### 7.1 レベル別推奨アクション（静的マッピング）

```typescript
const recommendations: Record<1|2|3|4|5, string[]> = {
  1: [
    'AIの基本特性を理解する',
    'AI利用の安全性とリスクを学ぶ',
    '小さな業務でAIを試してみる',
  ],
  2: [
    'メール作成・返信にAIを活用する',
    '文書作成・要約にAIを活用する',
    '会議の議事録作成にAIを活用する',
  ],
  3: [
    '自分の業務を棚卸しし、AI活用箇所を発見する',
    'AIと既存ツールを組み合わせて効率化する',
    '作業時間・品質の改善効果を測定する',
  ],
  4: [
    'AIエージェントを業務に組み込む',
    'RAG（社内知識のAI活用）を検討する',
    '部門横断でAI活用プロジェクトを推進する',
  ],
  5: [
    'AIを前提に顧客価値を再設計する',
    'AI活用による新規事業を創出する',
    'AIを組み込んだ組織・業務設計を行う',
  ],
};
```

### 7.2 ギャップパターン別の追加推奨

```typescript
const gapRecommendations: Record<GapPattern, string[]> = {
  'personal-leading': [
    'AI活用事例を社内で共有する',
    '部門別AIプロジェクトを立ち上げる',
    'AI利用ルールを整備する',
  ],
  'org-leading': [
    '社内のAI研修に参加する',
    'AI活用の成功事例を学ぶ',
    '実践的なAI活用を増やす',
  ],
  'balanced': [
    '個人と組織の両面でAI活用を進める',
    '継続的な改善を実施する',
  ],
  'both-low': [
    'まずAI基礎研修から始める',
    '小さく始めて成功体験を積む',
  ],
  'both-high': [
    'AI活用のベストプラクティスを他部門に展開する',
    '新しいAI技術・手法に挑戦する',
  ],
};
```

**設計判断:**
- **静的マッピング** - MVPではシンプルに事前定義
- **将来拡張** - 後でAI生成による個別化も可能

---

## 8. 結果画面

### 8.1 表示内容と順序

1. **総合レベル** - 大きく目立つバッジで表示
2. **レベル説明** - そのレベルの意味
3. **レーダーチャート** - 5軸の可視化（Tremor使用）
4. **強み・弱み** - トップ2とボトム2
5. **個人×組織マトリクス** - 散布図（Tremor使用）
6. **ギャップ分析** - パターン判定と説明
7. **推奨アクション** - 具体的な次のステップ
8. **PDFダウンロードボタン**

### 8.2 チャート実装（Tremor）

**レーダーチャート（RadarChart.tsx）:**
```tsx
import { DonutChart } from '@tremor/react';

export function RadarChart({ axisScores }) {
  const data = [
    { name: 'AIリテラシー', value: axisScores.literacy },
    { name: 'AI操作力', value: axisScores.operation },
    { name: '業務活用力', value: axisScores.application },
    { name: '業務設計力', value: axisScores.design },
    { name: '価値創造力', value: axisScores.innovation },
  ];
  
  return <DonutChart data={data} category="value" index="name" />;
}
```

**個人×組織マトリクス（MatrixChart.tsx）:**
```tsx
import { ScatterChart } from '@tremor/react';

export function MatrixChart({ personalLevel, organizationLevel }) {
  const data = [{
    x: personalLevel,
    y: organizationLevel,
  }];
  
  return <ScatterChart data={data} x="x" y="y" />;
}
```

### 8.3 PDF出力機能

**実装方式:** ブラウザ印刷機能 + 印刷用CSS

```typescript
// components/result/PDFDownloadButton.tsx
export function PDFDownloadButton() {
  const handlePrint = () => {
    window.print();
  };
  
  return (
    <button onClick={handlePrint} className="no-print">
      PDFでダウンロード
    </button>
  );
}
```

**印刷用CSS (`app/globals.css`):**
```css
@media print {
  /* 不要な要素を非表示 */
  header, nav, footer, .no-print {
    display: none !important;
  }
  
  /* ページ設定 */
  @page {
    size: A4;
    margin: 2cm;
  }
  
  /* チャートの改ページ制御 */
  .tremor-chart {
    break-inside: avoid;
    page-break-inside: avoid;
  }
  
  /* カラー調整 */
  body {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
}
```

**メリット:**
- 追加ライブラリ不要
- ユーザーが印刷設定を調整可能
- メンテナンスが容易

---

## 9. 質問データ

### 9.1 質問構成（35問）

**個人診断（20問 = 各軸4問 × 5軸）:**

1. **AIリテラシー（4問）**
   - AIが得意な仕事・苦手な仕事を説明できる
   - AIの回答を確認せずに信用しない
   - 機密情報の取り扱いルールを理解している
   - AIによる誤情報のリスクを理解している

2. **AI操作力（4問）**
   - AIに目的・条件を明確に伝えられる
   - AIの回答を見て追加指示を出せる
   - 複数のAIツールを使い分けられる
   - AIとの対話を繰り返して成果物を改善できる

3. **業務活用力（4問）**
   - 自分の仕事でAIを日常的に利用している
   - メール・資料・議事録等にAIを活用している
   - AIによって作業時間を短縮している
   - AIを使う業務・使わない業務を判断できる

4. **業務設計力（4問）**
   - 自分の業務プロセスをAI視点で見直せる
   - 「AIに任せる」「人が行う」を切り分けられる
   - AIを組み込んだ業務フローを考えられる
   - AIアプリ・自動化を業務に組み込める

5. **価値創造力（4問）**
   - AIを顧客理解に活用できる
   - AIを商品・サービス改善に活用できる
   - AIを意思決定支援に活用できる
   - AIで新しい顧客価値を創造できる

**組織診断（15問 = 各項目3問 × 5項目）:**

1. **導入（3問）**
   - 会社としてAI利用を認めている
   - AI利用ルールが明確に定められている
   - 推奨AIツールが提示されている

2. **利用（3問）**
   - 社員が継続的にAIを利用している
   - 部門内でAI利用方法が共有されている
   - AI活用事例が蓄積されている

3. **業務組込み（3問）**
   - AIが実際の業務プロセスに組み込まれている
   - AIによる業務改善を継続的に行っている
   - AIアプリ・自動化が実装されている

4. **データ・仕組み（3問）**
   - 社内データをAI活用できる状態にしている
   - RAG等で社内知識をAIから利用できる
   - AI活用を支えるシステム基盤がある

5. **経営活用（3問）**
   - 経営判断にAIを活用している
   - 顧客価値向上にAIを活用している
   - AIを前提に業務・組織を再設計している

### 9.2 5段階評価スケール

```typescript
export const scaleLabels = {
  1: 'まったくできない',
  2: 'あまりできない',
  3: 'ある程度できる',
  4: 'できる',
  5: '他者にも教えられる・仕組み化できる',
};
```

### 9.3 質問ID体系

- 個人診断: `p_{category}_{number}` (例: `p_literacy_1`)
- 組織診断: `o_{category}_{number}` (例: `o_adoption_1`)

**設計判断:**
1. **実践ベースの質問** - 「知っているか」ではなく「できるか」を問う
2. **5段階評価** - シンプルで直感的
3. **明確なID体系** - プレフィックスで種別を判別

---

## 10. UI/UXの方針

### 10.1 デザイン原則

1. **レスポンシブデザイン** - スマホ・タブレット・PCすべてに対応
2. **Tailwind CSS 4** - 一貫性のあるデザインシステム
3. **視覚的階層** - 重要な情報ほど目立つように配置
4. **明確なフィードバック** - プログレスバーで進捗を常に表示

### 10.2 アクセシビリティ

- キーボードナビゲーション対応
- 適切なARIAラベル
- 十分なコントラスト比
- スクリーンリーダー対応

---

## 11. 将来の拡張計画

### 11.1 データベース移行

localStorage → PostgreSQL/Supabase
- `lib/storage.ts`をデータベース版に拡張
- API Routesを追加
- テーブル設計は現在のデータモデルを踏襲

### 11.2 管理者機能

- 質問の編集機能
- 部門別比較
- 経時変化の確認
- CSVエクスポート

### 11.3 AI機能

- 推奨アクションのAI生成
- 個別化されたフィードバック
- 診断結果のAI分析

---

## 12. 実装アプローチ

**選択されたアプローチ:** シンプルなマルチページ構成

**理由:**
1. MVPとして短期間で実装可能
2. Next.js App Routerの利点を活かせる
3. 後からDB移行や機能追加が容易
4. URLベースのナビゲーションで直感的

**ルート構成:**
- `/` - トップページ
- `/assessment` - 診断画面
- `/result` - 結果画面
- `/history` - 診断履歴一覧

---

## 13. テスト戦略

### 13.1 単体テスト

- スコアリングロジック（`lib/scoring.ts`）
- ギャップ分析（`lib/recommendations.ts`）
- localStorage操作（`lib/storage.ts`）

### 13.2 統合テスト

- 診断フロー全体
- 結果画面の表示

### 13.3 E2Eテスト

- ユーザーが診断を開始して結果を見るまでの完全なフロー

---

## 14. まとめ

このAI活用成熟度診断アプリは、個人と組織のAI活用レベルを可視化し、次のアクションを明確にすることで、AI活用の成長を支援します。

**MVP段階での価値:**
- 短期間で実装可能
- シンプルで使いやすいUI
- 診断結果の即座の可視化
- PDFで結果を保存可能

**将来の拡張性:**
- データベース移行による本格運用
- 管理者機能による組織全体の分析
- AI機能による個別化

この設計に基づいて実装計画を作成し、段階的に開発を進めます。
