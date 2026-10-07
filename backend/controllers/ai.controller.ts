import type { Request, Response } from "express";

const GEMINI_MODEL = "gemini-3.8-flash";

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
    const requestBody = {
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
    };

    const maxAttempts = 3;
    const requestTimeoutMs = 45_000;
    let response: Response | null = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      try {
        response = await fetch(GEMINI_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
          },
          body: JSON.stringify(requestBody),
          signal: AbortSignal.timeout(requestTimeoutMs),
        });

        if (response.ok) break;

        const errorBody = await response.text();

        console.error(
          `Gemini request failed (attempt ${attempt}/${maxAttempts}):`,
          response.status,
          errorBody,
        );

        const shouldRetry = [408, 429, 500, 502, 503, 504].includes(response.status);

        if (!shouldRetry || attempt === maxAttempts) break;

        const delayMs = 1000 * 2 ** (attempt - 1);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      } catch (error) {
        const isTimeout =
          error instanceof DOMException && error.name === "TimeoutError";

        if (!isTimeout || attempt === maxAttempts) {
          throw error;
        }

        console.error(
          `Gemini request timed out (attempt ${attempt}/${maxAttempts}). Retrying...`,
        );

        const delayMs = 1000 * 2 ** (attempt - 1);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }

    if (!response) {
      return res.status(504).json({
        success: false,
        message: "Gemini timed out. Please try again.",
      });
    }

    if (!response.ok) {
      return res.status(502).json({
        success: false,
        message: "Gemini could not generate the task right now. Please try again.",
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
