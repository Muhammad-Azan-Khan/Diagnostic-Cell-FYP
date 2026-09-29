<script setup lang="ts">
import {
  Activity,
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  FileText,
  Gauge,
  Hash,
  Printer,
  ShieldCheck,
  Tractor,
  UserRound,
  Zap,
} from 'lucide-vue-next'

const route = useRoute()
const { sessions } = useDiagnostic()
const selectedSessionId = ref('')

const report = computed(
  () =>
    sessions.value.find((session) => session.id === selectedSessionId.value) ??
    sessions.value[0] ??
    null,
)
const passedSessions = computed(
  () => sessions.value.filter((session) => session.overallStatus === 'PASS').length,
)
const attentionSessions = computed(
  () => sessions.value.filter((session) => session.overallStatus !== 'PASS').length,
)
const passedChecks = computed(
  () => report.value?.testResults.filter((result) => result.status === 'PASS').length ?? 0,
)

watch(
  () => route.query.sessionId,
  (sessionId) => {
    selectedSessionId.value =
      typeof sessionId === 'string' ? sessionId : sessions.value[0]?.id || ''
  },
  { immediate: true },
)

function printReport() {
  if (import.meta.client) window.print()
}
</script>

<template>
  <div class="space-y-6 pb-14">
    <section
      class="print-hidden relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 px-5 py-6 text-white shadow-xl shadow-slate-950/10 sm:px-7 sm:py-7"
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
            <FileText class="size-3.5" />Technical documentation
          </div>
          <h1 class="text-2xl font-black tracking-tight sm:text-3xl">Diagnostic Reports</h1>
          <p class="mt-2 max-w-xl text-sm leading-6 text-slate-400">
            Open a completed inspection, review every measured parameter, and produce a clean
            workshop-ready diagnostic record.
          </p>
        </div>

        <div class="grid grid-cols-3 gap-2 sm:min-w-md">
          <div class="rounded-xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur-sm">
            <div class="text-[9px] font-bold text-slate-500 uppercase">Available</div>
            <div class="mt-1 font-mono text-lg font-black text-slate-100">
              {{ sessions.length }}
            </div>
          </div>
          <div class="rounded-xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur-sm">
            <div class="text-[9px] font-bold text-slate-500 uppercase">Passed</div>
            <div class="mt-1 font-mono text-lg font-black text-emerald-400">
              {{ passedSessions }}
            </div>
          </div>
          <div class="rounded-xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur-sm">
            <div class="text-[9px] font-bold text-slate-500 uppercase">Attention</div>
            <div class="mt-1 font-mono text-lg font-black text-amber-400">
              {{ attentionSessions }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <section
      class="print-hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-[#2a2d32] dark:bg-[#1a1c1e]"
    >
      <div
        class="flex flex-col justify-between gap-4 border-b border-gray-100 bg-gray-50/70 p-4 sm:flex-row sm:items-center sm:p-5 dark:border-[#2a2d32] dark:bg-[#202226]"
      >
        <div class="flex items-center gap-3">
          <span class="grid size-9 place-items-center rounded-lg bg-blue-600 text-white">
            <ClipboardCheck class="size-4" />
          </span>
          <div>
            <h2 class="text-sm font-bold">Report workspace</h2>
            <p class="text-[11px] text-gray-400">Select the diagnostic session to inspect</p>
          </div>
        </div>
        <div class="flex flex-col gap-2 sm:flex-row">
          <select
            v-model="selectedSessionId"
            class="h-10 min-w-72 rounded-lg border border-gray-200 bg-white px-3 text-xs font-semibold outline-none focus:border-blue-500 dark:border-[#34383f] dark:bg-[#1a1c1e]"
          >
            <option v-for="session in sessions" :key="session.id" :value="session.id">
              {{ session.formattedDate }} · {{ session.tractorModel }} · {{ session.circuitName }}
            </option>
          </select>
          <button
            :disabled="!report"
            class="flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-xs font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
            @click="printReport"
          >
            <Printer class="size-4" />Print report
          </button>
        </div>
      </div>
      <div
        v-if="report"
        class="flex flex-wrap items-center gap-2 px-5 py-3 text-[10px] text-gray-400"
      >
        <span>History</span><ChevronRight class="size-3" /><span>{{ report.tractorModel }}</span
        ><ChevronRight class="size-3" /><span class="font-bold text-blue-600">{{ report.id }}</span>
      </div>
    </section>

    <article
      v-if="report"
      class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-[#2a2d32] dark:bg-[#1a1c1e]"
    >
      <header class="relative overflow-hidden border-b border-gray-200 dark:border-[#2a2d32]">
        <div class="absolute inset-y-0 left-0 w-1.5 bg-blue-600" />
        <div
          class="flex flex-col justify-between gap-6 px-6 py-7 sm:px-8 lg:flex-row lg:items-start"
        >
          <div class="flex items-start gap-4">
            <span
              class="grid size-12 shrink-0 place-items-center rounded-xl bg-slate-950 text-white"
            >
              <Zap class="size-6 text-blue-400" />
            </span>
            <div>
              <div class="text-[10px] font-black tracking-[0.2em] text-blue-600 uppercase">
                Diagnostic Cell
              </div>
              <h2 class="mt-1 text-xl font-black tracking-tight sm:text-2xl">
                Electrical Diagnostic Report
              </h2>
              <p class="mt-1 text-xs text-gray-400">
                Complete circuit inspection and measurement record
              </p>
            </div>
          </div>
          <div class="lg:text-right">
            <CommonStatusBadge :status="report.overallStatus" size="md" />
            <div class="mt-3 font-mono text-[10px] text-gray-400">REPORT {{ report.id }}</div>
          </div>
        </div>
      </header>

      <div class="space-y-6 p-5 sm:p-7">
        <section class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div
            v-for="item in [
              {
                label: 'Tractor',
                value: report.tractorModel,
                meta: report.chassisNumber,
                icon: Tractor,
              },
              {
                label: 'Circuit tested',
                value: report.circuitName,
                meta: report.diagnosticMode.replace('_', ' '),
                icon: Activity,
              },
              {
                label: 'Technician',
                value: report.technicianName,
                meta: report.tractorId,
                icon: UserRound,
              },
              {
                label: 'Inspection date',
                value: report.formattedDate,
                meta: report.id,
                icon: CalendarDays,
              },
            ]"
            :key="item.label"
            class="rounded-xl border border-gray-200 bg-gray-50/60 p-4 dark:border-[#30343a] dark:bg-[#202226]"
          >
            <div
              class="flex items-center gap-2 text-[9px] font-bold tracking-wide text-gray-400 uppercase"
            >
              <component :is="item.icon" class="size-3.5 text-blue-600" />{{ item.label }}
            </div>
            <div class="mt-2 truncate text-sm font-black capitalize">{{ item.value }}</div>
            <div class="mt-1 truncate font-mono text-[9px] text-gray-400">{{ item.meta }}</div>
          </div>
        </section>

        <section class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="item in [
              { label: 'Voltage', value: `${report.measurements.voltageV} V` },
              { label: 'Current', value: `${report.measurements.currentA} A` },
              { label: 'Resistance', value: `${report.measurements.resistanceOhm} Ω` },
              { label: 'Temperature', value: `${report.measurements.temperatureC} °C` },
            ]"
            :key="item.label"
            class="flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50/50 px-4 py-3 dark:border-blue-950 dark:bg-blue-950/20"
          >
            <div>
              <div class="text-[9px] font-bold text-gray-400 uppercase">{{ item.label }}</div>
              <div class="mt-1 font-mono text-lg font-black">{{ item.value }}</div>
            </div>
            <Gauge class="size-5 text-blue-500/50" />
          </div>
        </section>

        <DiagnosticResultsTable :results="report.testResults" :circuit-name="report.circuitName" />
        <DiagnosticFaultList :faults="report.faults" :circuit-name="report.circuitName" />

        <section class="grid gap-4 lg:grid-cols-2">
          <div class="rounded-xl border border-gray-200 p-5 dark:border-[#30343a]">
            <div class="mb-4 flex items-center justify-between">
              <h3 class="flex items-center gap-2 text-xs font-black tracking-wide uppercase">
                <ShieldCheck class="size-4 text-blue-600" />Reference specification
              </h3>
              <span class="font-mono text-[9px] text-gray-400">{{ report.reference.id }}</span>
            </div>
            <dl class="grid grid-cols-2 gap-x-5 gap-y-3 text-xs">
              <div>
                <dt class="text-[9px] text-gray-400 uppercase">Rated power</dt>
                <dd class="mt-1 font-mono font-bold">{{ report.reference.powerW }} W</dd>
              </div>
              <div>
                <dt class="text-[9px] text-gray-400 uppercase">Nominal voltage</dt>
                <dd class="mt-1 font-mono font-bold">{{ report.reference.voltageV }} V</dd>
              </div>
              <div>
                <dt class="text-[9px] text-gray-400 uppercase">Expected current</dt>
                <dd class="mt-1 font-mono font-bold">{{ report.reference.currentA }} A</dd>
              </div>
              <div>
                <dt class="text-[9px] text-gray-400 uppercase">Expected resistance</dt>
                <dd class="mt-1 font-mono font-bold">{{ report.reference.resistanceOhm }} Ω</dd>
              </div>
              <div>
                <dt class="text-[9px] text-gray-400 uppercase">Fuse rating</dt>
                <dd class="mt-1 font-mono font-bold">{{ report.reference.fuseRatingA }} A</dd>
              </div>
              <div>
                <dt class="text-[9px] text-gray-400 uppercase">Fuse type</dt>
                <dd class="mt-1 font-bold">{{ report.reference.fuseType }}</dd>
              </div>
            </dl>
          </div>

          <div class="rounded-xl border border-gray-200 p-5 dark:border-[#30343a]">
            <div class="mb-4 flex items-center justify-between">
              <h3 class="flex items-center gap-2 text-xs font-black tracking-wide uppercase">
                <ClipboardCheck class="size-4 text-blue-600" />Inspection summary
              </h3>
              <span class="font-mono text-[9px] text-gray-400"
                >{{ passedChecks }}/{{ report.testResults.length }} PASSED</span
              >
            </div>
            <div class="mb-4 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-[#2a2d32]">
              <div
                class="h-full rounded-full bg-emerald-500"
                :style="{
                  width: `${report.testResults.length ? (passedChecks / report.testResults.length) * 100 : 0}%`,
                }"
              />
            </div>
            <div class="space-y-2 text-xs text-gray-500 dark:text-gray-400">
              <p class="flex items-center gap-2">
                <CheckCircle2 class="size-3.5 text-emerald-500" />
                {{ passedChecks }} parameters meet the expected specification.
              </p>
              <p class="flex items-center gap-2">
                <AlertTriangle class="size-3.5 text-amber-500" />
                {{ report.faults.length }} diagnostic fault{{
                  report.faults.length === 1 ? '' : 's'
                }}
                recorded.
              </p>
              <p v-if="report.notes" class="border-t border-gray-100 pt-3 dark:border-[#30343a]">
                {{ report.notes }}
              </p>
            </div>
          </div>
        </section>

        <section
          class="grid gap-8 border-t border-gray-200 pt-8 sm:grid-cols-2 dark:border-[#30343a]"
        >
          <div>
            <div class="h-8 border-b border-gray-400" />
            <div class="mt-2 flex justify-between text-[9px] text-gray-400 uppercase">
              <span>Technician signature</span><span>{{ report.technicianName }}</span>
            </div>
          </div>
          <div>
            <div class="h-8 border-b border-gray-400" />
            <div class="mt-2 flex justify-between text-[9px] text-gray-400 uppercase">
              <span>Workshop approval</span><span>Date</span>
            </div>
          </div>
        </section>
      </div>

      <footer
        class="flex flex-col justify-between gap-2 border-t border-gray-200 bg-gray-50 px-6 py-4 text-[9px] text-gray-400 sm:flex-row dark:border-[#2a2d32] dark:bg-[#202226]"
      >
        <span class="flex items-center gap-1.5"><Hash class="size-3" />{{ report.id }}</span>
        <span>Generated by Diagnostic Cell · Electrical inspection record</span>
      </footer>
    </article>

    <section
      v-else
      class="grid min-h-96 place-items-center rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center dark:border-[#34383f] dark:bg-[#1a1c1e]"
    >
      <div>
        <span
          class="mx-auto grid size-16 place-items-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-[#22252a]"
        >
          <FileText class="size-7" />
        </span>
        <h2 class="mt-4 text-base font-black">No diagnostic reports yet</h2>
        <p class="mt-1 text-xs text-gray-400">
          Complete a circuit scan to generate the first report.
        </p>
        <NuxtLink
          to="/diagnostic-scan"
          class="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-bold text-white"
        >
          <Activity class="size-4" />Start diagnostic scan
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
