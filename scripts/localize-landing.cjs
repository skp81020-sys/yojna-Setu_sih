const fs = require('fs');
const ts = require('typescript');
const filename = 'frontend/app/page.tsx';
let source = fs.readFileSync(filename,'utf8').replace(/^\uFEFF/,'');
const ast = ts.createSourceFile(filename,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
const edits=[];
function walk(node){if(ts.isJsxText(node)){const raw=node.getText(ast);const text=raw.trim();if(text&&/[A-Za-z]/.test(text)&&!['yojana','setu','AI','yojanasetu'].includes(text))edits.push({start:node.getStart(ast),end:node.getEnd(),text:`{copy(${JSON.stringify(text)})}`});}ts.forEachChild(node,walk);}
walk(ast);for(const e of edits.sort((a,b)=>b.start-a.start))source=source.slice(0,e.start)+e.text+source.slice(e.end);
source="'use client';\nimport {useState,useEffect} from 'react';\nimport {landingHindi} from '@/lib/landing-copy';\n"+source;
source=source.replace('export default function Home(){return','export default function Home(){const [lang,setLang]=useState(\'en\');useEffect(()=>{setLang(localStorage.getItem(\'ys_lang\')||\'en\');},[]);useEffect(()=>{document.documentElement.lang=lang;},[lang]);const copy=(s:string)=>lang===\'hi\'?(landingHindi[s]||s):s;return');
source=source.replace('<div className="nav-actions">','<div className="nav-actions"><button className="language-button" onClick={()=>{const next=lang===\'en\'?\'hi\':\'en\';setLang(next);localStorage.setItem(\'ys_lang\',next);}} aria-label="Change language">{lang===\'en\'?\'हिन्दी\':\'English\'}</button>');
source=source.replaceAll('<h3>{t}</h3>','<h3>{copy(t)}</h3>').replaceAll('<p>{d}</p>','<p>{copy(d)}</p>').replaceAll('<strong>{a}</strong>','<strong>{copy(a)}</strong>').replaceAll('<p>{b}</p>','<p>{copy(b)}</p>').replaceAll('{String(t)}','{copy(String(t))}').replaceAll('{String(d)}','{copy(String(d))}');
fs.writeFileSync(filename,source);
