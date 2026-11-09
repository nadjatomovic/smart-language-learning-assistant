import { FormEvent, useState } from "react";
import type { VocabularyResponse } from "./types";

const API_URL = "http://localhost:3001/api/explain";

export default function App() {
  const [word,setWord]=useState("");
  const [sourceLanguage,setSourceLanguage]=useState("English");
  const [level,setLevel]=useState("A2");
  const [explanationLanguage,setExplanationLanguage]=useState("Serbian");
  const [result,setResult]=useState<VocabularyResponse|null>(null);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");

  async function submit(e:FormEvent){
    e.preventDefault();
    if(!word.trim()){setError("Enter a word.");return;}
    setLoading(true); setError(""); setResult(null);
    try{
      const r=await fetch(API_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({word:word.trim(),sourceLanguage,level,explanationLanguage})});
      const data=await r.json();
      if(!r.ok) throw new Error(data.error||"Request failed.");
      setResult(data as VocabularyResponse);
    }catch(err){setError(err instanceof Error?err.message:"Unknown error.");}
    finally{setLoading(false);}
  }

  return <main className="page"><section className="panel">
    <p className="eyebrow">Smart Language Learning Assistant</p>
    <h1>AI Vocabulary Helper</h1>
    <p className="intro">Enter a word and choose your learning context. The explanation is generated dynamically by an LLM.</p>

    <form onSubmit={submit} className="form">
      <label>Word<input value={word} onChange={e=>setWord(e.target.value)} placeholder="environment / okruženje / okolje"/></label>
      <label>Word language<select value={sourceLanguage} onChange={e=>setSourceLanguage(e.target.value)}><option>English</option><option>Serbian</option><option>Slovenian</option></select></label>
      <label>Level<select value={level} onChange={e=>setLevel(e.target.value)}><option>A1</option><option>A2</option><option>B1</option><option>B2</option><option>C1</option></select></label>
      <label>Explanation language<select value={explanationLanguage} onChange={e=>setExplanationLanguage(e.target.value)}><option>English</option><option>Serbian</option><option>Slovenian</option></select></label>
      <button disabled={loading}>{loading?"Generating...":"Explain with AI"}</button>
    </form>

    {error && <p className="error">{error}</p>}

    {result && <article className="result">
      <div className="resultHeader"><div><p className="eyebrow">{result.sourceLanguage} · {result.level}</p><h2>{result.word}</h2></div><span>{result.explanationLanguage}</span></div>
      <dl>
        <div><dt>Simple definition</dt><dd>{result.simpleDefinition}</dd></div>
        <div><dt>Translation</dt><dd>{result.translation}</dd></div>
        <div><dt>Example sentence</dt><dd>{result.exampleSentence}</dd></div>
        <div><dt>Synonyms</dt><dd>{result.synonyms.length?result.synonyms.join(", "):"—"}</dd></div>
        <div><dt>Learning tip</dt><dd>{result.learningTip}</dd></div>
      </dl>
    </article>}
  </section></main>
}