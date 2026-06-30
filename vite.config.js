import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// In-memory rooms cache for local development
const localRooms = new Map();

// Local Dev API Mock Plugin
const localApiSharePlugin = {
  name: 'local-api-share',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url.startsWith('/api/share')) {
        const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
        const id = urlObj.searchParams.get('id');

        if (req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          if (!id) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Missing id parameter' }));
            return;
          }
          const room = localRooms.get(id);
          if (!room) {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: 'Room not found' }));
            return;
          }
          res.statusCode = 200;
          res.end(JSON.stringify(room));
          return;
        }

        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const payload = JSON.parse(body);
              if (!payload.id || !payload.data) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Invalid payload' }));
                return;
              }
              localRooms.set(payload.id, payload.data);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ ok: true }));
            } catch {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Internal server error' }));
            }
          });
          return;
        }
      }
      next();
    });
  }
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), localApiSharePlugin],
  server: {
    proxy: {
      '/api/wandbox': {
        target: 'https://wandbox.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/wandbox/, '/api'),
      }
    }
  }
})
