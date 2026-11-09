export interface VocabularyResponse {
  word: string;
  sourceLanguage: string;
  level: string;
  explanationLanguage: string;
  simpleDefinition: string;
  translation: string;
  exampleSentence: string;
  synonyms: string[];
  learningTip: string;
}