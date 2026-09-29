<script setup lang="ts">
import {
  Activity,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  CircleGauge,
  ClipboardCheck,
  Hash,
  IdCard,
  Search,
  ShieldCheck,
  Trash2,
  Tractor,
  UserRound,
  UsersRound,
  X,
} from 'lucide-vue-next'
import type { TractorProfile } from '~/app/types/diagnostic'

const { tractors, activeTractor, deleteTractor, setActiveTractor } = useDiagnostic()

const message = ref('')
const search = ref('')
const deleteConfirmId = ref<string | null>(null)

const totalScans = computed(() => tractors.value.reduce((sum, item) => sum + item.totalScans, 0))

const technicians = computed(() => new Set(tractors.value.map((item) => item.technicianName)).size)

const filteredTractors = computed(() => {
  const query = search.value.trim().toLowerCase()

  if (!query) return tractors.value

  return tractors.value.filter((item) =>
    [item.model, item.chassisNumber, item.tractorId, item.technicianName].some((value) =>
      value.toLowerCase().includes(query),
    ),
  )
})

function selectTractor(item: TractorProfile) {
  if (item.id === activeTractor.value.id) return

  setActiveTractor(item)

  message.value = `${item.model} (${item.chassisNumber}) is now the active tractor.`

  window.setTimeout(() => {
    message.value = ''
  }, 3500)
}

function confirmDelete(item: TractorProfile) {
  deleteTractor(item.id)
  deleteConfirmId.value = null
  message.value = `${item.model} was removed from the registry.`
}
</script>

<template>
  <div class="space-y-6 pb-14">
    <section
      class="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 px-5 py-6 text-white shadow-xl shadow-slate-950/10 sm:px-7 sm:py-7"
    >
      <div
        class="pointer-events-none absolute -top-32 right-0 size-80 rounded-full bg-blue-600/20 blur-3xl"
      />

      <div
        class="pointer-events-none absolute -bottom-28 left-1/3 size-64 rounded-full bg-cyan-500/10 blur-3xl"
      />

      <div class="relative flex flex-col justify-between gap-6 xl:flex-row xl:items-center">
        <div class="max-w-2xl">
          <div
            class="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-[10px] font-bold tracking-[0.18em] text-blue-300 uppercase"
          >
            <Tractor class="size-3.5" />
            Vehicle registry
          </div>

          <h1 class="text-2xl font-black tracking-tight sm:text-3xl">Tractor Fleet Selection</h1>

          <p class="mt-2 max-w-xl text-sm leading-6 text-slate-400">
            Review registered vehicles and select the tractor used by the diagnostic workstation.
            Click any tractor below to make it active.
          </p>
        </div>

        <div class="grid grid-cols-3 gap-2 sm:min-w-md">
          <div class="rounded-xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur-sm">
            <div
              class="mb-1 flex items-center gap-1.5 text-[9px] font-bold text-slate-500 uppercase"
            >
              <Tractor class="size-3" />
              Registered
            </div>

            <div class="font-mono text-lg font-black text-slate-100">
              {{ tractors.length }}
            </div>
          </div>

          <div class="rounded-xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur-sm">
            <div
              class="mb-1 flex items-center gap-1.5 text-[9px] font-bold text-slate-500 uppercase"
            >
              <ClipboardCheck class="size-3" />
              Total scans
            </div>

            <div class="font-mono text-lg font-black text-slate-100">
              {{ totalScans }}
            </div>
          </div>

          <div class="rounded-xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur-sm">
            <div
              class="mb-1 flex items-center gap-1.5 text-[9px] font-bold text-slate-500 uppercase"
            >
              <UsersRound class="size-3" />
              Technicians
            </div>

            <div class="font-mono text-lg font-black text-slate-100">
              {{ technicians }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <section
      class="overflow-hidden rounded-xl border border-blue-200 bg-white shadow-sm transition-colors dark:border-blue-600/40 dark:bg-[#17191c]"
    >
      <div
        class="flex flex-col justify-between gap-4 px-4 py-4 sm:flex-row sm:items-center sm:px-5"
      >
        <div class="flex min-w-0 items-center gap-3">
          <span
            class="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/20"
          >
            <ShieldCheck class="size-5" />
          </span>

          <div class="min-w-0">
            <div class="flex items-center gap-2">
              <span
                class="text-[9px] font-black tracking-widest text-blue-600 uppercase dark:text-blue-400"
              >
                Active diagnostic vehicle
              </span>

              <span class="size-1.5 animate-pulse rounded-full bg-emerald-500" />
            </div>

            <div class="mt-0.5 truncate text-sm font-black text-gray-900 dark:text-gray-100">
              {{ activeTractor.model }}
            </div>

            <div class="mt-0.5 truncate font-mono text-[10px] text-gray-500 dark:text-gray-400">
              {{ activeTractor.chassisNumber }} · {{ activeTractor.tractorId }} ·
              {{ activeTractor.technicianName }}
            </div>
          </div>
        </div>

        <NuxtLink
          to="/diagnostic-scan"
          class="group flex items-center gap-1.5 self-end rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700 sm:self-auto dark:hover:bg-blue-500"
        >
          <Activity class="size-3.5" />
          Start scan

          <ChevronRight class="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </NuxtLink>
      </div>
    </section>

    <div
      v-if="message"
      class="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/30 dark:text-emerald-400"
    >
      <span class="flex items-center gap-2">
        <CheckCircle2 class="size-4" />
        {{ message }}
      </span>

      <button
        aria-label="Dismiss message"
        class="rounded-md p-1 transition hover:bg-emerald-100 dark:hover:bg-emerald-900/40"
        @click="message = ''"
      >
        <X class="size-3.5" />
      </button>
    </div>

    <section
      class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-[#2a2d32] dark:bg-[#1a1c1e]"
    >
      <header
        class="border-b border-gray-100 bg-gray-50/70 px-5 py-4 sm:px-6 dark:border-[#2a2d32] dark:bg-[#202226]"
      >
        <div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div class="flex items-center gap-3">
            <span
              class="grid size-9 place-items-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300"
            >
              <ClipboardCheck class="size-4" />
            </span>

            <div>
              <h2 class="text-sm font-bold text-gray-900 dark:text-gray-100">
                Registered tractor fleet
              </h2>

              <p class="text-[11px] text-gray-400">
                Select a vehicle to make it active for dashboard and diagnostic scans
              </p>
            </div>
          </div>

          <label class="relative block sm:w-72">
            <Search class="absolute top-3 left-3 size-3.5 text-gray-400" />

            <input
              v-model="search"
              class="h-10 w-full rounded-lg border border-gray-200 bg-white pr-3 pl-9 text-xs text-gray-900 transition outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 dark:border-[#34383f] dark:bg-[#1a1c1e] dark:text-gray-100 dark:placeholder:text-gray-500"
              placeholder="Search model, chassis, ID, technician…"
            />
          </label>
        </div>
      </header>

      <div class="grid grid-cols-3 border-b border-gray-100 dark:border-[#2a2d32]">
        <div class="px-4 py-3 text-center">
          <div class="font-mono text-lg font-black text-gray-900 dark:text-gray-100">
            {{ tractors.length }}
          </div>

          <div class="text-[9px] font-bold tracking-wide text-gray-400 uppercase">Vehicles</div>
        </div>

        <div class="border-x border-gray-100 px-4 py-3 text-center dark:border-[#2a2d32]">
          <div class="font-mono text-lg font-black text-gray-900 dark:text-gray-100">
            {{ technicians }}
          </div>

          <div class="text-[9px] font-bold tracking-wide text-gray-400 uppercase">Technicians</div>
        </div>

        <div class="px-4 py-3 text-center">
          <div class="font-mono text-lg font-black text-gray-900 dark:text-gray-100">
            {{ totalScans }}
          </div>

          <div class="text-[9px] font-bold tracking-wide text-gray-400 uppercase">Inspections</div>
        </div>
      </div>

      <div v-if="filteredTractors.length" class="divide-y divide-gray-100 dark:divide-[#2a2d32]">
        <article
          v-for="item in filteredTractors"
          :key="item.id"
          role="button"
          tabindex="0"
          :aria-pressed="item.id === activeTractor.id"
          :class="[
            'group relative cursor-pointer p-4 transition-all duration-200 outline-none sm:p-5',
            item.id === activeTractor.id
              ? 'bg-white ring-1 ring-blue-200 ring-inset dark:bg-[#17191c] dark:ring-blue-600/40'
              : 'bg-white hover:bg-gray-50 dark:bg-[#1a1c1e] dark:hover:bg-[#202226]',
          ]"
          @click="selectTractor(item)"
          @keydown.enter.prevent="selectTractor(item)"
          @keydown.space.prevent="selectTractor(item)"
        >
          <div
            v-if="item.id === activeTractor.id"
            class="absolute inset-y-0 left-0 z-10 w-1 bg-blue-600"
          />

          <div
            v-if="item.id === activeTractor.id"
            class="pointer-events-none absolute inset-0 bg-blue-600/[0.025] dark:bg-blue-600/[0.035]"
          />

          <div class="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div class="flex min-w-0 items-start gap-3.5">
              <span
                :class="[
                  'grid size-11 shrink-0 place-items-center rounded-xl border transition-all duration-200',
                  item.id === activeTractor.id
                    ? 'border-blue-500 bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'border-gray-200 bg-gray-50 text-gray-500 group-hover:border-blue-200 group-hover:text-blue-600 dark:border-[#34383f] dark:bg-[#22252a] dark:text-gray-400 dark:group-hover:border-[#41464e] dark:group-hover:bg-[#272a2f] dark:group-hover:text-blue-400',
                ]"
              >
                <Tractor class="size-5" />
              </span>

              <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-2">
                  <h3 class="truncate text-sm font-black text-gray-900 dark:text-gray-100">
                    {{ item.model }}
                  </h3>

                  <span
                    v-if="item.id === activeTractor.id"
                    class="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[8px] font-black tracking-wide text-blue-700 uppercase dark:border-blue-500/20 dark:bg-blue-500/15 dark:text-blue-400"
                  >
                    Selected · Active
                  </span>

                  <span
                    v-else
                    class="text-[8px] font-bold tracking-wide text-gray-400 uppercase dark:text-gray-500"
                  >
                    Click to select
                  </span>
                </div>

                <div
                  class="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-gray-500 dark:text-gray-400"
                >
                  <span class="flex items-center gap-1 font-mono">
                    <IdCard class="size-3" />
                    {{ item.chassisNumber }}
                  </span>

                  <span class="flex items-center gap-1 font-mono">
                    <Hash class="size-3" />
                    {{ item.tractorId }}
                  </span>
                </div>

                <div
                  class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[9px] text-gray-400 dark:text-gray-500"
                >
                  <span class="flex items-center gap-1">
                    <UserRound class="size-3" />
                    {{ item.technicianName }}
                  </span>

                  <span class="flex items-center gap-1">
                    <CircleGauge class="size-3" />
                    {{ item.totalScans }} scans
                  </span>

                  <span class="flex items-center gap-1">
                    <CalendarClock class="size-3" />
                    {{ item.savedAt }}
                  </span>
                </div>
              </div>
            </div>

            <div class="flex shrink-0 items-center justify-end gap-1.5" @click.stop @keydown.stop>
              <template v-if="deleteConfirmId === item.id">
                <button
                  class="rounded-lg bg-red-600 px-2.5 py-2 text-[10px] font-bold text-white transition hover:bg-red-700 dark:hover:bg-red-500"
                  @click="confirmDelete(item)"
                >
                  Confirm delete
                </button>

                <button
                  class="rounded-lg border border-gray-200 bg-white p-2 text-gray-500 transition hover:bg-gray-50 dark:border-[#34383f] dark:bg-[#22252a] dark:text-gray-400 dark:hover:bg-[#292c31]"
                  aria-label="Cancel delete"
                  @click="deleteConfirmId = null"
                >
                  <X class="size-3.5" />
                </button>
              </template>

              <button
                v-else
                class="rounded-lg border border-red-100 bg-white p-2 text-red-500 transition hover:border-red-300 hover:bg-red-50 dark:border-red-950 dark:bg-[#22252a] dark:text-red-400 dark:hover:border-red-900 dark:hover:bg-red-950/30"
                title="Delete tractor"
                @click="deleteConfirmId = item.id"
              >
                <Trash2 class="size-3.5" />
              </button>
            </div>
          </div>
        </article>
      </div>

      <div
        v-else
        class="grid min-h-64 place-items-center bg-white p-10 text-center dark:bg-[#1a1c1e]"
      >
        <div>
          <span
            class="mx-auto grid size-12 place-items-center rounded-xl bg-gray-100 text-gray-400 dark:bg-[#22252a] dark:text-gray-500"
          >
            <Search class="size-5" />
          </span>

          <h3 class="mt-3 text-sm font-bold text-gray-900 dark:text-gray-100">No tractors found</h3>

          <p class="mt-1 text-xs text-gray-400 dark:text-gray-500">
            Try a different model, chassis, ID, or technician.
          </p>

          <button
            class="mt-3 text-xs font-bold text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            @click="search = ''"
          >
            Clear search
          </button>
        </div>
      </div>
    </section>
  </div>
</template>
