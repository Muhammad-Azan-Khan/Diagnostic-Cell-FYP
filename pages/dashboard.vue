<script setup lang="ts">
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  CircuitBoard,
  Clock3,
  Eye,
  FileText,
  History,
  ShieldCheck,
  Tractor,
} from 'lucide-vue-next'
import { CIRCUIT_OPTIONS } from '~/app/data/referenceData'

const { activeTractor, tractors, sessions, setActiveTractor, setSelectedSessionForModal } =
  useDiagnostic()
const activeSessions = computed(() =>
  sessions.value.filter(
    (session) =>
      session.chassisNumber.toUpperCase() === activeTractor.value.chassisNumber.toUpperCase(),
  ),
)
const passedSessions = computed(
  () => activeSessions.value.filter((session) => session.overallStatus === 'PASS').length,
)
const attentionSessions = computed(
  () => activeSessions.value.filter((session) => session.overallStatus !== 'PASS').length,
)
const passRate = computed(() =>
  activeSessions.value.length
    ? Math.round((passedSessions.value / activeSessions.value.length) * 100)
    : 0,
)
const circuitOverview = computed(() =>
  CIRCUIT_OPTIONS.map((circuit) => {
    const circuitSessions = activeSessions.value.filter(
      (session) => session.circuitId === circuit.id,
    )
    return {
      ...circuit,
      latest: circuitSessions[0] ?? null,
      scanCount: circuitSessions.length,
    }
  }),
)
const testedCircuits = computed(
  () => circuitOverview.value.filter((circuit) => circuit.latest).length,
)
const coveragePercent = computed(() =>
  Math.round((testedCircuits.value / CIRCUIT_OPTIONS.length) * 100),
)
const latestCircuitCounts = computed(() => ({
  PASS: circuitOverview.value.filter((circuit) => circuit.latest?.overallStatus === 'PASS').length,
  WARNING: circuitOverview.value.filter((circuit) => circuit.latest?.overallStatus === 'WARNING')
    .length,
  FAIL: circuitOverview.value.filter((circuit) => circuit.latest?.overallStatus === 'FAIL').length,
}))
const faultObservations = computed(() =>
  circuitOverview.value.reduce((total, circuit) => total + (circuit.latest?.faults.length ?? 0), 0),
)

function selectDashboardTractor(event: Event) {
  const tractorId = (event.target as HTMLSelectElement).value
  const tractor = tractors.value.find((item) => item.id === tractorId)
  if (tractor) setActiveTractor(tractor)
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
            <ShieldCheck class="size-3.5" />Diagnostic command center
          </div>
          <h1 class="text-2xl font-black tracking-tight sm:text-3xl">Electrical System Overview</h1>
          <p class="mt-2 max-w-xl text-sm leading-6 text-slate-400">
            Monitor inspection coverage, review circuit-level outcomes, and continue directly into
            electrical testing from one operational workspace.
          </p>
          <div class="mt-5 flex flex-wrap gap-2">
            <NuxtLink
              to="/diagnostic-scan"
              class="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-black text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500"
            >
              <Activity class="size-4" />Start diagnostic scan<ArrowRight class="size-3.5" />
            </NuxtLink>
            <NuxtLink
              to="/tractor"
              class="flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-bold text-slate-200 transition hover:bg-white/10"
            >
              <Tractor class="size-4" />Manage tractors
            </NuxtLink>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-2 sm:min-w-md">
          <div class="rounded-xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur-sm">
            <div class="text-[9px] font-bold text-slate-500 uppercase">Total scans</div>
            <div class="mt-1 font-mono text-lg font-black text-slate-100">
              {{ activeSessions.length }}
            </div>
          </div>
          <div class="rounded-xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur-sm">
            <div class="text-[9px] font-bold text-slate-500 uppercase">Pass rate</div>
            <div class="mt-1 font-mono text-lg font-black text-emerald-400">{{ passRate }}%</div>
          </div>
          <div class="rounded-xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur-sm">
            <div class="text-[9px] font-bold text-slate-500 uppercase">Coverage</div>
            <div class="mt-1 font-mono text-lg font-black text-blue-400">
              {{ testedCircuits }}/{{ CIRCUIT_OPTIONS.length }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <section
      class="overflow-hidden rounded-xl border border-blue-200 bg-blue-50/60 shadow-xs dark:border-blue-900 dark:bg-blue-950/20"
    >
      <div
        class="flex flex-col justify-between gap-4 px-4 py-4 sm:flex-row sm:items-center sm:px-5"
      >
        <div class="flex min-w-0 items-center gap-3">
          <span class="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-600 text-white">
            <Tractor class="size-5" />
          </span>
          <div class="min-w-0">
            <div class="flex items-center gap-2">
              <span class="text-[9px] font-black tracking-wide text-blue-600 uppercase"
                >Active tractor</span
              >
              <span class="size-1.5 rounded-full bg-emerald-500" />
            </div>
            <div class="truncate text-sm font-black">{{ activeTractor.model }}</div>
            <div class="mt-0.5 truncate font-mono text-[9px] text-gray-500 dark:text-gray-400">
              {{ activeTractor.chassisNumber }} · {{ activeTractor.tractorId }} ·
              {{ activeTractor.technicianName }}
            </div>
          </div>
        </div>
        <label class="relative block w-full sm:w-80">
          <Tractor class="pointer-events-none absolute top-3 left-3 size-3.5 text-blue-600" />
          <select
            :value="activeTractor.id"
            class="h-10 w-full appearance-none rounded-lg border border-blue-200 bg-white pr-9 pl-9 text-xs font-bold transition outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 dark:border-blue-900 dark:bg-[#1a1c1e]"
            aria-label="Select active tractor"
            @change="selectDashboardTractor"
          >
            <option v-for="tractor in tractors" :key="tractor.id" :value="tractor.id">
              {{ tractor.model }} · {{ tractor.chassisNumber }}
            </option>
          </select>
          <ChevronRight
            class="pointer-events-none absolute top-3 right-3 size-3.5 rotate-90 text-gray-400"
          />
        </label>
      </div>
    </section>

    <section class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="item in [
          {
            label: 'Completed scans',
            value: activeSessions.length,
            note: 'For the active tractor',
            icon: History,
            color: 'text-blue-600',
            bg: 'bg-blue-50 dark:bg-blue-950/30',
          },
          {
            label: 'Passed circuits',
            value: passedSessions,
            note: `${passRate}% success rate`,
            icon: CheckCircle2,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50 dark:bg-emerald-950/30',
          },
          {
            label: 'Attention required',
            value: attentionSessions,
            note: 'Warning or failed',
            icon: AlertTriangle,
            color: 'text-amber-600',
            bg: 'bg-amber-50 dark:bg-amber-950/30',
          },
          {
            label: 'Circuit coverage',
            value: `${coveragePercent}%`,
            note: `${testedCircuits} of ${CIRCUIT_OPTIONS.length} circuits tested`,
            icon: CircuitBoard,
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
        <div class="min-w-0">
          <div class="text-[9px] font-bold tracking-wide text-gray-400 uppercase">
            {{ item.label }}
          </div>
          <div class="font-mono text-xl font-black">{{ item.value }}</div>
          <div class="truncate text-[9px] text-gray-400">{{ item.note }}</div>
        </div>
      </div>
    </section>

    <section
      class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-[#2a2d32] dark:bg-[#1a1c1e]"
    >
      <header
        class="flex flex-col justify-between gap-3 border-b border-gray-100 bg-gray-50/70 p-4 sm:flex-row sm:items-center sm:p-5 dark:border-[#2a2d32] dark:bg-[#202226]"
      >
        <div class="flex items-center gap-3">
          <span class="grid size-9 place-items-center rounded-lg bg-blue-600 text-white">
            <CircuitBoard class="size-4" />
          </span>
          <div>
            <h2 class="text-sm font-black">Circuit health overview</h2>
            <p class="text-[10px] text-gray-400">
              Latest diagnostic outcome for each circuit—not cross-circuit measurements
            </p>
          </div>
        </div>
        <div
          class="flex min-w-0 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 dark:border-[#34383f] dark:bg-[#1a1c1e]"
        >
          <Tractor class="size-3.5 shrink-0 text-blue-600" />
          <div class="min-w-0">
            <div class="truncate text-[10px] font-black">{{ activeTractor.model }}</div>
            <div class="truncate font-mono text-[8px] text-gray-400">
              {{ activeTractor.chassisNumber }}
            </div>
          </div>
        </div>
      </header>

      <div class="grid gap-px bg-gray-100 sm:grid-cols-2 xl:grid-cols-3 dark:bg-[#2a2d32]">
        <div
          v-for="circuit in circuitOverview"
          :key="circuit.id"
          class="group bg-white p-4 transition hover:bg-gray-50 dark:bg-[#1a1c1e] dark:hover:bg-[#202226]"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="flex min-w-0 items-start gap-3">
              <span
                :class="[
                  'grid size-9 shrink-0 place-items-center rounded-lg',
                  circuit.latest?.overallStatus === 'PASS'
                    ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30'
                    : circuit.latest?.overallStatus === 'FAIL'
                      ? 'bg-red-50 text-red-600 dark:bg-red-950/30'
                      : circuit.latest?.overallStatus === 'WARNING'
                        ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/30'
                        : 'bg-gray-100 text-gray-400 dark:bg-[#292c31]',
                ]"
              >
                <CircuitBoard class="size-4" />
              </span>
              <div class="min-w-0">
                <div class="truncate text-xs font-black">{{ circuit.name }}</div>
                <div class="mt-1 truncate text-[9px] text-gray-400">
                  {{ circuit.latest ? circuit.latest.formattedDate : 'Not inspected yet' }}
                </div>
              </div>
            </div>
            <CommonStatusBadge
              v-if="circuit.latest"
              :status="circuit.latest.overallStatus"
              size="sm"
            />
            <span
              v-else
              class="rounded-md border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[9px] font-bold text-gray-400 uppercase dark:border-[#34383f] dark:bg-[#22252a]"
            >
              Untested
            </span>
          </div>
          <div
            class="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 text-[9px] text-gray-400 dark:border-[#2a2d32]"
          >
            <span
              >{{ circuit.scanCount }} scan{{ circuit.scanCount === 1 ? '' : 's' }} recorded</span
            >
            <NuxtLink
              v-if="circuit.latest"
              :to="`/reports?sessionId=${circuit.latest.id}`"
              class="font-bold text-blue-600 opacity-80 transition group-hover:opacity-100"
            >
              View report
            </NuxtLink>
            <NuxtLink v-else to="/diagnostic-scan" class="font-bold text-blue-600">
              Run test
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <div class="grid gap-6 xl:grid-cols-12">
      <section
        class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm xl:col-span-5 dark:border-[#2a2d32] dark:bg-[#1a1c1e]"
      >
        <header
          class="flex items-center gap-3 border-b border-gray-100 bg-gray-50/70 p-4 sm:p-5 dark:border-[#2a2d32] dark:bg-[#202226]"
        >
          <span class="grid size-9 place-items-center rounded-lg bg-violet-600 text-white">
            <ShieldCheck class="size-4" />
          </span>
          <div>
            <h2 class="text-sm font-black">Inspection coverage</h2>
            <p class="text-[10px] text-gray-400">Latest condition across the circuit catalog</p>
          </div>
        </header>

        <div class="p-5">
          <div class="flex items-end justify-between">
            <div>
              <div class="font-mono text-3xl font-black">{{ coveragePercent }}%</div>
              <div class="mt-1 text-[10px] text-gray-400">
                {{ testedCircuits }} of {{ CIRCUIT_OPTIONS.length }} circuits inspected
              </div>
            </div>
            <div class="text-right">
              <div class="font-mono text-lg font-black text-amber-600">{{ faultObservations }}</div>
              <div class="text-[9px] text-gray-400 uppercase">Latest faults</div>
            </div>
          </div>

          <div class="mt-4 h-2.5 overflow-hidden rounded-full bg-gray-100 dark:bg-[#2a2d32]">
            <div
              class="h-full rounded-full bg-blue-600 transition-all"
              :style="{ width: `${coveragePercent}%` }"
            />
          </div>

          <div class="mt-5 grid grid-cols-3 gap-2">
            <div
              class="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3 text-center dark:border-emerald-950 dark:bg-emerald-950/20"
            >
              <div class="font-mono text-lg font-black text-emerald-600">
                {{ latestCircuitCounts.PASS }}
              </div>
              <div class="text-[9px] font-bold text-emerald-700/70 uppercase dark:text-emerald-400">
                Passing
              </div>
            </div>
            <div
              class="rounded-xl border border-amber-100 bg-amber-50/60 p-3 text-center dark:border-amber-950 dark:bg-amber-950/20"
            >
              <div class="font-mono text-lg font-black text-amber-600">
                {{ latestCircuitCounts.WARNING }}
              </div>
              <div class="text-[9px] font-bold text-amber-700/70 uppercase dark:text-amber-400">
                Warning
              </div>
            </div>
            <div
              class="rounded-xl border border-red-100 bg-red-50/60 p-3 text-center dark:border-red-950 dark:bg-red-950/20"
            >
              <div class="font-mono text-lg font-black text-red-600">
                {{ latestCircuitCounts.FAIL }}
              </div>
              <div class="text-[9px] font-bold text-red-700/70 uppercase dark:text-red-400">
                Failed
              </div>
            </div>
          </div>

          <div class="mt-5 space-y-2 border-t border-gray-100 pt-4 dark:border-[#2a2d32]">
            <NuxtLink
              to="/diagnostic-scan"
              class="flex items-center justify-between rounded-lg bg-blue-600 px-3.5 py-2.5 text-[10px] font-black text-white"
            >
              Continue circuit testing<ArrowRight class="size-3.5" />
            </NuxtLink>
            <NuxtLink
              to="/history"
              class="flex items-center justify-between rounded-lg border border-gray-200 px-3.5 py-2.5 text-[10px] font-black text-gray-600 dark:border-[#34383f] dark:text-gray-300"
            >
              Review complete history<ChevronRight class="size-3.5" />
            </NuxtLink>
          </div>
        </div>
      </section>

      <section
        class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm xl:col-span-7 dark:border-[#2a2d32] dark:bg-[#1a1c1e]"
      >
        <header
          class="flex items-center justify-between gap-4 border-b border-gray-100 bg-gray-50/70 p-4 sm:p-5 dark:border-[#2a2d32] dark:bg-[#202226]"
        >
          <div class="flex items-center gap-3">
            <span class="grid size-9 place-items-center rounded-lg bg-blue-600 text-white">
              <Clock3 class="size-4" />
            </span>
            <div>
              <h2 class="text-sm font-black">Recent diagnostic sessions</h2>
              <p class="text-[10px] text-gray-400">Latest inspections for the active tractor</p>
            </div>
          </div>
          <NuxtLink
            to="/history"
            class="flex items-center gap-1 text-[10px] font-black text-blue-600"
          >
            View history<ChevronRight class="size-3.5" />
          </NuxtLink>
        </header>

        <div v-if="activeSessions.length" class="overflow-x-auto">
          <table class="w-full min-w-2xl text-left text-xs">
            <thead
              class="border-b border-gray-100 text-[9px] font-black tracking-wide text-gray-400 uppercase dark:border-[#2a2d32]"
            >
              <tr>
                <th class="px-5 py-3">Vehicle</th>
                <th class="px-4 py-3">Circuit</th>
                <th class="px-4 py-3">Inspected</th>
                <th class="px-4 py-3">Result</th>
                <th class="px-5 py-3 text-right">Open</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-[#2a2d32]">
              <tr
                v-for="session in activeSessions.slice(0, 5)"
                :key="session.id"
                class="transition hover:bg-gray-50/70 dark:hover:bg-[#202226]"
              >
                <td class="px-5 py-3.5">
                  <div class="font-bold">{{ session.tractorModel }}</div>
                  <div class="mt-0.5 font-mono text-[9px] text-gray-400">
                    {{ session.chassisNumber }}
                  </div>
                </td>
                <td class="px-4 py-3.5">
                  <div class="font-semibold">{{ session.circuitName }}</div>
                  <div class="mt-0.5 text-[9px] text-gray-400 capitalize">
                    {{ session.diagnosticMode.replace('_', ' ') }}
                  </div>
                </td>
                <td class="px-4 py-3.5 text-[10px] text-gray-400">{{ session.formattedDate }}</td>
                <td class="px-4 py-3.5">
                  <CommonStatusBadge :status="session.overallStatus" size="sm" />
                </td>
                <td class="px-5 py-3.5 text-right">
                  <div class="flex justify-end gap-1.5">
                    <button
                      class="rounded-lg border border-gray-200 bg-white p-2 text-gray-500 transition hover:border-blue-300 hover:text-blue-600 dark:border-[#34383f] dark:bg-[#22252a]"
                      title="Quick view"
                      @click="setSelectedSessionForModal(session)"
                    >
                      <Eye class="size-3.5" />
                    </button>
                    <NuxtLink
                      :to="`/reports?sessionId=${session.id}`"
                      class="rounded-lg border border-gray-200 bg-white p-2 text-gray-500 transition hover:border-blue-300 hover:text-blue-600 dark:border-[#34383f] dark:bg-[#22252a]"
                      title="Open report"
                    >
                      <FileText class="size-3.5" />
                    </NuxtLink>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="grid min-h-72 place-items-center p-10 text-center">
          <div>
            <span
              class="mx-auto grid size-14 place-items-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-[#22252a]"
            >
              <History class="size-6" />
            </span>
            <h3 class="mt-4 text-sm font-black">No diagnostic activity yet</h3>
            <p class="mt-1 text-xs text-gray-400">Run a circuit scan to populate the dashboard.</p>
            <NuxtLink
              to="/diagnostic-scan"
              class="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-bold text-white"
            >
              <Activity class="size-4" />Start first scan
            </NuxtLink>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
