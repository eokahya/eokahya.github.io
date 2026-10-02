import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {getDocument} from 'pdfjs-dist/legacy/build/pdf.mjs';
const path='dist/teaching/myz-310e/2026-fall/myz-310e-syllabus.pdf';
const doc=await getDocument({data:new Uint8Array(await readFile(path)),useSystemFonts:true}).promise;
let all='';const pages=[];
for(let i=1;i<=doc.numPages;i++){const p=await doc.getPage(i);const content=await p.getTextContent();const text=content.items.filter(x=>'str'in x).map(x=>x.str).join(' ');all+=text+'\n';const view=p.view;const outside=content.items.filter(x=>'str'in x&&x.str.trim()&&(x.transform[4]<0||x.transform[4]>view[2]||x.transform[5]<0||x.transform[5]>view[3]));if(outside.length)throw new Error(`Text outside page ${i}`);pages.push({page:i,textCharacters:text.length,outside:outside.length});}
for(const required of ['12/30','40%','AND complete both project presentations','30','15','40','100','provisional','2026-fall-v1','2026-10-02','Learning outcomes','Week 14','Research integrity'])if(!all.includes(required))throw new Error(`PDF missing: ${required}`);
for(const rule of [/Midterm examination\s+30/,/Project presentation I\s+15/,/Project presentation II\s+15/,/Final project paper\s+40/,/Total\s+100/])if(!rule.test(all))throw new Error(`PDF assessment table mismatch: ${rule}`);
await mkdir('artifacts/pdf',{recursive:true});await writeFile('artifacts/pdf/text.txt',all);await writeFile('artifacts/pdf/report.json',JSON.stringify({pages:doc.numPages,checks:pages},null,2));console.log(`PASS PDF text/assessment/geometry: ${doc.numPages} pages`);await doc.cleanup();
