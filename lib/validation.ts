// 入力検証ユーティリティ

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

// プロンプトの検証
export function validatePrompt(prompt: string): ValidationResult {
  if (!prompt || typeof prompt !== "string") {
    return {
      valid: false,
      error: "プロンプトは必須です",
    };
  }

  // 長さチェック（最大2000文字）
  if (prompt.length > 2000) {
    return {
      valid: false,
      error: "プロンプトが長すぎます（最大2000文字）",
    };
  }

  // 最小長チェック
  if (prompt.trim().length < 1) {
    return {
      valid: false,
      error: "プロンプトが空です",
    };
  }

  // 不適切な内容のチェック（基本的なフィルター）
  const blockedPatterns = [
    /malware/i,
    /virus/i,
    /hack/i,
    /exploit/i,
    /ddos/i,
  ];

  for (const pattern of blockedPatterns) {
    if (pattern.test(prompt)) {
      return {
        valid: false,
        error: "不適切な内容が含まれています",
      };
    }
  }

  return {
    valid: true,
  };
}

// 一般的な文字列の検証
export function sanitizeString(input: string, maxLength: number = 1000): string {
  if (typeof input !== "string") {
    return "";
  }

  return input.trim().substring(0, maxLength);
}
