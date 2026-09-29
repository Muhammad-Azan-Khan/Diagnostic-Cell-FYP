<script setup lang="ts">
import {
  Activity,
  ChevronRight,
  Cpu,
  FileText,
  History,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Tractor,
  X,
  Zap,
} from 'lucide-vue-next'

defineProps<{ mobile?: boolean }>()
const emit = defineEmits<{ close: [] }>()
const route = useRoute()
const { activeTractor, sessions } = useDiagnostic()

const navigation = computed(() => [
  {
    label: 'Operations',
    items: [
      {
        to: '/dashboard',
        label: 'Dashboard',
        description: 'System overview',
        icon: LayoutDashboard,
      },
      {
        to: '/diagnostic-scan',
        label: 'Diagnostic Scan',
        description: 'Test a circuit',
        icon: Activity,
      },
      {
        to: '/tractor',
        label: 'Registered Tractors',
        description: 'Manage vehicles',
        icon: Tractor,
      },
    ],
  },
  {
    label: 'Records',
    items: [
      {
        to: '/history',
        label: 'Diagnostic History',
        description: 'Inspection archive',
        icon: History,
        badge: sessions.value.length || undefined,
      },
      { to: '/reports', label: 'Reports', description: 'Technical records', icon: FileText },
    ],
  },
  {
    label: 'System',
    items: [
      { to: '/settings', label: 'Settings', description: 'Workspace preferences', icon: Settings },
    ],
  },
])
</script>

<template>
  <aside
    class="relative flex h-full w-64 flex-col overflow-hidden border-r border-gray-200 bg-white text-gray-700 select-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
  >
    <div
      class="pointer-events-none absolute -top-24 -left-24 size-56 rounded-full bg-blue-100/80 blur-3xl dark:bg-blue-600/15"
    />
    <div
      class="pointer-events-none absolute right-0 bottom-10 size-40 rounded-full bg-cyan-100/50 blur-3xl dark:bg-cyan-500/5"
    />

    <header class="relative border-b border-gray-200 px-4 py-4 dark:border-white/8">
      <div class="flex items-center justify-between">
        <div class="flex min-w-0 items-center gap-3">
          <span
            class="relative grid size-10 shrink-0 place-items-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20 dark:shadow-blue-950"
          >
            <Zap class="size-5" />
            <span
              class="absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-950 dark:bg-emerald-400"
            />
          </span>
          <div class="min-w-0">
            <div class="truncate text-sm font-black tracking-tight text-gray-950 dark:text-white">
              Diagnostic Cell
            </div>
            <p
              class="mt-0.5 truncate text-[9px] font-semibold tracking-wide text-gray-400 uppercase dark:text-slate-500"
            >
              Electrical workspace
            </p>
          </div>
        </div>
        <button
          v-if="mobile"
          class="grid size-8 place-items-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 lg:hidden dark:border-white/10 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
          aria-label="Close navigation"
          @click="emit('close')"
        >
          <X class="size-4" />
        </button>
      </div>
    </header>

    <div class="relative px-3 pt-3">
      <NuxtLink
        to="/tractor"
        class="group block overflow-hidden rounded-xl border border-gray-200 bg-gray-50/80 p-3 transition hover:border-blue-300 hover:bg-blue-50/60 dark:border-white/10 dark:bg-white/5 dark:hover:border-blue-400/30 dark:hover:bg-white/8"
        @click="emit('close')"
      >
        <div class="mb-2 flex items-center justify-between">
          <span
            class="flex items-center gap-1.5 text-[8px] font-black tracking-[0.16em] text-blue-600 uppercase dark:text-blue-400"
          >
            <span class="size-1.5 animate-pulse rounded-full bg-emerald-400" />Selected tractor
          </span>
          <ChevronRight
            class="size-3.5 text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-blue-600 dark:text-slate-600 dark:group-hover:text-blue-400"
          />
        </div>
        <div class="flex items-center gap-2.5">
          <span
            class="grid size-9 shrink-0 place-items-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
          >
            <Tractor class="size-4" />
          </span>
          <div class="min-w-0">
            <div class="truncate text-[11px] font-bold text-gray-900 dark:text-slate-100">
              {{ activeTractor.model }}
            </div>
            <div class="mt-0.5 truncate font-mono text-[9px] text-gray-400 dark:text-slate-500">
              {{ activeTractor.chassisNumber }}
            </div>
          </div>
        </div>
      </NuxtLink>
    </div>

    <nav class="relative flex-1 space-y-5 overflow-y-auto px-3 py-4">
      <section v-for="section in navigation" :key="section.label">
        <h2
          class="mb-1.5 px-2 text-[8px] font-black tracking-[0.18em] text-gray-400 uppercase dark:text-slate-600"
        >
          {{ section.label }}
        </h2>
        <div class="space-y-1">
          <NuxtLink
            v-for="item in section.items"
            :key="item.to"
            :to="item.to"
            :class="[
              'group relative flex items-center gap-3 overflow-hidden rounded-xl px-3 py-2.5 transition duration-200',
              route.path === item.to
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 dark:shadow-blue-950/40'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-950 dark:text-slate-400 dark:hover:bg-white/6 dark:hover:text-slate-100',
            ]"
            @click="emit('close')"
          >
            <span
              v-if="route.path === item.to"
              class="absolute inset-y-2 left-0 w-0.5 rounded-full bg-white"
            />
            <span
              :class="[
                'grid size-8 shrink-0 place-items-center rounded-lg transition',
                route.path === item.to
                  ? 'bg-white/15 text-white'
                  : 'bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600 dark:bg-white/5 dark:text-slate-500 dark:group-hover:bg-white/10 dark:group-hover:text-blue-400',
              ]"
            >
              <component :is="item.icon" class="size-4" />
            </span>
            <span class="min-w-0 flex-1">
              <span class="block truncate text-[11px] font-bold">{{ item.label }}</span>
              <span
                :class="[
                  'mt-0.5 block truncate text-[8px]',
                  route.path === item.to ? 'text-blue-100' : 'text-gray-400 dark:text-slate-600',
                ]"
              >
                {{ item.description }}
              </span>
            </span>
            <span
              v-if="item.badge"
              :class="[
                'min-w-5 rounded-md px-1.5 py-1 text-center font-mono text-[8px] font-black',
                route.path === item.to ? 'bg-white/15 text-white' : 'bg-blue-500/10 text-blue-400',
              ]"
            >
              {{ item.badge }}
            </span>
            <ChevronRight
              v-else
              :class="[
                'size-3.5 transition group-hover:translate-x-0.5',
                route.path === item.to ? 'text-blue-200' : 'text-gray-300 dark:text-slate-700',
              ]"
            />
          </NuxtLink>
        </div>
      </section>
    </nav>

    <footer class="relative border-t border-gray-200 p-3 dark:border-white/8">
      <div
        class="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50/80 p-3 dark:border-white/8 dark:bg-white/4"
      >
        <span
          class="grid size-8 shrink-0 place-items-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
        >
          <ShieldCheck class="size-4" />
        </span>
        <div class="min-w-0 flex-1">
          <div class="text-[10px] font-bold text-gray-700 dark:text-slate-200">Workspace ready</div>
          <div class="mt-0.5 text-[8px] text-gray-400 dark:text-slate-600">
            Diagnostic records synchronized locally
          </div>
        </div>
        <Cpu class="size-3.5 text-gray-300 dark:text-slate-600" />
      </div>
    </footer>
  </aside>
</template>
