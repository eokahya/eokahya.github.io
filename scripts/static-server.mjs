// Minimal static server for the production build (dist/). Used by the PDF step and browser checks.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { gzipSync } from 'node:zlib';

const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.webp': 'image/webp',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.pdf': 'application/pdf', '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8', '.json': 'application/json', '.webmanifest': 'application/manifest+json',
};

export async function startStaticServer(directory = 'dist', port = 0) {
  const root = resolve(directory);
  const notFound = async (res) => {
    try { res.writeHead(404, { 'content-type': types['.html'] }); res.end(await readFile(resolve(root, '404.html'))); }
    catch { res.writeHead(404); res.end('Not found'); }
  };
  const server = createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname);
      let file = resolve(root, `.${pathname}`);
      if (file !== root && !file.startsWith(root + sep)) { res.writeHead(403); res.end(); return; }
      const info = await stat(file).catch(() => null);
      if (!info) return notFound(res);
      if (info.isDirectory()) {
        if (!pathname.endsWith('/')) { res.writeHead(301, { location: `${pathname}/` }); res.end(); return; }
        file = resolve(file, 'index.html');
      }
      const body = await readFile(file).catch(() => null);
      if (!body) return notFound(res);
      const type = types[extname(file)] ?? 'application/octet-stream';
      // GitHub Pages compresses text responses; do the same so local measurements are realistic.
      const compressible = /^(text\/|application\/(json|xml|manifest)|image\/svg)/.test(type) && /\bgzip\b/.test(req.headers['accept-encoding'] ?? '');
      const payload = compressible ? gzipSync(body) : body;
      res.writeHead(200, { 'content-type': type, 'cache-control': 'no-store', ...(compressible ? { 'content-encoding': 'gzip', vary: 'Accept-Encoding' } : {}) });
      res.end(payload);
    } catch {
      res.writeHead(500); res.end('Server error');
    }
  });
  await new Promise((done, fail) => { server.once('error', fail); server.listen(port, '127.0.0.1', done); });
  const address = server.address();
  return { server, url: `http://127.0.0.1:${address.port}`, close: () => new Promise((done) => server.close(done)) };
}

if (process.argv[1]?.endsWith('static-server.mjs')) {
  const { url } = await startStaticServer('dist', Number(process.env.PORT ?? 4173));
  console.log(`Static production preview: ${url}`);
}
