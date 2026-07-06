<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import { ChevronLeft } from 'lucide-vue-next'
import { flattenLessons, GUIDES, PLACEHOLDER_VIDEO_URL } from '../data/guides'
import { getYouTubeEmbedUrl } from '../utils/youtube'
import { useI18n } from '../i18n'

const { params } = useData()
const { t } = useI18n()

const guideId = computed(() => (params.value?.id as string) ?? '')
const lessonId = computed(() => (params.value?.lesson as string) ?? '')
const guide = computed(() => GUIDES[guideId.value])
const lessons = computed(() => (guide.value ? flattenLessons(guide.value) : []))
const lessonIndex = computed(() => lessons.value.findIndex(l => l.id === lessonId.value))
const lesson = computed(() => lessons.value[lessonIndex.value])
const nextLesson = computed(() => lessons.value[lessonIndex.value + 1])

const embedUrl = computed(() => getYouTubeEmbedUrl(lesson.value?.videoUrl ?? PLACEHOLDER_VIDEO_URL) ?? undefined)
const nextHref = computed(() =>
  withBase(nextLesson.value ? `/guide/${guideId.value}/${nextLesson.value.id}` : `/guide/${guideId.value}`),
)
</script>

<template>
  <div v-if="!guide || !lesson" class="flex min-h-screen flex-col items-center justify-center bg-white">
    <p class="text-[18px] text-[#070233]/50">{{ t('knowledgeHub.lesson.notFound', 'Lesson not found.') }}</p>
    <a :href="withBase('/')" class="mt-4 cursor-pointer text-[#ff1700] underline">{{ t('knowledgeHub.guide.backToHub', 'Back to Knowledge Hub') }}</a>
  </div>

  <div v-else class="flex w-full flex-col bg-white md:h-screen">
    <!-- Top bar -->
    <div class="relative flex h-14 shrink-0 items-center justify-between border-b border-[#E4E9F1] bg-white px-4 md:px-6">
      <a :href="withBase(`/guide/${guideId}`)" class="inline-flex cursor-pointer items-center gap-1.5 text-[13px] font-semibold text-[#070233]/70 transition-colors hover:text-[#070233]">
        <ChevronLeft class="h-4 w-4" />
        {{ t('knowledgeHub.lesson.course', 'Course') }}
      </a>
      <span class="absolute left-1/2 -translate-x-1/2 text-[14px] font-semibold text-[#070233]">{{ guide.title }}</span>
    </div>

    <div class="flex flex-1 flex-col md:flex-row md:overflow-hidden">
      <!-- Sidebar -->
      <aside class="order-2 flex w-full shrink-0 flex-col border-r border-[#E4E9F1] bg-white px-6 py-6 md:order-1 md:w-[360px] md:overflow-y-auto md:py-8">
        <h1 class="font-black uppercase leading-tight text-[#070233]" :style="{ fontFamily: '\'Integral CF\', sans-serif', fontSize: '24px' }">
          {{ lesson.title }}
        </h1>

        <a
          :href="nextHref"
          class="mt-5 inline-block w-full cursor-pointer rounded-brand bg-[#2F9BFF] px-5 py-3 text-center text-[13px] font-semibold text-white transition-colors hover:bg-[#1a8af0] md:w-auto md:self-start"
        >
          {{ nextLesson ? t('knowledgeHub.lesson.skipToNext', 'Skip to next lesson') : t('knowledgeHub.lesson.finishCourse', 'Finish course') }}
        </a>

        <nav class="mt-8 flex flex-col gap-6">
          <div v-for="section in guide.sections" :key="section.title">
            <h2 class="mb-2 text-[13px] font-bold uppercase tracking-wide text-[#070233]/40">{{ section.title }}</h2>
            <div class="flex flex-col">
              <a
                v-for="l in section.lessons"
                :key="l.id"
                :href="withBase(`/guide/${guideId}/${l.id}`)"
                :class="`flex cursor-pointer items-center justify-between gap-3 rounded-brand px-2 py-2.5 text-left transition-colors ${l.id === lesson.id ? 'bg-[#2F9BFF]/10' : 'hover:bg-[#F8FAFD]'}`"
              >
                <span class="flex items-center gap-3">
                  <span :class="`h-2.5 w-2.5 shrink-0 rounded-full ${l.id === lesson.id ? 'bg-[#2F9BFF]' : 'bg-[#070233]/15'}`" />
                  <span :class="`text-[14px] ${l.id === lesson.id ? 'font-semibold text-[#2F9BFF]' : 'text-[#070233]/70'}`">{{ l.title }}</span>
                </span>
                <span class="shrink-0 rounded-full bg-[#F8FAFD] px-2 py-0.5 text-[11px] text-[#070233]/40">{{ l.duration }}</span>
              </a>
            </div>
          </div>
        </nav>
      </aside>

      <!-- Video panel -->
      <main class="relative order-1 aspect-video shrink-0 bg-black md:order-2 md:aspect-auto md:flex-1">
        <iframe
          :key="lesson.id"
          class="absolute inset-0 h-full w-full"
          :src="embedUrl"
          :title="lesson.title"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        />
      </main>
    </div>
  </div>
</template>
