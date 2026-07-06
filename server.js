import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'

// Minimal Node static server for the built marketing site.
//   dist/            → React SPA (landing + /knowledge-hub)
//   dist/docs/*      → VitePress docs (built with base '/docs/')
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dist = path.join(__dirname, 'dist')
const port = process.env.PORT || 3000

const app = express()

// VitePress cleanUrls: for an extensionless request, serve `<path>.html` when it
// exists. This must run BEFORE express.static so a guide page (e.g.
// /docs/guide/foo → foo.html) wins over a same-named lessons directory
// (foo/), which express.static would otherwise 301-redirect to.
app.get('*', (req, res, next) => {
  if (path.extname(req.path))
    return next()
  const htmlPath = path.join(dist, `${decodeURIComponent(req.path)}.html`)
  if (fs.existsSync(htmlPath))
    return res.sendFile(htmlPath)
  next()
})

// Serve built static files (assets, images, docs directory indexes).
app.use(express.static(dist))

// SPA history fallback: any route that isn't a real file returns index.html
// so TanStack Router deep-links (e.g. /knowledge-hub) load correctly.
app.get('*', (_req, res) => {
  res.sendFile(path.join(dist, 'index.html'))
})

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Marketing site running on http://localhost:${port}`)
})
