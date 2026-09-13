import Anthropic from "@anthropic-ai/sdk";

// Claude APIクライアントの初期化
let anthropic: Anthropic | null = null;

export function getClaudeClient(): Anthropic {
  if (!anthropic) {
    const apiKey = process.env.CLAUDE_API_KEY;
    if (!apiKey) {
      throw new Error("CLAUDE_API_KEY is not set");
    }
    anthropic = new Anthropic({ apiKey });
  }
  return anthropic;
}

// シンプルなテキスト生成
export async function generateText(prompt: string): Promise<string> {
  try {
    const client = getClaudeClient();

    const message = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const textContent = message.content.find((block) => block.type === "text");
    return textContent && textContent.type === "text" ? textContent.text : "";
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
    const client = getClaudeClient();

    // わざと存在しない情報について質問
    const fakeQuestion = "2025年に日本で開催されたAI万博の会場はどこでしたか？";

    const message = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 512,
      messages: [{ role: "user", content: fakeQuestion }],
    });

    const textContent = message.content.find((block) => block.type === "text");
    const aiAnswer =
      textContent && textContent.type === "text" ? textContent.text : "";

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
    const client = getClaudeClient();

    const prompt = `以下のテキストを要約してください：\n\n${longText}`;

    const message = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const textContent = message.content.find((block) => block.type === "text");
    const response =
      textContent && textContent.type === "text" ? textContent.text : "";

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
