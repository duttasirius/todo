import type { Request, Response } from "express";

const GEMINI_MODEL = "gemini-2.5-flash";

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const getToday = (): string =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

const cleanJson = (text: string): string =>
  text
    .replace(/^\s*```json\s*/i, "")
    .replace(/\s*```\s*$/i, "")
    .trim();

export const generateTodo = async (req: Request, res: Response) => {
  const prompt = String(req.body?.prompt || "").trim();

  if (!prompt) {
    return res.status(400).json({
      success: false,
      message: "Please describe the task you want to create.",
    });
  }

  if (prompt.length > 500) {
    return res.status(400).json({
      success: false,
      message: "Please keep the AI request under 500 characters.",
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      success: false,
      message: "GEMINI_API_KEY is not configured.",
    });
  }

  const today = getToday();

  const instruction = `You are a Todo task assistant.

Convert the user's request into one practical Todo.

Return ONLY JSON using this exact structure:
{
  "title": "short clear title",
  "description": "useful short description",
  "priority": "low",
  "dueDate": ""
}

Rules:
- priority must be exactly "low", "medium", or "high".
- dueDate must be either a valid date in YYYY-MM-DD format or an empty string "".
- Today's date is ${today}.
- Interpret words such as today, tomorrow, next week, or this Friday relative to today's date.
- Do not invent a due date when the user did not provide one.
- Use an empty string "" when no due date is specified.
- Keep the title concise.
- Keep the description useful but short.
- Return JSON only.

User request:
${prompt}`;

  try {
    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: instruction,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              title: {
                type: "STRING",
              },
              description: {
                type: "STRING",
              },
              priority: {
                type: "STRING",
                enum: ["low", "medium", "high"],
              },
              dueDate: {
                type: "STRING",
              },
            },
            required: ["title", "description", "priority", "dueDate"],
          },
        },
      }),
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      const errorBody = await response.text();

      console.error("Gemini request failed:", response.status, errorBody);

      return res.status(502).json({
        success: false,
        message: "Gemini could not generate the task right now.",
      });
    }

    const result = await response.json();

    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return res.status(502).json({
        success: false,
        message: "Gemini returned an empty response.",
      });
    }

    const todo = JSON.parse(cleanJson(text));

    if (
      typeof todo.title !== "string" ||
      typeof todo.description !== "string" ||
      typeof todo.priority !== "string" ||
      typeof todo.dueDate !== "string"
    ) {
      throw new Error("Invalid Gemini Todo response");
    }

    if (!["low", "medium", "high"].includes(todo.priority)) {
      throw new Error("Invalid Gemini priority");
    }

    if (todo.dueDate !== "" && !/^\d{4}-\d{2}-\d{2}$/.test(todo.dueDate)) {
      throw new Error("Invalid Gemini due date");
    }

    if (!todo.title.trim()) {
      throw new Error("Gemini returned an empty title");
    }

    return res.status(200).json({
      success: true,
      data: {
        title: todo.title.trim(),
        description: todo.description.trim(),
        priority: todo.priority,
        dueDate: todo.dueDate.trim(),
      },
    });
  } catch (error) {
    console.error("AI todo generation:", error);

    return res.status(500).json({
      success: false,
      message:
        "Could not generate the Todo with AI. You can still create it manually.",
    });
  }
};
