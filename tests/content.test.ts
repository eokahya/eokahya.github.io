import test from 'node:test';
import assert from 'node:assert/strict';
import {publications,publicationSnapshot} from '../src/data/publications';
import {researchAreas} from '../src/data/research';
import {profile} from '../src/data/profile';

test('bibliography is deduplicated and every record has its evidence',()=>{
 for(const key of ['id','doi','arxiv'] as const){const values=publications.map(p=>p[key]).filter(Boolean);assert.equal(new Set(values).size,values.length,`Duplicate ${key}`);}
 for(const p of publications){assert(p.title.trim());assert(p.authors.some(a=>/Kahya/.test(a))||p.authors.includes('CosmoVerse Network')); assert(Number.isInteger(p.year)&&p.year<=2026);assert(new URL(p.link).protocol==='https:');assert(p.sourceUrls.length>0);assert.equal(p.verifiedOn,publicationSnapshot.verifiedOn);}
 assert.equal(profile.orcid,'0000-0003-2760-7091');
});
test('research evidence resolves to actual records and current direction is labelled',()=>{
 for(const r of researchAreas)for(const id of r.evidence)assert(publications.some(p=>p.id===id),`Missing evidence ${id}`);
 const direction=researchAreas.find(r=>r.id==='interpretability');assert.equal(direction?.status,'Current research direction');assert.deepEqual(direction?.evidence,[]);
});
