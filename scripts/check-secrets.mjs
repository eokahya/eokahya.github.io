import {readdir,readFile} from 'node:fs/promises';
import {join} from 'node:path';
const skip=new Set(['node_modules','dist','.git','.astro','artifacts','tmp']);const problems=[];let count=0;
const patterns=[/gh[pousr]_[A-Za-z0-9]{30,}/g,/github_pat_[A-Za-z0-9_]{30,}/g,/AKIA[0-9A-Z]{16}/g,/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g,/sk-[A-Za-z0-9]{40,}/g];
async function walk(dir){for(const e of await readdir(dir,{withFileTypes:true})){if(skip.has(e.name))continue;const p=join(dir,e.name);if(e.isDirectory())await walk(p);else{if(/^\.env(?:\.|$)/.test(e.name))problems.push(`${p}: environment file`);if(e.name.endsWith('.pdf'))continue;const text=await readFile(p,'utf8');count++;for(const pattern of patterns){pattern.lastIndex=0;if(pattern.test(text))problems.push(`${p}: possible credential (value suppressed)`);}}}}
await walk('.');if(problems.length){console.error(problems.join('\n'));process.exit(1);}console.log(`PASS credential patterns: ${count} source/config/document files (manual diff review still required before public push)`);
