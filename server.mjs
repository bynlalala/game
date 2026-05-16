import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';

const PORT = Number(process.env.PORT ?? 5173);
const ROOT = process.cwd();

const CONTENT_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webmanifest': 'application/manifest+json; charset=utf-8'
};

function getFilePath(requestUrl) {
  const url = new URL(requestUrl, `http://127.0.0.1:${PORT}`);
  const decodedPath = decodeURIComponent(url.pathname);
  const safePath = normalize(decodedPath).replace(/^([/\\])+/, '');
  const requestedPath = resolve(join(ROOT, safePath));

  if (!requestedPath.startsWith(ROOT)) {
    return null;
  }

  if (!existsSync(requestedPath)) {
    return null;
  }

  if (statSync(requestedPath).isDirectory()) {
    return join(requestedPath, 'index.html');
  }

  return requestedPath;
}

const server = createServer((request, response) => {
  const filePath = getFilePath(request.url ?? '/');

  if (!filePath || !existsSync(filePath)) {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    response.end('找不到檔案');
    return;
  }

  response.writeHead(200, {
    'content-type': CONTENT_TYPES[extname(filePath)] ?? 'application/octet-stream'
  });
  createReadStream(filePath).pipe(response);
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`喵喵小屋已啟動：http://127.0.0.1:${PORT}`);
  console.log('請保持這個視窗開著。要停止伺服器請按 Ctrl + C。');
});
