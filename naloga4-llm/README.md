# Smart Language Learning Assistant – Naloga 4: Uporaba LLM

This project implements dynamic LLM integration.

## User input
- word
- word language: English / Serbian / Slovenian
- CEFR level: A1–C1
- explanation language: English / Serbian / Slovenian

The backend dynamically creates the prompt from these values and sends it to OpenRouter.

The LLM returns JSON with:
- word
- sourceLanguage
- level
- explanationLanguage
- simpleDefinition
- translation
- exampleSentence
- synonyms
- learningTip

The frontend maps the JSON response to the TypeScript `VocabularyResponse` interface.

## Setup

### 1. API key
Create an OpenRouter API key.

Copy:
`backend/.env.example`

to:
`backend/.env`

and insert your real key:
`OPENROUTER_API_KEY=...`

Do not upload `.env` to GitHub.

### 2. Backend
```bash
cd backend
npm install
npm start
```

Backend: `http://localhost:3001`

### 3. Frontend
Open another terminal:
```bash
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173`
