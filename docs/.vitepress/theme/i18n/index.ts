import { computed, ref } from 'vue'
import en from './en.json'
import et from './et.json'
import ru from './ru.json'

type Dict = Record<string, string>

const DICTS: Record<string, Dict> = { en, et, ru }
const STORAGE_KEY = 'kh_lang'

// Default to 'en' on both server and first client render to avoid hydration
// mismatches; the stored preference is applied in onMounted via initLangFromStorage().
const lang = ref<'en' | 'et' | 'ru'>('en')

/** Apply the persisted language after hydration (client-only). */
export function initLangFromStorage(): void {
  if (typeof localStorage === 'undefined')
    return
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored && stored in DICTS)
    lang.value = stored as 'en' | 'et' | 'ru'
}

export function useI18n() {
  /** Look up a flattened key in the current language, falling back to the English string. */
  const t = (key: string, fallback: string): string => DICTS[lang.value]?.[key] ?? fallback

  const setLang = (code: string): void => {
    const lc = code.toLowerCase()
    if (!(lc in DICTS))
      return
    lang.value = lc as 'en' | 'et' | 'ru'
    if (typeof localStorage !== 'undefined')
      localStorage.setItem(STORAGE_KEY, lc)
  }

  /** Uppercase language code (EN/ET/RU) for display, matching the React version. */
  const language = computed(() => lang.value.toUpperCase())

  return { t, lang, setLang, language }
}
