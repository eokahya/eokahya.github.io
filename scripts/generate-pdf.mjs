import {chromium} from 'playwright';
import {mkdir,rm,rename,readFile} from 'node:fs/promises';
import {PDFDocument} from 'pdf-lib';
import {startStaticServer} from './static-server.mjs';
const path='dist/teaching/myz-310e/2026-fall/myz-310e-syllabus.pdf';
// Remove stale artifacts before generation: an error must never publish an old syllabus.
await rm(path,{force:true});await rm(`${path}.tmp`,{force:true});
const preview=await startStaticServer();let browser;
try{
 browser=await chromium.launch({headless:true});const page=await browser.newPage();
 const response=await page.goto(`${preview.url}/teaching/myz-310e/2026-fall/syllabus/`,{waitUntil:'networkidle'});
 if(response?.status()!==200)throw new Error('Print syllabus route did not return 200');
 await page.emulateMedia({media:'print',colorScheme:'light'});
 await page.evaluate(()=>document.fonts.ready);
 const sourceVersion=await page.locator('[data-course-version]').getAttribute('data-course-version');
 await mkdir('dist/teaching/myz-310e/2026-fall',{recursive:true});
 await page.pdf({path:`${path}.tmp`,format:'A4',preferCSSPageSize:true,tagged:true,outline:true,printBackground:true,displayHeaderFooter:true,headerTemplate:'<div></div>',footerTemplate:`<div style="font-size:8px;color:#526368;width:100%;margin:0 16mm;display:flex;justify-content:space-between"><span>MYZ 310E · Fall 2026 · ${sourceVersion}</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`});
 const bytes=await readFile(`${path}.tmp`);const doc=await PDFDocument.load(bytes);if(doc.getPageCount()<1)throw new Error('No PDF pages');
 await rename(`${path}.tmp`,path);console.log(`Syllabus PDF generated: ${doc.getPageCount()} pages, ${bytes.length} bytes, source ${sourceVersion}`);
}finally{if(browser)await browser.close();await preview.close();}
