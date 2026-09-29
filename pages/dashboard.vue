<script setup lang="ts">
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  CircuitBoard,
  Clock3,
  Cpu,
  Eye,
  FileText,
  Gauge,
  History,
  ShieldCheck,
  Thermometer,
  Tractor,
  TrendingUp,
  Zap,
} from 'lucide-vue-next'

const { activeTractor, sessions, latestSession, hardwareStatus, setSelectedSessionForModal } =
  useDiagnostic()

const measurements = computed(
  () =>
    latestSession.value?.measurements || {
      voltageV: 0,
      currentA: 0,
      resistanceOhm: 0,
      continuity: false,
      fuseInstalledA: 0,
      fuseBlown: false,
      temperatureC: 0,
    },
)
const latestStatus = computed(() => latestSession.value?.overallStatus || 'WARNING')
const latestCircuit = computed(() => latestSession.value?.circuitName || 'No scan recorded')
const passedSessions = computed(
  () => sessions.value.filter((session) => session.overallStatus === 'PASS').length,
)
const attentionSessions = computed(
  () => sessions.value.filter((session) => session.overallStatus !== 'PASS').length,
)
const passRate = computed(() =>
  sessions.value.length ? Math.round((passedSessions.value / sessions.value.length) * 100) : 0,
)
const onlineSensors = computed(
  () =>
    [
      hardwareStatus.value.esp32,
      hardwareStatus.value.voltageSensor,
      hardwareStatus.value.currentSensor,
      hardwareStatus.value.tempSensor,
      hardwareStatus.value.continuityModule,
    ].filter(Boolean).length,
)
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
            Monitor the active tractor, review live diagnostic measurements, and continue directly
            into circuit testing from one operational workspace.
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
              {{ sessions.length }}
            </div>
          </div>
          <div class="rounded-xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur-sm">
            <div class="text-[9px] font-bold text-slate-500 uppercase">Pass rate</div>
            <div class="mt-1 font-mono text-lg font-black text-emerald-400">{{ passRate }}%</div>
          </div>
          <div class="rounded-xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur-sm">
            <div class="text-[9px] font-bold text-slate-500 uppercase">Hardware</div>
            <div class="mt-1 font-mono text-lg font-black text-blue-400">{{ onlineSensors }}/5</div>
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
        <NuxtLink
          to="/tractor"
          class="flex shrink-0 items-center gap-1 text-[10px] font-black text-blue-600"
        >
          Change active vehicle<ChevronRight class="size-3.5" />
        </NuxtLink>
      </div>
    </section>

    <section class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="item in [
          {
            label: 'Completed scans',
            value: sessions.length,
            note: 'All recorded inspections',
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
            label: 'Sensors online',
            value: `${onlineSensors}/5`,
            note: hardwareStatus.comPort,
            icon: Cpu,
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

    <section>
      <div class="mb-3 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <div
            class="flex items-center gap-2 text-[10px] font-black tracking-wider text-blue-600 uppercase"
          >
            <Gauge class="size-3.5" />Latest telemetry
          </div>
          <h2 class="mt-1 text-lg font-black">Electrical measurements</h2>
        </div>
        <div class="flex items-center gap-2 text-[10px] text-gray-400">
          <CircuitBoard class="size-3.5" />Circuit:
          <strong class="text-gray-700 dark:text-gray-200">{{ latestCircuit }}</strong>
          <CommonStatusBadge v-if="latestSession" :status="latestStatus" size="sm" />
        </div>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DiagnosticMeasurementCard
          title="Line Voltage"
          :value="measurements.voltageV.toFixed(2)"
          unit="V"
          expected="12.0 V (±10%)"
          :status="
            !latestSession
              ? 'WARNING'
              : Math.abs(measurements.voltageV - 12) > 1.8
                ? 'FAIL'
                : Math.abs(measurements.voltageV - 12) > 0.96
                  ? 'WARNING'
                  : 'PASS'
          "
          :icon="Zap"
          description="Battery and alternator supply potential"
        />
        <DiagnosticMeasurementCard
          title="Circuit Current"
          :value="measurements.currentA.toFixed(2)"
          unit="A"
          :expected="
            latestSession ? `${latestSession.reference.currentA.toFixed(2)} A` : 'Awaiting scan'
          "
          :status="
            !latestSession
              ? 'WARNING'
              : !measurements.continuity || measurements.currentA > 7
                ? 'FAIL'
                : 'PASS'
          "
          :icon="Activity"
          description="Hall-effect current transducer"
        />
        <DiagnosticMeasurementCard
          title="Circuit Resistance"
          :value="measurements.resistanceOhm > 500 ? '∞' : measurements.resistanceOhm.toFixed(2)"
          unit="Ω"
          :expected="
            latestSession
              ? `${latestSession.reference.resistanceOhm.toFixed(2)} Ω`
              : 'Awaiting scan'
          "
          :status="
            !latestSession
              ? 'WARNING'
              : measurements.resistanceOhm > 500 || measurements.resistanceOhm < 0.5
                ? 'FAIL'
                : 'PASS'
          "
          :icon="Cpu"
          description="Equivalent branch resistance"
        />
        <DiagnosticMeasurementCard
          title="Junction Temperature"
          :value="measurements.temperatureC.toFixed(1)"
          unit="°C"
          expected="< 50 °C"
          :status="
            !latestSession
              ? 'WARNING'
              : measurements.temperatureC > 70
                ? 'FAIL'
                : measurements.temperatureC > 55
                  ? 'WARNING'
                  : 'PASS'
          "
          :icon="Thermometer"
          description="Connector thermal probe"
        />
      </div>
    </section>

    <DiagnosticHardwareStatus />

    <div class="grid gap-6 xl:grid-cols-12">
      <div class="xl:col-span-5">
        <DiagnosticTrendChart :sessions="sessions" />
      </div>

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
              <p class="text-[10px] text-gray-400">Latest inspections across all circuits</p>
            </div>
          </div>
          <NuxtLink
            to="/history"
            class="flex items-center gap-1 text-[10px] font-black text-blue-600"
          >
            View history<ChevronRight class="size-3.5" />
          </NuxtLink>
        </header>

        <div v-if="sessions.length" class="overflow-x-auto">
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
                v-for="session in sessions.slice(0, 5)"
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
              <TrendingUp class="size-6" />
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
