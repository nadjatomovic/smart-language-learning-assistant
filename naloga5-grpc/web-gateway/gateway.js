import express from "express";
import cors from "cors";
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";

const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);
const def=protoLoader.loadSync(path.join(__dirname,"../proto/vocabulary.proto"),{keepCase:true,longs:String,enums:String,defaults:true,oneofs:true});
const proto=grpc.loadPackageDefinition(def).vocabulary;
const client=new proto.VocabularyService("localhost:50051",grpc.credentials.createInsecure());

const app=express();
app.use(cors());
app.use(express.json());

const fail=(res,e)=>res.status(500).json({error:e?.details||e?.message||"gRPC request failed."});

app.post("/api/word-info",(req,res)=>client.GetWordInfo(req.body,(e,r)=>e?fail(res,e):res.json(r)));
app.post("/api/translate",(req,res)=>client.TranslateWord(req.body,(e,r)=>e?fail(res,e):res.json(r)));
app.post("/api/quiz",(req,res)=>client.GetQuizQuestion(req.body,(e,r)=>e?fail(res,e):res.json(r)));

app.get("/api/examples-stream",(req,res)=>{
 const {word,language}=req.query;
 res.setHeader("Content-Type","text/event-stream");
 res.setHeader("Cache-Control","no-cache");
 res.setHeader("Connection","keep-alive");
 const stream=client.StreamExamples({word,language});
 stream.on("data",d=>res.write(`data: ${JSON.stringify(d)}\n\n`));
 stream.on("end",()=>{res.write("event: end\ndata: done\n\n");res.end();});
 stream.on("error",e=>{res.write(`event: error\ndata: ${JSON.stringify({error:e.details||e.message})}\n\n`);res.end();});
 req.on("close",()=>stream.cancel());
});

app.listen(3001,()=>console.log("Web gateway running on http://localhost:3001"));
