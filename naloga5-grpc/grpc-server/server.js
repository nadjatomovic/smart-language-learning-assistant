import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";

const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);
const PROTO_PATH=path.join(__dirname,"../proto/vocabulary.proto");

const def=protoLoader.loadSync(PROTO_PATH,{keepCase:true,longs:String,enums:String,defaults:true,oneofs:true});
const proto=grpc.loadPackageDefinition(def).vocabulary;

const words={
 "English:environment":{
  word:"environment",language:"English",
  definition:"The natural world and the conditions in which people, animals and plants live.",
  synonyms:["surroundings","setting"],difficulty:2,
  translations:{Serbian:"okruženje",Slovenian:"okolje"},
  examples:["We should protect the environment.","A quiet environment helps me study.","The school provides a friendly learning environment."]
 },
 "Serbian:okruženje":{
  word:"okruženje",language:"Serbian",
  definition:"Prostor, uslovi ili ljudi koji se nalaze oko nekoga ili nečega.",
  synonyms:["sredina","okolina"],difficulty:2,
  translations:{English:"environment",Slovenian:"okolje"},
  examples:["Ovo je prijatno okruženje za rad.","Detetu je potrebno bezbedno okruženje.","Novo poslovno okruženje zahteva prilagođavanje."]
 },
 "Slovenian:okolje":{
  word:"okolje",language:"Slovenian",
  definition:"Prostor in razmere, v katerih ljudje, živali ali rastline živijo.",
  synonyms:["okolica","sredina"],difficulty:2,
  translations:{English:"environment",Serbian:"okruženje"},
  examples:["Varovati moramo okolje.","Mirno okolje je dobro za učenje.","Delovno okolje je zelo prijetno."]
 }
};

const find=(w,l)=>words[`${l}:${w.toLowerCase()}`];

function GetWordInfo(call,cb){
 const x=find(call.request.word,call.request.language);
 if(!x)return cb({code:grpc.status.NOT_FOUND,message:"Word not found."});
 cb(null,{word:x.word,language:x.language,definition:x.definition,synonyms:x.synonyms,difficulty:x.difficulty});
}
function TranslateWord(call,cb){
 const x=find(call.request.word,call.request.sourceLanguage);
 if(!x)return cb({code:grpc.status.NOT_FOUND,message:"Word not found."});
 const t=x.translations[call.request.targetLanguage];
 if(!t)return cb({code:grpc.status.INVALID_ARGUMENT,message:"Translation not available."});
 cb(null,{originalWord:x.word,translatedWord:t,sourceLanguage:x.language,targetLanguage:call.request.targetLanguage});
}
function GetQuizQuestion(call,cb){
 const x=find(call.request.word,call.request.language);
 if(!x)return cb({code:grpc.status.NOT_FOUND,message:"Word not found."});
 const map={
  environment:["okruženje","prozor","vreme","grad"],
  okruženje:["environment","window","weather","street"],
  okolje:["environment","table","school","book"]
 };
 const options=map[x.word];
 cb(null,{question:`Choose the correct translation for "${x.word}".`,options,correctAnswer:options[0]});
}
function StreamExamples(call){
 const x=find(call.request.word,call.request.language);
 if(!x){call.emit("error",{code:grpc.status.NOT_FOUND,message:"Word not found."});return;}
 let i=0;
 const send=()=>{
  if(i>=x.examples.length){call.end();return;}
  call.write({sentence:x.examples[i],order:i+1});
  i++;
  setTimeout(send,700);
 };
 send();
}

const server=new grpc.Server();
server.addService(proto.VocabularyService.service,{GetWordInfo,TranslateWord,GetQuizQuestion,StreamExamples});
server.bindAsync("0.0.0.0:50051",grpc.ServerCredentials.createInsecure(),(err,port)=>{
 if(err) return console.error(err);
 console.log(`gRPC server running on port ${port}`);
});
