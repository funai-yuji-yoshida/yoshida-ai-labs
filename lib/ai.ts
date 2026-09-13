import { GoogleGenerativeAI } from "@google/generative-ai";

// Gemini APIクライアントの初期化
let genAI: GoogleGenerativeAI | null = null;

export function getGeminiClient(): GoogleGenerativeAI {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set");
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

// シンプルなテキスト生成
export async function generateText(prompt: string): Promise<string> {
  try {
    const client = getGeminiClient();
    const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error("AI generation error:", error);
    throw new Error("AI生成に失敗しました");
  }
}

// ハルシネーションチェック用の質問生成
export async function generateHallucinationQuestion(): Promise<{
  question: string;
  correctAnswer: string;
  aiAnswer: string;
}> {
  try {
    const client = getGeminiClient();
    const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });

    // わざと存在しない情報について質問
    const fakeQuestion = "2025年に日本で開催されたAI万博の会場はどこでしたか？";

    const result = await model.generateContent(fakeQuestion);
    const aiAnswer = result.response.text();

    return {
      question: fakeQuestion,
      correctAnswer: "そのようなイベントは存在しません",
      aiAnswer: aiAnswer,
    };
  } catch (error) {
    console.error("Hallucination check error:", error);
    throw new Error("ハルシネーションチェックに失敗しました");
  }
}

// コンテキスト長の実験
export async function testContextLength(
  longText: string
): Promise<{
  inputLength: number;
  canProcess: boolean;
  response: string;
}> {
  try {
    const client = getGeminiClient();
    const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `以下のテキストを要約してください：\n\n${longText}`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return {
      inputLength: longText.length,
      canProcess: true,
      response: response,
    };
  } catch (error) {
    console.error("Context length error:", error);
    return {
      inputLength: longText.length,
      canProcess: false,
      response: "コンテキスト長の制限を超えました",
    };
  }
}
