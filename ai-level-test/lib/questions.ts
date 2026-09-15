// lib/questions.ts
import { Question } from './types';

export const scaleLabels: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: 'まったくできない',
  2: 'あまりできない',
  3: 'ある程度できる',
  4: 'できる',
  5: '他者にも教えられる・仕組み化できる',
};

export const questions: Question[] = [
  // 個人診断 - AIリテラシー（4問）
  {
    id: 'p_literacy_1',
    type: 'personal',
    category: 'literacy',
    text: 'AIが得意な仕事・苦手な仕事を説明できる',
    order: 1,
  },
  {
    id: 'p_literacy_2',
    type: 'personal',
    category: 'literacy',
    text: 'AIの回答を確認せずに信用しない',
    order: 2,
  },
  {
    id: 'p_literacy_3',
    type: 'personal',
    category: 'literacy',
    text: '機密情報の取り扱いルールを理解している',
    order: 3,
  },
  {
    id: 'p_literacy_4',
    type: 'personal',
    category: 'literacy',
    text: 'AIによる誤情報のリスクを理解している',
    order: 4,
  },

  // 個人診断 - AI操作力（4問）
  {
    id: 'p_operation_1',
    type: 'personal',
    category: 'operation',
    text: 'AIに目的・条件を明確に伝えられる',
    order: 5,
  },
  {
    id: 'p_operation_2',
    type: 'personal',
    category: 'operation',
    text: 'AIの回答を見て追加指示を出せる',
    order: 6,
  },
  {
    id: 'p_operation_3',
    type: 'personal',
    category: 'operation',
    text: '複数のAIツールを使い分けられる',
    order: 7,
  },
  {
    id: 'p_operation_4',
    type: 'personal',
    category: 'operation',
    text: 'AIとの対話を繰り返して成果物を改善できる',
    order: 8,
  },

  // 個人診断 - 業務活用力（4問）
  {
    id: 'p_application_1',
    type: 'personal',
    category: 'application',
    text: '自分の仕事でAIを日常的に利用している',
    order: 9,
  },
  {
    id: 'p_application_2',
    type: 'personal',
    category: 'application',
    text: 'メール・資料・議事録等にAIを活用している',
    order: 10,
  },
  {
    id: 'p_application_3',
    type: 'personal',
    category: 'application',
    text: 'AIによって作業時間を短縮している',
    order: 11,
  },
  {
    id: 'p_application_4',
    type: 'personal',
    category: 'application',
    text: 'AIを使う業務・使わない業務を判断できる',
    order: 12,
  },

  // 個人診断 - 業務設計力（4問）
  {
    id: 'p_design_1',
    type: 'personal',
    category: 'design',
    text: '自分の業務プロセスをAI視点で見直せる',
    order: 13,
  },
  {
    id: 'p_design_2',
    type: 'personal',
    category: 'design',
    text: '「AIに任せる」「人が行う」を切り分けられる',
    order: 14,
  },
  {
    id: 'p_design_3',
    type: 'personal',
    category: 'design',
    text: 'AIを組み込んだ業務フローを考えられる',
    order: 15,
  },
  {
    id: 'p_design_4',
    type: 'personal',
    category: 'design',
    text: 'AIアプリ・自動化を業務に組み込める',
    order: 16,
  },

  // 個人診断 - 価値創造力（4問）
  {
    id: 'p_innovation_1',
    type: 'personal',
    category: 'innovation',
    text: 'AIを顧客理解に活用できる',
    order: 17,
  },
  {
    id: 'p_innovation_2',
    type: 'personal',
    category: 'innovation',
    text: 'AIを商品・サービス改善に活用できる',
    order: 18,
  },
  {
    id: 'p_innovation_3',
    type: 'personal',
    category: 'innovation',
    text: 'AIを意思決定支援に活用できる',
    order: 19,
  },
  {
    id: 'p_innovation_4',
    type: 'personal',
    category: 'innovation',
    text: 'AIで新しい顧客価値を創造できる',
    order: 20,
  },

  // 組織診断 - 導入（3問）
  {
    id: 'o_adoption_1',
    type: 'organization',
    category: 'adoption',
    text: '会社としてAI利用を認めている',
    order: 21,
  },
  {
    id: 'o_adoption_2',
    type: 'organization',
    category: 'adoption',
    text: 'AI利用ルールが明確に定められている',
    order: 22,
  },
  {
    id: 'o_adoption_3',
    type: 'organization',
    category: 'adoption',
    text: '推奨AIツールが提示されている',
    order: 23,
  },

  // 組織診断 - 利用（3問）
  {
    id: 'o_usage_1',
    type: 'organization',
    category: 'usage',
    text: '社員が継続的にAIを利用している',
    order: 24,
  },
  {
    id: 'o_usage_2',
    type: 'organization',
    category: 'usage',
    text: '部門内でAI利用方法が共有されている',
    order: 25,
  },
  {
    id: 'o_usage_3',
    type: 'organization',
    category: 'usage',
    text: 'AI活用事例が蓄積されている',
    order: 26,
  },

  // 組織診断 - 業務組込み（3問）
  {
    id: 'o_integration_1',
    type: 'organization',
    category: 'integration',
    text: 'AIが実際の業務プロセスに組み込まれている',
    order: 27,
  },
  {
    id: 'o_integration_2',
    type: 'organization',
    category: 'integration',
    text: 'AIによる業務改善を継続的に行っている',
    order: 28,
  },
  {
    id: 'o_integration_3',
    type: 'organization',
    category: 'integration',
    text: 'AIアプリ・自動化が実装されている',
    order: 29,
  },

  // 組織診断 - データ・仕組み（3問）
  {
    id: 'o_infrastructure_1',
    type: 'organization',
    category: 'infrastructure',
    text: '社内データをAI活用できる状態にしている',
    order: 30,
  },
  {
    id: 'o_infrastructure_2',
    type: 'organization',
    category: 'infrastructure',
    text: 'RAG等で社内知識をAIから利用できる',
    order: 31,
  },
  {
    id: 'o_infrastructure_3',
    type: 'organization',
    category: 'infrastructure',
    text: 'AI活用を支えるシステム基盤がある',
    order: 32,
  },

  // 組織診断 - 経営活用（3問）
  {
    id: 'o_management_1',
    type: 'organization',
    category: 'management',
    text: '経営判断にAIを活用している',
    order: 33,
  },
  {
    id: 'o_management_2',
    type: 'organization',
    category: 'management',
    text: '顧客価値向上にAIを活用している',
    order: 34,
  },
  {
    id: 'o_management_3',
    type: 'organization',
    category: 'management',
    text: 'AIを前提に業務・組織を再設計している',
    order: 35,
  },
];

/**
 * IDで質問を取得
 */
export function getQuestionById(id: string): Question | undefined {
  return questions.find((q) => q.id === id);
}

/**
 * ステップごとの質問を取得
 * ステップ1: 基本情報（質問なし）
 * ステップ2-5: 個人診断（各5問）
 * ステップ6-8: 組織診断（各5問）
 */
export function getQuestionsForStep(step: number): Question[] {
  if (step === 1) {
    return []; // 基本情報入力のみ
  }

  // ステップ2-5: 個人診断（各5問）
  if (step >= 2 && step <= 5) {
    const startIdx = (step - 2) * 5;
    return questions.slice(startIdx, startIdx + 5);
  }

  // ステップ6-8: 組織診断（各5問）
  if (step >= 6 && step <= 8) {
    const startIdx = 20 + (step - 6) * 5;
    return questions.slice(startIdx, startIdx + 5);
  }

  return [];
}
