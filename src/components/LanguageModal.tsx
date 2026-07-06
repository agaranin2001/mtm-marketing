import type { RefObject } from 'react'
import { ChevronDown, X } from 'lucide-react'
import { useEffect } from 'react'
import { COUNTRIES } from '@/lib/countries'

interface Country {
  code: string
  name: string
}

interface Language {
  code: string
  name: string
  nameKey: string
  main: boolean
}

type TFn = (key: string, fallback: string, vars?: Record<string, unknown>) => string

interface LanguageModalProps {
  open: boolean
  onClose: () => void
  t: TFn
  languages: readonly Language[]
  language: string
  onSelectLanguage: (code: string) => void
  country: Country
  onSelectCountry: (country: Country) => void
  countryDropdownOpen: boolean
  setCountryDropdownOpen: (open: boolean | ((o: boolean) => boolean)) => void
  countryDropdownRef: RefObject<HTMLDivElement | null>
  countrySearch: string
  setCountrySearch: (value: string) => void
  languageDropdownOpen: boolean
  setLanguageDropdownOpen: (open: boolean | ((o: boolean) => boolean)) => void
  languageDropdownRef: RefObject<HTMLDivElement | null>
}

/** Shared region/language modal for the landing and knowledge-hub pages — full mobile bottom-sheet + desktop dialog. */
export default function LanguageModal({
  open,
  onClose,
  t,
  languages,
  language,
  onSelectLanguage,
  country,
  onSelectCountry,
  countryDropdownOpen,
  setCountryDropdownOpen,
  countryDropdownRef,
  countrySearch,
  setCountrySearch,
  languageDropdownOpen,
  setLanguageDropdownOpen,
  languageDropdownRef,
}: LanguageModalProps) {
  // Lock background scroll while the modal is open so the wheel scrolls the
  // dropdown lists instead of the page behind. position:fixed is the reliable
  // technique — plain overflow:hidden doesn't always stop the document scroll.
  useEffect(() => {
    if (!open)
      return
    const scrollY = window.scrollY
    const body = document.body
    const prev = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
    }
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.left = '0'
    body.style.right = '0'
    body.style.width = '100%'
    body.style.overflow = 'hidden'
    return () => {
      body.style.position = prev.position
      body.style.top = prev.top
      body.style.left = prev.left
      body.style.right = prev.right
      body.style.width = prev.width
      body.style.overflow = prev.overflow
      window.scrollTo(0, scrollY)
    }
  }, [open])

  if (!open)
    return null

  const body = (
    <>
      {/* Country dropdown */}
      <div>
        <label className="mb-2 block text-[12px] font-semibold uppercase tracking-wide text-[#070233]/50">{t('landing.modal.country', 'Country')}</label>
        <div className="relative" ref={countryDropdownRef}>
          <button
            type="button"
            onClick={() => setCountryDropdownOpen(o => !o)}
            className="flex w-full cursor-pointer items-center justify-between rounded-brand px-4 py-3 text-[14px] text-[#070233]"
            style={{ boxShadow: 'inset 0 0 0 1px rgba(7,2,51,0.15)' }}
          >
            <span className="flex items-center gap-3">
              <span className="h-5 w-5 shrink-0 overflow-hidden rounded-full" style={{ boxShadow: 'inset 0 0 0 1px rgba(7,2,51,0.15)' }}>
                <img src={`https://flagcdn.com/w40/${country.code}.png`} alt={country.name} className="h-full w-full object-cover" />
              </span>
              {country.name}
            </span>
            <ChevronDown className={`h-4 w-4 shrink-0 transition-transform duration-200 ${countryDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {countryDropdownOpen && (
            <div className="absolute left-0 right-0 top-full z-10 mt-2 overflow-hidden rounded-brand bg-white" style={{ boxShadow: '0 4px 24px rgba(7,2,51,0.12), inset 0 0 0 1px #E4E9F1' }}>
              <div className="p-2">
                <input
                  autoFocus
                  value={countrySearch}
                  onChange={e => setCountrySearch(e.target.value)}
                  placeholder={t('landing.modal.searchCountry', 'Search country')}
                  className="w-full rounded-brand px-3 py-2 text-[16px] text-[#070233] outline-none md:text-[13px]"
                  style={{ backgroundColor: '#F8FAFD' }}
                />
              </div>
              <div style={{ maxHeight: '15rem', overflowY: 'auto', overscrollBehavior: 'contain' }}>
                {COUNTRIES.filter(c => c.name.toLowerCase().includes(countrySearch.toLowerCase())).map(c => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => { onSelectCountry(c); setCountryDropdownOpen(false); setCountrySearch('') }}
                    className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left text-[14px] text-[#070233] transition-colors hover:bg-[#F8FAFD]"
                  >
                    <span className="h-5 w-5 shrink-0 overflow-hidden rounded-full" style={{ boxShadow: 'inset 0 0 0 1px rgba(7,2,51,0.15)' }}>
                      <img src={`https://flagcdn.com/w40/${c.code}.png`} alt={c.name} className="h-full w-full object-cover" />
                    </span>
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Language dropdown */}
      <div>
        <label className="mb-2 block text-[12px] font-semibold uppercase tracking-wide text-[#070233]/50">{t('landing.modal.language', 'Language')}</label>
        <div className="relative" ref={languageDropdownRef}>
          <button
            type="button"
            onClick={() => setLanguageDropdownOpen(o => !o)}
            className="flex w-full cursor-pointer items-center justify-between rounded-brand px-4 py-3 text-[14px] text-[#070233]"
            style={{ boxShadow: 'inset 0 0 0 1px rgba(7,2,51,0.15)' }}
          >
            {(() => {
              const lang = languages.find(l => l.code === language)
              return lang ? t(lang.nameKey, lang.name) : ''
            })()}
            <ChevronDown className={`h-4 w-4 shrink-0 transition-transform duration-200 ${languageDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {languageDropdownOpen && (
            <div className="absolute left-0 right-0 top-full z-10 mt-2 rounded-brand bg-white" style={{ maxHeight: '15rem', overflowY: 'auto', overscrollBehavior: 'contain', boxShadow: '0 4px 24px rgba(7,2,51,0.12), inset 0 0 0 1px #E4E9F1' }}>
              {languages.map(lang => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => { onSelectLanguage(lang.code); setLanguageDropdownOpen(false) }}
                  className={`flex w-full cursor-pointer items-center justify-between px-4 py-2.5 text-left text-[14px] transition-colors ${language === lang.code ? 'bg-[#FFF1EC] text-[#FF5A36]' : 'text-[#070233] hover:bg-[#F8FAFD]'}`}
                >
                  {t(lang.nameKey, lang.name)}
                  {lang.main && (
                    <span className="rounded-full bg-[#070233]/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#070233]/60">{t('landing.modal.main', 'Main')}</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )

  return (
    // data-lenis-prevent: the landing page runs Lenis smooth-scroll which hijacks
    // wheel events globally; this tells it to leave native scrolling alone inside
    // the modal so the dropdown lists scroll and the background stays put.
    <div className="fixed inset-0 z-[300]" data-lenis-prevent>
      {/* Mobile: bottom sheet */}
      <div className="fixed inset-0 flex flex-col bg-[rgba(3,1,14,0.85)] backdrop-blur-[10px] md:hidden">
        <div className="flex flex-1 items-start justify-end p-5" onClick={onClose}>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/15 text-white"
            aria-label={t('landing.modal.close', 'Close')}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex h-[70vh] flex-col rounded-t-[28px] bg-white" onClick={e => e.stopPropagation()}>
          <div className="shrink-0 px-6 pb-2 pt-6">
            <h2 className="text-[#070233]">{t('landing.modal.regionLanguage', 'Region & language')}</h2>
          </div>
          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-4">
            {body}
          </div>
          <div className="shrink-0 border-t border-[rgba(7,2,51,0.1)] px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full cursor-pointer rounded-brand bg-[#2196F3] px-5 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#1976D2]"
            >
              {t('landing.modal.confirmChanges', 'Confirm Changes')}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop: centered dialog */}
      <div className="hidden h-full items-center justify-center md:flex">
        <div className="absolute inset-0 bg-[rgba(3,1,14,0.9)] backdrop-blur-[10px]" onClick={onClose} />
        <div className="relative mx-4 max-h-[90vh] w-full max-w-md overflow-visible rounded-brand bg-white shadow-xl" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between border-b border-[rgba(7,2,51,0.1)] p-6">
            <h2 className="text-[#070233]">{t('landing.modal.regionLanguage', 'Region & language')}</h2>
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-brand p-2 text-[#070233] hover:bg-[rgba(7,2,51,0.05)]"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="space-y-5 p-6">
            {body}
          </div>
          <div className="border-t border-[rgba(7,2,51,0.1)] p-6">
            <button
              type="button"
              onClick={onClose}
              className="w-full cursor-pointer rounded-brand bg-[#2196F3] px-5 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#1976D2]"
            >
              {t('landing.modal.confirmChanges', 'Confirm Changes')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
