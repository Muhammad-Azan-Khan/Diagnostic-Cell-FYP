<script setup lang="ts">
import {
  Activity,
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  CircleX,
  Download,
  Eye,
  FileText,
  Filter,
  History,
  Search,
  SlidersHorizontal,
  Trash2,
  X,
} from 'lucide-vue-next'
import type { TestResultStatus } from '~/app/types/diagnostic'

const { sessions, deleteSession, setSelectedSessionForModal } = useDiagnostic()
const search = ref('')
const status = ref<'ALL' | TestResultStatus>('ALL')
const circuit = ref('ALL')
const deleteConfirmId = ref<string | null>(null)

const circuits = computed(() => [...new Set(sessions.value.map((session) => session.circuitName))])
const filtered = computed(() => {
  const query = search.value.trim().toLowerCase()
  return sessions.value.filter(
    (session) =>
      (status.value === 'ALL' || session.overallStatus === status.value) &&
      (circuit.value === 'ALL' || session.circuitName === circuit.value) &&
      (!query ||
        [
          session.tractorModel,
          session.chassisNumber,
          session.circuitName,
          session.technicianName,
          session.id,
        ].some((value) => value.toLowerCase().includes(query))),
  )
})
const counts = computed(() => ({
  PASS: sessions.value.filter((session) => session.overallStatus === 'PASS').length,
  WARNING: sessions.value.filter((session) => session.overallStatus === 'WARNING').length,
  FAIL: sessions.value.filter((session) => session.overallStatus === 'FAIL').length,
}))
const passRate = computed(() =>
  sessions.value.length ? Math.round((counts.value.PASS / sessions.value.length) * 100) : 0,
)
const filtersActive = computed(
  () => Boolean(search.value.trim()) || status.value !== 'ALL' || circuit.value !== 'ALL',
)

function clearFilters() {
  search.value = ''
  status.value = 'ALL'
  circuit.value = 'ALL'
}

function exportCsv() {
  if (!filtered.value.length) return
  const headers = [
    'Session ID',
    'Date',
    'Tractor',
    'Chassis',
    'Circuit',
    'Result',
    'Voltage',
    'Current',
    'Resistance',
    'Temperature',
    'Faults',
    'Technician',
  ]
  const rows = filtered.value.map((session) => [
    session.id,
    `"${session.formattedDate}"`,
    `"${session.tractorModel}"`,
    session.chassisNumber,
    session.circuitName,
    session.overallStatus,
    session.measurements.voltageV,
    session.measurements.currentA,
    session.measurements.resistanceOhm,
    session.measurements.temperatureC,
    session.faults.length,
    `"${session.technicianName}"`,
  ])
  const link = document.createElement('a')
  link.href = encodeURI(
    `data:text/csv;charset=utf-8,${[headers, ...rows].map((row) => row.join(',')).join('\n')}`,
  )
  link.download = `diagnostic-history-${Date.now()}.csv`
  link.click()
}

function removeSession(id: string) {
  deleteSession(id)
  deleteConfirmId.value = null
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
            <History class="size-3.5" />Inspection archive
          </div>
          <h1 class="text-2xl font-black tracking-tight sm:text-3xl">Diagnostic Session History</h1>
          <p class="mt-2 max-w-xl text-sm leading-6 text-slate-400">
            Review every electrical inspection, compare measured values, and access detailed fault
            reports from one searchable archive.
          </p>
        </div>
        <div class="grid grid-cols-4 gap-2 sm:min-w-lg">
          <div
            v-for="item in [
              { label: 'Total', value: sessions.length, color: 'text-slate-100' },
              { label: 'Pass', value: counts.PASS, color: 'text-emerald-400' },
              { label: 'Warning', value: counts.WARNING, color: 'text-amber-400' },
              { label: 'Failed', value: counts.FAIL, color: 'text-red-400' },
            ]"
            :key="item.label"
            class="rounded-xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur-sm"
          >
            <div class="text-[9px] font-bold text-slate-500 uppercase">{{ item.label }}</div>
            <div :class="['mt-1 font-mono text-lg font-black', item.color]">{{ item.value }}</div>
          </div>
        </div>
      </div>
    </section>

    <section class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="item in [
          {
            label: 'Recorded sessions',
            value: sessions.length,
            note: 'Complete archive',
            icon: History,
            color: 'text-blue-600',
            bg: 'bg-blue-50 dark:bg-blue-950/30',
          },
          {
            label: 'Pass rate',
            value: `${passRate}%`,
            note: `${counts.PASS} compliant circuits`,
            icon: CheckCircle2,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50 dark:bg-emerald-950/30',
          },
          {
            label: 'Attention required',
            value: counts.WARNING + counts.FAIL,
            note: 'Warning or failed',
            icon: AlertTriangle,
            color: 'text-amber-600',
            bg: 'bg-amber-50 dark:bg-amber-950/30',
          },
          {
            label: 'Circuit coverage',
            value: circuits.length,
            note: 'Unique circuits tested',
            icon: Activity,
            color: 'text-violet-600',
            bg: 'bg-violet-50 dark:bg-violet-950/30',
          },
        ]"
        :key="item.label"
        class="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-xs dark:border-[#2a2d32] dark:bg-[#1a1c1e]"
      >
        <span :class="['grid size-10 shrink-0 place-items-center rounded-xl', item.bg, item.color]">
          <component :is="item.icon" class="size-4" />
        </span>
        <div>
          <div class="text-[9px] font-bold tracking-wide text-gray-400 uppercase">
            {{ item.label }}
          </div>
          <div class="font-mono text-xl font-black">{{ item.value }}</div>
          <div class="text-[9px] text-gray-400">{{ item.note }}</div>
        </div>
      </div>
    </section>

    <section
      class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-[#2a2d32] dark:bg-[#1a1c1e]"
    >
      <div
        class="border-b border-gray-100 bg-gray-50/70 p-4 sm:p-5 dark:border-[#2a2d32] dark:bg-[#202226]"
      >
        <div class="flex flex-col justify-between gap-3 xl:flex-row xl:items-center">
          <div class="flex items-center gap-3">
            <span class="grid size-9 place-items-center rounded-lg bg-blue-600 text-white"
              ><SlidersHorizontal class="size-4"
            /></span>
            <div>
              <h2 class="text-sm font-bold">Inspection records</h2>
              <p class="text-[11px] text-gray-400">
                Showing {{ filtered.length }} of {{ sessions.length }} sessions
              </p>
            </div>
          </div>
          <div class="flex flex-col gap-2 sm:flex-row">
            <label class="relative block sm:w-72">
              <Search class="absolute top-3 left-3 size-3.5 text-gray-400" />
              <input
                v-model="search"
                class="h-10 w-full rounded-lg border border-gray-200 bg-white pr-3 pl-9 text-xs outline-none focus:border-blue-500 dark:border-[#34383f] dark:bg-[#1a1c1e]"
                placeholder="Search tractor, chassis, circuit…"
              />
            </label>
            <select
              v-model="status"
              class="h-10 rounded-lg border border-gray-200 bg-white px-3 text-xs font-semibold dark:border-[#34383f] dark:bg-[#1a1c1e]"
            >
              <option value="ALL">All results</option>
              <option value="PASS">Pass</option>
              <option value="WARNING">Warning</option>
              <option value="FAIL">Fail</option>
            </select>
            <select
              v-model="circuit"
              class="h-10 rounded-lg border border-gray-200 bg-white px-3 text-xs font-semibold dark:border-[#34383f] dark:bg-[#1a1c1e]"
            >
              <option value="ALL">All circuits</option>
              <option v-for="item in circuits" :key="item" :value="item">{{ item }}</option>
            </select>
          </div>
        </div>
        <div
          class="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-3 dark:border-[#2a2d32]"
        >
          <div class="flex items-center gap-2 text-[10px] text-gray-400">
            <Filter class="size-3.5" />{{
              filtersActive ? 'Filters applied' : 'Displaying all diagnostic sessions'
            }}
            <button v-if="filtersActive" class="font-bold text-blue-600" @click="clearFilters">
              Clear filters
            </button>
          </div>
          <div class="flex gap-2">
            <button
              :disabled="!filtered.length"
              class="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-[10px] font-bold disabled:opacity-40 dark:border-[#34383f] dark:bg-[#1a1c1e]"
              @click="exportCsv"
            >
              <Download class="size-3.5" />Export CSV
            </button>
            <NuxtLink
              to="/diagnostic-scan"
              class="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-[10px] font-bold text-white"
            >
              <Activity class="size-3.5" />New scan
            </NuxtLink>
          </div>
        </div>
      </div>

      <div v-if="filtered.length" class="overflow-x-auto">
        <table class="w-full min-w-5xl text-left text-xs">
          <thead
            class="border-b border-gray-100 bg-gray-50/60 text-[9px] font-black tracking-wide text-gray-400 uppercase dark:border-[#2a2d32] dark:bg-[#202226]"
          >
            <tr>
              <th class="px-5 py-3">Session</th>
              <th class="px-4 py-3">Vehicle</th>
              <th class="px-4 py-3">Circuit</th>
              <th class="px-4 py-3">Telemetry</th>
              <th class="px-4 py-3">Result</th>
              <th class="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-[#2a2d32]">
            <tr
              v-for="session in filtered"
              :key="session.id"
              class="transition hover:bg-gray-50/70 dark:hover:bg-[#202226]"
            >
              <td class="px-5 py-4">
                <div class="flex items-start gap-2.5">
                  <span
                    class="grid size-8 shrink-0 place-items-center rounded-lg bg-gray-100 text-gray-500 dark:bg-[#2a2d32]"
                    ><CalendarDays class="size-3.5"
                  /></span>
                  <div>
                    <div class="font-semibold">{{ session.formattedDate }}</div>
                    <div class="mt-0.5 font-mono text-[9px] text-gray-400">{{ session.id }}</div>
                  </div>
                </div>
              </td>
              <td class="px-4 py-4">
                <div class="max-w-44 truncate font-bold">{{ session.tractorModel }}</div>
                <div class="mt-0.5 font-mono text-[9px] text-gray-400">
                  {{ session.chassisNumber }}
                </div>
                <div class="mt-1 text-[9px] text-gray-400">{{ session.technicianName }}</div>
              </td>
              <td class="px-4 py-4">
                <div class="font-bold">{{ session.circuitName }}</div>
                <div class="mt-1 text-[9px] text-gray-400 capitalize">
                  {{ session.diagnosticMode.replace('_', ' ') }}
                </div>
              </td>
              <td class="px-4 py-4">
                <div class="grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-[9px]">
                  <span><b class="text-gray-400">V</b> {{ session.measurements.voltageV }}V</span
                  ><span><b class="text-gray-400">I</b> {{ session.measurements.currentA }}A</span
                  ><span
                    ><b class="text-gray-400">R</b> {{ session.measurements.resistanceOhm }}Ω</span
                  ><span
                    ><b class="text-gray-400">T</b> {{ session.measurements.temperatureC }}°C</span
                  >
                </div>
              </td>
              <td class="px-4 py-4">
                <CommonStatusBadge :status="session.overallStatus" size="sm" />
                <div class="mt-1.5 text-[9px] text-gray-400">
                  {{ session.faults.length }} fault{{ session.faults.length === 1 ? '' : 's' }}
                </div>
              </td>
              <td class="px-5 py-4">
                <div class="flex justify-end gap-1.5">
                  <button
                    class="rounded-lg border border-gray-200 bg-white p-2 text-gray-500 hover:border-blue-300 hover:text-blue-600 dark:border-[#34383f] dark:bg-[#22252a]"
                    title="Quick view"
                    @click="setSelectedSessionForModal(session)"
                  >
                    <Eye class="size-3.5" /></button
                  ><NuxtLink
                    :to="`/reports?sessionId=${session.id}`"
                    class="rounded-lg border border-gray-200 bg-white p-2 text-gray-500 hover:border-blue-300 hover:text-blue-600 dark:border-[#34383f] dark:bg-[#22252a]"
                    title="Open report"
                    ><FileText class="size-3.5" /></NuxtLink
                  ><template v-if="deleteConfirmId === session.id"
                    ><button
                      class="rounded-lg bg-red-600 px-2.5 text-[9px] font-bold text-white"
                      @click="removeSession(session.id)"
                    >
                      Confirm</button
                    ><button
                      class="rounded-lg border border-gray-200 p-2"
                      @click="deleteConfirmId = null"
                    >
                      <X class="size-3.5" /></button></template
                  ><button
                    v-else
                    class="rounded-lg border border-red-100 bg-white p-2 text-red-500 hover:bg-red-50 dark:border-red-950 dark:bg-[#22252a]"
                    title="Delete session"
                    @click="deleteConfirmId = session.id"
                  >
                    <Trash2 class="size-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="grid min-h-80 place-items-center p-10 text-center">
        <div>
          <span
            class="mx-auto grid size-14 place-items-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-[#22252a]"
            ><CircleX class="size-6"
          /></span>
          <h3 class="mt-4 text-sm font-bold">No matching sessions</h3>
          <p class="mt-1 text-xs text-gray-400">Adjust the filters or run a new diagnostic scan.</p>
          <button
            v-if="filtersActive"
            class="mt-3 text-xs font-bold text-blue-600"
            @click="clearFilters"
          >
            Clear all filters
          </button>
        </div>
      </div>
    </section>
  </div>
</template>
