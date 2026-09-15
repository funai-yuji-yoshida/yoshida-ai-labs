import OpenAI from "openai";

// OpenAI APIクライアントの初期化
let openai: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (!openai) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is not set");
    }
    openai = new OpenAI({ apiKey });
  }
  return openai;
}

// シンプルなテキスト生成
export async function generateText(prompt: string): Promise<string> {
  try {
    const client = getOpenAIClient();

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1024,
    });

    return completion.choices[0]?.message?.content || "";
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
    const client = getOpenAIClient();

    // わざと存在しない情報について質問
    const fakeQuestion = "2025年に日本で開催されたAI万博の会場はどこでしたか？";

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: fakeQuestion }],
      max_tokens: 512,
    });

    const aiAnswer = completion.choices[0]?.message?.content || "";

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
    const client = getOpenAIClient();

    const prompt = `以下のテキストを要約してください：\n\n${longText}`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1024,
    });

    const response = completion.choices[0]?.message?.content || "";

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
