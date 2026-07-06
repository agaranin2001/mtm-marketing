import { IMAGES } from '@/lib/assets'

// EOK-branded experience is limited to these accounts (matched by email).
// Add more addresses here to extend the EOK brand to additional users.
export const EOK_EMAILS = ['erki.nool@eok.ee']

export type Brand = 'monetiseur' | 'eok'

export function isEokUser(user: { email?: string | null } | null | undefined): boolean {
  const email = user?.email?.toLowerCase().trim()
  return !!email && EOK_EMAILS.includes(email)
}

const BRAND_HEAD: Record<Brand, { title: string, favicon: string }> = {
  monetiseur: { title: 'Monetiseur – Talent Management', favicon: IMAGES.brand.favicon },
  eok: { title: 'Estonian National Olympic Committee', favicon: IMAGES.brand.faviconSvg },
}

// Sets the document <title> and favicon to match the given brand at runtime.
export function applyBrandHead(brand: Brand): void {
  if (typeof document === 'undefined')
    return
  const { title, favicon } = BRAND_HEAD[brand]
  document.title = title
  let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
  if (!link) {
    link = document.createElement('link')
    link.rel = 'icon'
    document.head.appendChild(link)
  }
  link.href = favicon
}
