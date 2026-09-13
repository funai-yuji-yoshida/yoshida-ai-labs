import { WordResult } from "./types";

// 回答を正規化
export function normalizeAnswer(answer: string): string {
  return answer
    .trim()
    .replace(/\s+/g, "") // すべての空白を削除
    .toLowerCase()
    .replace(/[ぁ-ん]/g, (char) => {
      // ひらがなをカタカナに変換
      return String.fromCharCode(char.charCodeAt(0) + 0x60);
    })
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (char) => {
      // 全角英数字を半角に変換
      return String.fromCharCode(char.charCodeAt(0) - 0xfee0);
    });
}

// 回答を分割して正規化
export function parseAnswers(input: string): string[] {
  // 複数の区切り文字で分割
  const delimiters = /[、,，\s\n]+/;
  const answers = input
    .split(delimiters)
    .map((ans) => ans.trim())
    .filter((ans) => ans.length > 0);

  // 重複を除去
  const uniqueAnswers = Array.from(new Set(answers));

  return uniqueAnswers;
}

// 回答を判定
export function evaluateAnswers(
  displayedWords: string[],
  userAnswers: string[],
  isolatedIndex?: number
): WordResult[] {
  const normalizedDisplayed = displayedWords.map(normalizeAnswer);
  const normalizedAnswers = userAnswers.map(normalizeAnswer);

  return displayedWords.map((word, index) => {
    const normalizedWord = normalizedDisplayed[index];
    const correct = normalizedAnswers.includes(normalizedWord);

    return {
      word,
      position: index,
      correct,
      isIsolated: isolatedIndex !== undefined && index === isolatedIndex,
    };
  });
}

// 正答率を計算
export function calculateAccuracy(results: WordResult[]): number {
  const correctCount = results.filter((r) => r.correct).length;
  return Math.round((correctCount / results.length) * 100);
}

// 孤立語の正答率を計算
export function calculateIsolatedAccuracy(results: WordResult[]): {
  normalAccuracy: number;
  isolatedCorrect: boolean;
} {
  const normalResults = results.filter((r) => !r.isIsolated);
  const isolatedResult = results.find((r) => r.isIsolated);

  const normalCorrect = normalResults.filter((r) => r.correct).length;
  const normalAccuracy = Math.round((normalCorrect / normalResults.length) * 100);

  return {
    normalAccuracy,
    isolatedCorrect: isolatedResult?.correct || false,
  };
}

// ユニークIDを生成
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// classNames を結合するユーティリティ
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
