import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'

const SITES_ROOT = path.resolve(__dirname, '..')

function serveSites() {
  const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
  }

  // Short prefixes map to site directories
  const siteMap = {
    '/g/': 'gemma',
    '/gf/': 'gemma_frontend',
    '/l/': 'glm',
    '/lf/': 'glm_frontend',
    '/q/': 'qwen',
    '/qf/': 'qwen_frontend',
    '/q27/': 'qwen27',
    '/qf27/': 'qwen27_frontend',
  }

  function serveFile(resolved, res) {
    const ext = path.extname(resolved)
    res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream')
    fs.createReadStream(resolved).pipe(res)
  }

  return {
    name: 'serve-sites',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url) return next()

        for (const [prefix, dir] of Object.entries(siteMap)) {
          if (req.url.startsWith(prefix) || req.url === prefix.slice(0, -1)) {
            const relativePath = req.url.slice(prefix.length - 1) // keep leading /
            const filePath = path.join(SITES_ROOT, dir, relativePath)
            const resolved = path.resolve(filePath)

            if (!resolved.startsWith(SITES_ROOT)) {
              res.statusCode = 403
              res.end()
              return
            }

            if (fs.existsSync(resolved) && fs.statSync(resolved).isFile()) {
              return serveFile(resolved, res)
            }

            const indexPath = path.join(resolved, 'index.html')
            if (fs.existsSync(indexPath)) {
              return serveFile(indexPath, res)
            }

            res.statusCode = 404
            res.end()
            return
          }
        }

        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    serveSites(),
  ],
  server: {
    port: 43234,
    host: true,
    allowedHosts: true,
    fs: {
      allow: ['..'],
    },
  },
  preview: {
    port: 43234,
    host: true,
    allowedHosts: true,
  },
})
