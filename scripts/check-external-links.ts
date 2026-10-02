import {mkdir,writeFile} from 'node:fs/promises';
import {profile} from '../src/data/profile';
import {course} from '../src/data/course';
const urls=[...profile.links.map(p=>p.url),...course.resources.map(p=>p.url),'https://ninova.itu.edu.tr/en/courses/faculty-of-science-and-letters/37319/myz-310e/','https://ninova.itu.edu.tr/en/courses/faculty-of-science-and-letters/37319/myz-310e/form'];
const results=await Promise.all(urls.map(async url=>{try{const r=await fetch(url,{signal:AbortSignal.timeout(25000),headers:{'user-agent':'AcademicWebsiteVerification/1.0'},redirect:'follow'});await r.body?.cancel();return {url,finalUrl:r.url,httpStatus:r.status,status:r.ok?'VERIFIED':([403,429].includes(r.status)||r.status>=500?'BLOCKED':'REVIEW')};}catch(e){return {url,status:'BLOCKED',reason:e instanceof Error?e.message:String(e)};}}));
await mkdir('artifacts',{recursive:true});await writeFile('artifacts/external-links.json',JSON.stringify({checkedOn:'2026-10-02',results},null,2));for(const r of results)console.log(JSON.stringify(r));if(results.some(r=>r.status==='REVIEW'))process.exitCode=1;
