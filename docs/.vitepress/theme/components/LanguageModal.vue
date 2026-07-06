<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { ChevronDown, X } from 'lucide-vue-next'
import { COUNTRIES } from '../data/countries'
import { useI18n } from '../i18n'

interface Country { code: string, name: string }
interface Language { code: string, name: string, nameKey: string, main: boolean }

const props = defineProps<{
  open: boolean
  languages: readonly Language[]
  language: string
  country: Country
}>()

const emit = defineEmits<{
  close: []
  selectLanguage: [code: string]
  selectCountry: [country: Country]
}>()

const { t } = useI18n()

const countryDropdownOpen = ref(false)
const languageDropdownOpen = ref(false)
const countrySearch = ref('')
const countryDropdownRef = ref<HTMLElement | null>(null)
const languageDropdownRef = ref<HTMLElement | null>(null)

function filteredCountries() {
  const q = countrySearch.value.toLowerCase()
  return COUNTRIES.filter(c => c.name.toLowerCase().includes(q))
}

function chooseCountry(c: Country) {
  emit('selectCountry', c)
  countryDropdownOpen.value = false
  countrySearch.value = ''
}

function chooseLanguage(code: string) {
  emit('selectLanguage', code)
  languageDropdownOpen.value = false
}

function onDocMouseDown(e: MouseEvent) {
  if (!countryDropdownRef.value?.contains(e.target as Node))
    countryDropdownOpen.value = false
  if (!languageDropdownRef.value?.contains(e.target as Node))
    languageDropdownOpen.value = false
}

watch(() => props.open, (open) => {
  if (typeof document === 'undefined')
    return
  if (open)
    document.addEventListener('mousedown', onDocMouseDown)
  else
    document.removeEventListener('mousedown', onDocMouseDown)
})

onBeforeUnmount(() => {
  if (typeof document !== 'undefined')
    document.removeEventListener('mousedown', onDocMouseDown)
})

function currentLanguageLabel() {
  const lang = props.languages.find(l => l.code === props.language)
  return lang ? t(lang.nameKey, lang.name) : ''
}
</script>

<template>
  <div v-if="open" class="fixed inset-0 z-[300]">
    <!-- Mobile: bottom sheet -->
    <div class="fixed inset-0 flex flex-col bg-[rgba(3,1,14,0.85)] backdrop-blur-[10px] md:hidden">
      <div class="flex flex-1 items-start justify-end p-5" @click="emit('close')">
        <button
          type="button"
          class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/15 text-white"
          :aria-label="t('landing.modal.close', 'Close')"
          @click="emit('close')"
        >
          <X class="h-5 w-5" />
        </button>
      </div>
      <div class="flex h-[70vh] flex-col rounded-t-[28px] bg-white" @click.stop>
        <div class="shrink-0 px-6 pb-2 pt-6">
          <h2 class="text-[#070233]">{{ t('landing.modal.regionLanguage', 'Region & language') }}</h2>
        </div>
        <div class="flex-1 space-y-5 overflow-y-auto px-6 py-4">
          <!-- body -->
          <div>
            <label class="mb-2 block text-[12px] font-semibold uppercase tracking-wide text-[#070233]/50">{{ t('landing.modal.country', 'Country') }}</label>
            <div class="relative" ref="countryDropdownRef">
              <button
                type="button"
                class="flex w-full cursor-pointer items-center justify-between rounded-brand px-4 py-3 text-[14px] text-[#070233]"
                :style="{ boxShadow: 'inset 0 0 0 1px rgba(7,2,51,0.15)' }"
                @click="countryDropdownOpen = !countryDropdownOpen"
              >
                <span class="flex items-center gap-3">
                  <span class="h-5 w-5 shrink-0 overflow-hidden rounded-full" :style="{ boxShadow: 'inset 0 0 0 1px rgba(7,2,51,0.15)' }">
                    <img :src="`https://flagcdn.com/w40/${country.code}.png`" :alt="country.name" class="h-full w-full object-cover">
                  </span>
                  {{ country.name }}
                </span>
                <ChevronDown :class="`h-4 w-4 shrink-0 transition-transform duration-200 ${countryDropdownOpen ? 'rotate-180' : ''}`" />
              </button>
              <div v-if="countryDropdownOpen" class="absolute left-0 right-0 top-full z-10 mt-2 overflow-hidden rounded-brand bg-white" :style="{ boxShadow: '0 4px 24px rgba(7,2,51,0.12), inset 0 0 0 1px #E4E9F1' }">
                <div class="p-2">
                  <input
                    v-model="countrySearch"
                    :placeholder="t('landing.modal.searchCountry', 'Search country')"
                    class="w-full rounded-brand px-3 py-2 text-[16px] text-[#070233] outline-none md:text-[13px]"
                    :style="{ backgroundColor: '#F8FAFD' }"
                  >
                </div>
                <div class="max-h-60 overflow-y-auto">
                  <button
                    v-for="c in filteredCountries()"
                    :key="c.code"
                    type="button"
                    class="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left text-[14px] text-[#070233] transition-colors hover:bg-[#F8FAFD]"
                    @click="chooseCountry(c)"
                  >
                    <span class="h-5 w-5 shrink-0 overflow-hidden rounded-full" :style="{ boxShadow: 'inset 0 0 0 1px rgba(7,2,51,0.15)' }">
                      <img :src="`https://flagcdn.com/w40/${c.code}.png`" :alt="c.name" class="h-full w-full object-cover">
                    </span>
                    {{ c.name }}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div>
            <label class="mb-2 block text-[12px] font-semibold uppercase tracking-wide text-[#070233]/50">{{ t('landing.modal.language', 'Language') }}</label>
            <div class="relative" ref="languageDropdownRef">
              <button
                type="button"
                class="flex w-full cursor-pointer items-center justify-between rounded-brand px-4 py-3 text-[14px] text-[#070233]"
                :style="{ boxShadow: 'inset 0 0 0 1px rgba(7,2,51,0.15)' }"
                @click="languageDropdownOpen = !languageDropdownOpen"
              >
                {{ currentLanguageLabel() }}
                <ChevronDown :class="`h-4 w-4 shrink-0 transition-transform duration-200 ${languageDropdownOpen ? 'rotate-180' : ''}`" />
              </button>
              <div v-if="languageDropdownOpen" class="absolute left-0 right-0 top-full z-10 mt-2 overflow-hidden rounded-brand bg-white" :style="{ boxShadow: '0 4px 24px rgba(7,2,51,0.12), inset 0 0 0 1px #E4E9F1' }">
                <button
                  v-for="lang in languages"
                  :key="lang.code"
                  type="button"
                  :class="`flex w-full cursor-pointer items-center justify-between px-4 py-2.5 text-left text-[14px] transition-colors ${language === lang.code ? 'bg-[#FFF1EC] text-[#FF5A36]' : 'text-[#070233] hover:bg-[#F8FAFD]'}`"
                  @click="chooseLanguage(lang.code)"
                >
                  {{ t(lang.nameKey, lang.name) }}
                  <span v-if="lang.main" class="rounded-full bg-[#070233]/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#070233]/60">{{ t('landing.modal.main', 'Main') }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="shrink-0 border-t border-[rgba(7,2,51,0.1)] px-6 py-4">
          <button
            type="button"
            class="w-full cursor-pointer rounded-brand bg-[#2196F3] px-5 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#1976D2]"
            @click="emit('close')"
          >
            {{ t('landing.modal.confirmChanges', 'Confirm Changes') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Desktop: centered dialog -->
    <div class="hidden h-full items-center justify-center md:flex">
      <div class="absolute inset-0 bg-[rgba(3,1,14,0.9)] backdrop-blur-[10px]" @click="emit('close')" />
      <div class="relative mx-4 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-brand bg-white shadow-xl" @click.stop>
        <div class="flex items-center justify-between border-b border-[rgba(7,2,51,0.1)] p-6">
          <h2 class="text-[#070233]">{{ t('landing.modal.regionLanguage', 'Region & language') }}</h2>
          <button
            type="button"
            class="cursor-pointer rounded-brand p-2 text-[#070233] hover:bg-[rgba(7,2,51,0.05)]"
            @click="emit('close')"
          >
            <X class="h-6 w-6" />
          </button>
        </div>
        <div class="space-y-5 p-6">
          <!-- body (desktop) -->
          <div>
            <label class="mb-2 block text-[12px] font-semibold uppercase tracking-wide text-[#070233]/50">{{ t('landing.modal.country', 'Country') }}</label>
            <div class="relative" ref="countryDropdownRef">
              <button
                type="button"
                class="flex w-full cursor-pointer items-center justify-between rounded-brand px-4 py-3 text-[14px] text-[#070233]"
                :style="{ boxShadow: 'inset 0 0 0 1px rgba(7,2,51,0.15)' }"
                @click="countryDropdownOpen = !countryDropdownOpen"
              >
                <span class="flex items-center gap-3">
                  <span class="h-5 w-5 shrink-0 overflow-hidden rounded-full" :style="{ boxShadow: 'inset 0 0 0 1px rgba(7,2,51,0.15)' }">
                    <img :src="`https://flagcdn.com/w40/${country.code}.png`" :alt="country.name" class="h-full w-full object-cover">
                  </span>
                  {{ country.name }}
                </span>
                <ChevronDown :class="`h-4 w-4 shrink-0 transition-transform duration-200 ${countryDropdownOpen ? 'rotate-180' : ''}`" />
              </button>
              <div v-if="countryDropdownOpen" class="absolute left-0 right-0 top-full z-10 mt-2 overflow-hidden rounded-brand bg-white" :style="{ boxShadow: '0 4px 24px rgba(7,2,51,0.12), inset 0 0 0 1px #E4E9F1' }">
                <div class="p-2">
                  <input
                    v-model="countrySearch"
                    :placeholder="t('landing.modal.searchCountry', 'Search country')"
                    class="w-full rounded-brand px-3 py-2 text-[16px] text-[#070233] outline-none md:text-[13px]"
                    :style="{ backgroundColor: '#F8FAFD' }"
                  >
                </div>
                <div class="max-h-60 overflow-y-auto">
                  <button
                    v-for="c in filteredCountries()"
                    :key="c.code"
                    type="button"
                    class="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left text-[14px] text-[#070233] transition-colors hover:bg-[#F8FAFD]"
                    @click="chooseCountry(c)"
                  >
                    <span class="h-5 w-5 shrink-0 overflow-hidden rounded-full" :style="{ boxShadow: 'inset 0 0 0 1px rgba(7,2,51,0.15)' }">
                      <img :src="`https://flagcdn.com/w40/${c.code}.png`" :alt="c.name" class="h-full w-full object-cover">
                    </span>
                    {{ c.name }}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div>
            <label class="mb-2 block text-[12px] font-semibold uppercase tracking-wide text-[#070233]/50">{{ t('landing.modal.language', 'Language') }}</label>
            <div class="relative" ref="languageDropdownRef">
              <button
                type="button"
                class="flex w-full cursor-pointer items-center justify-between rounded-brand px-4 py-3 text-[14px] text-[#070233]"
                :style="{ boxShadow: 'inset 0 0 0 1px rgba(7,2,51,0.15)' }"
                @click="languageDropdownOpen = !languageDropdownOpen"
              >
                {{ currentLanguageLabel() }}
                <ChevronDown :class="`h-4 w-4 shrink-0 transition-transform duration-200 ${languageDropdownOpen ? 'rotate-180' : ''}`" />
              </button>
              <div v-if="languageDropdownOpen" class="absolute left-0 right-0 top-full z-10 mt-2 overflow-hidden rounded-brand bg-white" :style="{ boxShadow: '0 4px 24px rgba(7,2,51,0.12), inset 0 0 0 1px #E4E9F1' }">
                <button
                  v-for="lang in languages"
                  :key="lang.code"
                  type="button"
                  :class="`flex w-full cursor-pointer items-center justify-between px-4 py-2.5 text-left text-[14px] transition-colors ${language === lang.code ? 'bg-[#FFF1EC] text-[#FF5A36]' : 'text-[#070233] hover:bg-[#F8FAFD]'}`"
                  @click="chooseLanguage(lang.code)"
                >
                  {{ t(lang.nameKey, lang.name) }}
                  <span v-if="lang.main" class="rounded-full bg-[#070233]/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#070233]/60">{{ t('landing.modal.main', 'Main') }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="border-t border-[rgba(7,2,51,0.1)] p-6">
          <button
            type="button"
            class="w-full cursor-pointer rounded-brand bg-[#2196F3] px-5 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#1976D2]"
            @click="emit('close')"
          >
            {{ t('landing.modal.confirmChanges', 'Confirm Changes') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
