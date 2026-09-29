<script setup lang="ts">
import { Activity, Menu, Moon, Sun, UserCheck } from 'lucide-vue-next'

const emit = defineEmits<{ menu: [] }>()
const route = useRoute()
const { settings, updateSettings } = useDiagnostic()

const pages: Record<string, { title: string; eyebrow: string }> = {
  '/dashboard': { title: 'Dashboard', eyebrow: 'Operations overview' },
  '/diagnostic-scan': { title: 'Diagnostic Scan', eyebrow: 'Circuit inspection' },
  '/tractor': { title: 'Tractor Information', eyebrow: 'Vehicle registry' },
  '/history': { title: 'Diagnostic History', eyebrow: 'Inspection archive' },
  '/reports': { title: 'Reports', eyebrow: 'Technical documentation' },
  '/settings': { title: 'Settings', eyebrow: 'Workspace preferences' },
}

const page = computed(() => pages[route.path] || { title: 'Diagnostic Cell', eyebrow: 'Workspace' })
</script>

<template>
  <header
    class="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between overflow-hidden border-b border-gray-200/80 bg-white/95 px-4 shadow-xs backdrop-blur-xl sm:px-6 dark:border-slate-800 dark:bg-slate-950/95"
  >
    <div
      class="pointer-events-none absolute -top-24 left-10 size-56 rounded-full bg-blue-100/60 blur-3xl dark:bg-blue-600/15"
    />

    <div
      class="pointer-events-none absolute -top-20 right-32 size-48 rounded-full bg-cyan-100/40 blur-3xl dark:bg-cyan-500/5"
    />

    <div
      class="pointer-events-none absolute top-0 left-1/3 h-px w-1/3 bg-gradient-to-r from-transparent via-blue-500/0 to-transparent dark:via-blue-500/20"
    />

    <div class="relative flex min-w-0 items-center gap-3">
      <button
        class="grid size-9 shrink-0 place-items-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:border-blue-300 hover:text-blue-600 lg:hidden dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-blue-400/30 dark:hover:bg-white/10 dark:hover:text-blue-400"
        aria-label="Open navigation"
        @click="emit('menu')"
      >
        <Menu class="size-4.5" />
      </button>

      <div
        class="hidden size-8 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600 shadow-sm sm:grid dark:border dark:border-blue-500/10 dark:bg-blue-500/10 dark:text-blue-400 dark:shadow-blue-950/30"
      >
        <Activity class="size-4" />
      </div>

      <div class="min-w-0">
        <div
          class="truncate text-[9px] font-black tracking-[0.14em] text-gray-400 uppercase dark:text-slate-500"
        >
          {{ page.eyebrow }}
        </div>

        <h1
          class="truncate text-sm leading-tight font-black text-gray-950 sm:text-base dark:text-white"
        >
          {{ page.title }}
        </h1>
      </div>
    </div>

    <div class="relative ml-3 flex shrink-0 items-center gap-2">
      <NuxtLink
        v-if="route.path !== '/diagnostic-scan'"
        to="/diagnostic-scan"
        class="group flex h-9 items-center gap-1.5 rounded-lg bg-blue-600 px-3 text-[10px] font-black text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700 sm:px-3.5 sm:text-xs dark:shadow-blue-950/50 dark:hover:bg-blue-500"
      >
        <Activity class="size-3.5" />

        <span class="hidden sm:inline"> Start scan </span>
      </NuxtLink>

      <button
        class="grid size-9 place-items-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:border-blue-300 hover:text-blue-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-blue-400/30 dark:hover:bg-white/10 dark:hover:text-blue-400"
        :aria-label="settings.theme === 'dark' ? 'Use light mode' : 'Use dark mode'"
        :title="settings.theme === 'dark' ? 'Use light mode' : 'Use dark mode'"
        @click="updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })"
      >
        <Sun v-if="settings.theme === 'dark'" class="size-4 text-amber-400" />

        <Moon v-else class="size-4" />
      </button>

      <div
        class="hidden items-center gap-2.5 border-l border-gray-200 pl-3 xl:flex dark:border-white/10"
      >
        <span
          class="grid size-8 place-items-center rounded-lg bg-slate-950 text-blue-400 shadow-sm dark:border dark:border-blue-500/20 dark:bg-blue-600 dark:text-white dark:shadow-md dark:shadow-blue-950/50"
        >
          <UserCheck class="size-4" />
        </span>

        <div class="max-w-36 min-w-0">
          <div class="truncate text-xs leading-none font-bold text-gray-900 dark:text-slate-100">
            {{ settings.technicianName }}
          </div>

          <div class="mt-1 text-[9px] text-gray-400 dark:text-slate-500">Diagnostic technician</div>
        </div>
      </div>
    </div>
  </header>
</template>
