<script setup lang="ts">
import { Check, CheckCircle2, Moon, Palette, Save, Settings, Sun, UserRound } from 'lucide-vue-next'

const { settings, updateSettings } = useDiagnostic()
const technicianName = ref(settings.value.technicianName)
const error = ref('')
const saved = ref(false)
let toastTimer: number | undefined

watch(
  () => settings.value.technicianName,
  (value) => {
    technicianName.value = value
  },
)

function selectTheme(theme: 'light' | 'dark') {
  updateSettings({ theme })
}

function saveProfile() {
  const name = technicianName.value.trim()
  if (!name) {
    error.value = 'Technician name is required.'
    return
  }
  error.value = ''
  updateSettings({ technicianName: name })
  saved.value = true
  if (toastTimer) window.clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => {
    saved.value = false
  }, 3500)
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
            <Settings class="size-3.5" />Workspace preferences
          </div>
          <h1 class="text-2xl font-black tracking-tight sm:text-3xl">Application Settings</h1>
          <p class="mt-2 max-w-xl text-sm leading-6 text-slate-400">
            Personalize the diagnostic workspace and maintain the technician identity used across
            vehicle profiles and inspection records.
          </p>
        </div>

        <div class="grid grid-cols-2 gap-2 sm:min-w-sm">
          <div class="rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
            <div class="flex items-center gap-1.5 text-[9px] font-bold text-slate-500 uppercase">
              <Palette class="size-3" />Appearance
            </div>
            <div class="mt-1 text-sm font-black text-slate-100 capitalize">
              {{ settings.theme }} mode
            </div>
          </div>
          <div class="rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
            <div class="flex items-center gap-1.5 text-[9px] font-bold text-slate-500 uppercase">
              <UserRound class="size-3" />Operator
            </div>
            <div class="mt-1 truncate text-sm font-black text-slate-100">
              {{ settings.technicianName }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <Transition
      enter-active-class="transition duration-200"
      enter-from-class="-translate-y-2 opacity-0"
      leave-active-class="transition duration-150"
      leave-to-class="-translate-y-2 opacity-0"
    >
      <div
        v-if="saved"
        class="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300"
      >
        <CheckCircle2 class="size-4" />Settings saved successfully.
      </div>
    </Transition>

    <div class="grid gap-6 xl:grid-cols-12">
      <section
        class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm xl:col-span-7 dark:border-[#2a2d32] dark:bg-[#1a1c1e]"
      >
        <header
          class="flex items-center gap-3 border-b border-gray-100 bg-gray-50/70 p-5 dark:border-[#2a2d32] dark:bg-[#202226]"
        >
          <span class="grid size-10 place-items-center rounded-xl bg-blue-600 text-white">
            <Palette class="size-4" />
          </span>
          <div>
            <h2 class="text-sm font-black">Appearance</h2>
            <p class="text-[11px] text-gray-400">Choose the interface that suits your workspace</p>
          </div>
        </header>

        <div class="p-5 sm:p-6">
          <div class="grid gap-4 sm:grid-cols-2">
            <button
              v-for="option in [
                {
                  value: 'light' as const,
                  label: 'Light mode',
                  description: 'Bright, clean and optimized for daylight.',
                  icon: Sun,
                },
                {
                  value: 'dark' as const,
                  label: 'Dark mode',
                  description: 'Low-glare interface for dim workshops.',
                  icon: Moon,
                },
              ]"
              :key="option.value"
              class="group relative overflow-hidden rounded-2xl border-2 p-1 text-left transition"
              :class="
                settings.theme === option.value
                  ? 'border-blue-600 shadow-lg shadow-blue-600/10'
                  : 'border-gray-200 hover:border-blue-300 dark:border-[#34383f]'
              "
              @click="selectTheme(option.value)"
            >
              <div
                :class="[
                  'h-36 overflow-hidden rounded-xl border p-3',
                  option.value === 'light'
                    ? 'border-gray-200 bg-gray-100'
                    : 'border-slate-700 bg-slate-950',
                ]"
              >
                <div
                  :class="[
                    'flex h-full overflow-hidden rounded-lg border shadow-sm',
                    option.value === 'light'
                      ? 'border-gray-200 bg-white'
                      : 'border-slate-700 bg-slate-900',
                  ]"
                >
                  <div
                    :class="[
                      'w-10 border-r p-2',
                      option.value === 'light'
                        ? 'border-gray-200 bg-slate-950'
                        : 'border-slate-700 bg-slate-950',
                    ]"
                  >
                    <div class="size-3 rounded bg-blue-500" />
                    <div class="mt-4 space-y-2">
                      <div class="h-1 rounded bg-slate-600" />
                      <div class="h-1 rounded bg-slate-700" />
                      <div class="h-1 rounded bg-slate-700" />
                    </div>
                  </div>
                  <div class="flex-1 p-2.5">
                    <div class="h-6 rounded bg-blue-600" />
                    <div class="mt-2 grid grid-cols-3 gap-1.5">
                      <div
                        v-for="index in 3"
                        :key="index"
                        :class="[
                          'h-8 rounded border',
                          option.value === 'light'
                            ? 'border-gray-200 bg-gray-50'
                            : 'border-slate-700 bg-slate-800',
                        ]"
                      />
                    </div>
                    <div
                      :class="[
                        'mt-2 h-7 rounded border',
                        option.value === 'light'
                          ? 'border-gray-200 bg-gray-50'
                          : 'border-slate-700 bg-slate-800',
                      ]"
                    />
                  </div>
                </div>
              </div>
              <div class="flex items-start gap-3 px-3 py-4">
                <span
                  :class="[
                    'grid size-9 shrink-0 place-items-center rounded-lg',
                    settings.theme === option.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-500 dark:bg-[#292c31]',
                  ]"
                >
                  <component :is="option.icon" class="size-4" />
                </span>
                <div class="min-w-0 flex-1">
                  <div class="text-sm font-black">{{ option.label }}</div>
                  <p class="mt-1 text-[11px] leading-5 text-gray-400">{{ option.description }}</p>
                </div>
                <span
                  v-if="settings.theme === option.value"
                  class="grid size-5 place-items-center rounded-full bg-blue-600 text-white"
                >
                  <Check class="size-3" />
                </span>
              </div>
            </button>
          </div>

          <div
            class="mt-5 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/60 p-4 dark:border-blue-950 dark:bg-blue-950/20"
          >
            <Sun v-if="settings.theme === 'light'" class="mt-0.5 size-4 shrink-0 text-blue-600" />
            <Moon v-else class="mt-0.5 size-4 shrink-0 text-blue-400" />
            <p class="text-[11px] leading-5 text-gray-600 dark:text-gray-300">
              <strong class="font-black capitalize">{{ settings.theme }} mode is active.</strong>
              Your appearance preference is applied immediately and remembered on this device.
            </p>
          </div>
        </div>
      </section>

      <section
        class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm xl:col-span-5 dark:border-[#2a2d32] dark:bg-[#1a1c1e]"
      >
        <header
          class="flex items-center gap-3 border-b border-gray-100 bg-gray-50/70 p-5 dark:border-[#2a2d32] dark:bg-[#202226]"
        >
          <span class="grid size-10 place-items-center rounded-xl bg-violet-600 text-white">
            <UserRound class="size-4" />
          </span>
          <div>
            <h2 class="text-sm font-black">Operator identity</h2>
            <p class="text-[11px] text-gray-400">Default technician for new records</p>
          </div>
        </header>

        <form class="flex h-[calc(100%-81px)] flex-col p-5 sm:p-6" @submit.prevent="saveProfile">
          <div
            class="mb-6 flex items-center gap-4 rounded-xl border border-gray-200 bg-gray-50/70 p-4 dark:border-[#30343a] dark:bg-[#202226]"
          >
            <span
              class="grid size-12 shrink-0 place-items-center rounded-xl bg-slate-950 text-lg font-black text-blue-400 dark:bg-blue-600 dark:text-white"
            >
              {{ (technicianName.trim()[0] || 'T').toUpperCase() }}
            </span>
            <div class="min-w-0">
              <div class="truncate text-sm font-black">{{ technicianName || 'Technician' }}</div>
              <div class="mt-1 text-[10px] text-gray-400">Diagnostic workstation operator</div>
            </div>
          </div>

          <label class="block">
            <span class="mb-2 block text-[10px] font-black tracking-wide text-gray-500 uppercase">
              Technician name
            </span>
            <div class="relative">
              <UserRound class="absolute top-3.5 left-3 size-4 text-gray-400" />
              <input
                v-model="technicianName"
                class="h-11 w-full rounded-lg border bg-white pr-3 pl-10 text-sm font-semibold transition outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 dark:bg-[#202226]"
                :class="error ? 'border-red-400' : 'border-gray-200 dark:border-[#34383f]'"
                autocomplete="name"
                placeholder="Enter technician name"
                @input="error = ''"
              />
            </div>
            <span v-if="error" class="mt-1.5 block text-[10px] font-semibold text-red-600">{{
              error
            }}</span>
            <span v-else class="mt-1.5 block text-[10px] leading-4 text-gray-400">
              This name is prefilled when registering tractors and appears on future reports.
            </span>
          </label>

          <div class="mt-auto pt-8">
            <div class="mb-4 border-t border-gray-100 pt-4 dark:border-[#30343a]">
              <div class="flex items-center justify-between text-[10px]">
                <span class="text-gray-400">Current saved operator</span>
                <span class="max-w-52 truncate font-bold">{{ settings.technicianName }}</span>
              </div>
            </div>
            <button
              type="submit"
              class="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 text-xs font-black text-white shadow-lg shadow-blue-600/15 transition hover:bg-blue-700"
            >
              <Save class="size-4" />Save operator profile
            </button>
          </div>
        </form>
      </section>
    </div>
  </div>
</template>
