import express from "express";
import cors from "cors";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { configDotenv } from "dotenv";

configDotenv();

const app = express();
app.use(cors());

app.use(express.json());

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function extractJSON(text) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }
    throw new Error("No valid JSON found in response");
  }
}


app.post("/generate", async (req, res) => {
    const { description, industry, tone, features } = req.body;

    const model = ai.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: `You are a code generator with specialization in web development.
Return ONLY valid JSON. The generated code must be properly formatted. For all designs I ask you to make, have them be beautiful and responsive, not cookie cutter. Make webpages that are fully featured and worthy for production.The codes must be in a single HTML.`,
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
                type: SchemaType.OBJECT,
                properties: {
                    code: {
                        type: SchemaType.STRING,
                    }
                }
            }
        }
    });

    try {
        const prompt = `Build a website with:
        - Description: ${description}
        - Industry: ${industry}
        - Tone/Style: ${tone}
        - Features: ${features}`;

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }]
        });
        let data;
        try {
  data = extractJSON(await result.response.text());
            res.send(data);
} catch (err) {
  console.error("❌ Failed to extract JSON:", await result.response.text());
  return res.status(500).json({ error: "Invalid JSON response from Gemini" });
}
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to generate website" });
    }
});

app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));
