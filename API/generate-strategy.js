import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Securely load API key
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { businessStage, goal, techSolution, companyName } = req.body;

  if (!businessStage || !goal || !techSolution || !companyName) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `Generate 3 LinkedIn post titles for a ${goal} campaign in the ${techSolution} industry.`,
        },
      ],
      max_tokens: 100,
    });

    const generatedTitles = response.choices[0].message.content.trim().split("\n");

    return res.status(200).json({
      strategy: [
        { type: "LinkedIn Post", details: generatedTitles.map(title => ({ category: "AI-Generated", title })) },
      ],
    });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return res.status(500).json({ error: "Failed to generate content. Please try again." });
  }
}
