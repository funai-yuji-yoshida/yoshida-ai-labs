// lib/recommendations.ts
import type { GapPattern, AxisScores, LevelDefinition } from './types';

/**
 * レベル定義
 */
export const levelDefinitions: LevelDefinition[] = [
  {
    level: 1,
    name: '知る',
    description: 'AIの基本・特性・リスクを理解している段階です。',
  },
  {
    level: 2,
    name: '使う',
    description: '日常業務でAIを利用できる段階です。',
  },
  {
    level: 3,
    name: '改善する',
    description: '自分の業務をAIで効率化・高度化できる段階です。',
  },
  {
    level: 4,
    name: '設計する',
    description: 'AIを組み込んだ業務プロセスを設計できる段階です。',
  },
  {
    level: 5,
    name: '変革する',
    description: 'AIで顧客価値・事業・組織を変革できる段階です。',
  },
];

/**
 * レベル定義を取得
 */
export function getLevelDefinition(level: 1 | 2 | 3 | 4 | 5): LevelDefinition {
  return levelDefinitions[level - 1];
}

/**
 * 評価軸のラベル
 */
const axisLabels: Record<keyof AxisScores, string> = {
  literacy: 'AIリテラシー',
  operation: 'AI操作力',
  application: '業務活用力',
  design: '業務設計力',
  innovation: '価値創造力',
};

/**
 * ギャップ分析
 */
export function analyzeGap(
  personalLevel: number,
  orgLevel: number
): GapPattern {
  const diff = personalLevel - orgLevel;

  if (personalLevel <= 2 && orgLevel <= 2) return 'both-low';
  if (personalLevel >= 4 && orgLevel >= 4) return 'both-high';
  if (diff >= 2) return 'personal-leading';
  if (diff <= -2) return 'org-leading';
  return 'balanced';
}

/**
 * レベル別推奨アクション
 */
const levelRecommendations: Record<1 | 2 | 3 | 4 | 5, string[]> = {
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

/**
 * レベル別推奨アクションを取得
 */
export function getRecommendations(level: 1 | 2 | 3 | 4 | 5): string[] {
  return levelRecommendations[level];
}

/**
 * ギャップパターン別推奨アクション
 */
const gapPatternRecommendations: Record<GapPattern, string[]> = {
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
  balanced: ['個人と組織の両面でAI活用を進める', '継続的な改善を実施する'],
  'both-low': ['まずAI基礎研修から始める', '小さく始めて成功体験を積む'],
  'both-high': [
    'AI活用のベストプラクティスを他部門に展開する',
    '新しいAI技術・手法に挑戦する',
  ],
};

/**
 * ギャップパターン別推奨アクションを取得
 */
export function getGapRecommendations(pattern: GapPattern): string[] {
  return gapPatternRecommendations[pattern];
}

/**
 * 強み・弱み分析
 */
export function analyzeStrengthWeakness(axisScores: AxisScores): {
  strengths: Array<{ axis: string; score: number }>;
  weaknesses: Array<{ axis: string; score: number }>;
} {
  const entries = Object.entries(axisScores) as Array<
    [keyof AxisScores, number]
  >;
  const sorted = entries.sort((a, b) => b[1] - a[1]);

  return {
    strengths: sorted.slice(0, 2).map(([axis, score]) => ({
      axis: axisLabels[axis],
      score,
    })),
    weaknesses: sorted
      .slice(-2)
      .reverse()
      .map(([axis, score]) => ({
        axis: axisLabels[axis],
        score,
      })),
  };
}
