<script setup lang="ts">
import {
  Activity,
  AlertCircle,
  Cable,
  CheckCircle2,
  ChevronRight,
  CircleCheckBig,
  Clock3,
  Cpu,
  FileText,
  FlaskConical,
  Gauge,
  Lightbulb,
  Play,
  Printer,
  Radio,
  RotateCcw,
  ShieldCheck,
  Thermometer,
  Tractor,
  TriangleAlert,
  Wifi,
  Wrench,
  Zap,
} from 'lucide-vue-next'
import type { Component } from 'vue'
import type { CircuitType, DiagnosticSession, FaultSimulationOption } from '~/app/types/diagnostic'
import { CIRCUITS_REFERENCE_DATA, CIRCUIT_OPTIONS } from '~/app/data/referenceData'
import { generateSensorMeasurement, SCAN_STEPS } from '~/app/utils/mockSensorService'
import { evaluateDiagnostic } from '~/app/utils/diagnosticEngine'

const {
  tractors,
  activeTractor,
  selectedCircuitId,
  settings,
  hardwareStatus,
  setActiveTractor,
  setSelectedCircuitId,
  addDiagnosticSession,
} = useDiagnostic()

const selectedTractorId = ref(activeTractor.value.id)
const chassisInput = ref(activeTractor.value.chassisNumber)
const mode = ref<'normal' | 'fault_simulation'>('normal')
const fault = ref<FaultSimulationOption>('high_current')
const scanning = ref(false)
const step = ref(0)
const result = ref<DiagnosticSession | null>(null)
const error = ref('')
let timer: ReturnType<typeof setInterval> | undefined

const reference = computed(
  () => CIRCUITS_REFERENCE_DATA[selectedCircuitId.value] || CIRCUITS_REFERENCE_DATA.horn,
)
const hardwareItems = computed(() => [
  { label: 'ESP32', online: hardwareStatus.value.esp32, icon: Cpu },
  { label: 'Voltage', online: hardwareStatus.value.voltageSensor, icon: Zap },
  { label: 'Current', online: hardwareStatus.value.currentSensor, icon: Activity },
  { label: 'Thermal', online: hardwareStatus.value.tempSensor, icon: Thermometer },
  { label: 'Continuity', online: hardwareStatus.value.continuityModule, icon: Cable },
])
const allHardwareOnline = computed(() => hardwareItems.value.every((item) => item.online))

const faultOptions: Array<{ value: FaultSimulationOption; label: string; detail: string }> = [
  {
    value: 'high_current',
    label: 'Excessive current draw',
    detail: 'High wattage or partial short',
  },
  { value: 'low_voltage', label: 'Low supply voltage', detail: 'Weak battery or alternator drop' },
  { value: 'high_resistance', label: 'High resistance', detail: 'Corroded contact or poor ground' },
  { value: 'open_circuit', label: 'Open circuit', detail: 'Broken wire or burned filament' },
  { value: 'wrong_fuse', label: 'Oversized fuse', detail: 'Unsafe fuse rating installed' },
  {
    value: 'high_temperature',
    label: 'Thermal stress',
    detail: 'Connector temperature above limit',
  },
  {
    value: 'short_circuit',
    label: 'Dead short circuit',
    detail: 'Blown fuse and near-zero resistance',
  },
]

const circuitIcons: Partial<Record<CircuitType, Component>> = {
  horn: Radio,
  headLampLow: Lightbulb,
  headLampHigh: Lightbulb,
  indicator: ChevronRight,
  brakeLight: CircleCheckBig,
  ploughLamp: Lightbulb,
  numberPlateLight: Lightbulb,
  gaugeBulb: Gauge,
  nightLamp: Lightbulb,
}

watch(activeTractor, (value) => {
  selectedTractorId.value = value.id
  chassisInput.value = value.chassisNumber
})

function changeTractor() {
  const found = tractors.value.find((tractor) => tractor.id === selectedTractorId.value)
  if (found) {
    setActiveTractor(found)
    chassisInput.value = found.chassisNumber
  }
}

function selectCircuit(id: CircuitType) {
  if (!scanning.value) setSelectedCircuitId(id)
}

function stop() {
  if (timer) clearInterval(timer)
  scanning.value = false
  step.value = 0
}

function start() {
  error.value = ''
  if (!chassisInput.value.trim()) {
    error.value = 'Enter a chassis number before starting the diagnostic scan.'
    return
  }
  if (!allHardwareOnline.value) {
    error.value = 'One or more hardware modules are offline. Check the interface before scanning.'
    return
  }

  result.value = null
  scanning.value = true
  step.value = 0
  timer = setInterval(() => {
    if (++step.value < SCAN_STEPS.length) return
    if (timer) clearInterval(timer)
    finish()
  }, 420)
}

function finish() {
  scanning.value = false
  step.value = SCAN_STEPS.length - 1
  const measurement = generateSensorMeasurement(
    reference.value,
    mode.value === 'fault_simulation' ? fault.value : 'none',
  )
  const evaluated = evaluateDiagnostic(reference.value, measurement)
  const now = new Date()
  const formattedDate = `${now.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`

  result.value = {
    id: `sess-${Date.now()}`,
    date: now.toISOString(),
    formattedDate,
    tractorModel: activeTractor.value.model,
    chassisNumber: chassisInput.value.trim().toUpperCase(),
    tractorId: activeTractor.value.tractorId,
    technicianName: activeTractor.value.technicianName || settings.value.technicianName,
    circuitId: selectedCircuitId.value,
    circuitName: reference.value.name,
    measurements: measurement,
    reference: reference.value,
    testResults: evaluated.testResults,
    overallStatus: evaluated.overallStatus,
    faults: evaluated.faults,
    diagnosticMode: mode.value,
    simulatedFaultType: mode.value === 'fault_simulation' ? fault.value : undefined,
  }
  addDiagnosticSession(result.value)
}

function reset() {
  stop()
  result.value = null
  error.value = ''
}

function printResult() {
  if (import.meta.client) window.print()
}

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="space-y-6 pb-14">
    <!-- Command header -->
    <section
      class="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 px-5 py-6 text-white shadow-xl shadow-slate-950/10 sm:px-7 sm:py-7"
    >
      <div
        class="pointer-events-none absolute -top-32 right-0 size-80 rounded-full bg-blue-600/20 blur-3xl"
      />
      <div
        class="pointer-events-none absolute -bottom-32 left-1/3 size-64 rounded-full bg-cyan-500/10 blur-3xl"
      />
      <div class="relative flex flex-col justify-between gap-6 xl:flex-row xl:items-center">
        <div class="max-w-2xl">
          <div
            class="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-[10px] font-bold tracking-[0.18em] text-blue-300 uppercase"
          >
            <Radio class="size-3.5" />Live diagnostic workstation
          </div>
          <h1 class="text-2xl font-black tracking-tight sm:text-3xl">
            Electrical Circuit Diagnostic
          </h1>
          <p class="mt-2 max-w-xl text-sm leading-6 text-slate-400">
            Configure the inspection, validate the hardware interface, and run a complete
            engineering assessment against factory reference values.
          </p>
        </div>

        <div class="grid grid-cols-3 gap-2 sm:min-w-md">
          <div class="rounded-xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur-sm">
            <div
              class="mb-1 flex items-center gap-1.5 text-[9px] font-bold text-slate-500 uppercase"
            >
              <Wifi class="size-3" />Interface
            </div>
            <div class="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <span class="size-1.5 animate-pulse rounded-full bg-emerald-400" />Online
            </div>
          </div>
          <div class="rounded-xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur-sm">
            <div class="mb-1 text-[9px] font-bold text-slate-500 uppercase">Connection</div>
            <div class="truncate font-mono text-xs font-bold text-slate-200">
              {{ hardwareStatus.comPort.split(' ')[0] }}
            </div>
          </div>
          <div class="rounded-xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur-sm">
            <div class="mb-1 text-[9px] font-bold text-slate-500 uppercase">Baud rate</div>
            <div class="font-mono text-xs font-bold text-slate-200">
              {{ hardwareStatus.baudRate.toLocaleString() }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Hardware readiness -->
    <section
      class="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-xs dark:border-[#2a2d32] dark:bg-[#1a1c1e]"
    >
      <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div class="flex items-center gap-2">
          <span
            :class="[
              'grid size-8 place-items-center rounded-lg',
              allHardwareOnline
                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40'
                : 'bg-red-50 text-red-600 dark:bg-red-950/40',
            ]"
          >
            <ShieldCheck class="size-4" />
          </span>
          <div>
            <div class="text-xs font-bold">Pre-scan hardware check</div>
            <div class="text-[10px] text-gray-400">
              {{
                allHardwareOnline
                  ? 'All acquisition modules are ready'
                  : 'Hardware attention required'
              }}
            </div>
          </div>
        </div>
        <div class="grid grid-cols-5 gap-1.5 sm:gap-2">
          <div
            v-for="item in hardwareItems"
            :key="item.label"
            class="flex items-center gap-1.5 rounded-lg border border-gray-100 bg-gray-50 px-2.5 py-2 dark:border-[#2f3238] dark:bg-[#22252a]"
          >
            <component :is="item.icon" class="size-3.5 text-gray-400" />
            <span
              class="hidden text-[10px] font-semibold text-gray-600 sm:inline dark:text-gray-300"
            >
              {{ item.label }}
            </span>
            <span
              :class="['size-1.5 rounded-full', item.online ? 'bg-emerald-500' : 'bg-red-500']"
            />
          </div>
        </div>
      </div>
    </section>

    <div class="grid items-start gap-6 xl:grid-cols-12">
      <!-- Configuration workspace -->
      <section
        class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm xl:col-span-8 dark:border-[#2a2d32] dark:bg-[#1a1c1e]"
      >
        <div
          class="flex items-center justify-between border-b border-gray-100 bg-gray-50/70 px-5 py-4 sm:px-6 dark:border-[#2a2d32] dark:bg-[#202226]"
        >
          <div class="flex items-center gap-3">
            <span
              class="grid size-9 place-items-center rounded-lg bg-blue-600 text-white shadow-sm"
            >
              <Wrench class="size-4" />
            </span>
            <div>
              <h2 class="text-sm font-bold">Inspection setup</h2>
              <p class="text-[11px] text-gray-400">Vehicle, circuit and diagnostic mode</p>
            </div>
          </div>
          <span
            class="rounded-md border border-gray-200 bg-white px-2 py-1 font-mono text-[9px] font-bold text-gray-400 uppercase dark:border-[#34383f] dark:bg-[#1a1c1e]"
          >
            Step 1 of 2
          </span>
        </div>

        <div class="space-y-7 p-5 sm:p-6">
          <div>
            <div class="mb-3 flex items-center justify-between">
              <div class="flex items-center gap-2 text-xs font-bold">
                <Tractor class="size-4 text-blue-600" />Vehicle identity
              </div>
              <span class="text-[10px] text-gray-400">Required</span>
            </div>
            <div class="grid gap-3 md:grid-cols-2">
              <label class="block">
                <span
                  class="mb-1.5 block text-[10px] font-bold tracking-wide text-gray-500 uppercase"
                >
                  Registered tractor
                </span>
                <select
                  v-model="selectedTractorId"
                  class="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm font-semibold transition outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 disabled:opacity-60 dark:border-[#34383f] dark:bg-[#22252a]"
                  :disabled="scanning"
                  @change="changeTractor"
                >
                  <option
                    v-for="tractorItem in tractors"
                    :key="tractorItem.id"
                    :value="tractorItem.id"
                  >
                    {{ tractorItem.model }} — {{ tractorItem.tractorId }}
                  </option>
                </select>
              </label>
              <label class="block">
                <span
                  class="mb-1.5 block text-[10px] font-bold tracking-wide text-gray-500 uppercase"
                >
                  Chassis / VIN number
                </span>
                <input
                  v-model="chassisInput"
                  class="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 font-mono text-sm font-semibold uppercase transition outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 disabled:opacity-60 dark:border-[#34383f] dark:bg-[#22252a]"
                  :disabled="scanning"
                  placeholder="Enter chassis number"
                />
              </label>
            </div>
          </div>

          <div class="border-t border-gray-100 pt-6 dark:border-[#2a2d32]">
            <div class="mb-3 flex items-center justify-between">
              <div class="flex items-center gap-2 text-xs font-bold">
                <Zap class="size-4 text-blue-600" />Select electrical circuit
              </div>
              <span class="font-mono text-[10px] text-gray-400"
                >{{ CIRCUIT_OPTIONS.length }} available</span
              >
            </div>
            <div class="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              <button
                v-for="circuit in CIRCUIT_OPTIONS"
                :key="circuit.id"
                type="button"
                :disabled="scanning"
                :class="[
                  'group relative min-h-20 rounded-xl border p-3 text-left transition-all disabled:cursor-not-allowed disabled:opacity-60',
                  selectedCircuitId === circuit.id
                    ? 'border-blue-500 bg-blue-50 shadow-sm ring-2 ring-blue-500/10 dark:bg-blue-950/30'
                    : 'border-gray-200 bg-white hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-sm dark:border-[#34383f] dark:bg-[#22252a]',
                ]"
                @click="selectCircuit(circuit.id)"
              >
                <div class="flex items-start justify-between gap-2">
                  <span
                    :class="[
                      'grid size-7 place-items-center rounded-md',
                      selectedCircuitId === circuit.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-500 dark:bg-[#2d3035]',
                    ]"
                  >
                    <component :is="circuitIcons[circuit.id] || Zap" class="size-3.5" />
                  </span>
                  <CheckCircle2
                    v-if="selectedCircuitId === circuit.id"
                    class="size-4 text-blue-600"
                  />
                </div>
                <div class="mt-2 truncate text-[11px] font-bold">{{ circuit.name }}</div>
                <div class="mt-0.5 font-mono text-[9px] text-gray-400">
                  {{ circuit.powerW }}W · {{ circuit.currentA.toFixed(2) }}A
                </div>
              </button>
            </div>
          </div>

          <div class="border-t border-gray-100 pt-6 dark:border-[#2a2d32]">
            <div class="mb-3 flex items-center gap-2 text-xs font-bold">
              <FlaskConical class="size-4 text-blue-600" />Diagnostic mode
            </div>
            <div class="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                :disabled="scanning"
                :class="[
                  'flex items-start gap-3 rounded-xl border p-4 text-left transition disabled:opacity-60',
                  mode === 'normal'
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/10 dark:bg-blue-950/30'
                    : 'border-gray-200 hover:border-blue-300 dark:border-[#34383f]',
                ]"
                @click="mode = 'normal'"
              >
                <span
                  class="grid size-9 shrink-0 place-items-center rounded-lg bg-blue-600 text-white"
                >
                  <Activity class="size-4" />
                </span>
                <span>
                  <span class="block text-xs font-bold">Live normal scan</span>
                  <span class="mt-1 block text-[11px] leading-4 text-gray-500">
                    Acquire nominal telemetry from the selected circuit.
                  </span>
                </span>
              </button>
              <button
                type="button"
                :disabled="scanning"
                :class="[
                  'flex items-start gap-3 rounded-xl border p-4 text-left transition disabled:opacity-60',
                  mode === 'fault_simulation'
                    ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-500/10 dark:bg-amber-950/20'
                    : 'border-gray-200 hover:border-amber-300 dark:border-[#34383f]',
                ]"
                @click="mode = 'fault_simulation'"
              >
                <span
                  class="grid size-9 shrink-0 place-items-center rounded-lg bg-amber-500 text-white"
                >
                  <TriangleAlert class="size-4" />
                </span>
                <span>
                  <span class="block text-xs font-bold">Fault simulation</span>
                  <span class="mt-1 block text-[11px] leading-4 text-gray-500">
                    Inject a controlled condition for training and validation.
                  </span>
                </span>
              </button>
            </div>

            <div
              v-if="mode === 'fault_simulation'"
              class="mt-3 rounded-xl border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-900 dark:bg-amber-950/20"
            >
              <label class="block">
                <span
                  class="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold text-amber-800 uppercase dark:text-amber-300"
                >
                  <AlertCircle class="size-3.5" />Simulated fault condition
                </span>
                <select
                  v-model="fault"
                  class="h-11 w-full rounded-lg border border-amber-200 bg-white px-3 text-sm font-semibold outline-none focus:border-amber-500 dark:border-amber-900 dark:bg-[#22252a]"
                  :disabled="scanning"
                >
                  <option v-for="option in faultOptions" :key="option.value" :value="option.value">
                    {{ option.label }} — {{ option.detail }}
                  </option>
                </select>
              </label>
            </div>
          </div>
        </div>
      </section>

      <!-- Sticky scan control -->
      <aside class="space-y-4 xl:sticky xl:top-22 xl:col-span-4">
        <DiagnosticCircuitSpecs :reference="reference" />

        <section
          class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-[#2a2d32] dark:bg-[#1a1c1e]"
        >
          <div class="border-b border-gray-100 px-5 py-4 dark:border-[#2a2d32]">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                  Ready to inspect
                </div>
                <h3 class="mt-0.5 text-sm font-bold">{{ reference.name }}</h3>
              </div>
              <span
                class="grid size-9 place-items-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40"
              >
                <CircleCheckBig class="size-4" />
              </span>
            </div>
          </div>
          <div class="space-y-3 p-5">
            <div class="grid grid-cols-2 gap-2 text-[10px]">
              <div class="rounded-lg bg-gray-50 p-2.5 dark:bg-[#22252a]">
                <span class="block text-gray-400">Vehicle</span>
                <span class="mt-0.5 block truncate font-bold">{{ activeTractor.tractorId }}</span>
              </div>
              <div class="rounded-lg bg-gray-50 p-2.5 dark:bg-[#22252a]">
                <span class="block text-gray-400">Mode</span>
                <span class="mt-0.5 block truncate font-bold capitalize">
                  {{ mode.replace('_', ' ') }}
                </span>
              </div>
              <div class="rounded-lg bg-gray-50 p-2.5 dark:bg-[#22252a]">
                <span class="block text-gray-400">Parameters</span>
                <span class="mt-0.5 block font-bold">6 evaluated</span>
              </div>
              <div class="rounded-lg bg-gray-50 p-2.5 dark:bg-[#22252a]">
                <span class="block text-gray-400">Estimated time</span>
                <span class="mt-0.5 flex items-center gap-1 font-bold"
                  ><Clock3 class="size-3" />4 sec</span
                >
              </div>
            </div>

            <div
              v-if="error"
              class="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-[11px] leading-4 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
            >
              <AlertCircle class="mt-0.5 size-3.5 shrink-0" />{{ error }}
            </div>

            <button
              v-if="!scanning"
              class="group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-blue-600/30"
              @click="start"
            >
              <Play class="size-4 fill-current" />Start Diagnostic Scan
              <ChevronRight class="size-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              v-else
              class="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm font-bold text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
              @click="stop"
            >
              Stop Active Scan
            </button>
            <p class="text-center text-[9px] leading-4 text-gray-400">
              Starting a scan stores the completed session in diagnostic history.
            </p>
          </div>
        </section>
      </aside>
    </div>

    <DiagnosticScanProgress v-if="scanning" :step="step" @stop="stop" />

    <template v-if="result">
      <section
        :class="[
          'overflow-hidden rounded-2xl border shadow-sm',
          result.overallStatus === 'PASS'
            ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/20'
            : result.overallStatus === 'WARNING'
              ? 'border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/20'
              : 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/20',
        ]"
      >
        <div class="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center sm:p-6">
          <div class="flex items-center gap-4">
            <span
              :class="[
                'grid size-12 shrink-0 place-items-center rounded-xl',
                result.overallStatus === 'PASS'
                  ? 'bg-emerald-600 text-white'
                  : result.overallStatus === 'WARNING'
                    ? 'bg-amber-500 text-white'
                    : 'bg-red-600 text-white',
              ]"
            >
              <CheckCircle2 class="size-6" />
            </span>
            <div>
              <div class="text-[10px] font-bold tracking-widest uppercase">Scan complete</div>
              <h2 class="mt-0.5 text-xl font-black">
                {{ result.circuitName }} diagnostic {{ result.overallStatus.toLowerCase() }}
              </h2>
              <p class="mt-1 text-xs opacity-70">
                {{ result.formattedDate }} · {{ result.technicianName }} · {{ result.id }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <CommonStatusBadge :status="result.overallStatus" />
            <button
              class="flex items-center gap-1.5 rounded-lg border border-current/20 bg-white/50 px-3 py-2 text-xs font-semibold dark:bg-black/10"
              @click="reset"
            >
              <RotateCcw class="size-3.5" />New scan
            </button>
          </div>
        </div>
      </section>

      <DiagnosticResultsTable :results="result.testResults" :circuit-name="result.circuitName" />
      <DiagnosticFaultList :faults="result.faults" :circuit-name="result.circuitName" />

      <div class="flex flex-col justify-end gap-2 sm:flex-row">
        <button
          class="flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold shadow-xs dark:border-[#34383f] dark:bg-[#1a1c1e]"
          @click="printResult"
        >
          <Printer class="size-4" />Print Results
        </button>
        <NuxtLink
          :to="`/reports?sessionId=${result.id}`"
          class="flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm"
        >
          <FileText class="size-4" />Open Full Report
        </NuxtLink>
      </div>
    </template>
  </div>
</template>
