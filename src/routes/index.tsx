import type { MotionValue } from 'framer-motion'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { motion, useScroll, useTransform } from 'framer-motion'
import Lenis from 'lenis'
import { ChevronDown, ChevronRight, Phone, Plus, Send } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import LanguageModal from '@/components/LanguageModal'
import MobileNavOverlay from '@/components/MobileNavOverlay'
import MonetiseurWordmark from '@/components/MonetiseurWordmark'
import { IMAGES } from '@/lib/assets'
import { COUNTRIES } from '@/lib/countries'
import { initI18n } from '@/lib/i18n'

// Standalone marketing site: the app lives on a separate origin. All
// "Login" links point there (configure via VITE_APP_URL at build time).
const APP_URL = import.meta.env.VITE_APP_URL ?? 'https://app.monetiseur.pro'

// How long the "email copied" confirmation stays visible after clicking the address.
const EMAIL_COPIED_RESET_MS = 2000
const CALENDLY_URL = 'https://calendly.com/welcome-monetiseur/30min'

function CollageColumn({ progress, index, offset, images }: { progress: MotionValue<number>, index: number, offset: string, images: string[] }) {
  const range = index % 2 === 0 ? [-30, 30] : [30, -30]
  const y = useTransform(progress, [0, 1], range)
  return (
    <motion.div style={{ y }} className={`flex w-[160px] shrink-0 flex-col gap-4 ${offset}`}>
      {images.map(src => (
        <div key={src} className="aspect-[3/4] w-full overflow-hidden rounded-[12px]" style={{ boxShadow: '0 8px 24px rgba(7,2,51,0.12)' }}>
          <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
      ))}
    </motion.div>
  )
}

export const Route = createFileRoute('/')({
  component: LandingPage,
})

type TFn = (key: string, fallback: string) => string

function buildFaqs(t: TFn) {
  return [
    {
      question: t('landing.faq.q0', 'What exactly is Monetiseur?'),
      answer: t('landing.faq.a0', 'Monetiseur is an all-in-one platform for athlete performance and talent management — bringing training, nutrition, recovery, finances and team communication into one shared workspace for athletes, coaches and agents.'),
    },
    {
      question: t('landing.faq.q1', 'How does onboarding work in practice?'),
      answer: t('landing.faq.a1', 'You book a short demo, we onboard your roster and configure roles and permissions, then run a focused pilot with part of your team before rolling out to everyone — usually within a few weeks.'),
    },
    {
      question: t('landing.faq.q2', 'What is included in the platform?'),
      answer: t('landing.faq.a2', 'Training plans, nutrition tracking, recovery and wellness monitoring, performance analytics, team management with role-based access, and a financial dashboard for contracts and budgets.'),
    },
    {
      question: t('landing.faq.q3', 'How does coach-athlete collaboration work?'),
      answer: t('landing.faq.a3', 'Coaches assign sessions and track recovery and performance across their whole roster, athletes log their own training and wellness data, and everyone sees the same real-time information in one dashboard.'),
    },
    {
      question: t('landing.faq.q4', 'Is Monetiseur online only, or does it work offline too?'),
      answer: t('landing.faq.a4', 'The platform works online, with mobile access so athletes and coaches can log training, recovery and messages on the go — data syncs automatically once you are back online.'),
    },
    {
      question: t('landing.faq.q5', 'What makes Monetiseur different from other tools?'),
      answer: t('landing.faq.a5', 'Most tools cover a single piece — training, finance or communication. Monetiseur connects all of it for every role in the athlete ecosystem, so nothing gets tracked in five different apps.'),
    },
  ]
}

function buildNavLinks(t: TFn) {
  return [
    { label: t('landing.nav.platform', 'Platform'), id: 'platform' },
    { label: t('landing.nav.services', 'Services'), id: 'services' },
    { label: t('landing.nav.customers', 'Customers'), id: 'customers' },
    { label: t('landing.nav.knowledgeHub', 'Knowledge Hub'), id: 'knowledge-hub', href: '/knowledge-hub' },
  ]
}

// `code` is the visible short code + state key (not translated); `name` is the
// English fallback resolved through `nameKey` for the language dropdown.
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

// `value` is the language-stable key used to look up FLOWS; `label` is translated.
function buildRoles(t: TFn) {
  return [
    { value: 'Athlete', label: t('landing.roles.athlete', 'Athlete') },
    { value: 'Coach', label: t('landing.roles.coach', 'Coach') },
    { value: 'Team / Club', label: t('landing.roles.teamClub', 'Team / Club') },
    { value: 'Federation', label: t('landing.roles.federation', 'Federation') },
    { value: 'Sports Agent', label: t('landing.roles.sportsAgent', 'Sports Agent') },
  ]
}

function buildFlows(t: TFn): Record<string, { question: string, options: string[] }[]> {
  return {
    'Athlete': [
      {
        question: t('landing.flows.athlete.q0.question', 'What is your primary goal?'),
        options: [t('landing.flows.athlete.q0.o0', 'Improve athletic performance'), t('landing.flows.athlete.q0.o1', 'Prepare for upcoming competitions'), t('landing.flows.athlete.q0.o2', 'Find the right coach'), t('landing.flows.athlete.q0.o3', 'Build a long-term development plan'), t('landing.flows.athlete.q0.o4', 'Secure sponsorship opportunities'), t('landing.flows.athlete.q0.o5', 'Manage my athletic career')],
      },
      {
        question: t('landing.flows.athlete.q1.question', 'What level are you competing at?'),
        options: [t('landing.flows.athlete.q1.o0', 'Youth'), t('landing.flows.athlete.q1.o1', 'Amateur'), t('landing.flows.athlete.q1.o2', 'National'), t('landing.flows.athlete.q1.o3', 'International'), t('landing.flows.athlete.q1.o4', 'Professional'), t('landing.flows.athlete.q1.o5', 'Olympic')],
      },
      {
        question: t('landing.flows.athlete.q2.question', 'What area needs the most attention?'),
        options: [t('landing.flows.athlete.q2.o0', 'Physical preparation'), t('landing.flows.athlete.q2.o1', 'Mental performance'), t('landing.flows.athlete.q2.o2', 'Nutrition'), t('landing.flows.athlete.q2.o3', 'Recovery'), t('landing.flows.athlete.q2.o4', 'Competition planning'), t('landing.flows.athlete.q2.o5', 'Career management')],
      },
      {
        question: t('landing.flows.athlete.q3.question', 'What would success look like in the next 12 months?'),
        options: [t('landing.flows.athlete.q3.o0', 'Reach a new performance level'), t('landing.flows.athlete.q3.o1', 'Qualify for major competitions'), t('landing.flows.athlete.q3.o2', 'Improve rankings'), t('landing.flows.athlete.q3.o3', 'Increase sponsorship opportunities'), t('landing.flows.athlete.q3.o4', 'Build a sustainable sports career')],
      },
    ],
    'Coach': [
      {
        question: t('landing.flows.coach.q0.question', 'What is your primary focus?'),
        options: [t('landing.flows.coach.q0.o0', 'Athlete performance'), t('landing.flows.coach.q0.o1', 'Talent development'), t('landing.flows.coach.q0.o2', 'Team success'), t('landing.flows.coach.q0.o3', 'Coach education'), t('landing.flows.coach.q0.o4', 'Competition preparation'), t('landing.flows.coach.q0.o5', 'Long-term athlete development')],
      },
      {
        question: t('landing.flows.coach.q1.question', 'How many athletes do you currently coach?'),
        options: [t('landing.flows.coach.q1.o0', '1–10'), t('landing.flows.coach.q1.o1', '11–25'), t('landing.flows.coach.q1.o2', '26–50'), t('landing.flows.coach.q1.o3', '51+')],
      },
      {
        question: t('landing.flows.coach.q2.question', 'What is your biggest challenge?'),
        options: [t('landing.flows.coach.q2.o0', 'Monitoring athlete progress'), t('landing.flows.coach.q2.o1', 'Training planning'), t('landing.flows.coach.q2.o2', 'Communication'), t('landing.flows.coach.q2.o3', 'Competition preparation'), t('landing.flows.coach.q2.o4', 'Athlete retention'), t('landing.flows.coach.q2.o5', 'Managing multiple athletes')],
      },
      {
        question: t('landing.flows.coach.q3.question', 'What are you looking to achieve?'),
        options: [t('landing.flows.coach.q3.o0', 'Improve athlete results'), t('landing.flows.coach.q3.o1', 'Scale my coaching practice'), t('landing.flows.coach.q3.o2', 'Streamline athlete management'), t('landing.flows.coach.q3.o3', 'Enhance performance tracking'), t('landing.flows.coach.q3.o4', 'Build a stronger coaching program')],
      },
    ],
    'Team / Club': [
      {
        question: t('landing.flows.teamClub.q0.question', 'What is your organization\'s priority?'),
        options: [t('landing.flows.teamClub.q0.o0', 'Athlete development'), t('landing.flows.teamClub.q0.o1', 'Performance management'), t('landing.flows.teamClub.q0.o2', 'Membership growth'), t('landing.flows.teamClub.q0.o3', 'Coach development'), t('landing.flows.teamClub.q0.o4', 'Competition success'), t('landing.flows.teamClub.q0.o5', 'Digital transformation')],
      },
      {
        question: t('landing.flows.teamClub.q1.question', 'How many athletes are in your organization?'),
        options: [t('landing.flows.teamClub.q1.o0', 'Under 50'), t('landing.flows.teamClub.q1.o1', '50–200'), t('landing.flows.teamClub.q1.o2', '200–500'), t('landing.flows.teamClub.q1.o3', '500+')],
      },
      {
        question: t('landing.flows.teamClub.q2.question', 'What area needs improvement?'),
        options: [t('landing.flows.teamClub.q2.o0', 'Athlete monitoring'), t('landing.flows.teamClub.q2.o1', 'Communication'), t('landing.flows.teamClub.q2.o2', 'Scheduling'), t('landing.flows.teamClub.q2.o3', 'Performance analysis'), t('landing.flows.teamClub.q2.o4', 'Coach collaboration'), t('landing.flows.teamClub.q2.o5', 'Administration')],
      },
      {
        question: t('landing.flows.teamClub.q3.question', 'What outcome are you seeking?'),
        options: [t('landing.flows.teamClub.q3.o0', 'Better athlete performance'), t('landing.flows.teamClub.q3.o1', 'More efficient operations'), t('landing.flows.teamClub.q3.o2', 'Higher athlete retention'), t('landing.flows.teamClub.q3.o3', 'Improved competition results'), t('landing.flows.teamClub.q3.o4', 'Stronger development pathways')],
      },
    ],
    'Federation': [
      {
        question: t('landing.flows.federation.q0.question', 'What is your main objective?'),
        options: [t('landing.flows.federation.q0.o0', 'National athlete development'), t('landing.flows.federation.q0.o1', 'Coach education'), t('landing.flows.federation.q0.o2', 'Talent identification'), t('landing.flows.federation.q0.o3', 'Performance pathways'), t('landing.flows.federation.q0.o4', 'Federation modernization'), t('landing.flows.federation.q0.o5', 'Stakeholder engagement')],
      },
      {
        question: t('landing.flows.federation.q1.question', 'Who are you primarily supporting?'),
        options: [t('landing.flows.federation.q1.o0', 'Athletes'), t('landing.flows.federation.q1.o1', 'Coaches'), t('landing.flows.federation.q1.o2', 'Clubs'), t('landing.flows.federation.q1.o3', 'Regional organizations'), t('landing.flows.federation.q1.o4', 'National teams')],
      },
      {
        question: t('landing.flows.federation.q2.question', 'What challenge are you facing?'),
        options: [t('landing.flows.federation.q2.o0', 'Data management'), t('landing.flows.federation.q2.o1', 'Athlete tracking'), t('landing.flows.federation.q2.o2', 'Communication'), t('landing.flows.federation.q2.o3', 'Coach development'), t('landing.flows.federation.q2.o4', 'Talent pathways'), t('landing.flows.federation.q2.o5', 'Performance oversight')],
      },
      {
        question: t('landing.flows.federation.q3.question', 'What are you hoping to achieve?'),
        options: [t('landing.flows.federation.q3.o0', 'Better athlete outcomes'), t('landing.flows.federation.q3.o1', 'Stronger national programs'), t('landing.flows.federation.q3.o2', 'Improved collaboration'), t('landing.flows.federation.q3.o3', 'Greater visibility'), t('landing.flows.federation.q3.o4', 'More efficient operations')],
      },
    ],
    'Sports Agent': [
      {
        question: t('landing.flows.sportsAgent.q0.question', 'What type of athletes do you represent?'),
        options: [t('landing.flows.sportsAgent.q0.o0', 'Youth prospects'), t('landing.flows.sportsAgent.q0.o1', 'Amateur athletes'), t('landing.flows.sportsAgent.q0.o2', 'Professional athletes'), t('landing.flows.sportsAgent.q0.o3', 'Olympic athletes'), t('landing.flows.sportsAgent.q0.o4', 'Mixed portfolio')],
      },
      {
        question: t('landing.flows.sportsAgent.q1.question', 'What is your biggest priority?'),
        options: [t('landing.flows.sportsAgent.q1.o0', 'Athlete development'), t('landing.flows.sportsAgent.q1.o1', 'Career planning'), t('landing.flows.sportsAgent.q1.o2', 'Sponsorship opportunities'), t('landing.flows.sportsAgent.q1.o3', 'Brand growth'), t('landing.flows.sportsAgent.q1.o4', 'Competition management')],
      },
      {
        question: t('landing.flows.sportsAgent.q2.question', 'How many athletes do you manage?'),
        options: [t('landing.flows.sportsAgent.q2.o0', '1–10'), t('landing.flows.sportsAgent.q2.o1', '11–25'), t('landing.flows.sportsAgent.q2.o2', '26–50'), t('landing.flows.sportsAgent.q2.o3', '50+')],
      },
      {
        question: t('landing.flows.sportsAgent.q3.question', 'What outcome matters most?'),
        options: [t('landing.flows.sportsAgent.q3.o0', 'Better athlete performance'), t('landing.flows.sportsAgent.q3.o1', 'More commercial opportunities'), t('landing.flows.sportsAgent.q3.o2', 'Stronger athlete visibility'), t('landing.flows.sportsAgent.q3.o3', 'Improved career planning'), t('landing.flows.sportsAgent.q3.o4', 'Centralized athlete management')],
      },
    ],
  }
}

const TOTAL_QUIZ_STEPS = 5

const AVATAR_COLORS = ['#1a1a2e', '#16213e', '#0f3460', '#533483', '#e94560']

function LandingPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [role, setRole] = useState('')
  const [selected, setSelected] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [emailCopied, setEmailCopied] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  // Drive the picker from the live i18next language (landing is outside the
  // LanguageProvider, so we switch i18n directly — same effect as the in-app
  // switcher: persist the choice and load that locale's translations).
  const language = (i18n.language || 'en').toUpperCase() as typeof LANGUAGES[number]['code']
  const switchLanguage = (code: typeof LANGUAGES[number]['code']) => {
    const lc = code.toLowerCase()
    localStorage.setItem('preferred_language', lc)
    // Self-contained site ships the bundled English fallback; switching locale
    // re-applies it and flips document direction (no backend translation fetch).
    initI18n(undefined, lc)
  }
  const [country, setCountry] = useState(() => COUNTRIES.find(c => c.name === 'Estonia')!)
  const [langModalOpen, setLangModalOpen] = useState(false)
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false)
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false)
  const [countrySearch, setCountrySearch] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const countryDropdownRef = useRef<HTMLDivElement>(null)
  const languageDropdownRef = useRef<HTMLDivElement>(null)
  const collageRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: collageProgress } = useScroll({ target: collageRef, offset: ['start end', 'end start'] })

  const NAV_LINKS = buildNavLinks(t)
  const FAQS = buildFaqs(t)
  const ROLES = buildRoles(t)
  const FLOWS = buildFlows(t)

  const FEATURES = [
    { label: 'Training', title: t('landing.features.training.title', 'Training'), body: t('landing.features.training.body', 'Build structured training blocks and log every workout in one shared calendar with your coaching staff.'), img: IMAGES.features.training, gradient: 'linear-gradient(#fff0 40%,#ffab9433 90%,#ffab9466)', badges: [t('landing.features.training.badges.0', 'Shared calendar'), t('landing.features.training.badges.1', 'Workout logging'), t('landing.features.training.badges.2', 'Coach sync')] },
    { label: 'Nutrition', title: t('landing.features.nutrition.title', 'Nutrition'), body: t('landing.features.nutrition.body', 'Get personalised meal plans matched to your training load, with macros and hydration tracked daily.'), img: IMAGES.features.nutrition, gradient: 'linear-gradient(#fff0 40%,#415eee33 90%,#415eee66)', badges: [t('landing.features.nutrition.badges.0', 'Meal plans'), t('landing.features.nutrition.badges.1', 'Macro tracking'), t('landing.features.nutrition.badges.2', 'Hydration log')] },
    { label: 'Recovery', title: t('landing.features.recovery.title', 'Recovery'), body: t('landing.features.recovery.body', 'Track sleep, HRV and wellness scores so your coaches know exactly when you need extra recovery time.'), img: IMAGES.features.recovery, gradient: 'linear-gradient(#fff0 40%,#31ce0133 90%,#31ce0166)', badges: [t('landing.features.recovery.badges.0', 'Sleep tracking'), t('landing.features.recovery.badges.1', 'HRV monitoring'), t('landing.features.recovery.badges.2', 'Wellness scores')] },
  ]

  const WIDE_FEATURES = [
    { label: 'Analytics', title: t('landing.features.analytics.title', 'Analytics'), body: t('landing.features.analytics.body', 'Visualise trends across training, recovery and competition results, so coaches and athletes can spot what is working before it shows up in results.'), img: IMAGES.features.analytics, gradient: 'linear-gradient(#fff0,#b9a6ff66 90%,#b9a6ff66)', badges: [t('landing.features.analytics.badges.0', 'Trend tracking'), t('landing.features.analytics.badges.1', 'Custom reports'), t('landing.features.analytics.badges.2', 'Real-time data')] },
    { label: 'Team', title: t('landing.features.team.title', 'Team'), body: t('landing.features.team.body', 'Give coaches, medical staff and agents shared visibility into every athlete, with the right access for each role on the team.'), img: IMAGES.features.team, gradient: 'linear-gradient(#fff0,#83e3de33 90%,#83e3de66)', badges: [t('landing.features.team.badges.0', 'Shared visibility'), t('landing.features.team.badges.1', 'Role-based access'), t('landing.features.team.badges.2', 'Secure messaging')] },
  ]

  const ONBOARDING_STEPS = [
    { step: '01', tag: t('landing.onboarding.step1.tag', 'Step 1'), title: t('landing.onboarding.step1.title', 'Book a demo meeting'), body: t('landing.onboarding.step1.body', 'Schedule a call with our team to see Monetiseur in action and map out the right setup for your athletes, coaches and staff.'), img: IMAGES.landing.steps.step1, duration: t('landing.onboarding.step1.duration', 'Demo · 1 hour') },
    { step: '02', tag: t('landing.onboarding.step2.tag', 'Step 2'), title: t('landing.onboarding.step2.title', 'Platform adoption'), body: t('landing.onboarding.step2.body', 'We onboard your roster, configure roles and permissions, and get every coach, athlete and agent comfortable with their dashboard.'), img: IMAGES.landing.steps.step2, person: { name: 'Aleksei', role: t('landing.onboarding.step2.personRole', 'Your Personal Delivery Manager'), img: IMAGES.people.alekseiGaranin }, duration: t('landing.onboarding.step2.duration', 'Adoption · Up to 2 weeks') },
    { step: '03', tag: t('landing.onboarding.step3.tag', 'Step 3'), title: t('landing.onboarding.step3.title', 'Pilot launch and testing'), body: t('landing.onboarding.step3.body', 'Run a focused pilot with a subset of your team, validate the workflows that matter most, and fine-tune before a full rollout.'), img: IMAGES.landing.steps.step3, person: { name: 'Mihhail', role: t('landing.onboarding.step3.personRole', 'Your Personal Account Manager'), img: IMAGES.people.mihhailPopov }, duration: t('landing.onboarding.step3.duration', 'Testing · 3 weeks') },
    { step: '04', tag: t('landing.onboarding.step4.tag', 'Step 4'), title: t('landing.onboarding.step4.title', 'Ongoing success'), body: t('landing.onboarding.step4.body', 'Get continuous support, feature updates and check-ins so Monetiseur keeps delivering value as your program grows.'), img: IMAGES.landing.steps.step4, duration: t('landing.onboarding.step4.duration', 'Ongoing · Lifetime') },
  ]

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 768)
        setMobileNavOpen(false)
    }
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
    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setDropdownOpen(false)
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(e.target as Node))
        setCountryDropdownOpen(false)
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(e.target as Node))
        setLanguageDropdownOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Quiz question + options for the current step. Options are normalized to
  // { value, label }: `value` is the language-stable key (role name / English
  // option) stored in `selected`/`role`, `label` is the translated display text.
  const currentQuestion = step === 0
    ? t('landing.quiz.who', 'Who are you?')
    : FLOWS[role][step - 1].question
  const currentOptions = step === 0
    ? ROLES
    : FLOWS[role][step - 1].options.map(o => ({ value: o, label: o }))
  const selectedLabel = currentOptions.find(o => o.value === selected)?.label ?? ''
  const isLast = step === TOTAL_QUIZ_STEPS - 1

  function handleNext() {
    if (!selected)
      return
    if (step === 0) {
      setRole(selected)
      setStep(1)
      setSelected('')
      return
    }
    if (isLast) {
      setCompleted(true)
    }
    else {
      setStep(s => s + 1)
      setSelected('')
    }
  }

  function handleCopyEmail() {
    navigator.clipboard.writeText('welcome@monetiseur.pro')
    setEmailCopied(true)
    setTimeout(setEmailCopied, EMAIL_COPIED_RESET_MS, false)
  }

  function closeLangModal() {
    setLangModalOpen(false)
    setCountryDropdownOpen(false)
    setLanguageDropdownOpen(false)
    setCountrySearch('')
  }

  function scrollToSection(id: string) {
    setMobileNavOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  // Labels are athlete proper names — not translated.
  const GALLERY_IMAGES = [
    { src: IMAGES.customers.erkiNool, label: 'Erki Nool', countryCode: 'ee' },
    { src: IMAGES.customers.adhamDjamalov, label: 'Adham Djamalov', countryCode: 'uz' },
    { src: IMAGES.customers.talalAlenezi, label: 'Talal Alenezi', countryCode: 'kw' },
    { src: IMAGES.customers.aigerimAbilkadirova, label: 'Aigerim Abilkadirova', countryCode: 'kz' },
    { src: IMAGES.customers.toniLettner, label: 'Toni Lettner', countryCode: 'us' },
  ]

  const COLLAGE_COLUMNS = [
    { offset: '', images: [IMAGES.landing.gallery.gallery1] },
    { offset: 'mt-16', images: [IMAGES.landing.gallery.gallery2] },
    { offset: 'mt-4', images: [IMAGES.demo.hedi] },
    { offset: 'mt-24', images: [IMAGES.landing.gallery.gallery3] },
    { offset: 'mt-8', images: [IMAGES.demo.alika] },
    { offset: 'mt-20', images: [IMAGES.landing.gallery.gallery4] },
    { offset: 'mt-2', images: [IMAGES.landing.gallery.gallery5] },
    { offset: 'mt-16', images: [IMAGES.landing.gallery.gallery6] },
    { offset: 'mt-6', images: [IMAGES.landing.gallery.gallery6] },
  ]

  return (
    <div className="w-full bg-white">
      {/* ── Hero ── */}
      <div className="relative flex h-dvh w-full items-center justify-center">
        {/* Dark band behind hero */}
        <div className="absolute top-0 left-0 z-0 h-[75vh] w-full bg-[#070233]" />
        <div className="relative z-10 h-dvh w-screen overflow-hidden rounded-none bg-black md:h-[calc(100vh-2rem)] md:w-[calc(100vw-2rem)] md:rounded-xl">
          {/* Video background */}
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src="/videos/hero.webm"
            autoPlay
            loop
            muted
            playsInline
          />

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#070233]/60 via-[#070233]/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />

          {/* ── Hero content ── */}
          <div className="relative z-10 flex h-full flex-col justify-between px-4 pb-4 pt-12 md:px-16 md:pb-10 md:pt-24">

            {/* Hero text — center-left, large */}
            <div className="flex flex-1 items-center">
              <motion.h1
                className="font-black uppercase leading-none text-white"
                style={{
                  fontFamily: '\'Integral CF\', sans-serif',
                  fontSize: 'clamp(40px, 9vw, 82px)',
                  letterSpacing: '-0.01em',
                  lineHeight: 0.92,
                  textShadow: '0 2px 40px rgba(0,0,0,0.3)',
                }}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              >
                <Trans i18nKey="landing.hero.headline">
                  Built for Athletes.
                  <br />
                  Designed for
                  {' '}
                  <span style={{ color: '#ff1700' }}>Results.</span>
                </Trans>
              </motion.h1>
            </div>

            {/* ── Bottom row ── */}
            <div className="flex items-end justify-between gap-6">

              {/* Quiz card */}
              <motion.div
                className="w-full max-w-[540px] rounded-brand bg-white p-6"
                style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.9)' }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.25, ease: 'easeOut' }}
              >
                {!completed
                  ? (
                      <>
                        {/* Step indicator */}
                        <div className="mb-4 flex items-center gap-3">
                          <span className="text-[12px] font-bold uppercase tracking-[0.15em] text-[#ff1700]">
                            {t('landing.quiz.step', 'STEP {{current}}/{{total}}', { current: step + 1, total: TOTAL_QUIZ_STEPS })}
                          </span>
                          <div className="flex flex-1 gap-1">
                            {Array.from({ length: TOTAL_QUIZ_STEPS }).map((_, i) => (
                              <div
                                key={i}
                                className="h-[3px] flex-1 rounded-full transition-colors duration-300"
                                style={{ backgroundColor: i <= step ? '#ff1700' : 'rgba(7,2,51,0.12)' }}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Question */}
                        <p className="mb-6 text-[18px] font-bold text-[#070233]">
                          {currentQuestion}
                        </p>

                        {/* Controls */}
                        <div className="flex items-stretch gap-3">
                          {/* Dropdown */}
                          <div className="relative min-w-0 flex-1" ref={dropdownRef}>
                            <button
                              onClick={() => setDropdownOpen(o => !o)}
                              className="flex h-full w-full cursor-pointer items-center justify-between rounded-brand px-5 py-3 text-[16px] text-[#070233] transition-colors duration-200"
                              style={{ boxShadow: 'inset 0 0 0 1px rgba(7,2,51,0.2)', backgroundColor: '#F8FAFD' }}
                            >
                              <span className={`min-w-0 flex-1 truncate text-start ${selected ? 'text-[#070233]' : ''}`}>{selectedLabel || t('landing.quiz.makeChoice', 'Make a choice')}</span>
                              <ChevronDown className={`h-4 w-4 shrink-0 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {dropdownOpen && (
                              <div className="absolute bottom-full left-0 z-30 mb-2 w-full overflow-hidden rounded-brand bg-white shadow-lg" style={{ boxShadow: '0 4px 24px rgba(7,2,51,0.12), inset 0 0 0 1px #E4E9F1' }}>
                                {currentOptions.map(opt => (
                                  <button
                                    key={opt.value}
                                    onClick={() => { setSelected(opt.value); setDropdownOpen(false) }}
                                    className="w-full cursor-pointer px-5 py-3 text-start text-[14px] text-[#070233] transition-colors duration-150 hover:bg-[#F8FAFD]"
                                  >
                                    {opt.label}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Next */}
                          <button
                            onClick={handleNext}
                            disabled={!selected}
                            className="flex cursor-pointer items-center gap-2 rounded-brand bg-[#070233] px-5 py-3 text-[16px] font-medium text-white transition-all duration-200 hover:bg-[#ff1700] disabled:cursor-not-allowed disabled:opacity-35"
                          >
                            <span className="hidden sm:inline">{isLast ? t('landing.quiz.submit', 'Submit') : t('landing.quiz.next', 'Next')}</span>
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>

                        <p className="mt-4 text-[14px] leading-relaxed text-[#070233]">
                          {t('landing.quiz.disclaimer', 'Check without obligation whether Monetiseur fits your goals.')}
                        </p>
                      </>
                    )
                  : (
                      <div className="py-2 text-center">
                        <p className="mb-2 text-[22px] font-black uppercase text-[#070233]">
                          {t('landing.quiz.thankYou', 'Thank you.')}
                        </p>
                        <p className="mb-4 text-[13px] text-[#070233]/50">{t('landing.quiz.finalStep', 'Final step — book your personalised demo.')}</p>
                        <a
                          href={CALENDLY_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-brand bg-[#070233] px-5 py-3 text-[13px] font-semibold text-white transition-all hover:bg-[#ff1700]"
                        >
                          {t('landing.cta.bookDemo', 'Book a demo')}
                          {' '}
                          <ChevronRight className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    )}
              </motion.div>

            </div>
          </div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <motion.nav
        className={`fixed left-0 right-0 top-0 z-[70] transition-all duration-300 ${scrolled ? 'px-3 pt-3' : ''}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div
          className={`mx-auto flex items-center justify-between transition-all duration-300 ${scrolled ? 'max-w-[1400px] rounded-xl bg-[#070233] p-4 shadow-lg md:px-6 md:py-3' : 'max-w-[1400px] px-4 py-6 md:px-16'
          }`}
        >
          {/* Logo */}
          <MonetiseurWordmark fill="white" className="h-4 w-auto cursor-pointer transition-opacity duration-300" />

          {/* Nav links — desktop */}
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

          {/* CTA */}
          <div className="flex items-center gap-3">
            {/* Language switcher */}
            <button
              onClick={() => setLangModalOpen(true)}
              className="hidden cursor-pointer items-center gap-2.5 rounded-full px-4 py-2 text-[15px] font-medium text-white transition-colors duration-200 hover:bg-white/10 sm:flex"
            >
              <span className="h-5 w-5 shrink-0 overflow-hidden rounded-full" style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.6)' }}>
                <img
                  src={`https://flagcdn.com/w40/${country.code}.png`}
                  alt={country.name}
                  className="h-full w-full object-cover"
                />
              </span>
              {language}
            </button>
            <a
              href={`${APP_URL}/login`}
              className="hidden cursor-pointer text-center py-3 px-5 text-[14px] rounded-brand border text-white transition-colors duration-200 hover:border-transparent hover:bg-[#2F9BFF] md:flex"
            >
              {t('landing.cta.login', 'Login')}
            </a>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden cursor-pointer text-center py-3 px-5 text-[14px] rounded-brand text-sm font-semibold transition-colors duration-200 md:flex ${scrolled ? 'bg-white text-[#070233] hover:bg-[#2F9BFF] hover:text-white' : 'bg-[#fff] text-[#070233] hover:bg-[#2F9BFF] hover:text-[#fff]'
              }`}
            >
              {t('landing.cta.bookDemo', 'Book a demo')}
            </a>

            {/* Hamburger — mobile only */}
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

      {/* ── Mobile nav overlay ── */}
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

      {/* ── Language modal ── */}
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

      {/* ── Social proof section ── */}
      <section id="network" className="bg-white pb-0 pt-20 md:pb-20">
        {/* Headline */}
        <motion.h2
          className="mb-14 px-4 text-center font-black uppercase text-[#070233] md:px-16"
          style={{ fontFamily: '\'Integral CF\', sans-serif', fontSize: 'clamp(28px, 3.5vw, 48px)', lineHeight: 1.1 }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <Trans i18nKey="landing.sections.network">
            Where Potential
            <br />
            Becomes Performance
          </Trans>
        </motion.h2>

        {/* Scrolling gallery */}
        <div className="overflow-hidden">
          <div className="animate-marquee flex w-max gap-4 px-4">
            {[...GALLERY_IMAGES, ...GALLERY_IMAGES].map((img, i) => (
              <div
                key={i}
                className="h-[290px] w-[220px] shrink-0 overflow-hidden rounded-2xl md:h-[420px] md:w-[320px]"
                style={{ position: 'relative', flex: 'none' }}
              >
                <img
                  src={img.src}
                  alt={img.label}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <span
                    className="h-5 w-5 shrink-0 overflow-hidden rounded-full bg-white/10"
                    style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.6)' }}
                  >
                    <img
                      src={`https://flagcdn.com/w40/${img.countryCode}.png`}
                      alt={img.countryCode}
                      className="h-full w-full object-cover"
                    />
                  </span>
                  <span className="text-[13px] font-semibold uppercase tracking-wider text-white">
                    {img.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Functionality ── */}
      <section id="platform" className="bg-white py-24 px-4 md:px-16">
        <div className="mx-auto">
          <motion.h2
            className="mb-14 text-center font-black uppercase text-[#070233]"
            style={{ fontFamily: '\'Integral CF\', sans-serif', fontSize: 'clamp(28px, 3.5vw, 48px)', lineHeight: 1.1 }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <Trans i18nKey="landing.sections.platform">
              Everything your
              <br />
              performance demands
            </Trans>
          </motion.h2>

          {/* 12-column grid: 3 × col-span-4 cards + 2 × col-span-12 wide cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            {FEATURES.map((f, fi) => (
              <motion.div
                key={f.label}
                className="col-span-1 flex flex-col overflow-hidden md:col-span-4"
                style={{ backgroundColor: '#ebf0f8', backgroundImage: f.gradient, borderRadius: '1.5rem' }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: fi * 0.1, ease: 'easeOut' }}
              >
                <div className="flex flex-col gap-3 p-6 md:p-[48px]">
                  <h3
                    className="text-[24px] font-semibold uppercase leading-snug text-[#070233] md:text-[32px]"
                    style={{ fontFamily: '\'Integral CF\', sans-serif' }}
                  >
                    {f.title}
                  </h3>
                  <p className="text-[16px] leading-relaxed text-[#73839E] md:text-[18px]">{f.body}</p>
                  <div className="flex flex-wrap gap-2">
                    {f.badges.map(badge => (
                      <span
                        key={badge}
                        className="rounded-full border border-white bg-white/60 px-4 py-2 text-[12px] font-medium text-[#070233] backdrop-blur-md"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="px-6 md:px-[48px]">
                  <div className="relative w-full overflow-hidden rounded-xl" style={{ aspectRatio: '360 / 495' }}>
                    <img
                      src={f.img}
                      alt={f.label}
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Wide features — each spans full 12 columns */}
            {WIDE_FEATURES.map((f, i) => (
              <motion.div
                key={f.label}
                className={`col-span-1 flex flex-col justify-between overflow-hidden md:col-span-12 md:flex-row ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                style={{ backgroundColor: '#ebf0f8', backgroundImage: f.gradient, borderRadius: '1.5rem' }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <div className="flex w-full flex-col justify-center gap-4 p-10 md:w-[50%] md:p-16">
                  <h3
                    className="text-[24px] font-semibold uppercase leading-snug text-[#070233] md:text-[32px]"
                    style={{ fontFamily: '\'Integral CF\', sans-serif' }}
                  >
                    {f.title}
                  </h3>
                  <p className="text-[16px] leading-relaxed text-[#73839E] md:text-[18px]">{f.body}</p>
                  <div className="flex flex-wrap gap-2">
                    {f.badges.map(badge => (
                      <span
                        key={badge}
                        className="rounded-full border border-white bg-white/60 px-4 py-2 text-[12px] font-medium text-[#070233] backdrop-blur-md"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-1 md:max-w-[50%]">
                  <div className="relative h-full min-h-[50vh] w-full overflow-hidden rounded-xl md:min-h-[75vh]">
                    <img
                      src={f.img}
                      alt={f.label}
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Built for every role ── */}
      <section
        id="services"
        className="overflow-hidden rounded-b-[25px] pb-24"
        style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, #ff170033 0%, transparent 60%), linear-gradient(135deg, #070233 0%, #0a0240 50%, #2a0a14 100%)' }}
      >
        <div className="overflow-hidden border-b border-white pb-5 pt-4 md:pb-10">
          <div className="animate-marquee flex w-max items-center gap-12 whitespace-nowrap">
            {[0, 1].map(i => (
              <div key={i} className="flex items-center gap-12">
                <span
                  className="font-black uppercase text-white"
                  style={{
                    fontFamily: '\'Integral CF\', sans-serif',
                    fontSize: 'clamp(36px, 8vw, 92px)',
                  }}
                >
                  {t('landing.sections.getStarted', 'Get started in minutes')}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto flex flex-col gap-20 px-4 pt-16 md:px-16">
          <div className="pointer-events-none absolute bottom-0 left-6 top-0 w-px bg-gradient-to-b from-white/0 via-white/20 to-white/0 md:left-1/2 md:-translate-x-1/2" />
          {ONBOARDING_STEPS.map((s, i) => (
            <motion.div
              key={s.step}
              className={`relative flex flex-col items-center justify-between gap-12 ps-10 md:flex-row md:ps-0 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              <motion.div
                className="absolute left-2 top-12 z-10 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border-2 border-[#ff1700] bg-[#070233] text-[14px] font-black text-white md:left-1/2 md:top-1/2 md:h-14 md:w-14 md:-translate-y-1/2 md:text-[16px]"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: 0.3, ease: 'backOut' }}
              >
                <span className="absolute inset-0 animate-ping rounded-full border-2 border-[#ff1700]" />
                {i + 1}
              </motion.div>
              <div className="w-full md:max-w-[40%]">
                <div className="mb-5 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#ff1700]" />
                  <span className="text-[13px] font-bold uppercase tracking-[0.2em] text-white/70">{s.tag}</span>
                </div>
                <h3
                  className="mb-5 font-black uppercase leading-[1.05] text-white"
                  style={{ fontFamily: '\'Integral CF\', sans-serif', fontSize: 'clamp(32px, 4vw, 48px)' }}
                >
                  {s.title}
                </h3>
                <p className="text-[16px] leading-relaxed text-white/60">{s.body}</p>
                {i === 0 && (
                  <button className="mt-6 flex items-center gap-1.5 rounded-brand bg-[#2F9BFF] px-5 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#2F9BFF]/85">
                    {t('landing.cta.bookMeeting', 'Book a meeting')}
                    {' '}
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                )}
                {s.person && (
                  <div className="mt-6 flex items-center gap-3">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full">
                      <img
                        src={s.person.img}
                        alt={s.person.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-white">{s.person.name}</p>
                      <p className="text-[13px] text-white/50">{s.person.role}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="relative w-full md:w-auto md:self-center">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[12px] md:h-[min(75vh,600px)] md:w-auto">
                  <img
                    src={s.img}
                    alt={s.title}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-[#2F9BFF] px-4 py-2 text-[13px] font-semibold text-white backdrop-blur-sm">
                    {s.duration}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Photo collage ── */}
      <section id="customers" className="overflow-hidden bg-white py-24 px-4 md:px-16">
        <div ref={collageRef} className="mx-auto mb-16 flex max-w-6xl justify-center gap-4">
          {COLLAGE_COLUMNS.map((col, ci) => (
            <CollageColumn key={ci} progress={collageProgress} index={ci} offset={col.offset} images={col.images} />
          ))}
        </div>
        <motion.h2
          className="mb-5 text-center font-black uppercase text-[#070233]"
          style={{ fontFamily: '\'Integral CF\', sans-serif', fontSize: 'clamp(32px, 5vw, 64px)', lineHeight: 1.1 }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <Trans i18nKey="landing.sections.customers">
            Built with care
            <br />
            trusted everywhere
          </Trans>
        </motion.h2>
        <motion.p
          className="mx-auto max-w-xl text-center text-[16px] leading-relaxed text-[#73839E]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
        >
          {t('landing.sections.customersBody', 'Don\'t take our word for it. See why athletes, coaches and agents around the world trust Monetiseur to manage their careers, training and finances in one place.')}
        </motion.p>
        <motion.div
          className="mt-8 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
        >
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-brand bg-[#2F9BFF] px-5 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#2F9BFF]/85"
          >
            {t('landing.cta.bookDemoMeeting', 'Book a demo meeting')}
            {' '}
            <ChevronRight className="h-3.5 w-3.5" />
          </a>
        </motion.div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-white px-4 pb-24 md:px-16">
        <div className="mx-auto flex flex-col gap-12 md:flex-row md:gap-16">
          <div className="md:w-[30%]">
            <h2
              className="font-black uppercase leading-none text-[#070233]"
              style={{ fontFamily: '\'Integral CF\', sans-serif', fontSize: 'clamp(40px, 6vw, 64px)' }}
            >
              {t('landing.faq.title', 'FAQ')}
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-[#73839E]">
              {t('landing.faq.intro', 'Everything you need to know about getting started with Monetiseur.')}
            </p>
          </div>
          <div className="flex flex-1 flex-col gap-3">
            {FAQS.map((faq, i) => {
              const isOpen = openFaq === i
              return (
                <div key={faq.question} className="overflow-hidden rounded-[1.5rem] bg-[#ebf0f8]">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-start"
                  >
                    <span className="text-[18px] font-bold uppercase text-[#070233] md:text-[24px]" style={{ fontFamily: '\'Integral CF\', sans-serif' }}>
                      {faq.question}
                    </span>
                    <Plus className={`h-8 w-8 shrink-0 text-[#070233] transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`} />
                  </button>
                  {isOpen && (
                    <p className="px-6 pb-5 text-[16px] leading-relaxed text-[#73839E] md:text-[18px]">
                      {faq.answer}
                    </p>
                  )}
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
            <h3
              className="font-black uppercase leading-[1.05] text-white"
              style={{ fontFamily: '\'Integral CF\', sans-serif', fontSize: 'clamp(32px, 4vw, 44px)' }}
            >
              <Trans i18nKey="landing.footer.ready">
                Ready to perform
                <br />
                together?
              </Trans>
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
                <img
                  src={IMAGES.people.mihhailPopov}
                  alt="Mihhail Popov"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
              <div className="text-[15px] leading-relaxed text-white/85">
                <p className="font-semibold text-[14px]">Mihhail Popov</p>
                <p className="text-white/65 text-[12px]">{t('landing.onboarding.step3.personRole', 'Your Personal Account Manager')}</p>
              </div>
            </div>
            <button
              onClick={handleCopyEmail}
              className="mt-2 flex w-full items-center justify-between rounded-full px-5 py-3 text-[14px] text-white transition-colors hover:bg-white/10"
              style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.5)' }}
            >
              <span className="flex items-center gap-3">
                <Send className="h-4 w-4 text-white/70" />
                welcome@monetiseur.pro
              </span>
            </button>
            <a
              href="https://wa.me/3725540890"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center gap-3 rounded-full px-5 py-3 text-[14px] text-white transition-colors hover:bg-white/10"
              style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.5)' }}
            >
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
