import { NextResponse } from "next/server";
import { generateText } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "プロンプトが必要です" },
        { status: 400 }
      );
    }

    const text = await generateText(prompt);
    return NextResponse.json({ text });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "AI APIの呼び出しに失敗しました" },
      { status: 500 }
    );
  }
}
