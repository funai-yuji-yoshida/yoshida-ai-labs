require("dotenv").config({ path: ".env.local" });
const OpenAI = require("openai");

async function testOpenAI() {
  try {
    console.log("Testing OpenAI API...\n");

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("❌ OPENAI_API_KEY is not set");
      process.exit(1);
    }

    console.log("✅ API key found");
    console.log("Creating client...");

    const openai = new OpenAI({ apiKey });

    console.log("Sending test request...\n");

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: "2025年に日本で開催されたAI万博の会場はどこでしたか？",
        },
      ],
      max_tokens: 512,
    });

    console.log("✅ Request successful!\n");
    console.log("Response:");
    console.log(completion.choices[0]?.message?.content || "");
  } catch (error) {
    console.error("❌ Error:", error.message);
    if (error.response) {
      console.error("Response data:", JSON.stringify(error.response.data, null, 2));
    }
    if (error.code) {
      console.error("Error code:", error.code);
    }
    process.exit(1);
  }
}

testOpenAI();
