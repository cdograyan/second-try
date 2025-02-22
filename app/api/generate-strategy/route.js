import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { businessStage, goal, techSolution, companyName } = body;

    if (!businessStage || !goal || !techSolution || !companyName) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a marketing assistant that generates structured content strategies." },
        { role: "user", content: `
          Generate a structured 3-month B2B content strategy for a ${businessStage} tech company (${companyName}), focused on ${goal}.
          The company specializes in ${techSolution}. 

          Return the response in this tabular format:
          - Month (1, 2, or 3)
          - Content Type (Blog, LinkedIn Post, Case Study, Infographic, Newsletter, etc.)
          - Content Title (A creative title for the content)
          - Brief (1-2 sentence summary of the content)

          Example output:
          1 - Blog - "The Future of AI in Marketing" - This blog discusses how AI is transforming digital marketing.
          1 - LinkedIn Post - "Our New Product Features" - This social media post highlights the latest product updates.
          2 - Case Study - "How XYZ Company Achieved 2x Growth" - A deep dive into how a customer achieved success.
          3 - Infographic - "Tech Industry Trends 2024" - A visually engaging infographic on upcoming trends.
          
        ` },
      ],
      max_tokens: 500,
    });

    if (!response.choices || response.choices.length === 0) {
      return new Response(JSON.stringify({ error: "No response from OpenAI" }), { status: 500 });
    }

    return new Response(JSON.stringify({ strategy: response.choices[0].message.content.trim() }), { status: 200 });
  } catch (error) {
    console.error("❌ OpenAI API Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
