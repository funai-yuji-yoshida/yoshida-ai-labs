require("dotenv").config({ path: ".env.local" });
const Anthropic = require("@anthropic-ai/sdk");

async function testClaude() {
  try {
    console.log("Testing Claude API...\n");

    const apiKey = process.env.CLAUDE_API_KEY;
    if (!apiKey) {
      console.error("❌ CLAUDE_API_KEY is not set");
      process.exit(1);
    }

    console.log("✅ API key found");
    console.log("Creating client...");

    const anthropic = new Anthropic({ apiKey });

    console.log("Sending test request...\n");

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 512,
      messages: [
        {
          role: "user",
          content: "2025年に日本で開催されたAI万博の会場はどこでしたか？",
        },
      ],
    });

    console.log("✅ Request successful!\n");
    console.log("Response:");
    const textContent = message.content.find((block) => block.type === "text");
    if (textContent && textContent.type === "text") {
      console.log(textContent.text);
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
    }
    process.exit(1);
  }
}

testClaude();
