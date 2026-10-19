# Smart Language Learning Assistant

Project for the course **Tehnologije integracije in digitalizacije storitev**.

## Project idea

Smart Language Learning Assistant is a web application for learning vocabulary in multiple languages.

The initial version will support:

- English
- Slovenian
- Serbian

The application will combine data from multiple external services and provide:

- translations
- dictionary definitions
- part of speech
- synonyms
- example sentences
- pronunciation
- personal vocabulary
- quizzes
- progress statistics

For English, the application will provide an extended vocabulary card using external dictionary data. For Slovenian and Serbian, translations and pronunciation will be combined with additional lexical data stored in the application's internal database.

## Planned technologies

### Backend

- Java
- Spring Boot
- Spring Data JPA

### Frontend

- React
- TypeScript
- Vite

### Database

- PostgreSQL
- Docker Compose

## External services

- Free Dictionary API
- Google Cloud Translation API
- Google Cloud Text-to-Speech API

## Main features

- Word search
- Translation
- Dictionary information
- Pronunciation
- Example sentences
- Personal vocabulary
- NEW / LEARNING / LEARNED word status
- Different quiz question types
- Quiz statistics
- Identification of weak words
- Progress tracking

## Repository structure

Course assignments will be stored in separate directories.

- `naloga1-xml-json/` – XML and JSON assignment
- `backend/` – Spring Boot backend *(planned)*
- `frontend/` – React frontend *(planned)*

## Current progress

### Naloga 1 – XML and JSON

The first assignment demonstrates:

- reading and deserializing XML files,
- connecting data through IDs,
- filtering connected data,
- exporting filtered results to JSON,
- exporting filtered results to XML.

More information and instructions for running the assignment are available in:

`naloga1-xml-json/README.md`
