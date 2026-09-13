import { ExperimentSession } from "./types";

const STORAGE_KEY = "ai-kuse-lab-sessions";

// localStorageが利用可能かチェック
export function isStorageAvailable(): boolean {
  try {
    const test = "__storage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

// セッションを保存
export function saveSession(session: ExperimentSession): void {
  if (!isStorageAvailable()) {
    console.warn("localStorage is not available");
    return;
  }

  try {
    const sessions = getAllSessions();
    const existingIndex = sessions.findIndex((s) => s.id === session.id);

    if (existingIndex >= 0) {
      sessions[existingIndex] = session;
    } else {
      sessions.push(session);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error("Failed to save session:", error);
  }
}

// すべてのセッションを取得
export function getAllSessions(): ExperimentSession[] {
  if (!isStorageAvailable()) {
    return [];
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return [];
    }

    const sessions = JSON.parse(data);
    return Array.isArray(sessions) ? sessions : [];
  } catch (error) {
    console.error("Failed to load sessions:", error);
    return [];
  }
}

// 特定のセッションを取得
export function getSession(id: string): ExperimentSession | null {
  const sessions = getAllSessions();
  return sessions.find((s) => s.id === id) || null;
}

// セッションを削除
export function deleteSession(id: string): void {
  if (!isStorageAvailable()) {
    return;
  }

  try {
    const sessions = getAllSessions();
    const filtered = sessions.filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Failed to delete session:", error);
  }
}

// すべてのセッションをクリア
export function clearAllSessions(): void {
  if (!isStorageAvailable()) {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear sessions:", error);
  }
}
