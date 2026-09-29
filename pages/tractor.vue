<script setup lang="ts">
import {
  Activity,
  BadgeCheck,
  CalendarClock,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleGauge,
  ClipboardCheck,
  Hash,
  IdCard,
  PencilLine,
  Plus,
  RotateCcw,
  Save,
  Search,
  ShieldCheck,
  Trash2,
  Tractor,
  UserRound,
  UsersRound,
  X,
} from 'lucide-vue-next'
import { POPULAR_TRACTOR_MODELS } from '~/app/data/referenceData'
import type { TractorProfile } from '~/app/types/diagnostic'

const { tractors, activeTractor, settings, saveTractor, deleteTractor, setActiveTractor } =
  useDiagnostic()

const model = ref(POPULAR_TRACTOR_MODELS[0] || 'Massey Ferguson')
const customModel = ref('')
const chassis = ref('')
const tractorId = ref('')
const technician = ref(settings.value.technicianName)
const errors = ref<Record<string, string>>({})
const message = ref('')
const search = ref('')
const editingId = ref<string | null>(null)
const deleteConfirmId = ref<string | null>(null)

const totalScans = computed(() => tractors.value.reduce((sum, item) => sum + item.totalScans, 0))
const healthyTractors = computed(
  () => tractors.value.filter((item) => item.lastStatus === 'PASS').length,
)
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

function clear() {
  model.value = POPULAR_TRACTOR_MODELS[0] || ''
  customModel.value = ''
  chassis.value = ''
  tractorId.value = ''
  technician.value = settings.value.technicianName
  errors.value = {}
  message.value = ''
  editingId.value = null
}

function submit() {
  const finalModel = customModel.value.trim() || model.value
  errors.value = {}

  if (!finalModel) errors.value.model = 'Select or enter a tractor model.'
  if (!chassis.value.trim()) errors.value.chassis = 'Chassis number is required.'
  if (!technician.value.trim()) errors.value.technician = 'Technician name is required.'
  if (Object.keys(errors.value).length) return

  const saved = saveTractor({
    model: finalModel,
    chassisNumber: chassis.value.trim(),
    tractorId: tractorId.value.trim(),
    technicianName: technician.value.trim(),
  })
  editingId.value = saved.id
  message.value = `${saved.model} (${saved.chassisNumber}) was saved and set as the active tractor.`
  window.setTimeout(() => {
    message.value = ''
  }, 5000)
}

function edit(item: TractorProfile) {
  model.value = POPULAR_TRACTOR_MODELS.includes(item.model)
    ? item.model
    : POPULAR_TRACTOR_MODELS[0] || ''
  customModel.value = POPULAR_TRACTOR_MODELS.includes(item.model) ? '' : item.model
  chassis.value = item.chassisNumber
  tractorId.value = item.tractorId
  technician.value = item.technicianName
  editingId.value = item.id
  errors.value = {}
  setActiveTractor(item)
  message.value = `${item.model} is loaded for editing and is now active.`
  if (import.meta.client) window.scrollTo({ top: 0, behavior: 'smooth' })
}

function activate(item: TractorProfile) {
  setActiveTractor(item)
  message.value = `${item.model} (${item.tractorId}) is now the active tractor.`
}

function confirmDelete(item: TractorProfile) {
  deleteTractor(item.id)
  if (editingId.value === item.id) clear()
  deleteConfirmId.value = null
  message.value = `${item.model} was removed from the registry.`
}
</script>

<template>
  <div class="space-y-6 pb-14">
    <!-- Registry command header -->
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
            <Tractor class="size-3.5" />Vehicle registry
          </div>
          <h1 class="text-2xl font-black tracking-tight sm:text-3xl">Tractor Profile Management</h1>
          <p class="mt-2 max-w-xl text-sm leading-6 text-slate-400">
            Register vehicles, maintain chassis identity, assign technicians, and select the tractor
            used by the diagnostic workstation.
          </p>
        </div>

        <div class="grid grid-cols-3 gap-2 sm:min-w-md">
          <div class="rounded-xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur-sm">
            <div
              class="mb-1 flex items-center gap-1.5 text-[9px] font-bold text-slate-500 uppercase"
            >
              <Tractor class="size-3" />Registered
            </div>
            <div class="font-mono text-lg font-black text-slate-100">{{ tractors.length }}</div>
          </div>
          <div class="rounded-xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur-sm">
            <div
              class="mb-1 flex items-center gap-1.5 text-[9px] font-bold text-slate-500 uppercase"
            >
              <ClipboardCheck class="size-3" />Total scans
            </div>
            <div class="font-mono text-lg font-black text-slate-100">{{ totalScans }}</div>
          </div>
          <div class="rounded-xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur-sm">
            <div
              class="mb-1 flex items-center gap-1.5 text-[9px] font-bold text-slate-500 uppercase"
            >
              <UsersRound class="size-3" />Technicians
            </div>
            <div class="font-mono text-lg font-black text-slate-100">{{ technicians }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Active vehicle strip -->
    <section
      class="overflow-hidden rounded-xl border border-blue-200 bg-blue-50/60 shadow-xs dark:border-blue-900 dark:bg-blue-950/20"
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
                class="text-[9px] font-black tracking-widest text-blue-600 uppercase dark:text-blue-300"
              >
                Active diagnostic vehicle
              </span>
              <span class="size-1.5 animate-pulse rounded-full bg-emerald-500" />
            </div>
            <div class="mt-0.5 truncate text-sm font-black">{{ activeTractor.model }}</div>
            <div class="mt-0.5 truncate font-mono text-[10px] text-gray-500 dark:text-gray-400">
              {{ activeTractor.chassisNumber }} · {{ activeTractor.tractorId }} ·
              {{ activeTractor.technicianName }}
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2 self-end sm:self-auto">
          <CommonStatusBadge
            v-if="activeTractor.lastStatus"
            :status="activeTractor.lastStatus"
            size="sm"
          />
          <NuxtLink
            to="/diagnostic-scan"
            class="group flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm"
          >
            <Activity class="size-3.5" />Start scan
            <ChevronRight class="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </NuxtLink>
        </div>
      </div>
    </section>

    <div
      v-if="message"
      class="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300"
    >
      <span class="flex items-center gap-2"><CheckCircle2 class="size-4" />{{ message }}</span>
      <button aria-label="Dismiss message" @click="message = ''"><X class="size-3.5" /></button>
    </div>

    <div class="grid items-start gap-6 xl:grid-cols-12">
      <!-- Registration form -->
      <form
        class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm xl:sticky xl:top-22 xl:col-span-5 dark:border-[#2a2d32] dark:bg-[#1a1c1e]"
        @submit.prevent="submit"
      >
        <div
          class="flex items-center justify-between border-b border-gray-100 bg-gray-50/70 px-5 py-4 dark:border-[#2a2d32] dark:bg-[#202226]"
        >
          <div class="flex items-center gap-3">
            <span
              class="grid size-9 place-items-center rounded-lg bg-blue-600 text-white shadow-sm"
            >
              <component :is="editingId ? PencilLine : Plus" class="size-4" />
            </span>
            <div>
              <h2 class="text-sm font-bold">
                {{ editingId ? 'Update tractor profile' : 'Register new tractor' }}
              </h2>
              <p class="text-[11px] text-gray-400">Vehicle identity and technician assignment</p>
            </div>
          </div>
          <span
            class="rounded-md border border-gray-200 bg-white px-2 py-1 text-[9px] font-bold text-gray-400 uppercase dark:border-[#34383f] dark:bg-[#1a1c1e]"
          >
            {{ editingId ? 'Editing' : 'New entry' }}
          </span>
        </div>

        <div class="space-y-5 p-5 sm:p-6">
          <label class="block">
            <span
              class="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold tracking-wide text-gray-500 uppercase"
            >
              <Tractor class="size-3.5" />Tractor model
            </span>
            <select
              v-model="model"
              class="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm font-semibold transition outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 dark:border-[#34383f] dark:bg-[#22252a]"
            >
              <option v-for="item in POPULAR_TRACTOR_MODELS" :key="item">{{ item }}</option>
            </select>
            <span v-if="errors.model" class="mt-1 block text-[10px] text-red-600">{{
              errors.model
            }}</span>
          </label>

          <label class="block">
            <span class="mb-1.5 block text-[10px] font-bold tracking-wide text-gray-500 uppercase">
              Custom model <span class="font-normal tracking-normal normal-case">(optional)</span>
            </span>
            <input
              v-model="customModel"
              class="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm transition outline-none placeholder:text-gray-300 focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 dark:border-[#34383f] dark:bg-[#22252a]"
              placeholder="Enter a model not listed above"
            />
          </label>

          <label class="block">
            <span
              class="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold tracking-wide text-gray-500 uppercase"
            >
              <IdCard class="size-3.5" />Chassis / VIN number
            </span>
            <input
              v-model="chassis"
              class="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 font-mono text-sm font-semibold uppercase transition outline-none placeholder:font-sans placeholder:font-normal placeholder:normal-case focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 dark:border-[#34383f] dark:bg-[#22252a]"
              placeholder="e.g. MTL-385-2026-8841"
            />
            <span v-if="errors.chassis" class="mt-1 block text-[10px] text-red-600">{{
              errors.chassis
            }}</span>
          </label>

          <div class="grid gap-4 sm:grid-cols-2">
            <label class="block">
              <span
                class="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold tracking-wide text-gray-500 uppercase"
              >
                <Hash class="size-3.5" />Tractor ID
              </span>
              <input
                v-model="tractorId"
                class="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 font-mono text-sm font-semibold uppercase transition outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 dark:border-[#34383f] dark:bg-[#22252a]"
                placeholder="Auto-generated"
              />
            </label>
            <label class="block">
              <span
                class="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold tracking-wide text-gray-500 uppercase"
              >
                <UserRound class="size-3.5" />Technician
              </span>
              <input
                v-model="technician"
                class="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm font-semibold transition outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 dark:border-[#34383f] dark:bg-[#22252a]"
                placeholder="Assigned technician"
              />
              <span v-if="errors.technician" class="mt-1 block text-[10px] text-red-600">
                {{ errors.technician }}
              </span>
            </label>
          </div>

          <div
            class="rounded-xl border border-gray-100 bg-gray-50 p-3 text-[10px] text-gray-500 dark:border-[#2f3238] dark:bg-[#22252a]"
          >
            <div class="flex items-start gap-2">
              <BadgeCheck class="mt-0.5 size-4 shrink-0 text-blue-600" />
              <p class="leading-4">
                Saving a profile makes it the active diagnostic vehicle. Existing chassis numbers
                are updated instead of duplicated.
              </p>
            </div>
          </div>

          <div
            class="flex flex-col-reverse gap-2 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end dark:border-[#2a2d32]"
          >
            <button
              type="button"
              class="flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold transition hover:bg-gray-50 dark:border-[#34383f] dark:bg-[#22252a]"
              @click="clear"
            >
              <RotateCcw class="size-3.5" />Clear form
            </button>
            <button
              class="flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              <Save class="size-3.5" />{{ editingId ? 'Save Changes' : 'Register Tractor' }}
            </button>
          </div>
        </div>
      </form>

      <!-- Registry -->
      <section
        class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm xl:col-span-7 dark:border-[#2a2d32] dark:bg-[#1a1c1e]"
      >
        <div
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
                <h2 class="text-sm font-bold">Registered tractor fleet</h2>
                <p class="text-[11px] text-gray-400">
                  {{ tractors.length }} vehicle profiles available
                </p>
              </div>
            </div>
            <label class="relative block sm:w-56">
              <Search class="absolute top-2.5 left-3 size-3.5 text-gray-400" />
              <input
                v-model="search"
                class="h-9 w-full rounded-lg border border-gray-200 bg-white pr-3 pl-8 text-xs outline-none focus:border-blue-500 dark:border-[#34383f] dark:bg-[#1a1c1e]"
                placeholder="Search registry…"
              />
            </label>
          </div>
        </div>

        <div class="grid grid-cols-3 border-b border-gray-100 dark:border-[#2a2d32]">
          <div class="px-4 py-3 text-center">
            <div class="font-mono text-lg font-black">{{ tractors.length }}</div>
            <div class="text-[9px] font-bold tracking-wide text-gray-400 uppercase">Vehicles</div>
          </div>
          <div class="border-x border-gray-100 px-4 py-3 text-center dark:border-[#2a2d32]">
            <div class="font-mono text-lg font-black text-emerald-600">{{ healthyTractors }}</div>
            <div class="text-[9px] font-bold tracking-wide text-gray-400 uppercase">
              Last scan pass
            </div>
          </div>
          <div class="px-4 py-3 text-center">
            <div class="font-mono text-lg font-black">{{ totalScans }}</div>
            <div class="text-[9px] font-bold tracking-wide text-gray-400 uppercase">
              Inspections
            </div>
          </div>
        </div>

        <div v-if="filteredTractors.length" class="divide-y divide-gray-100 dark:divide-[#2a2d32]">
          <article
            v-for="item in filteredTractors"
            :key="item.id"
            :class="[
              'group relative p-4 transition sm:p-5',
              item.id === activeTractor.id
                ? 'bg-blue-50/60 dark:bg-blue-950/20'
                : 'hover:bg-gray-50/70 dark:hover:bg-[#202226]',
            ]"
          >
            <div
              v-if="item.id === activeTractor.id"
              class="absolute inset-y-0 left-0 w-1 bg-blue-600"
            />
            <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div class="flex min-w-0 items-start gap-3.5">
                <span
                  :class="[
                    'grid size-11 shrink-0 place-items-center rounded-xl border',
                    item.id === activeTractor.id
                      ? 'border-blue-200 bg-blue-600 text-white shadow-sm'
                      : 'border-gray-200 bg-gray-50 text-gray-500 dark:border-[#34383f] dark:bg-[#22252a]',
                  ]"
                >
                  <Tractor class="size-5" />
                </span>
                <div class="min-w-0">
                  <div class="flex flex-wrap items-center gap-2">
                    <h3 class="truncate text-sm font-black">{{ item.model }}</h3>
                    <span
                      v-if="item.id === activeTractor.id"
                      class="rounded-full bg-blue-100 px-2 py-0.5 text-[8px] font-black tracking-wide text-blue-700 uppercase dark:bg-blue-900/50 dark:text-blue-300"
                    >
                      Active
                    </span>
                    <CommonStatusBadge v-if="item.lastStatus" :status="item.lastStatus" size="sm" />
                  </div>
                  <div class="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-gray-500">
                    <span class="flex items-center gap-1 font-mono">
                      <IdCard class="size-3" />{{ item.chassisNumber }}
                    </span>
                    <span class="flex items-center gap-1 font-mono">
                      <Hash class="size-3" />{{ item.tractorId }}
                    </span>
                  </div>
                  <div class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[9px] text-gray-400">
                    <span class="flex items-center gap-1"
                      ><UserRound class="size-3" />{{ item.technicianName }}</span
                    >
                    <span class="flex items-center gap-1"
                      ><CircleGauge class="size-3" />{{ item.totalScans }} scans</span
                    >
                    <span class="flex items-center gap-1"
                      ><CalendarClock class="size-3" />{{ item.savedAt }}</span
                    >
                  </div>
                </div>
              </div>

              <div class="flex shrink-0 items-center justify-end gap-1.5">
                <button
                  v-if="item.id !== activeTractor.id"
                  class="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-[10px] font-bold transition hover:border-blue-300 hover:text-blue-600 dark:border-[#34383f] dark:bg-[#22252a]"
                  title="Set as active tractor"
                  @click="activate(item)"
                >
                  <Check class="size-3.5" />Activate
                </button>
                <button
                  class="rounded-lg border border-gray-200 bg-white p-2 text-gray-500 transition hover:border-blue-300 hover:text-blue-600 dark:border-[#34383f] dark:bg-[#22252a]"
                  title="Edit tractor"
                  @click="edit(item)"
                >
                  <PencilLine class="size-3.5" />
                </button>
                <template v-if="deleteConfirmId === item.id">
                  <button
                    class="rounded-lg bg-red-600 px-2.5 py-2 text-[10px] font-bold text-white"
                    @click="confirmDelete(item)"
                  >
                    Confirm
                  </button>
                  <button
                    class="rounded-lg border border-gray-200 p-2 text-gray-500 dark:border-[#34383f]"
                    aria-label="Cancel delete"
                    @click="deleteConfirmId = null"
                  >
                    <X class="size-3.5" />
                  </button>
                </template>
                <button
                  v-else
                  class="rounded-lg border border-red-100 bg-white p-2 text-red-500 transition hover:border-red-300 hover:bg-red-50 dark:border-red-950 dark:bg-[#22252a]"
                  title="Delete tractor"
                  @click="deleteConfirmId = item.id"
                >
                  <Trash2 class="size-3.5" />
                </button>
              </div>
            </div>
          </article>
        </div>

        <div v-else class="grid min-h-64 place-items-center p-10 text-center">
          <div>
            <span
              class="mx-auto grid size-12 place-items-center rounded-xl bg-gray-100 text-gray-400 dark:bg-[#22252a]"
            >
              <Search class="size-5" />
            </span>
            <h3 class="mt-3 text-sm font-bold">No tractors found</h3>
            <p class="mt-1 text-xs text-gray-400">
              Try a different model, chassis, ID, or technician.
            </p>
            <button class="mt-3 text-xs font-bold text-blue-600" @click="search = ''">
              Clear search
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
