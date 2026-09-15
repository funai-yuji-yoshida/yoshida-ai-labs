// lib/types.ts

/**
 * 個人診断の評価軸
 */
export type AssessmentAxis =
  | 'literacy'      // AIリテラシー
  | 'operation'     // AI操作力
  | 'application'   // 業務活用力
  | 'design'        // 業務設計力
  | 'innovation';   // 価値創造力

/**
 * 組織診断の評価項目
 */
export type OrganizationCategory =
  | 'adoption'       // 導入
  | 'usage'          // 利用
  | 'integration'    // 業務組込み
  | 'infrastructure' // データ・仕組み
  | 'management';    // 経営活用

/**
 * 質問タイプ
 */
export type QuestionType = 'personal' | 'organization';

/**
 * 質問データ
 */
export interface Question {
  id: string;
  type: QuestionType;
  category: AssessmentAxis | OrganizationCategory;
  text: string;
  order: number;
}

/**
 * 回答データ（1-5のスケール）
 */
export interface Answer {
  questionId: string;
  score: 1 | 2 | 3 | 4 | 5;
}

/**
 * 基本情報
 */
export interface BasicInfo {
  name?: string;  // 任意
  timestamp: number;
}

/**
 * 5軸スコア（個人）
 */
export interface AxisScores {
  literacy: number;
  operation: number;
  application: number;
  design: number;
  innovation: number;
}

/**
 * 組織スコア
 */
export interface OrgScores {
  adoption: number;
  usage: number;
  integration: number;
  infrastructure: number;
  management: number;
}

/**
 * 診断結果
 */
export interface AssessmentResult {
  id: string;  // UUID
  basicInfo: BasicInfo;
  personalAnswers: Answer[];
  organizationAnswers: Answer[];

  // 計算済みスコア
  personalLevel: 1 | 2 | 3 | 4 | 5;
  organizationLevel: 1 | 2 | 3 | 4 | 5;

  // 5軸スコア（個人）
  axisScores: AxisScores;

  // 組織スコア
  orgScores: OrgScores;

  createdAt: string;  // ISO 8601
}

/**
 * ギャップパターン
 */
export type GapPattern =
  | 'balanced'          // バランス型（差が±1以内）
  | 'personal-leading'  // 個人先行型（個人 > 組織+1）
  | 'org-leading'       // 組織先行型（組織 > 個人+1）
  | 'both-low'          // 停滞型（両方Lv.2以下）
  | 'both-high';        // 変革型（両方Lv.4以上）

/**
 * レベル定義
 */
export interface LevelDefinition {
  level: 1 | 2 | 3 | 4 | 5;
  name: string;
  description: string;
}
