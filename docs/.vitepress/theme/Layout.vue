<script setup lang="ts">
import { onMounted } from 'vue'
import { useData } from 'vitepress'
import HomePage from './components/HomePage.vue'
import GuidePage from './components/GuidePage.vue'
import LessonPage from './components/LessonPage.vue'
import { initLangFromStorage } from './i18n'

const { frontmatter } = useData()

onMounted(() => {
  initLangFromStorage()
})
</script>

<template>
  <HomePage v-if="frontmatter.khLayout === 'home'" />
  <GuidePage v-else-if="frontmatter.khLayout === 'guide'" />
  <LessonPage v-else-if="frontmatter.khLayout === 'lesson'" />
  <div v-else class="flex min-h-screen items-center justify-center bg-white text-[#070233]">
    Page not found.
  </div>
</template>
