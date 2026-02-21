import 'zone.js/node';

import { APP_BASE_HREF } from '@angular/common';
import { renderApplication } from '@angular/platform-server';
import * as express from 'express';
import { existsSync } from 'fs';
import { join } from 'path';
import { createProxyMiddleware } from 'http-proxy-middleware';
import * as fs from 'fs';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/stacionar-site/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  // Custom engine for standalone components
  server.engine('html', async (path, options, callback) => {
    try {
      const document = fs.readFileSync(path, 'utf-8');
      const { req } = { ...options } as { req: express.Request, res: express.Response };
      
      const html = await renderApplication(() => {
         return import('./src/bootstrap.server').then(m => m.default());
       }, {
         document: document,
         url: `${req.protocol}://${req.get('host')}${req.originalUrl}`
       });
      
      callback(null, html);
    } catch (err) {
      callback(err as Error);
    }
  });

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // API proxy to external server (must be before static files and universal routes)
  console.log('Setting up API proxy for /api routes');
  server.use('/api', (req, res, next) => {
    console.log('API request received:', req.method, req.url);
    next();
  }, createProxyMiddleware({
    target: 'https://front-api.nmpansion.ru',
    changeOrigin: true,
    secure: true,
    logLevel: 'debug',
    onProxyReq: (proxyReq, req, res) => {
      // Add authorization header
      proxyReq.setHeader('Authorization', 'Bearer 0cacc14d6b6cc78223a8197c01a61c69388c27cf6e8bde1ed36b08625720e5e4094cff52f0608f54b74112dd212813362bec1a0590b67dd73737890a2c7b9d801a4caebeb9a690e28b37adf8861e549f365be427e2c5924e7233cf3e9894a31ed49884b2e500e8cb6527b05fa6e6a3d20c8276a68481e3a2542facd8d1b85570');
      console.log('Proxying request to:', proxyReq.path);
    },
    onError: (err, req, res) => {
      console.error('Proxy error:', err);
      res.status(500).json({ error: 'API proxy error' });
    }
  }));
  
  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    res.render(indexHtml, { req });
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
