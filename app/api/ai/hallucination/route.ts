import { NextResponse } from "next/server";
import { generateHallucinationQuestion } from "@/lib/ai";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function GET(request: Request) {
  try {
    // レート制限チェック（5分間に3回まで - コスト管理）
    const clientIp = getClientIp(request);
    const rateLimitResult = rateLimit(`hallucination:${clientIp}`, {
      maxRequests: 3,
      windowMs: 5 * 60 * 1000, // 5分
    });

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: "リクエストが多すぎます。5分後に再試行してください。",
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": rateLimitResult.limit.toString(),
            "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
            "X-RateLimit-Reset": new Date(rateLimitResult.reset).toISOString(),
            "Retry-After": Math.ceil(
              (rateLimitResult.reset - Date.now()) / 1000
            ).toString(),
          },
        }
      );
    }

    const result = await generateHallucinationQuestion();

    return NextResponse.json(result, {
      headers: {
        "X-RateLimit-Limit": rateLimitResult.limit.toString(),
        "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
        "X-RateLimit-Reset": new Date(rateLimitResult.reset).toISOString(),
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    // 詳細なエラーメッセージを公開しない
    return NextResponse.json(
      { error: "リクエストの処理中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
