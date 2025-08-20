import express from "express";
import cors from "cors";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { configDotenv } from "dotenv";

configDotenv();

const app = express();
app.use(cors());

app.use(express.json());

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/generate", async (req, res) => {
    const { description, industry, tone, features } = req.body;

    const model = ai.getGenerativeModel({
        model: "gemini-2.5-pro",
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
        console.log(result);
        const data = JSON.parse(result.response.text());
        console.log(data);
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to generate website" });
    }
});

app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));
