import { NextResponse } from "next/server";
import { generateText } from "@/lib/ai";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { validatePrompt } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    // レート制限チェック（1分間に5回まで）
    const clientIp = getClientIp(request);
    const rateLimitResult = rateLimit(clientIp, {
      maxRequests: 5,
      windowMs: 60 * 1000, // 1分
    });

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: "リクエストが多すぎます。しばらく待ってから再試行してください。",
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": rateLimitResult.limit.toString(),
            "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
            "X-RateLimit-Reset": new Date(rateLimitResult.reset).toISOString(),
          },
        }
      );
    }

    // リクエストボディの検証
    const body = await request.json();
    const { prompt } = body;

    // プロンプトの検証
    const validation = validatePrompt(prompt);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // AI生成
    const text = await generateText(prompt);

    return NextResponse.json(
      { text },
      {
        headers: {
          "X-RateLimit-Limit": rateLimitResult.limit.toString(),
          "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
          "X-RateLimit-Reset": new Date(rateLimitResult.reset).toISOString(),
        },
      }
    );
  } catch (error) {
    console.error("API Error:", error);
    // 詳細なエラーメッセージを公開しない
    return NextResponse.json(
      { error: "リクエストの処理中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
