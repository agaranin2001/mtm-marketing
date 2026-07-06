import { createRouter, RouterProvider } from '@tanstack/react-router'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initI18n } from './lib/i18n'
import { routeTree } from './routeTree.gen'
import './index.css'

// Self-contained marketing site: initialize i18n from the bundled English
// fallback (plus the user's stored locale preference) before first paint.
const locale = localStorage.getItem('preferred_language') ?? 'en'
initI18n(undefined, locale)

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const root = document.getElementById('root')
if (!root)
  throw new Error('#root element not found')

createRoot(root).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
