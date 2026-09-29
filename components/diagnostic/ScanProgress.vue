<script setup lang="ts">
import { Activity, Check, Loader2, OctagonX, Radio } from 'lucide-vue-next'
import { SCAN_STEPS } from '~/app/utils/mockSensorService'

const props = defineProps<{ step: number }>()
defineEmits<{ stop: [] }>()
const percent = computed(() =>
  Math.min(100, Math.round(((props.step + 1) / SCAN_STEPS.length) * 100)),
)
</script>

<template>
  <section
    class="overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-lg shadow-blue-900/5 dark:border-blue-900 dark:bg-[#1a1c1e]"
  >
    <div
      class="border-b border-blue-100 bg-blue-50/70 px-5 py-4 sm:px-6 dark:border-blue-900 dark:bg-blue-950/20"
    >
      <div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div class="flex items-center gap-3">
          <span
            class="relative grid size-11 shrink-0 place-items-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/25"
          >
            <Radio class="size-5 animate-pulse" />
            <span
              class="absolute -top-1 -right-1 size-3 rounded-full border-2 border-white bg-emerald-400"
            />
          </span>
          <div>
            <div
              class="flex items-center gap-2 text-[9px] font-black tracking-[0.16em] text-blue-600 uppercase dark:text-blue-300"
            >
              Live acquisition in progress
              <span class="size-1 animate-pulse rounded-full bg-blue-500" />
            </div>
            <h2 class="mt-0.5 text-sm font-bold sm:text-base">{{ SCAN_STEPS[step] }}</h2>
          </div>
        </div>
        <div class="flex items-center gap-3 self-end sm:self-auto">
          <div class="text-right">
            <div class="font-mono text-lg font-black text-blue-700 dark:text-blue-300">
              {{ percent }}%
            </div>
            <div class="text-[9px] text-gray-400">
              Step {{ step + 1 }} of {{ SCAN_STEPS.length }}
            </div>
          </div>
          <button
            class="flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-[10px] font-bold text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:bg-red-950/20"
            @click="$emit('stop')"
          >
            <OctagonX class="size-3.5" />Stop scan
          </button>
        </div>
      </div>
    </div>

    <div class="p-5 sm:p-6">
      <div class="relative h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-[#2a2d32]">
        <div
          class="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-300 ease-out"
          :style="{ width: `${percent}%` }"
        >
          <div class="absolute inset-0 animate-pulse bg-white/20" />
        </div>
      </div>

      <div class="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        <div
          v-for="(label, index) in SCAN_STEPS"
          :key="label"
          :class="[
            'flex min-h-14 items-center gap-2 rounded-lg border px-2.5 py-2 transition-all',
            index === step
              ? 'border-blue-300 bg-blue-50 text-blue-800 ring-2 ring-blue-500/10 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-200'
              : index < step
                ? 'border-emerald-100 bg-emerald-50/50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/20 dark:text-emerald-300'
                : 'border-gray-100 bg-gray-50/60 text-gray-400 dark:border-[#2f3238] dark:bg-[#22252a]',
          ]"
        >
          <span
            :class="[
              'grid size-6 shrink-0 place-items-center rounded-full',
              index === step
                ? 'bg-blue-600 text-white'
                : index < step
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-200 text-gray-500 dark:bg-[#34383f]',
            ]"
          >
            <Check v-if="index < step" class="size-3.5" />
            <Loader2 v-else-if="index === step" class="size-3.5 animate-spin" />
            <span v-else class="font-mono text-[9px] font-bold">{{ index + 1 }}</span>
          </span>
          <span class="line-clamp-2 text-[9px] leading-3 font-semibold">{{ label }}</span>
        </div>
      </div>

      <div
        class="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 text-[9px] text-gray-400 dark:border-[#2a2d32]"
      >
        <span class="flex items-center gap-1.5"
          ><Activity class="size-3" />Sampling sensor telemetry</span
        >
        <span class="font-mono">Do not disconnect the hardware interface</span>
      </div>
    </div>
  </section>
</template>
