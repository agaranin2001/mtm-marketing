import { defineConfig } from 'vitepress'
import tailwindcss from '@tailwindcss/vite'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Knowledge Hub',
  description: 'Monetiseur Talent Management — guides and documentation for athletes and coaches',
  cleanUrls: true,
  // Mounted at /docs on the marketing site (the React Knowledge Hub page links
  // to /docs/guide/:id). Build output lands in the SPA's dist so the Node
  // server serves the site and the docs from one folder.
  base: '/docs/',
  outDir: '../dist/docs',
  head: [
    ['script', { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-8GL8GJMVK8' }],
    ['script', {}, [
      'window.dataLayer = window.dataLayer || [];',
      'function gtag(){dataLayer.push(arguments);}',
      'gtag(\'js\', new Date());',
      'gtag(\'config\', \'G-8GL8GJMVK8\');',
    ].join('\n')],
  ],
  // The custom theme (.vitepress/theme) owns all chrome; no default nav/sidebar.
  vite: {
    plugins: [tailwindcss()],
    // Own port (the frontend dev server owns 5173); proxied at /knowledge-hub.
    server: { port: 5174, strictPort: true },
  },
})
