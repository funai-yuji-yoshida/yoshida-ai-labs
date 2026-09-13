// シンプルなインメモリレート制限
// 本番環境ではRedisやUpstash等を使用することを推奨

type RateLimitStore = Map<string, { count: number; resetTime: number }>;

const rateLimitStore: RateLimitStore = new Map();

// 古いエントリをクリーンアップ
function cleanupOldEntries() {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// 定期的にクリーンアップ（1分ごと）
if (typeof window === "undefined") {
  setInterval(cleanupOldEntries, 60000);
}

export interface RateLimitConfig {
  maxRequests: number; // 最大リクエスト数
  windowMs: number; // 時間窓（ミリ秒）
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

export function rateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const key = `ratelimit:${identifier}`;

  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    // 新しい時間窓を開始
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });

    return {
      success: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - 1,
      reset: now + config.windowMs,
    };
  }

  if (record.count >= config.maxRequests) {
    // レート制限超過
    return {
      success: false,
      limit: config.maxRequests,
      remaining: 0,
      reset: record.resetTime,
    };
  }

  // カウントを増やす
  record.count++;

  return {
    success: true,
    limit: config.maxRequests,
    remaining: config.maxRequests - record.count,
    reset: record.resetTime,
  };
}

// IPアドレスを取得
export function getClientIp(request: Request): string {
  // Vercelの場合
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  // その他の環境
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  return "unknown";
}
