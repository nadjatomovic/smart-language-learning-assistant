import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

const clean = (text) => {
  let cleaned = text.trim();

  cleaned = cleaned
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }

  return cleaned;
};

function valid(d) {
  return (
    d &&
    typeof d.word === "string" &&
    typeof d.sourceLanguage === "string" &&
    typeof d.level === "string" &&
    typeof d.explanationLanguage === "string" &&
    typeof d.simpleDefinition === "string" &&
    typeof d.translation === "string" &&
    typeof d.exampleSentence === "string" &&
    Array.isArray(d.synonyms) &&
    d.synonyms.every((x) => typeof x === "string") &&
    typeof d.learningTip === "string"
  );
}

app.post("/api/explain", async (req, res) => {
  const {
    word,
    sourceLanguage,
    level,
    explanationLanguage
  } = req.body;

  if (!word || !sourceLanguage || !level || !explanationLanguage) {
    return res.status(400).json({
      error: "All input fields are required."
    });
  }

  if (!process.env.OPENROUTER_API_KEY) {
    return res.status(500).json({
      error: "OPENROUTER_API_KEY is missing in backend/.env."
    });
  }

  const languageRules =
    explanationLanguage === "Serbian"
      ? `
Language rules for Serbian:
- Use standard Serbian.
- Use Ekavian forms.
- Use natural and grammatically correct Serbian.
- Prefer common Serbian vocabulary.
- Avoid Croatian or Bosnian variants when a normal Serbian equivalent exists.
- For example, prefer "sto" instead of "stol", "sedeti" instead of "sjediti".
- Make sentences sound natural to a native Serbian speaker.
- Pay special attention to cases, gender, number and adjective-noun agreement.
`
      : explanationLanguage === "Slovenian"
      ? `
Language rules for Slovenian:
- Use standard Slovenian.
- Use natural and grammatically correct Slovenian.
- Prefer common modern Slovenian vocabulary.
- Make sentences sound natural to a native Slovenian speaker.
- Pay special attention to cases, gender, number and adjective-noun agreement.
`
      : `
Language rules for English:
- Use natural standard English.
- Use grammatically correct English.
- Keep wording clear and appropriate for the learner's CEFR level.
`;

  const prompt = `
You are a careful language-learning assistant.

The user is learning the word "${word}".
The word is in ${sourceLanguage}.
The learner's CEFR level is ${level}.
All explanations must be written in ${explanationLanguage}.

${languageRules}

Important meaning rules:
1. First determine the most common modern meaning of the word in ${sourceLanguage}.
2. Do not translate the word based only on etymology or word formation.
3. Use the meaning that a native speaker would most likely understand first in normal everyday usage.
4. If the word has several common meanings, choose the most frequent general meaning.
5. If you are uncertain about the meaning, do not invent one.
6. The translation must match the definition and example sentence.
7. The example sentence must use the original word "${word}" naturally in ${sourceLanguage}.
8. Keep the explanation appropriate for CEFR level ${level}.
9. The simpleDefinition must be clear, natural and grammatically correct.
10. The learningTip must sound natural in ${explanationLanguage}.
11. Synonyms must be genuine synonyms of the selected meaning, not just loosely related words.
12. Return ONLY valid JSON.
13. Do not use Markdown.
14. Do not add any text before or after the JSON.

Use exactly this structure:
{
  "word": "${word}",
  "sourceLanguage": "${sourceLanguage}",
  "level": "${level}",
  "explanationLanguage": "${explanationLanguage}",
  "simpleDefinition": "short, natural definition of the most common meaning",
  "translation": "best translation into ${explanationLanguage}",
  "exampleSentence": "one natural sentence using the original word in ${sourceLanguage}",
  "synonyms": ["synonym 1", "synonym 2"],
  "learningTip": "one short, natural and useful learning tip"
}

If there are no useful synonyms, return an empty array.
`.trim();

  try {
    const r = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openrouter/free",
          messages: [
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.2,
          response_format: {
            type: "json_object"
          }
        })
      }
    );

    const body = await r.json();

    if (!r.ok) {
      return res.status(r.status).json({
        error:
          body?.error?.message ||
          "OpenRouter request failed."
      });
    }

    const content =
      body?.choices?.[0]?.message?.content;

    if (typeof content !== "string") {
      return res.status(502).json({
        error: "LLM did not return text content."
      });
    }

    let parsed;

    try {
      parsed = JSON.parse(clean(content));
    } catch {
      console.error("Invalid JSON response:", content);

      return res.status(502).json({
        error: "LLM response was not valid JSON. Try again."
      });
    }

    if (!valid(parsed)) {
      console.error("Unexpected JSON structure:", parsed);

      return res.status(502).json({
        error: "LLM returned JSON with an unexpected structure."
      });
    }

    res.json(parsed);
  } catch (e) {
    console.error(e);

    res.status(500).json({
      error: "Could not connect to the LLM service."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});