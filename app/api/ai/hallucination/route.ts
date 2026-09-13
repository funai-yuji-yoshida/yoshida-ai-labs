import { NextResponse } from "next/server";
import { generateHallucinationQuestion } from "@/lib/ai";

export async function GET() {
  try {
    const result = await generateHallucinationQuestion();
    return NextResponse.json(result);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "AI APIの呼び出しに失敗しました" },
      { status: 500 }
    );
  }
}
