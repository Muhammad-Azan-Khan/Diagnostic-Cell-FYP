<script setup lang="ts">
import { Menu, Activity, Sun, Moon, UserCheck, Tractor } from 'lucide-vue-next'
const emit = defineEmits<{ menu: [] }>()
const route = useRoute()
const { activeTractor, tractors, settings, setActiveTractor, updateSettings } = useDiagnostic()
const titles: Record<string, string> = {
  '/dashboard': 'Dashboard & Diagnostics Overview',
  '/diagnostic-scan': 'Active Circuit Diagnostic Scan',
  '/tractor': 'Tractor Information & Registry',
  '/history': 'Diagnostic Session History',
  '/reports': 'Diagnostic Reports & Export',
  '/settings': 'Application Settings & Configurations',
}
const title = computed(() => titles[route.path] || 'Diagnostic Cell')
function selectTractor(event: Event) {
  const found = tractors.value.find((t) => t.id === (event.target as HTMLSelectElement).value)
  if (found) setActiveTractor(found)
}
</script>

<template>
  <header
    class="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-xs sm:px-6 dark:border-[#2a2d32] dark:bg-[#1a1c1e]"
  >
    <div class="flex items-center gap-3">
      <button class="rounded-lg p-2 lg:hidden" aria-label="Open menu" @click="emit('menu')">
        <Menu class="size-5" />
      </button>
      <div>
        <div class="hidden text-[10px] font-bold tracking-widest text-gray-400 uppercase sm:block">
          Tractor Electrical Diagnostics
        </div>
        <h1 class="text-sm font-bold sm:text-base dark:text-white">{{ title }}</h1>
      </div>
    </div>
    <div class="flex items-center gap-2 sm:gap-3">
      <div
        class="hidden items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-[11px] sm:flex dark:border-[#2f3238] dark:bg-[#22252a]"
      >
        <span class="size-2 animate-pulse rounded-full bg-emerald-500" />ESP32 Online
      </div>
      <div
        class="hidden items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 md:flex dark:border-[#2f3238] dark:bg-[#22252a]"
      >
        <Tractor class="size-4 text-blue-600" /><select
          class="bg-transparent text-xs font-medium outline-none"
          :value="activeTractor.id"
          @change="selectTractor"
        >
          <option v-for="tractor in tractors" :key="tractor.id" :value="tractor.id">
            {{ tractor.model.split(' ')[0] }} - {{ tractor.chassisNumber }}
          </option>
        </select>
      </div>
      <NuxtLink
        v-if="route.path !== '/diagnostic-scan'"
        to="/diagnostic-scan"
        class="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
        ><Activity class="size-3.5" /><span class="hidden sm:inline">Start Scan</span></NuxtLink
      >
      <button
        class="rounded-lg border border-gray-200 p-2 dark:border-[#2f3238]"
        @click="updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })"
      >
        <Sun v-if="settings.theme === 'dark'" class="size-4 text-amber-400" /><Moon
          v-else
          class="size-4"
        />
      </button>
      <div class="hidden items-center gap-2 border-l border-gray-200 pl-2 lg:flex">
        <span class="grid size-7 place-items-center rounded-full bg-gray-100 dark:bg-[#2a2d32]"
          ><UserCheck class="size-3.5"
        /></span>
        <div>
          <div class="text-xs leading-none font-semibold">{{ settings.technicianName }}</div>
          <div class="text-[10px] text-gray-400">Diagnostic Tech</div>
        </div>
      </div>
    </div>
  </header>
</template>
