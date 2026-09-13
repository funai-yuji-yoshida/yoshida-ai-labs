// 実験の種類
export type ExperimentType = "serial-position" | "isolation";

// 実験フェーズ
export type ExperimentPhase =
  | "intro"
  | "memorize"
  | "answer"
  | "result"
  | "reflection"
  | "explanation"
  | "complete";

// 実験定義
export type ExperimentDefinition = {
  id: string;
  name: string;
  description: string;
  type: ExperimentType;
};

// 単語セット
export type WordSet = {
  id: string;
  experimentId: string;
  words: string[];
  isolatedWordIndex?: number; // 孤立効果実験用
};

// 実験結果の各単語の詳細
export type WordResult = {
  word: string;
  position: number;
  correct: boolean;
  isIsolated?: boolean; // 孤立語かどうか
};

// 実験セッション
export type ExperimentSession = {
  id: string;
  experimentId: string;
  wordSetId: string;
  startedAt: string;
  completedAt?: string;
  displayedWords: string[]; // 表示された順番
  answers: string[];
  results: WordResult[];
  phase: ExperimentPhase;
};

// 振り返りの回答
export type ReflectionAnswer = {
  patterns: string[]; // 選択したパターン
  freeText?: string; // 自由回答
};
