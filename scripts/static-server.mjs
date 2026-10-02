import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
export async function startStaticServer(directory='dist',port=0){
 const root=resolve(directory);
 const server=createServer(async(req,res)=>{try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);let file=resolve(root,`.${pathname}`);if(!file.startsWith(root+sep)&&file!==root){res.writeHead(403);res.end();return;}if((await stat(file)).isDirectory())file=resolve(file,'index.html');const buffer=await readFile(file);const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'application/javascript','.svg':'image/svg+xml','.pdf':'application/pdf','.xml':'application/xml','.txt':'text/plain','.json':'application/json'};res.writeHead(200,{'content-type':types[extname(file)]||'application/octet-stream'});res.end(buffer);}catch{res.writeHead(404);res.end('Not found');}});
 await new Promise((done,fail)=>{server.once('error',fail);server.listen(port,'127.0.0.1',done)});
 return {server,url:`http://127.0.0.1:${server.address().port}`,close:()=>new Promise(done=>server.close(done))};
}
if(process.argv[1]?.endsWith('static-server.mjs')){const {url}=await startStaticServer('dist',Number(process.env.PORT||4173));console.log(`Static production preview: ${url}`);}
