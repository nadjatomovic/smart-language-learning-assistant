import {useState} from "react";
const API="http://localhost:3001";
const presets=[{language:"English",word:"environment"},{language:"Serbian",word:"okruženje"},{language:"Slovenian",word:"okolje"}];

export default function App(){
 const [selected,setSelected]=useState(0);
 const [targetLanguage,setTargetLanguage]=useState("Serbian");
 const [wordInfo,setWordInfo]=useState<any>(null);
 const [translation,setTranslation]=useState<any>(null);
 const [quiz,setQuiz]=useState<any>(null);
 const [examples,setExamples]=useState<any[]>([]);
 const [error,setError]=useState("");
 const current=presets[selected];

 async function post(path:string,body:any){
  setError("");
  const r=await fetch(`${API}${path}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
  const data=await r.json();
  if(!r.ok)throw new Error(data.error||"Request failed");
  return data;
 }

 async function info(){try{setWordInfo(await post("/api/word-info",current));}catch(e:any){setError(e.message);}}
 async function translate(){try{setTranslation(await post("/api/translate",{word:current.word,sourceLanguage:current.language,targetLanguage}));}catch(e:any){setError(e.message);}}
 async function getQuiz(){try{setQuiz(await post("/api/quiz",current));}catch(e:any){setError(e.message);}}
 function stream(){
  setExamples([]);setError("");
  const p=new URLSearchParams(current);
  const s=new EventSource(`${API}/api/examples-stream?${p.toString()}`);
  s.onmessage=e=>setExamples(prev=>[...prev,JSON.parse(e.data)]);
  s.addEventListener("end",()=>s.close());
  s.onerror=()=>s.close();
 }

 return <main className="page"><section className="card">
  <p className="eyebrow">Smart Language Learning Assistant</p>
  <h1>gRPC Vocabulary Demo</h1>

  <label>Choose word
   <select value={selected} onChange={e=>{setSelected(Number(e.target.value));setWordInfo(null);setTranslation(null);setQuiz(null);setExamples([]);}}>
    {presets.map((p,i)=><option key={i} value={i}>{p.word} ({p.language})</option>)}
   </select>
  </label>

  <div className="buttons">
   <button onClick={info}>1. Get word info</button>
   <button onClick={getQuiz}>2. Get quiz question</button>
  </div>

  <div className="translateRow">
   <select value={targetLanguage} onChange={e=>setTargetLanguage(e.target.value)}>
    <option>English</option><option>Serbian</option><option>Slovenian</option>
   </select>
   <button onClick={translate}>3. Translate word</button>
  </div>

  <button className="streamButton" onClick={stream}>4. Stream examples</button>

  {error&&<p className="error">{error}</p>}
  {wordInfo&&<section className="result"><h2>Word info</h2><p><b>Word:</b> {wordInfo.word}</p><p><b>Language:</b> {wordInfo.language}</p><p><b>Definition:</b> {wordInfo.definition}</p><p><b>Synonyms:</b> {wordInfo.synonyms.join(", ")}</p><p><b>Difficulty:</b> {wordInfo.difficulty}</p></section>}
  {translation&&<section className="result"><h2>Translation</h2><p>{translation.originalWord} → <b>{translation.translatedWord}</b></p></section>}
  {quiz&&<section className="result"><h2>Quiz</h2><p>{quiz.question}</p><ul>{quiz.options.map((o:string)=><li key={o}>{o}</li>)}</ul><p><b>Correct answer:</b> {quiz.correctAnswer}</p></section>}
  {examples.length>0&&<section className="result"><h2>Streaming examples</h2><ol>{examples.map((e:any)=><li key={e.order}>{e.sentence}</li>)}</ol></section>}
 </section></main>
}