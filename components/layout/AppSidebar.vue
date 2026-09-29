<script setup lang="ts">
import {
  LayoutDashboard,
  Activity,
  Tractor,
  History,
  FileText,
  Settings,
  Cpu,
  X,
} from 'lucide-vue-next'
defineProps<{ mobile?: boolean }>()
const emit = defineEmits<{ close: [] }>()
const route = useRoute()
const { activeTractor, sessions } = useDiagnostic()
const items = computed(() => [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/diagnostic-scan', label: 'Diagnostic Scan', icon: Activity, badge: 'Test' },
  { to: '/tractor', label: 'Tractor Information', icon: Tractor },
  {
    to: '/history',
    label: 'Diagnostic History',
    icon: History,
    badge: sessions.value.length || undefined,
  },
  { to: '/reports', label: 'Reports', icon: FileText },
  { to: '/settings', label: 'Settings', icon: Settings },
])
</script>

<template>
  <aside
    class="flex h-full w-64 flex-col border-r border-gray-200 bg-white text-gray-800 select-none dark:border-[#2a2d32] dark:bg-[#1a1c1e] dark:text-gray-200"
  >
    <div
      class="flex items-center justify-between border-b border-gray-200 p-5 dark:border-[#2a2d32]"
    >
      <div class="flex items-center gap-3">
        <span class="grid size-9 place-items-center rounded-lg bg-blue-600 text-white"
          ><Cpu class="size-5"
        /></span>
        <div>
          <div class="text-sm font-bold dark:text-white">Diagnostic Cell</div>
          <p class="text-[11px] text-gray-500">Tractor Electrical System</p>
        </div>
      </div>
      <button v-if="mobile" class="rounded p-1 lg:hidden" @click="emit('close')">
        <X class="size-4" />
      </button>
    </div>
    <div
      class="m-3.5 rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs dark:border-[#2f3238] dark:bg-[#22252a]"
    >
      <div
        class="mb-1 flex justify-between text-[10px] font-semibold tracking-wider text-gray-500 uppercase"
      >
        <span>Active Tractor</span
        ><span class="size-1.5 animate-pulse rounded-full bg-emerald-500" />
      </div>
      <div class="truncate font-medium dark:text-gray-100">{{ activeTractor.model }}</div>
      <div class="mt-0.5 truncate font-mono text-[11px] text-gray-500">
        {{ activeTractor.chassisNumber }}
      </div>
    </div>
    <nav class="flex-1 space-y-1 overflow-y-auto px-3 py-2">
      <NuxtLink
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        :class="[
          'flex items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium transition',
          route.path === item.to
            ? 'bg-blue-600 text-white shadow-sm'
            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-[#26292e]',
        ]"
        @click="emit('close')"
      >
        <span class="flex items-center gap-2.5"
          ><component :is="item.icon" class="size-4" />{{ item.label }}</span
        ><span
          v-if="item.badge"
          class="rounded border border-white/20 bg-black/10 px-1.5 py-0.5 font-mono text-[10px]"
          >{{ item.badge }}</span
        >
      </NuxtLink>
    </nav>
    <div class="border-t border-gray-200 bg-gray-50 p-4 dark:border-[#2a2d32] dark:bg-[#16181b]">
      <div class="text-xs font-semibold">Diagnostic Cell</div>
      <div class="text-[10px] font-medium text-blue-600">Nuxt v1.0</div>
    </div>
  </aside>
</template>
