import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import {
  ChevronRight,
  Dumbbell,
  HeartPulse,
  Rocket,
  Search,
  Send,
  Users,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import LanguageModal from '@/components/LanguageModal'
import MobileNavOverlay from '@/components/MobileNavOverlay'
import MonetiseurWordmark from '@/components/MonetiseurWordmark'
import { COUNTRIES } from '@/lib/countries'
import { initI18n } from '@/lib/i18n'

// The app lives on a separate origin; "Login" links point there.
const APP_URL = import.meta.env.VITE_APP_URL ?? 'https://app.monetiseur.pro'

const LANGUAGES = [
  { code: 'EN', name: 'English', nameKey: 'landing.languages.en', main: true },
  { code: 'ET', name: 'Estonian', nameKey: 'landing.languages.et', main: false },
  { code: 'RU', name: 'Russian', nameKey: 'landing.languages.ru', main: false },
] as const

const CALENDLY_URL = 'https://calendly.com/welcome-monetiseur/30min'

export const Route = createFileRoute('/knowledge-hub')({
  component: KnowledgeHubPage,
})

type TFn = (key: string, fallback: string) => string

interface Guide {
  id: string
  category: string
  image: string
  title: string
  description: string
}

// Topic chips used both as the filter bar and as each guide's category tag.
function buildCategories(t: TFn) {
  return [
    { key: 'all', label: t('knowledgeHub.categories.all', 'All') },
    { key: 'athletes', label: t('knowledgeHub.categories.athletes', 'Athletes') },
    { key: 'training', label: t('knowledgeHub.categories.training', 'Training') },
    { key: 'recovery', label: t('knowledgeHub.categories.recovery', 'Recovery') },
    { key: 'events', label: t('knowledgeHub.categories.events', 'Events') },
    { key: 'team', label: t('knowledgeHub.categories.team', 'Team') },
    { key: 'analytics', label: t('knowledgeHub.categories.analytics', 'Analytics') },
  ]
}

const IMG = {
  training: '/images/knowledgehub/knowledge_hub_training.webp',
  nutrition: '/images/knowledgehub/knowledge_hub_nutrition.webp',
  recovery: '/images/knowledgehub/knowledge_hub_recovery.webp',
  gettingStarted: '/images/knowledgehub/get_started.webp',
  analytics: '/images/knowledgehub/analytics.webp',
  team: '/images/knowledgehub/team_management.webp',
  events: '/images/knowledgehub/knowledge_hub_events.webp',
  athletes: '/images/knowledgehub/knowledge_hub_athletes.webp',
}

function buildGuides(t: TFn): Guide[] {
  return [
    {
      id: 'athletes-management',
      category: 'athletes',
      image: IMG.athletes,
      title: t('knowledgeHub.guides.athletesManagement.title', 'Athletes Management'),
      description: t('knowledgeHub.guides.athletesManagement.desc', 'Manage your full athlete roster — view training, events, analytics, recovery and medical records all from one place.'),
    },
    {
      id: 'training-plans-management',
      category: 'training',
      image: IMG.training,
      title: t('knowledgeHub.guides.trainingPlansManagement.title', 'Training Plans Management'),
      description: t('knowledgeHub.guides.trainingPlansManagement.desc', 'Build your exercise library, create session templates and schedule athlete training cycles.'),
    },
    {
      id: 'recovery-management',
      category: 'recovery',
      image: IMG.nutrition,
      title: t('knowledgeHub.guides.recoveryManagement.title', 'Recovery and Nutrition'),
      description: t('knowledgeHub.guides.recoveryManagement.desc', 'Set up daily routines, weekly treatments and nutrition plans to keep athletes recovering at their best.'),
    },
    {
      id: 'events',
      category: 'events',
      image: IMG.events,
      title: t('knowledgeHub.guides.events.title', 'Events'),
      description: t('knowledgeHub.guides.events.desc', 'Create competition and training events, assign athletes and manage all event details in one place.'),
    },
    {
      id: 'manage-your-team',
      category: 'team',
      image: IMG.team,
      title: t('knowledgeHub.guides.manageYourTeam.title', 'Manage Your Team'),
      description: t('knowledgeHub.guides.manageYourTeam.desc', 'Invite athletes and staff, assign roles and keep your club or organisation running smoothly.'),
    },
    {
      id: 'analytics-dashboard',
      category: 'analytics',
      image: IMG.analytics,
      title: t('knowledgeHub.guides.analyticsDashboard.title', 'Analytics Dashboard'),
      description: t('knowledgeHub.guides.analyticsDashboard.desc', 'Understand athlete performance trends, ACWR and session load through clear, actionable dashboards.'),
    },
  ]
}

interface RoleBundle {
  key: string
  image: string
  title: string
  description: string
}

function buildRoleBundles(t: TFn): RoleBundle[] {
  return [
    {
      key: 'athlete',
      image: IMG.recovery,
      title: t('knowledgeHub.roles.athlete.title', 'For Athletes'),
      description: t('knowledgeHub.roles.athlete.desc', 'Log your training, nutrition and recovery, and track your progress over time.'),
    },
    {
      key: 'coach',
      image: IMG.training,
      title: t('knowledgeHub.roles.coach.title', 'For Coaches'),
      description: t('knowledgeHub.roles.coach.desc', 'Plan training, monitor your whole roster and run performance analytics.'),
    },
  ]
}

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.6, ease: 'easeOut' as const },
}

function KnowledgeHubPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()

  const categories = buildCategories(t)
  const guides = buildGuides(t)
  const roleBundles = buildRoleBundles(t)

  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  // Nav state — mirrors the landing page exactly
  const [scrolled, setScrolled] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [langModalOpen, setLangModalOpen] = useState(false)
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false)
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false)
  const [countrySearch, setCountrySearch] = useState('')
  const [country, setCountry] = useState(() => COUNTRIES.find(c => c.name === 'Estonia')!)
  const countryDropdownRef = useRef<HTMLDivElement>(null)
  const languageDropdownRef = useRef<HTMLDivElement>(null)

  const language = (i18n.language || 'en').toUpperCase() as typeof LANGUAGES[number]['code']

  const switchLanguage = (code: typeof LANGUAGES[number]['code']) => {
    const lc = code.toLowerCase()
    localStorage.setItem('preferred_language', lc)
    // Self-contained: re-apply the bundled English fallback (no backend fetch).
    initI18n(undefined, lc)
  }

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 768) setMobileNavOpen(false) }
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileNavOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileNavOpen])

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!countryDropdownRef.current?.contains(e.target as Node)) setCountryDropdownOpen(false)
      if (!languageDropdownRef.current?.contains(e.target as Node)) setLanguageDropdownOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filteredGuides = useMemo(() => {
    const q = query.trim().toLowerCase()
    return guides.filter((g) => {
      const matchesCategory = activeCategory === 'all' || g.category === activeCategory
      const matchesQuery = !q
        || g.title.toLowerCase().includes(q)
        || g.description.toLowerCase().includes(q)
      return matchesCategory && matchesQuery
    })
  }, [guides, query, activeCategory])

  return (
    <div className="w-full bg-white">
      {/* ── Navigation — matches landing page exactly ── */}
      <motion.nav
        className={`fixed left-0 right-0 top-0 z-[70] transition-all duration-300 ${scrolled ? 'px-3 pt-3' : ''}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className={`mx-auto flex items-center justify-between transition-all duration-300 ${scrolled ? 'max-w-[1400px] rounded-xl bg-[#070233] p-4 shadow-lg md:px-6 md:py-3' : 'max-w-[1400px] px-4 py-6 md:px-16'}`}>
          {/* Logo */}
          <MonetiseurWordmark fill="white" className="h-4 w-auto cursor-pointer md:hidden" onClick={() => navigate({ to: '/' })} />
          <MonetiseurWordmark fill={scrolled ? 'white' : '#070233'} className="hidden h-4 w-auto cursor-pointer md:block" onClick={() => navigate({ to: '/' })} />

          {/* Nav links — desktop */}
          <div className="hidden items-center gap-8 md:flex">
            {[
              { label: t('knowledgeHub.nav.home', 'Home'), href: '/', internal: true },
              { label: t('knowledgeHub.nav.guides', 'Guides'), href: '#guides', internal: false },
            ].map(({ label, href, internal }) => (
              internal
                ? (
                  <button key={label} onClick={() => navigate({ to: '/' })} className={`cursor-pointer text-[16px] font-medium transition-colors ${scrolled ? 'text-white/85 hover:text-white' : 'text-[#070233]/70 hover:text-[#070233]'}`}>
                    {label}
                  </button>
                )
                : (
                  <a key={label} href={href} className={`text-[16px] font-medium transition-colors ${scrolled ? 'text-white/85 hover:text-white' : 'text-[#070233]/70 hover:text-[#070233]'}`}>
                    {label}
                  </a>
                )
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Language switcher */}
            <button
              onClick={() => setLangModalOpen(true)}
              className={`hidden cursor-pointer items-center gap-2.5 rounded-full px-4 py-2 text-[15px] font-medium transition-colors sm:flex ${scrolled ? 'text-white hover:bg-white/10' : 'text-[#070233] hover:bg-[#070233]/10'}`}
            >
              <span className="h-5 w-5 shrink-0 overflow-hidden rounded-full" style={{ boxShadow: scrolled ? 'inset 0 0 0 1px rgba(255,255,255,0.6)' : 'inset 0 0 0 1px rgba(7,2,51,0.3)' }}>
                <img src={`https://flagcdn.com/w40/${country.code}.png`} alt={country.name} className="h-full w-full object-cover" />
              </span>
              {language}
            </button>
            <a
              href={`${APP_URL}/login`}
              className={`hidden cursor-pointer rounded-brand border px-5 py-3 text-center text-[14px] transition-colors hover:border-transparent hover:bg-[#2F9BFF] hover:text-white md:flex ${scrolled ? 'border-white/30 text-white' : 'border-[#070233]/30 text-[#070233]'}`}
            >
              {t('landing.cta.login', 'Login')}
            </a>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden cursor-pointer rounded-brand px-5 py-3 text-center text-[14px] font-semibold text-sm transition-colors md:flex ${scrolled ? 'bg-white text-[#070233] hover:bg-[#2F9BFF] hover:text-white' : 'bg-[#070233] text-white hover:bg-[#2F9BFF]'}`}
            >
              {t('landing.cta.bookDemo', 'Book a demo')}
            </a>

            {/* Hamburger — mobile */}
            <button
              onClick={() => setMobileNavOpen(o => !o)}
              className="-mr-2 flex h-12 w-[60px] cursor-pointer flex-col items-end justify-center gap-[6px] p-2 md:hidden"
              aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
            >
              <span className={`block h-[2px] w-full origin-center bg-white transition-all duration-300 ${mobileNavOpen ? 'translate-y-[8px] rotate-45' : ''}`} />
              <span className={`block h-[2px] w-full origin-center bg-white transition-all duration-300 ${mobileNavOpen ? 'scale-x-0 opacity-0' : ''}`} />
              <span className={`block h-[2px] w-full origin-center bg-white transition-all duration-300 ${mobileNavOpen ? '-translate-y-[8px] -rotate-45' : ''}`} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile nav overlay */}
      <MobileNavOverlay
        open={mobileNavOpen}
        links={[
          { label: t('knowledgeHub.nav.home', 'Home'), onClick: () => navigate({ to: '/' }) },
          { label: t('knowledgeHub.nav.guides', 'Guides'), onClick: () => { setMobileNavOpen(false); document.getElementById('guides')?.scrollIntoView({ behavior: 'smooth' }) } },
        ]}
        country={country}
        language={language}
        onLanguageClick={() => setLangModalOpen(true)}
        onLogin={() => { window.location.href = `${APP_URL}/login` }}
        loginLabel={t('landing.cta.login', 'Login')}
        onBookDemo={() => window.open(CALENDLY_URL, '_blank', 'noopener,noreferrer')}
        bookDemoLabel={t('landing.cta.bookDemo', 'Book a demo')}
      />

      {/* Language modal — shared with landing */}
      <LanguageModal
        open={langModalOpen}
        onClose={() => { setLangModalOpen(false); setCountryDropdownOpen(false); setLanguageDropdownOpen(false); setCountrySearch('') }}
        t={t}
        languages={LANGUAGES}
        language={language}
        onSelectLanguage={code => void switchLanguage(code as typeof LANGUAGES[number]['code'])}
        country={country}
        onSelectCountry={setCountry}
        countryDropdownOpen={countryDropdownOpen}
        setCountryDropdownOpen={setCountryDropdownOpen}
        countryDropdownRef={countryDropdownRef}
        countrySearch={countrySearch}
        setCountrySearch={setCountrySearch}
        languageDropdownOpen={languageDropdownOpen}
        setLanguageDropdownOpen={setLanguageDropdownOpen}
        languageDropdownRef={languageDropdownRef}
      />

      {/* ── Hero ── */}
      {/* Outer wrapper provides the dark bg that shows behind the rounded card on desktop */}
      <div className="bg-white md:px-4 md:pb-4 md:pt-[95px]">
        <header className="relative flex flex-col overflow-hidden md:rounded-xl" style={{ minHeight: '60vh', backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(255, 23, 0, 0.2) 0%, transparent 60%), linear-gradient(135deg, rgb(7, 2, 51) 0%, rgb(10, 2, 64) 50%, rgb(42, 10, 20) 100%)' }}>
          <div className="pointer-events-none absolute inset-0" />
          <div className="relative z-10 mx-auto flex w-full flex-1 max-w-[1400px]">
            {/* Left — text */}
            <motion.div
              className="flex flex-col justify-center px-4 pt-28 pb-12 md:w-[58%] md:px-16 md:py-28"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              <span className="mb-5 block text-[12px] font-semibold uppercase tracking-[0.18em] text-[#ff1700]">
                {t('knowledgeHub.hero.eyebrow', 'Knowledge Hub')}
              </span>
              <h1
                className="font-black uppercase leading-none text-white"
                style={{ fontFamily: '\'Integral CF\', sans-serif', fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: 0.95 }}
              >
                {t('knowledgeHub.hero.headline', 'Discover how to use Monetiseur')}
              </h1>
              <p className="mt-6 max-w-[480px] text-[17px] leading-relaxed text-white/55">
                {t('knowledgeHub.hero.subtitle', 'Get the most out of your team or club. These short guides show exactly how to set up, run and grow with the platform.')}
              </p>
            </motion.div>

            {/* Right — scrolling feature image columns (absolutely positioned, doesn't affect hero height) */}
            <motion.div
              className="absolute inset-y-0 right-0 hidden w-[42%] overflow-hidden md:block"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
            >
              <style>{`
                @keyframes kh-scroll-up {
                  from { transform: translateY(0); }
                  to { transform: translateY(-50%); }
                }
                @keyframes kh-scroll-down {
                  from { transform: translateY(-50%); }
                  to { transform: translateY(0); }
                }
                .kh-col-up { animation: kh-scroll-up 24s linear infinite; }
                .kh-col-down { animation: kh-scroll-down 28s linear infinite; }
              `}</style>
              <div className="flex h-full gap-3 pr-4">
                {/* Column 1 — scrolls up */}
                <div className="flex flex-1 flex-col overflow-hidden">
                  <div className="kh-col-up flex flex-col gap-3">
                    {[
                      '/images/features/training.webp',
                      '/images/features/recovery.webp',
                      '/images/features/nutrition.webp',
                      '/images/features/training.webp',
                      '/images/features/recovery.webp',
                      '/images/features/nutrition.webp',
                    ].map((src, i) => (
                      <img key={i} src={src} alt="" className="w-full rounded-[10px]" />
                    ))}
                  </div>
                </div>
                {/* Column 2 — scrolls down */}
                <div className="flex flex-1 flex-col overflow-hidden">
                  <div className="kh-col-down flex flex-col gap-3">
                    {[
                      '/images/features/session_report.png',
                      '/images/features/training_session.png',
                      '/images/features/chat.png',
                      '/images/features/marketplace.png',
                      '/images/features/session_report.png',
                      '/images/features/training_session.png',
                      '/images/features/chat.png',
                      '/images/features/marketplace.png',
                    ].map((src, i) => (
                      <img key={i} src={src} alt="" className="w-full rounded-[10px]" />
                    ))}
                  </div>
                </div>
              </div>
              {/* Fades */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#070233] to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#070233] to-transparent" />
            </motion.div>
          </div>
        </header>
      </div>

      {/* ── Popular Guides ── */}
      <section id="guides" className="bg-white px-4 py-8 md:px-16 md:py-16">
        <div className="mx-auto max-w-[1400px]">
          <h2
            className="font-black uppercase leading-tight text-[#070233]"
            style={{ fontFamily: '\'Integral CF\', sans-serif', fontSize: 'clamp(28px, 4vw, 40px)' }}
          >
            {t('knowledgeHub.guides.heading', 'Popular guides')}
          </h2>
          <p className="mt-3 max-w-[520px] text-[16px] text-[#070233]/50">
            {t('knowledgeHub.guides.subheading', 'Short, practical walkthroughs for every part of the platform.')}
          </p>

          {/* Search */}
          <div className="mt-8 flex w-full items-center gap-3 rounded-brand px-5 py-4" style={{ boxShadow: 'inset 0 0 0 1px #E4E9F1' }}>
            <Search className="h-5 w-5 shrink-0 text-[#070233]/40" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={t('knowledgeHub.hero.searchPlaceholder', 'Search guides…')}
              className="w-full bg-transparent text-[16px] text-[#070233] outline-none placeholder:text-[#070233]/40"
            />
          </div>

          {/* Category filter */}
          <div className="mt-5 flex gap-2.5 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible md:pb-0" style={{ scrollbarWidth: 'none' }}>
            {categories.map(cat => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`shrink-0 cursor-pointer rounded-full px-4 py-2 text-[14px] font-medium transition-colors ${activeCategory === cat.key
                  ? 'bg-[#070233] text-white'
                  : 'bg-[#F8FAFD] text-[#070233]/70 hover:bg-[#070233]/10'
                  }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          {filteredGuides.length > 0
            ? (
              <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredGuides.map((guide, i) => (
                  <motion.a
                    key={guide.id}
                    href={`/docs/guide/${guide.id}`}
                    className="group flex flex-col overflow-hidden rounded-brand bg-white transition-all duration-200 hover:-translate-y-1"
                    style={{ boxShadow: 'inset 0 0 0 1px #E4E9F1' }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: i * 0.05, ease: 'easeOut' }}
                  >
                    <div className="relative h-[180px] w-full shrink-0 overflow-hidden md:h-[250px]">
                      <img
                        src={guide.image}
                        alt={guide.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#070233] to-[#070233]/40" />
                      <MonetiseurWordmark fill="white" className="absolute left-1/2 top-1/2 h-4 w-auto -translate-x-1/2 -translate-y-1/2 opacity-50" />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="text-[19px] font-bold text-[#070233]">{guide.title}</h3>
                      <p className="mt-2 flex-1 text-[15px] leading-relaxed text-[#070233]/55">{guide.description}</p>
                      <span className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#ff1700]">
                        {t('knowledgeHub.guides.read', 'Read guide')}
                        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </motion.a>
                ))}
              </div>
            )
            : (
              <p className="mt-12 text-[16px] text-[#070233]/50">
                {t('knowledgeHub.guides.empty', 'No guides match your search yet.')}
              </p>
            )}
        </div>
      </section>

      {/* ── By Role ── */}
      <section id="by-role" className="hidden bg-white px-4 py-12 md:px-16 md:py-16">
        <motion.div className="mx-auto max-w-[1400px]" {...fadeUp}>
          <h2
            className="font-black uppercase leading-tight text-[#070233]"
            style={{ fontFamily: '\'Integral CF\', sans-serif', fontSize: 'clamp(28px, 4vw, 40px)' }}
          >
            {t('knowledgeHub.roles.heading', 'Guides by role')}
          </h2>
          <p className="mt-3 max-w-[520px] text-[16px] text-[#070233]/50">
            {t('knowledgeHub.roles.subheading', 'Start with the bundle built for how you use Monetiseur.')}
          </p>

          <div className="mt-10 flex flex-col gap-6 md:flex-row">
            {roleBundles.map((role, i) => (
              <motion.a
                key={role.key}
                href="#guides"
                className="group flex flex-1 flex-col overflow-hidden rounded-brand bg-white transition-all duration-200 hover:-translate-y-1"
                style={{ boxShadow: 'inset 0 0 0 1px #E4E9F1' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: 'easeOut' }}
              >
                <div className="h-[250px] w-full shrink-0 overflow-hidden">
                  <img
                    src={role.image}
                    alt={role.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-[19px] font-bold text-[#070233]">{role.title}</h3>
                  <p className="mt-2 flex-1 text-[15px] leading-relaxed text-[#070233]/55">{role.description}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#ff1700]">
                    {t('knowledgeHub.roles.explore', 'Explore guides')}
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-white px-4 py-8 md:px-16 md:py-16">
        <motion.div
          className="mx-auto flex max-w-[1400px] flex-col items-stretch gap-6 md:flex-row"
          {...fadeUp}
        >
          {/* Left — gradient box */}
          <div
            className="flex flex-1 flex-col justify-center overflow-hidden rounded-[1.5rem] p-8 md:p-14"
            style={{ backgroundColor: '#ebf0f8', backgroundImage: 'linear-gradient(#fff0 40%,#ffab9433 90%,#ffab9466)' }}
          >
            <h2
              className="font-black uppercase leading-tight text-[#070233]"
              style={{ fontFamily: '\'Integral CF\', sans-serif', fontSize: 'clamp(26px, 3.5vw, 38px)' }}
            >
              {t('knowledgeHub.cta.heading', 'Still have questions?')}
            </h2>
            <p className="mt-3 max-w-[440px] text-[16px] text-[#73839E]">
              {t('knowledgeHub.cta.subtitle', 'Book a short demo and our team will walk you through everything in person.')}
            </p>
          </div>

          {/* Contact card — outside gradient box */}
          <div className="w-full shrink-0 rounded-[1.5rem] border border-[#070233]/15 bg-[#070233] p-6 md:w-[380px] md:p-10">
            <p className="mb-4 text-[12px] font-bold uppercase tracking-[0.2em] text-white">{t('landing.footer.contact', 'Contact')}</p>
            <div className="mb-4 flex items-center gap-3">
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full">
                <img src="/images/people/mihhail-popov.webp" alt="Mihhail Popov" className="h-full w-full object-cover" />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-white">Mihhail Popov</p>
                <p className="text-[12px] text-white/55">{t('landing.onboarding.step3.personRole', 'Your Personal Account Manager')}</p>
              </div>
            </div>
            <a
              href="mailto:welcome@monetiseur.pro"
              className="mb-3 flex w-full items-center gap-3 rounded-full px-5 py-3 text-[14px] text-white transition-colors hover:bg-white/10"
              style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.2)' }}
            >
              <Send className="h-4 w-4 text-white/60" />
              welcome@monetiseur.pro
            </a>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#2F9BFF] px-5 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#1a8af0]"
            >
              {t('landing.cta.bookDemo', 'Book a demo')}
            </a>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gradient-to-b from-[#070233] to-[#040118] px-4 py-8 md:px-16">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <MonetiseurWordmark fill="white" className="h-4 w-auto" />
            <p className="mt-2 text-[12px] text-white/25">
              {t('landing.footer.copyright', '© {{year}} Monetiseur', { year: new Date().getFullYear() })}
            </p>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => navigate({ to: '/' })} className="cursor-pointer text-[13px] text-white/40 transition-colors hover:text-white">
              {t('knowledgeHub.nav.home', 'Home')}
            </button>
            <a href="#" className="text-[13px] text-white/40 transition-colors hover:text-white">{t('landing.footer.privacy', 'Privacy Policy')}</a>
            <a href="#" className="text-[13px] text-white/40 transition-colors hover:text-white">{t('landing.footer.terms', 'Terms of Service')}</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
