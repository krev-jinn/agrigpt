import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

function ttsProxyPlugin() {
  return {
    name: 'tts-proxy-plugin',
    configureServer(server) {
      server.middlewares.use('/api/tts', async (req, res) => {
        try {
          const url = new URL(req.url, 'http://localhost:5173');
          const q = url.searchParams.get('q') || '';
          const tl = url.searchParams.get('tl') || 'ta';
          if (!q) {
            res.statusCode = 400;
            res.end('Missing query');
            return;
          }
          const targetUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(q)}&tl=${tl}&client=tw-ob`;
          const response = await fetch(targetUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
          });
          if (!response.ok) {
            res.statusCode = response.status;
            res.end(`Upstream TTS error: ${response.status}`);
            return;
          }
          res.setHeader('Content-Type', 'audio/mpeg');
          res.setHeader('Access-Control-Allow-Origin', '*');
          const arrayBuffer = await response.arrayBuffer();
          res.end(Buffer.from(arrayBuffer));
        } catch (err) {
          res.statusCode = 500;
          res.end(err.message || 'TTS Error');
        }
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), ttsProxyPlugin()],
  base: './', // Ensures relative assets work on GitHub Pages
})
