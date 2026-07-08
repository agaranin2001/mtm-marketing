import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'framer-motion'
import Lenis from 'lenis'
import { ChevronRight, Phone, Plus, Send } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import LanguageModal from '@/components/LanguageModal'
import MobileNavOverlay from '@/components/MobileNavOverlay'
import MonetiseurWordmark from '@/components/MonetiseurWordmark'
import { IMAGES } from '@/lib/assets'
import { COUNTRIES } from '@/lib/countries'
import { initI18n } from '@/lib/i18n'

// Standalone marketing site: the app lives on a separate origin.
const APP_URL = import.meta.env.VITE_APP_URL ?? 'https://app.monetiseur.pro'
const CALENDLY_URL = 'https://calendly.com/welcome-monetiseur/30min'
const EMAIL_COPIED_RESET_MS = 2000

const LANGUAGES = [
  { code: 'EN', name: 'English', nameKey: 'landing.languages.en', main: true },
  { code: 'RU', name: 'Russian', nameKey: 'landing.languages.ru', main: false },
  { code: 'ET', name: 'Estonian', nameKey: 'landing.languages.et', main: false },
  { code: 'UZ', name: 'Uzbek', nameKey: 'landing.languages.uz', main: false },
  { code: 'AR', name: 'Arabic', nameKey: 'landing.languages.ar', main: false },
  { code: 'FI', name: 'Finnish', nameKey: 'landing.languages.fi', main: false },
  { code: 'DE', name: 'German', nameKey: 'landing.languages.de', main: false },
  { code: 'FR', name: 'French', nameKey: 'landing.languages.fr', main: false },
  { code: 'ES', name: 'Spanish', nameKey: 'landing.languages.es', main: false },
  { code: 'NO', name: 'Norwegian', nameKey: 'landing.languages.no', main: false },
] as const

export const Route = createFileRoute('/overview')({
  component: OverviewPage,
})

type TFn = (key: string, fallback: string) => string

function buildNavLinks(t: TFn) {
  return [
    { label: t('overview.nav.whatWeTest', 'What we test'), id: 'product' },
    { label: t('overview.nav.reviews', 'Reviews'), id: 'athletes' },
    { label: t('overview.nav.faqs', 'FAQs'), id: 'faq' },
  ]
}

function buildHowItWorks(t: TFn) {
  return [
    {
      step: '1',
      title: t('overview.how.step1.title', 'Take Your DNA Test'),
      body: t('overview.how.step1.body', 'One saliva sample. A lifetime of personalized insights.'),
      img: IMAGES.howItWorks.step1,
    },
    {
      step: '2',
      title: t('overview.how.step2.title', 'Discover Your Biology'),
      body: t('overview.how.step2.body', "Understand your body's unique strengths and areas for improvement."),
      img: IMAGES.howItWorks.step2,
    },
    {
      step: '3',
      title: t('overview.how.step3.title', 'Receive Your Plan'),
      body: t('overview.how.step3.body', 'Get an AI-powered roadmap tailored to your genetics and performance goals.'),
      img: IMAGES.howItWorks.step3,
    },
    {
      step: '4',
      title: t('overview.how.step4.title', 'Train Smarter'),
      body: t('overview.how.step4.body', 'Track results, adjust your plan, and continuously optimize your athletic development.'),
      img: IMAGES.howItWorks.step4,
    },
  ]
}

function buildStackCards(t: TFn) {
  return [
    {
      navLabel: t('overview.stack.card1.nav', 'Take the DNA test'),
      title: t('overview.stack.card1.title', 'Start with a Comprehensive DNA Test'),
      body: t('overview.stack.card1.body', 'Unlock personalized insights into performance, recovery, nutrition, injury risk, sleep, and more with a simple saliva sample.'),
      img: IMAGES.stackCards.card1,
    },
    {
      navLabel: t('overview.stack.card2.nav', 'See your data'),
      title: t('overview.stack.card2.title', 'All Your Performance Data in One Place'),
      body: t('overview.stack.card2.body', 'Combine your DNA results with training sessions, wearables, health metrics, and progress tracking to see the complete picture of your development.'),
      img: IMAGES.stackCards.card2,
    },
    {
      navLabel: t('overview.stack.card3.nav', 'Get your plan'),
      title: t('overview.stack.card3.title', 'Get Your Personalized Development Plan'),
      body: t('overview.stack.card3.body', 'Receive an AI-powered, science-backed roadmap with tailored recommendations for training, nutrition, recovery, and long-term athletic growth.'),
      img: IMAGES.stackCards.card3,
    },
    {
      navLabel: t('overview.stack.card4.nav', 'Train with AI'),
      title: t('overview.stack.card4.title', 'Your Personal AI Performance Coach'),
      body: t('overview.stack.card4.body', 'Get continuous guidance, actionable recommendations, and expert support whenever you need it — all within a single athlete performance platform.'),
      img: IMAGES.stackCards.card4,
    },
  ]
}

function buildFaqs(t: TFn) {
  return [
    { question: t('overview.faq.q0', 'What is Monetiseur in one sentence?'), answer: t('overview.faq.a0', 'A single platform that connects training, nutrition, recovery, analytics and team management for athletes, coaches and agents.') },
    { question: t('overview.faq.q1', 'Who is it for?'), answer: t('overview.faq.a1', 'Individual athletes, coaches, clubs, federations and sports agents — anyone who needs one place to plan, track and analyse athletic performance.') },
    { question: t('overview.faq.q2', 'How long does it take to get started?'), answer: t('overview.faq.a2', 'Most teams are onboarded within a few weeks: a short demo, roster setup, a focused pilot, then a full rollout.') },
    { question: t('overview.faq.q3', 'Does it work on mobile?'), answer: t('overview.faq.a3', 'Yes. Athletes and coaches can log training, recovery and messages on the go, and data syncs automatically.') },
  ]
}

const GALLERY_IMAGES = [
  { src: IMAGES.customers.erkiNool, label: 'Erki Nool', countryCode: 'ee' },
  { src: IMAGES.customers.adhamDjamalov, label: 'Adham Djamalov', countryCode: 'uz' },
  { src: IMAGES.customers.talalAlenezi, label: 'Talal Alenezi', countryCode: 'kw' },
  { src: IMAGES.customers.aigerimAbilkadirova, label: 'Aigerim Abilkadirova', countryCode: 'kz' },
  { src: IMAGES.customers.toniLettner, label: 'Toni Lettner', countryCode: 'us' },
]

interface StackCardData { navLabel: string, title: string, body: string, img: string }

// Full-width carousel, driven entirely by the page's own vertical scroll (no
// buttons/dots). The outer section is `count * 100vh` tall in normal document
// flow; N invisible 100vh marker divs inside it are watched by an
// IntersectionObserver to derive which slide is "active" as the user scrolls
// through that range. The actual carousel is a `position: sticky` viewport
// pinned for that whole range, so it stays fully on screen the entire time;
// AnimatePresence then pushes the outgoing slide out one side while the
// incoming slide pushes in from the other — the standard carousel transition
// (not the earlier opacity cross-fade, which stacked two slides in the same
// spot). It's a discrete, time-based tween per slide change, not a
// continuous scroll-linked drag, so a transition always finishes once triggered.
function StackCarousel({ cards }: { cards: StackCardData[] }) {
  const markersRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [direction, setDirection] = useState(1)

  useEffect(() => {
    const container = markersRef.current
    if (!container)
      return
    const markers = Array.from(container.children) as HTMLElement[]
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting)
            return
          const idx = markers.indexOf(entry.target as HTMLElement)
          if (idx === -1)
            return
          setActive((prev) => {
            setDirection(idx > prev ? 1 : -1)
            return idx
          })
        })
      },
      { threshold: 0.5 },
    )
    markers.forEach(marker => observer.observe(marker))
    return () => observer.disconnect()
  }, [cards.length])

  const card = cards[active]

  return (
    <section id="product" className="relative bg-white" style={{ height: `${cards.length * 100}vh` }}>
      <div ref={markersRef} className="absolute inset-0 -z-10">
        {cards.map(c => <div key={c.title} className="h-dvh" />)}
      </div>

      <div className="sticky top-0 h-dvh w-full overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={active}
            custom={direction}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
            className="absolute inset-0 flex h-dvh w-full flex-col justify-center overflow-hidden px-4 pb-16 pt-24 md:px-16 md:pb-20"
          >
            <img src={card.img} alt={card.title} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
            <div className="relative z-10 max-w-[640px]">
              <span className="text-[13px] font-bold uppercase tracking-[0.2em] text-[#ff1700]">{String(active + 1).padStart(2, '0')}</span>
              <h3
                className="mt-3 font-black uppercase leading-[1.05] text-white"
                style={{ fontFamily: '\'Integral CF\', sans-serif', fontSize: 'clamp(28px, 4vw, 48px)' }}
              >
                {card.title}
              </h3>
              <p className="mt-4 text-[16px] leading-relaxed text-white/80 md:text-[18px]">{card.body}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Right-side step navigation — passive progress indicator, mirrors the active slide. */}
        <div className="pointer-events-none absolute right-6 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-end gap-5 md:right-16 md:flex">
          {cards.map((c, i) => {
            const isActive = i === active
            return (
              <div key={c.navLabel} className="flex items-center gap-3">
                <span className={`text-[15px] transition-colors duration-300 ${isActive ? 'font-semibold text-white' : 'text-white/45'}`}>
                  {c.navLabel}
                </span>
                <span className={`text-[13px] transition-colors duration-300 ${isActive ? 'text-white/70' : 'text-white/35'}`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className={`h-4 w-px transition-colors duration-300 ${isActive ? 'bg-[#ff1700]' : 'bg-transparent'}`} />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function OverviewPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [emailCopied, setEmailCopied] = useState(false)
  const [langModalOpen, setLangModalOpen] = useState(false)
  const [country, setCountry] = useState(() => COUNTRIES.find(c => c.name === 'Estonia')!)
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false)
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false)
  const [countrySearch, setCountrySearch] = useState('')
  const countryDropdownRef = useRef<HTMLDivElement>(null)
  const languageDropdownRef = useRef<HTMLDivElement>(null)

  const language = (i18n.language || 'en').toUpperCase() as typeof LANGUAGES[number]['code']
  const switchLanguage = (code: typeof LANGUAGES[number]['code']) => {
    const lc = code.toLowerCase()
    localStorage.setItem('preferred_language', lc)
    initI18n(undefined, lc)
  }

  const NAV_LINKS = buildNavLinks(t)
  const STACK_CARDS = buildStackCards(t)
  const HOW_IT_WORKS = buildHowItWorks(t)
  const FAQS = buildFaqs(t)
  const HERO_STATS = [
    { label: t('overview.hero.stat0.label', 'DNA Reports'), sub: t('overview.hero.stat0.sub', '40+ Genetic Traits') },
    { label: t('overview.hero.stat1.label', 'AI Personal Plans'), sub: t('overview.hero.stat1.sub', 'Unlimited Personalized Recommendations') },
    { label: t('overview.hero.stat2.label', 'Science-Based'), sub: t('overview.hero.stat2.sub', '100+ Research-Backed Insights') },
  ]

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

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true })
    let rafId: number
    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)
    return () => { cancelAnimationFrame(rafId); lenis.destroy() }
  }, [])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(e.target as Node))
        setCountryDropdownOpen(false)
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(e.target as Node))
        setLanguageDropdownOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function scrollToSection(id: string) {
    setMobileNavOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  function closeLangModal() {
    setLangModalOpen(false)
    setCountryDropdownOpen(false)
    setLanguageDropdownOpen(false)
    setCountrySearch('')
  }

  function handleCopyEmail() {
    navigator.clipboard.writeText('welcome@monetiseur.pro')
    setEmailCopied(true)
    setTimeout(setEmailCopied, EMAIL_COPIED_RESET_MS, false)
  }

  return (
    <div className="w-full bg-white">
      {/* ── Announcement bar ── */}
      <a
        href="#athletes"
        className="relative z-[75] flex w-full items-center justify-center gap-3 bg-white px-4 py-2.5 text-center text-[13px] text-[#070233] transition-colors hover:bg-[#f5f5f5] md:text-[14px]"
      >
        {/* Placeholder name — swap for a confirmed real partner/user before launch. */}
        <span className="font-medium">{t('overview.banner.text', 'Aitana Bonmatí is on Monetiseur')}</span>
        <span className="flex items-center gap-1 text-[#73839E]">
          {t('overview.banner.cta', 'Learn more')}
          <ChevronRight className="h-3.5 w-3.5" />
        </span>
      </a>

      {/* ── Hero ── */}
      <div className="relative h-dvh w-full">
        <div className="absolute inset-x-0 top-0 bottom-0 overflow-hidden rounded-none bg-[#3a4d52] md:inset-x-4 md:bottom-4 md:rounded-xl">
          <img src="/images/DNA_hero.jpeg" alt="" className="absolute inset-0 h-full w-full object-cover" />
          {/* Legibility overlays — darker on the left where the text sits */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/20" />

          <div className="relative z-10 flex h-full flex-col justify-between px-4 pb-8 pt-12 md:px-16 md:pb-12 md:pt-24">
            {/* Centre-left content */}
            <motion.div
              className="flex flex-1 flex-col justify-center gap-6 md:max-w-[760px]"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <h1
                className="font-black uppercase italic leading-[0.9] text-white"
                style={{ fontFamily: '\'Integral CF\', sans-serif', fontSize: 'clamp(32px, 6vw, 69px)', letterSpacing: '-0.01em', textShadow: '0 2px 40px rgba(0,0,0,0.35)' }}
              >
                {t('overview.hero.line1', 'Train Smarter.')}
                <br />
                {t('overview.hero.line2', 'Perform at Your Genetic Best.')}
              </h1>
              <p className="max-w-[460px] text-[16px] leading-relaxed text-white/80 md:text-[18px]">
                {t('overview.hero.sub', 'Build Your Personal Performance Plan.')}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <a
                  href="#product"
                  onClick={(e) => { e.preventDefault(); scrollToSection('product') }}
                  className="rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-[#070233] transition-colors hover:bg-[#2F9BFF] hover:text-white"
                >
                  {t('overview.nav.whatWeTest', 'What we test')}
                </a>
                <a
                  href="#product"
                  className="rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-[15px] font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                >
                  {t('overview.hero.explore', 'Explore the platform')}
                </a>
              </div>
            </motion.div>

            {/* Bottom stat row */}
            <motion.div
              className="flex flex-wrap items-center gap-x-8 gap-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
            >
              {HERO_STATS.map((s, i) => (
                <div key={s.label} className={`flex flex-col ${i > 0 ? 'md:border-l md:border-white/25 md:pl-8' : ''}`}>
                  <span className="text-[15px] font-semibold text-white">{s.label}</span>
                  <span className="text-[13px] text-white/60">{s.sub}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
      {/* ── Navigation ── */}
      <motion.nav
        className={`fixed left-0 right-0 z-[70] transition-all duration-300 ${scrolled ? 'top-0 px-3 pt-3' : 'top-[42px]'}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className={`mx-auto flex min-w-max items-center justify-between transition-all duration-300 md:grid md:grid-cols-3 ${scrolled ? 'rounded-xl bg-[#070233] p-4 shadow-lg md:px-16 md:py-3' : 'px-4 py-6 md:px-16'}`}>
          {/* Left — nav links (desktop only) */}
          <div className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map(({ label, id, href }) => (
              <a
                key={id}
                href={href ?? `#${id}`}
                onClick={href ? undefined : (e) => { e.preventDefault(); scrollToSection(id) }}
                className="cursor-pointer text-[16px] font-medium text-white/85 transition-colors duration-200 hover:text-white"
              >
                {label}
              </a>
            ))}
          </div>

          {/* Centre — logo */}
          <a href="/" aria-label="Monetiseur home" className="justify-self-start md:justify-self-center">
            <MonetiseurWordmark fill="white" className="h-4 w-auto cursor-pointer transition-opacity duration-300" />
          </a>

          {/* Right — language, login, CTA, mobile hamburger */}
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => setLangModalOpen(true)}
              className="hidden cursor-pointer items-center gap-2.5 rounded-full px-4 py-2 text-[15px] font-medium text-white transition-colors duration-200 hover:bg-white/10 sm:flex"
            >
              <span className="h-5 w-5 shrink-0 overflow-hidden rounded-full" style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.6)' }}>
                <img src={`https://flagcdn.com/w40/${country.code}.png`} alt={country.name} className="h-full w-full object-cover" />
              </span>
              {language}
            </button>
            <a href={`${APP_URL}/login`} className="hidden cursor-pointer text-center py-3 px-5 text-[14px] rounded-brand border text-white transition-colors duration-200 hover:border-transparent hover:bg-[#2F9BFF] md:flex">
              {t('landing.cta.login', 'Login')}
            </a>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden cursor-pointer text-center py-3 px-5 text-[14px] rounded-brand text-sm font-semibold transition-colors duration-200 md:flex bg-[#fff] text-[#070233] hover:bg-[#2F9BFF] hover:text-[#fff]"
            >
              {t('landing.cta.startTesting', 'Start Testing')}
            </a>

            <button
              onClick={() => setMobileNavOpen(o => !o)}
              className="-me-2 flex h-12 w-[60px] cursor-pointer flex-col items-end justify-center gap-[6px] p-2 md:hidden"
              aria-label={mobileNavOpen ? t('landing.nav.closeMenu', 'Close menu') : t('landing.nav.openMenu', 'Open menu')}
              aria-expanded={mobileNavOpen}
            >
              <span className={`block h-[2px] w-full origin-center bg-white transition-all duration-300 ${mobileNavOpen ? 'translate-y-[8px] rotate-45' : ''}`} />
              <span className={`block h-[2px] w-full origin-center bg-white transition-all duration-300 ${mobileNavOpen ? 'scale-x-0 opacity-0' : ''}`} />
              <span className={`block h-[2px] w-full origin-center bg-white transition-all duration-300 ${mobileNavOpen ? '-translate-y-[8px] -rotate-45' : ''}`} />
            </button>
          </div>
        </div>
      </motion.nav>

      <MobileNavOverlay
        open={mobileNavOpen}
        links={NAV_LINKS.map(({ label, id, href }) => ({
          label,
          onClick: () => (href ? navigate({ to: href }) : scrollToSection(id)),
        }))}
        country={country}
        language={language}
        onLanguageClick={() => setLangModalOpen(true)}
        onLogin={() => { setMobileNavOpen(false); window.location.href = `${APP_URL}/login` }}
        loginLabel={t('landing.cta.login', 'Login')}
        onBookDemo={() => { setMobileNavOpen(false); window.open(CALENDLY_URL, '_blank', 'noopener,noreferrer') }}
        bookDemoLabel={t('landing.cta.bookDemo', 'Book a demo')}
        ariaLabel={t('landing.nav.mobileNavigation', 'Mobile navigation')}
      />

      <LanguageModal
        open={langModalOpen}
        onClose={closeLangModal}
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

      {/* ── How it works ── */}
      <section className="bg-white px-4 pt-24 pb-24 md:px-16">
        <div className="mx-auto">
          <motion.h2
            className="text-center font-black text-[#070233]"
            style={{ fontFamily: '\'Integral CF\', sans-serif', fontSize: 'clamp(32px, 4vw, 48px)' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            {t('overview.how.title', 'How it works')}
          </motion.h2>
          <motion.p
            className="mx-auto mt-3 max-w-[520px] text-center text-[16px] text-[#73839E]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          >
            {t('overview.how.subtitle', 'It starts with your DNA, then your whole plan follows.')}
          </motion.p>

          <div className="mt-14 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: 'easeOut' }}
              >
                <div className="relative h-[300px] w-full overflow-hidden" style={{ borderRadius: '15px' }}>
                  <img src={s.img} alt={s.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  <span className="absolute left-3 top-3 flex h-7 w-7 items-center justify-center rounded-md bg-[#070233] text-[13px] font-bold text-white">{s.step}</span>
                </div>
                <h3 className="mt-4 text-[18px] font-normal text-[#070233]">{s.title}</h3>
                <p className="mt-1 text-[14px] leading-relaxed text-[#73839E]">{s.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Full-width carousel (vertical page scroll drives slide changes) ── */}
      <StackCarousel cards={STACK_CARDS} />

      {/* ── Social proof ── */}
      <section id="athletes" className="bg-white pb-6 pt-24">
        <motion.h2
          className="mb-14 px-4 text-center font-black uppercase text-[#070233] md:px-16"
          style={{ fontFamily: '\'Integral CF\', sans-serif', fontSize: 'clamp(28px, 3.5vw, 48px)', lineHeight: 1.1 }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {t('overview.sections.trusted', 'Trusted by athletes worldwide')}
        </motion.h2>
        <div className="overflow-hidden">
          <div className="animate-marquee flex w-max gap-4 px-4">
            {[...GALLERY_IMAGES, ...GALLERY_IMAGES].map((img, i) => (
              <div key={i} className="h-[290px] w-[220px] shrink-0 overflow-hidden rounded-2xl md:h-[420px] md:w-[320px]" style={{ position: 'relative', flex: 'none' }}>
                <img src={img.src} alt={img.label} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <span className="h-5 w-5 shrink-0 overflow-hidden rounded-full bg-white/10" style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.6)' }}>
                    <img src={`https://flagcdn.com/w40/${img.countryCode}.png`} alt={img.countryCode} className="h-full w-full object-cover" />
                  </span>
                  <span className="text-[13px] font-semibold uppercase tracking-wider text-white">{img.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sticky CTA banner ── */}
      <section className="px-4 py-20 md:px-16">
        <motion.div
          className="mx-auto flex flex-col items-center gap-6 rounded-[1.5rem] px-6 py-14 text-center md:px-16"
          style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, #ff170033 0%, transparent 60%), linear-gradient(135deg, #070233 0%, #0a0240 50%, #2a0a14 100%)' }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h2 className="font-black uppercase leading-[1.05] text-white" style={{ fontFamily: '\'Integral CF\', sans-serif', fontSize: 'clamp(30px, 4.5vw, 56px)' }}>
            {t('overview.cta.title', 'Bring it all together')}
          </h2>
          <p className="max-w-[560px] text-[16px] leading-relaxed text-white/60">
            {t('overview.cta.body', 'See how Monetiseur fits your athletes, coaches and staff. Book a 30-minute demo — no obligation.')}
          </p>
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-brand bg-[#2F9BFF] px-6 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-[#2F9BFF]/85"
          >
            {t('landing.cta.bookDemoMeeting', 'Book a demo meeting')}
            <ChevronRight className="h-4 w-4" />
          </a>
        </motion.div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="bg-white px-4 pb-24 md:px-16">
        <div className="mx-auto flex flex-col gap-12 md:flex-row md:gap-16">
          <div className="md:w-[30%]">
            <h2 className="font-black uppercase leading-none text-[#070233]" style={{ fontFamily: '\'Integral CF\', sans-serif', fontSize: 'clamp(40px, 6vw, 64px)' }}>
              {t('landing.faq.title', 'FAQ')}
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-[#73839E]">
              {t('overview.faq.intro', 'The short answers. Book a demo for the rest.')}
            </p>
          </div>
          <div className="flex flex-1 flex-col gap-3">
            {FAQS.map((faq, i) => {
              const isOpen = openFaq === i
              return (
                <div key={faq.question} className="overflow-hidden rounded-[1.5rem] bg-[#ebf0f8]">
                  <button onClick={() => setOpenFaq(isOpen ? null : i)} className="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-start">
                    <span className="text-[18px] font-bold uppercase text-[#070233] md:text-[24px]" style={{ fontFamily: '\'Integral CF\', sans-serif' }}>{faq.question}</span>
                    <Plus className={`h-8 w-8 shrink-0 text-[#070233] transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`} />
                  </button>
                  {isOpen && <p className="px-6 pb-5 text-[16px] leading-relaxed text-[#73839E] md:text-[18px]">{faq.answer}</p>}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative overflow-hidden bg-gradient-to-b from-[#070233] to-[#040118] px-4 py-16 md:px-16">
        <motion.div
          className="relative z-10 mx-auto flex flex-col gap-16 md:flex-row md:justify-between"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="flex flex-col gap-4">
            <h3 className="font-black uppercase leading-[1.05] text-white" style={{ fontFamily: '\'Integral CF\', sans-serif', fontSize: 'clamp(32px, 4vw, 44px)' }}>
              {t('landing.footer.ready', 'Ready to perform together?')}
            </h3>
            <p className="max-w-[260px] text-[15px] leading-relaxed text-white/40">
              {t('landing.footer.join', 'Join the community and grow together with Monetiseur.')}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-6">
              {NAV_LINKS.map(({ label, id, href }) => (
                <a
                  key={id}
                  href={href ?? `#${id}`}
                  onClick={href ? undefined : (e) => { e.preventDefault(); scrollToSection(id) }}
                  className="text-[15px] text-white/55 transition-colors hover:text-white"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 rounded-[12px] border border-white bg-white/10 p-6 backdrop-blur-md md:w-[420px]">
            <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-white">{t('landing.footer.contact', 'Contact')}</p>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full">
                <img src={IMAGES.people.mihhailPopov} alt="Mihhail Popov" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
              <div className="text-[15px] leading-relaxed text-white/85">
                <p className="font-semibold text-[14px]">Mihhail Popov</p>
                <p className="text-white/65 text-[12px]">{t('landing.onboarding.step3.personRole', 'Your Personal Account Manager')}</p>
              </div>
            </div>
            <button onClick={handleCopyEmail} className="mt-2 flex w-full items-center justify-between rounded-full px-5 py-3 text-[14px] text-white transition-colors hover:bg-white/10" style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.5)' }}>
              <span className="flex items-center gap-3">
                <Send className="h-4 w-4 text-white/70" />
                welcome@monetiseur.pro
              </span>
              {emailCopied && <span className="text-[12px] text-white/60">{t('landing.footer.copied', 'Copied')}</span>}
            </button>
            <a href="https://wa.me/3725540890" target="_blank" rel="noopener noreferrer" className="flex w-full items-center gap-3 rounded-full px-5 py-3 text-[14px] text-white transition-colors hover:bg-white/10" style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.5)' }}>
              <Phone className="h-4 w-4 text-white/70" />
              +372 5540 890
            </a>
          </div>
        </motion.div>

        <div className="relative z-10 mx-auto mt-20 flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <MonetiseurWordmark fill="white" className="h-4 w-auto" />
            <p className="mt-2 text-[12px] text-white/25">{t('landing.footer.copyright', '© {{year}} Monetiseur', { year: new Date().getFullYear() })}</p>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-[13px] text-white/40 transition-colors hover:text-white">{t('landing.footer.privacy', 'Privacy Policy')}</a>
            <a href="#" className="text-[13px] text-white/40 transition-colors hover:text-white">{t('landing.footer.terms', 'Terms of Service')}</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
