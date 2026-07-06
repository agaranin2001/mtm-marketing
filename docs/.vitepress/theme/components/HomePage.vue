<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { withBase } from 'vitepress'
import { ChevronRight, Search, Send } from 'lucide-vue-next'
import MonetiseurWordmark from './MonetiseurWordmark.vue'
import MobileNavOverlay from './MobileNavOverlay.vue'
import LanguageModal from './LanguageModal.vue'
import { COUNTRIES } from '../data/countries'
import { useI18n } from '../i18n'

const LANGUAGES = [
  { code: 'EN', name: 'English', nameKey: 'landing.languages.en', main: true },
  { code: 'ET', name: 'Estonian', nameKey: 'landing.languages.et', main: false },
  { code: 'RU', name: 'Russian', nameKey: 'landing.languages.ru', main: false },
] as const

const { t, language, setLang } = useI18n()

// The app lives on a separate origin; "Login" links point there.
const loginUrl = `${import.meta.env.VITE_APP_URL ?? 'https://app.monetiseur.pro'}/login`

const IMG = {
  training: '/images/knowledgehub/knowledge_hub_training.webp',
  nutrition: '/images/knowledgehub/knowledge_hub_nutrition.webp',
  recovery: '/images/knowledgehub/knowledge_hub_recovery.webp',
  analytics: '/images/knowledgehub/analytics.webp',
  team: '/images/knowledgehub/team_management.webp',
  events: '/images/knowledgehub/knowledge_hub_events.webp',
  athletes: '/images/knowledgehub/knowledge_hub_athletes.webp',
}

const categories = computed(() => [
  { key: 'all', label: t('knowledgeHub.categories.all', 'All') },
  { key: 'athletes', label: t('knowledgeHub.categories.athletes', 'Athletes') },
  { key: 'training', label: t('knowledgeHub.categories.training', 'Training') },
  { key: 'recovery', label: t('knowledgeHub.categories.recovery', 'Recovery') },
  { key: 'events', label: t('knowledgeHub.categories.events', 'Events') },
  { key: 'team', label: t('knowledgeHub.categories.team', 'Team') },
  { key: 'analytics', label: t('knowledgeHub.categories.analytics', 'Analytics') },
])

const guides = computed(() => [
  { id: 'athletes-management', category: 'athletes', image: IMG.athletes, title: t('knowledgeHub.guides.athletesManagement.title', 'Athletes Management'), description: t('knowledgeHub.guides.athletesManagement.desc', 'Manage your full athlete roster — view training, events, analytics, recovery and medical records all from one place.') },
  { id: 'training-plans-management', category: 'training', image: IMG.training, title: t('knowledgeHub.guides.trainingPlansManagement.title', 'Training Plans Management'), description: t('knowledgeHub.guides.trainingPlansManagement.desc', 'Build your exercise library, create session templates and schedule athlete training cycles.') },
  { id: 'recovery-management', category: 'recovery', image: IMG.nutrition, title: t('knowledgeHub.guides.recoveryManagement.title', 'Recovery and Nutrition'), description: t('knowledgeHub.guides.recoveryManagement.desc', 'Set up daily routines, weekly treatments and nutrition plans to keep athletes recovering at their best.') },
  { id: 'events', category: 'events', image: IMG.events, title: t('knowledgeHub.guides.events.title', 'Events'), description: t('knowledgeHub.guides.events.desc', 'Create competition and training events, assign athletes and manage all event details in one place.') },
  { id: 'manage-your-team', category: 'team', image: IMG.team, title: t('knowledgeHub.guides.manageYourTeam.title', 'Manage Your Team'), description: t('knowledgeHub.guides.manageYourTeam.desc', 'Invite athletes and staff, assign roles and keep your club or organisation running smoothly.') },
  { id: 'analytics-dashboard', category: 'analytics', image: IMG.analytics, title: t('knowledgeHub.guides.analyticsDashboard.title', 'Analytics Dashboard'), description: t('knowledgeHub.guides.analyticsDashboard.desc', 'Understand athlete performance trends, ACWR and session load through clear, actionable dashboards.') },
])

const colUp = [
  '/images/features/training.webp',
  '/images/features/recovery.webp',
  '/images/features/nutrition.webp',
  '/images/features/training.webp',
  '/images/features/recovery.webp',
  '/images/features/nutrition.webp',
]
const colDown = [
  '/images/features/session_report.png',
  '/images/features/training_session.png',
  '/images/features/chat.png',
  '/images/features/marketplace.png',
  '/images/features/session_report.png',
  '/images/features/training_session.png',
  '/images/features/chat.png',
  '/images/features/marketplace.png',
]

const query = ref('')
const activeCategory = ref('all')
const scrolled = ref(false)
const mobileNavOpen = ref(false)
const langModalOpen = ref(false)
const country = ref(COUNTRIES.find(c => c.name === 'Estonia')!)

const currentYear = new Date().getFullYear()
const copyright = computed(() => t('landing.footer.copyright', `© ${currentYear} Monetiseur`).replace('{{year}}', String(currentYear)))

const filteredGuides = computed(() => {
  const q = query.value.trim().toLowerCase()
  return guides.value.filter((g) => {
    const matchesCategory = activeCategory.value === 'all' || g.category === activeCategory.value
    const matchesQuery = !q || g.title.toLowerCase().includes(q) || g.description.toLowerCase().includes(q)
    return matchesCategory && matchesQuery
  })
})

function onScroll() {
  scrolled.value = window.scrollY > 60
}
function onResize() {
  if (window.innerWidth >= 768)
    mobileNavOpen.value = false
}
function scrollToGuides() {
  mobileNavOpen.value = false
  document.getElementById('guides')?.scrollIntoView({ behavior: 'smooth' })
}

watch(mobileNavOpen, (open) => {
  if (typeof document !== 'undefined')
    document.body.style.overflow = open ? 'hidden' : ''
})

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onResize)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onResize)
  if (typeof document !== 'undefined')
    document.body.style.overflow = ''
})

function closeLangModal() {
  langModalOpen.value = false
}
</script>

<template>
  <div class="w-full bg-white">
    <!-- Navigation -->
    <nav :class="`fixed left-0 right-0 top-0 z-[70] transition-all duration-300 ${scrolled ? 'px-3 pt-3' : ''}`">
      <div :class="`mx-auto flex items-center justify-between transition-all duration-300 ${scrolled ? 'max-w-[1400px] rounded-xl bg-[#070233] p-4 shadow-lg md:px-6 md:py-3' : 'max-w-[1400px] px-4 py-6 md:px-16'}`">
        <a href="/" target="_self" class="md:hidden"><MonetiseurWordmark fill="white" class="h-4 w-auto cursor-pointer" /></a>
        <a href="/" target="_self" class="hidden md:block"><MonetiseurWordmark :fill="scrolled ? 'white' : '#070233'" class="h-4 w-auto cursor-pointer" /></a>

        <div class="hidden items-center gap-8 md:flex">
          <a href="/" target="_self" :class="`cursor-pointer text-[16px] font-medium transition-colors ${scrolled ? 'text-white/85 hover:text-white' : 'text-[#070233]/70 hover:text-[#070233]'}`">
            {{ t('knowledgeHub.nav.home', 'Home') }}
          </a>
          <a href="#guides" :class="`text-[16px] font-medium transition-colors ${scrolled ? 'text-white/85 hover:text-white' : 'text-[#070233]/70 hover:text-[#070233]'}`">
            {{ t('knowledgeHub.nav.guides', 'Guides') }}
          </a>
        </div>

        <div class="flex items-center gap-3">
          <button
            :class="`hidden cursor-pointer items-center gap-2.5 rounded-full px-4 py-2 text-[15px] font-medium transition-colors sm:flex ${scrolled ? 'text-white hover:bg-white/10' : 'text-[#070233] hover:bg-[#070233]/10'}`"
            @click="langModalOpen = true"
          >
            <span class="h-5 w-5 shrink-0 overflow-hidden rounded-full" :style="{ boxShadow: scrolled ? 'inset 0 0 0 1px rgba(255,255,255,0.6)' : 'inset 0 0 0 1px rgba(7,2,51,0.3)' }">
              <img :src="`https://flagcdn.com/w40/${country.code}.png`" :alt="country.name" class="h-full w-full object-cover">
            </span>
            {{ language }}
          </button>
          <a :href="loginUrl" target="_self" :class="`hidden cursor-pointer rounded-brand border px-5 py-3 text-center text-[14px] transition-colors hover:border-transparent hover:bg-[#2F9BFF] hover:text-white md:flex ${scrolled ? 'border-white/30 text-white' : 'border-[#070233]/30 text-[#070233]'}`">
            {{ t('landing.cta.login', 'Login') }}
          </a>
          <a :href="loginUrl" target="_self" :class="`hidden cursor-pointer rounded-brand px-5 py-3 text-center text-[14px] font-semibold text-sm transition-colors md:flex ${scrolled ? 'bg-white text-[#070233] hover:bg-[#2F9BFF] hover:text-white' : 'bg-[#070233] text-white hover:bg-[#2F9BFF]'}`">
            {{ t('landing.cta.bookDemo', 'Book a demo') }}
          </a>

          <button
            class="-mr-2 flex h-12 w-[60px] cursor-pointer flex-col items-end justify-center gap-[6px] p-2 md:hidden"
            :aria-label="mobileNavOpen ? 'Close menu' : 'Open menu'"
            @click="mobileNavOpen = !mobileNavOpen"
          >
            <span :class="`block h-[2px] w-full origin-center bg-white transition-all duration-300 ${mobileNavOpen ? 'translate-y-[8px] rotate-45' : ''}`" />
            <span :class="`block h-[2px] w-full origin-center bg-white transition-all duration-300 ${mobileNavOpen ? 'scale-x-0 opacity-0' : ''}`" />
            <span :class="`block h-[2px] w-full origin-center bg-white transition-all duration-300 ${mobileNavOpen ? '-translate-y-[8px] -rotate-45' : ''}`" />
          </button>
        </div>
      </div>
    </nav>

    <MobileNavOverlay
      :open="mobileNavOpen"
      :links="[
        { label: t('knowledgeHub.nav.home', 'Home'), onClick: () => { window.location.href = '/' } },
        { label: t('knowledgeHub.nav.guides', 'Guides'), onClick: scrollToGuides },
      ]"
      :country="country"
      :language="language"
      :login-label="t('landing.cta.login', 'Login')"
      :book-demo-label="t('landing.cta.bookDemo', 'Book a demo')"
      @language-click="langModalOpen = true"
      @login="() => { window.location.href = loginUrl }"
      @book-demo="() => { window.location.href = loginUrl }"
    />

    <LanguageModal
      :open="langModalOpen"
      :languages="LANGUAGES"
      :language="language"
      :country="country"
      @close="closeLangModal"
      @select-language="setLang"
      @select-country="(c) => (country = c)"
    />

    <!-- Hero -->
    <div class="bg-white md:px-4 md:pb-4 md:pt-[95px]">
      <header class="relative flex flex-col overflow-hidden md:rounded-xl" :style="{ minHeight: '60vh', backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(255, 23, 0, 0.2) 0%, transparent 60%), linear-gradient(135deg, rgb(7, 2, 51) 0%, rgb(10, 2, 64) 50%, rgb(42, 10, 20) 100%)' }">
        <div class="pointer-events-none absolute inset-0" />
        <div class="relative z-10 mx-auto flex w-full flex-1 max-w-[1400px]">
          <div class="flex flex-col justify-center px-4 pt-28 pb-12 md:w-[58%] md:px-16 md:py-28">
            <span class="mb-5 block text-[12px] font-semibold uppercase tracking-[0.18em] text-[#ff1700]">
              {{ t('knowledgeHub.hero.eyebrow', 'Knowledge Hub') }}
            </span>
            <h1 class="font-black uppercase leading-none text-white" :style="{ fontFamily: '\'Integral CF\', sans-serif', fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: 0.95 }">
              {{ t('knowledgeHub.hero.headline', 'Discover how to use Monetiseur') }}
            </h1>
            <p class="mt-6 max-w-[480px] text-[17px] leading-relaxed text-white/55">
              {{ t('knowledgeHub.hero.subtitle', 'Get the most out of your team or club. These short guides show exactly how to set up, run and grow with the platform.') }}
            </p>
          </div>

          <div class="absolute inset-y-0 right-0 hidden w-[42%] overflow-hidden md:block">
            <div class="flex h-full gap-3 pr-4">
              <div class="flex flex-1 flex-col overflow-hidden">
                <div class="kh-col-up flex flex-col gap-3">
                  <img v-for="(src, i) in colUp" :key="`u${i}`" :src="src" alt="" class="w-full rounded-[10px]">
                </div>
              </div>
              <div class="flex flex-1 flex-col overflow-hidden">
                <div class="kh-col-down flex flex-col gap-3">
                  <img v-for="(src, i) in colDown" :key="`d${i}`" :src="src" alt="" class="w-full rounded-[10px]">
                </div>
              </div>
            </div>
            <div class="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#070233] to-transparent" />
            <div class="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#070233] to-transparent" />
          </div>
        </div>
      </header>
    </div>

    <!-- Popular Guides -->
    <section id="guides" class="bg-white px-4 py-8 md:px-16 md:py-16">
      <div class="mx-auto max-w-[1400px]">
        <h2 class="font-black uppercase leading-tight text-[#070233]" :style="{ fontFamily: '\'Integral CF\', sans-serif', fontSize: 'clamp(28px, 4vw, 40px)' }">
          {{ t('knowledgeHub.guides.heading', 'Popular guides') }}
        </h2>
        <p class="mt-3 max-w-[520px] text-[16px] text-[#070233]/50">
          {{ t('knowledgeHub.guides.subheading', 'Short, practical walkthroughs for every part of the platform.') }}
        </p>

        <div class="mt-8 flex w-full items-center gap-3 rounded-brand px-5 py-4" :style="{ boxShadow: 'inset 0 0 0 1px #E4E9F1' }">
          <Search class="h-5 w-5 shrink-0 text-[#070233]/40" />
          <input
            v-model="query"
            :placeholder="t('knowledgeHub.hero.searchPlaceholder', 'Search guides…')"
            class="w-full bg-transparent text-[16px] text-[#070233] outline-none placeholder:text-[#070233]/40"
          >
        </div>

        <div class="mt-5 flex gap-2.5 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible md:pb-0" :style="{ scrollbarWidth: 'none' }">
          <button
            v-for="cat in categories"
            :key="cat.key"
            :class="`shrink-0 cursor-pointer rounded-full px-4 py-2 text-[14px] font-medium transition-colors ${activeCategory === cat.key ? 'bg-[#070233] text-white' : 'bg-[#F8FAFD] text-[#070233]/70 hover:bg-[#070233]/10'}`"
            @click="activeCategory = cat.key"
          >
            {{ cat.label }}
          </button>
        </div>

        <div v-if="filteredGuides.length > 0" class="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <a
            v-for="guide in filteredGuides"
            :key="guide.id"
            :href="withBase(`/guide/${guide.id}`)"
            class="group flex flex-col overflow-hidden rounded-brand bg-white transition-all duration-200 hover:-translate-y-1"
            :style="{ boxShadow: 'inset 0 0 0 1px #E4E9F1' }"
          >
            <div class="relative h-[180px] w-full shrink-0 overflow-hidden md:h-[250px]">
              <img :src="guide.image" :alt="guide.title" class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105">
              <div class="absolute inset-0 bg-gradient-to-t from-[#070233] to-[#070233]/40" />
              <MonetiseurWordmark fill="white" class="absolute left-1/2 top-1/2 h-4 w-auto -translate-x-1/2 -translate-y-1/2 opacity-50" />
            </div>
            <div class="flex flex-1 flex-col p-6">
              <h3 class="text-[19px] font-bold text-[#070233]">{{ guide.title }}</h3>
              <p class="mt-2 flex-1 text-[15px] leading-relaxed text-[#070233]/55">{{ guide.description }}</p>
              <span class="mt-5 inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#ff1700]">
                {{ t('knowledgeHub.guides.read', 'Read guide') }}
                <ChevronRight class="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </a>
        </div>
        <p v-else class="mt-12 text-[16px] text-[#070233]/50">
          {{ t('knowledgeHub.guides.empty', 'No guides match your search yet.') }}
        </p>
      </div>
    </section>

    <!-- CTA -->
    <section class="bg-white px-4 py-8 md:px-16 md:py-16">
      <div class="mx-auto flex max-w-[1400px] flex-col items-stretch gap-6 md:flex-row">
        <div class="flex flex-1 flex-col justify-center overflow-hidden rounded-[1.5rem] p-8 md:p-14" :style="{ backgroundColor: '#ebf0f8', backgroundImage: 'linear-gradient(#fff0 40%,#ffab9433 90%,#ffab9466)' }">
          <h2 class="font-black uppercase leading-tight text-[#070233]" :style="{ fontFamily: '\'Integral CF\', sans-serif', fontSize: 'clamp(26px, 3.5vw, 38px)' }">
            {{ t('knowledgeHub.cta.heading', 'Still have questions?') }}
          </h2>
          <p class="mt-3 max-w-[440px] text-[16px] text-[#73839E]">
            {{ t('knowledgeHub.cta.subtitle', 'Book a short demo and our team will walk you through everything in person.') }}
          </p>
        </div>

        <div class="w-full shrink-0 rounded-[1.5rem] border border-[#070233]/15 bg-[#070233] p-6 md:w-[380px] md:p-10">
          <p class="mb-4 text-[12px] font-bold uppercase tracking-[0.2em] text-white">{{ t('landing.footer.contact', 'Contact') }}</p>
          <div class="mb-4 flex items-center gap-3">
            <div class="h-12 w-12 shrink-0 overflow-hidden rounded-full">
              <img src="/images/people/mihhail-popov.webp" alt="Mihhail Popov" class="h-full w-full object-cover">
            </div>
            <div>
              <p class="text-[14px] font-semibold text-white">Mihhail Popov</p>
              <p class="text-[12px] text-white/55">{{ t('landing.onboarding.step3.personRole', 'Your Personal Account Manager') }}</p>
            </div>
          </div>
          <a href="mailto:support@monetiseur.com" class="mb-3 flex w-full items-center gap-3 rounded-full px-5 py-3 text-[14px] text-white transition-colors hover:bg-white/10" :style="{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.2)' }">
            <Send class="h-4 w-4 text-white/60" />
            support@monetiseur.com
          </a>
          <a href="mailto:support@monetiseur.com?subject=Demo%20Request" class="flex w-full items-center justify-center gap-2 rounded-full bg-[#2F9BFF] px-5 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#1a8af0]">
            {{ t('landing.cta.bookDemo', 'Book a demo') }}
          </a>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gradient-to-b from-[#070233] to-[#040118] px-4 py-8 md:px-16">
      <div class="mx-auto flex max-w-[1400px] flex-col items-center gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <MonetiseurWordmark fill="white" class="h-4 w-auto" />
          <p class="mt-2 text-[12px] text-white/25">{{ copyright }}</p>
        </div>
        <div class="flex items-center gap-6">
          <a href="/" target="_self" class="cursor-pointer text-[13px] text-white/40 transition-colors hover:text-white">
            {{ t('knowledgeHub.nav.home', 'Home') }}
          </a>
          <a href="#" class="text-[13px] text-white/40 transition-colors hover:text-white">{{ t('landing.footer.privacy', 'Privacy Policy') }}</a>
          <a href="#" class="text-[13px] text-white/40 transition-colors hover:text-white">{{ t('landing.footer.terms', 'Terms of Service') }}</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
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
</style>
