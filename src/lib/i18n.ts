import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import fallback from '@/locales/en/common.json'

/** Right-to-left UI locales. */
export const RTL_LOCALES = new Set(['ar', 'fa', 'he', 'ur'])

export function isRtl(locale: string | undefined | null): boolean {
  return !!locale && RTL_LOCALES.has(locale.split('-')[0])
}

/** Reflect the active locale's direction on <html> so CSS + logical properties flip. */
function applyDocumentDirection(locale: string): void {
  if (typeof document === 'undefined')
    return
  document.documentElement.lang = locale
  document.documentElement.dir = isRtl(locale) ? 'rtl' : 'ltr'
}

function flatten(obj: Record<string, unknown>, prefix = ''): Record<string, string> {
  const result: Record<string, string> = {}
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(result, flatten(value as Record<string, unknown>, path))
    }
    else {
      result[path] = String(value)
    }
  }
  return result
}

const flatFallback = flatten(fallback)

/**
 * Initialize i18n with translations fetched from /api/translations.
 * Server translations use dot-notation keys — merge directly over the static fallback.
 *
 * Called twice:
 *  1. main.tsx — no args, sets up i18next with static fallback for pre-auth pages (login)
 *  2. _auth.tsx — with server translations, re-initializes with full 1300+ keys
 *
 * On the second call we must emit a languageChanged event so react-i18next
 * hooks re-render with the new resources.
 */
export function initI18n(serverTranslations?: Record<string, string>, locale?: string) {
  const lng = locale ?? 'en'
  const resources = { ...flatFallback, ...(serverTranslations ?? {}) }

  applyDocumentDirection(lng)

  if (i18n.isInitialized) {
    i18n.addResourceBundle(lng, 'common', resources, true, true)
    // Force react-i18next hooks to re-render with new resources
    i18n.changeLanguage(lng)
    return
  }

  i18n.use(initReactI18next).init({
    resources: {
      [lng]: { common: resources },
    },
    lng,
    fallbackLng: 'en',
    defaultNS: 'common',
    keySeparator: false,
    interpolation: { escapeValue: false },
  })
}

export default i18n
