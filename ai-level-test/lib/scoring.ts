// lib/scoring.ts
import type {
  Answer,
  AssessmentAxis,
  OrganizationCategory,
  AxisScores,
  OrgScores,
} from './types';
import { getQuestionById } from './questions';

/**
 * 各軸のスコア計算（平均値）
 */
export function calculateAxisScore(
  answers: Answer[],
  axis: AssessmentAxis
): number {
  const axisAnswers = answers.filter((a) => {
    const question = getQuestionById(a.questionId);
    return question?.category === axis;
  });

  if (axisAnswers.length === 0) {
    return 0;
  }

  const sum = axisAnswers.reduce((acc, a) => acc + a.score, 0);
  return sum / axisAnswers.length;
}

/**
 * 組織スコア計算
 */
export function calculateOrgScore(
  answers: Answer[],
  category: OrganizationCategory
): number {
  const categoryAnswers = answers.filter((a) => {
    const question = getQuestionById(a.questionId);
    return question?.category === category;
  });

  if (categoryAnswers.length === 0) {
    return 0;
  }

  const sum = categoryAnswers.reduce((acc, a) => acc + a.score, 0);
  return sum / categoryAnswers.length;
}

/**
 * 個人総合レベル判定
 * 平均スコアだけでなく最低スコアも考慮
 */
export function calculatePersonalLevel(
  axisScores: AxisScores
): 1 | 2 | 3 | 4 | 5 {
  const scores = Object.values(axisScores);
  const average = scores.reduce((a, b) => a + b, 0) / scores.length;
  const minScore = Math.min(...scores);

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

/**
 * 組織総合レベル判定
 */
export function calculateOrganizationLevel(
  orgScores: OrgScores
): 1 | 2 | 3 | 4 | 5 {
  const scores = Object.values(orgScores);
  const average = scores.reduce((a, b) => a + b, 0) / scores.length;
  const minScore = Math.min(...scores);

  // レベル5: 平均4.5以上 かつ 全項目4.0以上
  if (average >= 4.5 && minScore >= 4.0) return 5;

  // レベル4: 平均3.5以上 かつ 全項目3.0以上
  if (average >= 3.5 && minScore >= 3.0) return 4;

  // レベル3: 平均2.5以上 かつ 全項目2.0以上
  if (average >= 2.5 && minScore >= 2.0) return 3;

  // レベル2: 平均1.5以上
  if (average >= 1.5) return 2;

  // レベル1
  return 1;
}

/**
 * すべてのスコアを計算
 */
export function calculateAllScores(
  personalAnswers: Answer[],
  organizationAnswers: Answer[]
): {
  axisScores: AxisScores;
  orgScores: OrgScores;
  personalLevel: 1 | 2 | 3 | 4 | 5;
  organizationLevel: 1 | 2 | 3 | 4 | 5;
} {
  const axisScores: AxisScores = {
    literacy: calculateAxisScore(personalAnswers, 'literacy'),
    operation: calculateAxisScore(personalAnswers, 'operation'),
    application: calculateAxisScore(personalAnswers, 'application'),
    design: calculateAxisScore(personalAnswers, 'design'),
    innovation: calculateAxisScore(personalAnswers, 'innovation'),
  };

  const orgScores: OrgScores = {
    adoption: calculateOrgScore(organizationAnswers, 'adoption'),
    usage: calculateOrgScore(organizationAnswers, 'usage'),
    integration: calculateOrgScore(organizationAnswers, 'integration'),
    infrastructure: calculateOrgScore(organizationAnswers, 'infrastructure'),
    management: calculateOrgScore(organizationAnswers, 'management'),
  };

  const personalLevel = calculatePersonalLevel(axisScores);
  const organizationLevel = calculateOrganizationLevel(orgScores);

  return {
    axisScores,
    orgScores,
    personalLevel,
    organizationLevel,
  };
}
