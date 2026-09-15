// ダミーデータ版 - 本物のAI APIを使わず、事前定義された応答を返す
// 後で本物のAI APIに切り替える場合は、このファイルを置き換えてください

// シンプルなテキスト生成（ダミー）
export async function generateText(prompt: string): Promise<string> {
  // ダミー応答を返す
  await simulateDelay(500);
  return "これはダミーの応答です。本物のAI APIに接続するには、APIキーを設定してください。";
}

// ハルシネーションチェック用の質問生成（ダミー）
export async function generateHallucinationQuestion(): Promise<{
  question: string;
  correctAnswer: string;
  aiAnswer: string;
}> {
  // リアルな応答をシミュレート
  await simulateDelay(1500);

  const fakeQuestion = "2025年に日本で開催されたAI万博の会場はどこでしたか？";

  // AIがハルシネーション（幻覚）を起こした例
  const aiAnswer = `2025年に日本で開催されたAI万博は、東京ビッグサイトで開催されました。このイベントは、最新のAI技術を展示する大規模な国際イベントで、世界中から約50万人の来場者が訪れました。主なテーマは「AIと人間の共生」で、様々な企業や研究機関が最新のAI技術を披露しました。

特に注目を集めたのは、自動運転車の実演や、AIアシスタントとの対話デモ、そしてAIによるアート作品の展示でした。期間は2025年3月15日から3月24日までの10日間で、日本政府が主催し、多くの企業がスポンサーとして参加しました。`;

  return {
    question: fakeQuestion,
    correctAnswer: "そのようなイベントは実際には開催されていません。これは存在しない情報です。",
    aiAnswer: aiAnswer,
  };
}

// コンテキスト長の実験（ダミー）
export async function testContextLength(
  longText: string
): Promise<{
  inputLength: number;
  canProcess: boolean;
  response: string;
}> {
  await simulateDelay(1000);

  return {
    inputLength: longText.length,
    canProcess: true,
    response: `入力されたテキスト（${longText.length}文字）の要約：これはダミーの要約です。本物のAI APIに接続すると、実際の要約が生成されます。`,
  };
}

// 遅延をシミュレート（リアルなAPI呼び出しのように見せる）
function simulateDelay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 後で本物のAI APIに切り替える場合のための注釈
/*
本物のAI APIに切り替えるには：

1. OpenAI API の場合：
   - npm install openai
   - 環境変数 OPENAI_API_KEY を設定
   - このファイルを OpenAI SDK を使ったコードに置き換え

2. Claude API の場合：
   - npm install @anthropic-ai/sdk
   - 環境変数 CLAUDE_API_KEY を設定
   - このファイルを Claude SDK を使ったコードに置き換え

3. Gemini API の場合：
   - npm install @google/generative-ai
   - 環境変数 GEMINI_API_KEY を設定
   - このファイルを Gemini SDK を使ったコードに置き換え
*/
