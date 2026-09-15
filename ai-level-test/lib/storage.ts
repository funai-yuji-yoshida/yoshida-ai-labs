// lib/storage.ts
import type { AssessmentResult } from './types';

const STORAGE_KEY = 'ai-level-test:assessments';

/**
 * localStorage が利用可能かチェック
 */
function isLocalStorageAvailable(): boolean {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * 診断結果を保存
 */
export function saveAssessment(result: AssessmentResult): void {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage is not available');
    return;
  }

  try {
    const existing = getAssessments();
    const updated = [...existing, result];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save assessment:', error);
  }
}

/**
 * 全診断結果を取得
 */
export function getAssessments(): AssessmentResult[] {
  if (!isLocalStorageAvailable()) {
    return [];
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return [];
    }
    return JSON.parse(data) as AssessmentResult[];
  } catch (error) {
    console.error('Failed to get assessments:', error);
    return [];
  }
}

/**
 * IDで特定の診断結果を取得
 */
export function getAssessmentById(id: string): AssessmentResult | null {
  const assessments = getAssessments();
  return assessments.find((a) => a.id === id) || null;
}

/**
 * 診断結果を削除
 */
export function deleteAssessment(id: string): void {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage is not available');
    return;
  }

  try {
    const existing = getAssessments();
    const filtered = existing.filter((a) => a.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete assessment:', error);
  }
}
