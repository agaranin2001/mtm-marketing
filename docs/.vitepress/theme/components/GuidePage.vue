<script setup lang="ts">
import { computed, ref } from 'vue'
import { useData, withBase } from 'vitepress'
import { ChevronDown, ChevronLeft, Clock, Play, PlayCircle } from 'lucide-vue-next'
import MonetiseurWordmark from './MonetiseurWordmark.vue'
import { flattenLessons, GUIDES } from '../data/guides'
import { useI18n } from '../i18n'

const { params } = useData()
const { t } = useI18n()

const guide = computed(() => GUIDES[(params.value?.id as string) ?? ''])
const totalLessons = computed(() => guide.value?.sections.reduce((acc, s) => acc + s.lessons.length, 0) ?? 0)
const firstLessonId = computed(() => (guide.value ? flattenLessons(guide.value)[0]?.id : undefined))
const currentYear = new Date().getFullYear()

const openSections = ref<Record<number, boolean>>({})
function ensureOpenInit() {
  if (guide.value && Object.keys(openSections.value).length === 0)
    guide.value.sections.forEach((_, i) => (openSections.value[i] = true))
}
ensureOpenInit()

function toggleSection(i: number) {
  openSections.value[i] = !openSections.value[i]
}

function lessonWord(count: number) {
  return count === 1 ? 'lesson' : 'lessons'
}
</script>

<template>
  <div v-if="!guide" class="flex min-h-screen flex-col items-center justify-center bg-white">
    <p class="text-[18px] text-[#070233]/50">{{ t('knowledgeHub.guide.notFound', 'Guide not found.') }}</p>
    <a :href="withBase('/')" class="mt-4 text-[#ff1700] underline">{{ t('knowledgeHub.guide.backToHub', 'Back to Knowledge Hub') }}</a>
  </div>

  <div v-else class="w-full bg-white">
    <!-- Hero -->
    <div class="relative min-h-[60vh] overflow-hidden">
      <img :src="guide.image" :alt="guide.title" class="absolute inset-0 h-full w-full object-cover">
      <div class="absolute inset-0" :style="{ background: 'linear-gradient(to top, rgb(255, 255, 255) 0%, rgba(7, 2, 51, 0.25) 100%)' }" />
      <div class="absolute inset-0 bg-white/65" />
      <a :href="withBase('/')" class="absolute left-4 top-4 z-20 inline-flex cursor-pointer items-center gap-1.5 text-[13px] font-semibold text-[#070233] transition-colors hover:opacity-70 md:left-8 md:top-6">
        <ChevronLeft class="h-4 w-4" />
        {{ t('knowledgeHub.nav.knowledgeHub', 'Knowledge Hub') }}
      </a>
      <div class="relative z-10 flex min-h-[60vh] flex-col items-center justify-end px-4 pb-12 pt-20 text-center md:px-16">
        <h1 class="font-black uppercase leading-none text-[#070233]" :style="{ fontFamily: '\'Integral CF\', sans-serif', fontSize: 'clamp(32px, 5vw, 72px)', lineHeight: 0.95 }">
          {{ guide.title }}
        </h1>
        <p class="mt-6 max-w-[520px] text-[16px] leading-relaxed text-[#070233]">{{ guide.description }}</p>
        <div class="mt-6 flex items-center justify-center gap-4 text-[15px] text-[#070233]">
          <span class="flex items-center gap-1.5">
            <PlayCircle class="h-5 w-5" />
            {{ totalLessons }} {{ lessonWord(totalLessons) }}
          </span>
          <span class="flex items-center gap-1.5">
            <Clock class="h-5 w-5" />
            {{ guide.totalDuration }}
          </span>
        </div>
        <a
          v-if="firstLessonId"
          :href="withBase(`/guide/${guide.id}/${firstLessonId}`)"
          class="mt-8 inline-flex cursor-pointer items-center gap-2 rounded-brand bg-[#2F9BFF] px-7 py-4 text-[15px] font-semibold text-white transition-colors hover:bg-[#1a8af0]"
        >
          <Play class="h-4 w-4" />
          {{ t('knowledgeHub.guide.startCourse', 'Start course') }}
        </a>
      </div>
    </div>

    <!-- Lesson Plan -->
    <section class="bg-white px-4 py-12 md:px-16 md:py-16">
      <div class="mx-auto max-w-[1400px]">
        <h2 class="font-black uppercase leading-tight text-[#070233]" :style="{ fontFamily: '\'Integral CF\', sans-serif', fontSize: 'clamp(24px, 3vw, 36px)' }">
          {{ t('knowledgeHub.guide.courseContent', 'Course Content') }}
        </h2>
        <p class="mt-2 text-[15px] text-[#070233]/50">
          {{ totalLessons }} {{ lessonWord(totalLessons) }} · {{ guide.totalDuration }} total
        </p>

        <div class="mt-8 flex flex-col gap-3">
          <div v-for="(section, si) in guide.sections" :key="si" class="overflow-hidden rounded-brand border border-[#E4E9F1]">
            <button
              class="flex w-full cursor-pointer items-center justify-between px-6 py-4 text-left transition-colors hover:bg-[#F8FAFD]"
              @click="toggleSection(si)"
            >
              <div class="flex items-center gap-3">
                <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#070233] text-[11px] font-bold text-white">
                  {{ si + 1 }}
                </span>
                <h3 class="text-[15px] font-semibold text-[#070233]">{{ section.title }}</h3>
              </div>
              <div class="flex items-center gap-3">
                <span class="text-[13px] text-[#070233]/40">{{ section.lessons.length }} {{ lessonWord(section.lessons.length) }}</span>
                <ChevronDown :class="`h-4 w-4 text-[#070233]/40 transition-transform duration-200 ${openSections[si] ? 'rotate-180' : ''}`" />
              </div>
            </button>

            <div v-if="openSections[si]" class="border-t border-[#E4E9F1]">
              <a
                v-for="lesson in section.lessons"
                :key="lesson.id"
                :href="withBase(`/guide/${guide.id}/${lesson.id}`)"
                class="group flex w-full cursor-pointer items-center gap-4 border-b border-[#E4E9F1] px-6 py-3.5 text-left transition-colors last:border-b-0 hover:bg-[#F8FAFD]"
              >
                <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F8FAFD] transition-colors group-hover:bg-[#ff1700]/10">
                  <Play class="h-3 w-3 fill-[#070233]/40 text-[#070233]/40 transition-colors group-hover:fill-[#ff1700] group-hover:text-[#ff1700]" />
                </div>
                <span class="flex-1 text-[14px] text-[#070233]/80 transition-colors group-hover:text-[#070233]">{{ lesson.title }}</span>
                <span class="shrink-0 text-[13px] text-[#070233]/35">{{ lesson.duration }}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gradient-to-b from-[#070233] to-[#040118] px-4 py-8 md:px-16">
      <div class="mx-auto flex max-w-[1400px] flex-col items-center gap-6 text-center">
        <MonetiseurWordmark fill="white" class="h-4 w-auto" />
        <p class="text-[12px] text-white/25">© {{ currentYear }} Monetiseur</p>
        <div class="flex items-center gap-6">
          <a href="/" target="_self" class="cursor-pointer text-[13px] text-white/40 transition-colors hover:text-white">{{ t('knowledgeHub.nav.home', 'Home') }}</a>
          <a :href="withBase('/')" class="cursor-pointer text-[13px] text-white/40 transition-colors hover:text-white">{{ t('knowledgeHub.nav.knowledgeHub', 'Knowledge Hub') }}</a>
          <a href="#" class="text-[13px] text-white/40 transition-colors hover:text-white">{{ t('landing.footer.privacy', 'Privacy Policy') }}</a>
        </div>
      </div>
    </footer>
  </div>
</template>
