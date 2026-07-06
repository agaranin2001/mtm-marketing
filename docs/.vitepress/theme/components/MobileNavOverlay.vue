<script setup lang="ts">
interface NavLink { label: string, onClick: () => void }

defineProps<{
  open: boolean
  links: NavLink[]
  country: { code: string, name: string }
  language: string
  loginLabel: string
  bookDemoLabel: string
  ariaLabel?: string
}>()

const emit = defineEmits<{
  languageClick: []
  login: []
  bookDemo: []
}>()
</script>

<template>
  <div
    :class="`fixed inset-0 z-[60] flex flex-col pt-[88px] transition-opacity duration-300 md:hidden ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`"
    :style="{ backgroundImage: 'radial-gradient(circle at 50% 0%, #ff170033 0%, transparent 60%), linear-gradient(135deg, #070233 0%, #0a0240 50%, #2a0a14 100%)' }"
    aria-modal="true"
    role="dialog"
    :aria-label="ariaLabel"
  >
    <nav class="flex flex-1 flex-col justify-center gap-2 px-4">
      <button
        v-for="link in links"
        :key="link.label"
        class="cursor-pointer py-4 text-left text-[20px] font-medium text-white/80 transition-colors duration-200 hover:text-white"
        @click="link.onClick"
      >
        {{ link.label }}
      </button>
      <button
        class="flex cursor-pointer items-center gap-2.5 py-4 text-left text-[20px] font-medium text-white/80 transition-colors duration-200 hover:text-white"
        @click="emit('languageClick')"
      >
        <span class="h-5 w-5 shrink-0 overflow-hidden rounded-full" :style="{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.6)' }">
          <img :src="`https://flagcdn.com/w40/${country.code}.png`" :alt="country.name" class="h-full w-full object-cover">
        </span>
        {{ country.name }}
        {{ ' · ' }}
        {{ language }}
      </button>
    </nav>

    <div class="shrink-0 space-y-3 px-4 pb-6">
      <button
        class="w-full cursor-pointer rounded-brand border border-white/30 py-4 text-[13px] font-bold uppercase tracking-[0.12em] text-white transition-colors duration-200 hover:bg-white/10"
        @click="emit('login')"
      >
        {{ loginLabel }}
      </button>
      <button
        class="w-full cursor-pointer rounded-brand bg-white py-4 text-[13px] font-bold uppercase tracking-[0.12em] text-[#070233] transition-colors duration-200 hover:bg-[#2F9BFF] hover:text-white"
        @click="emit('bookDemo')"
      >
        {{ bookDemoLabel }}
      </button>
    </div>
  </div>
</template>
