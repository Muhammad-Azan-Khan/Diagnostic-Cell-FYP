<script setup lang="ts">
import type { DiagnosticSession } from '~/app/types/diagnostic'
import { Activity, Thermometer } from 'lucide-vue-next'
const props = defineProps<{ sessions: DiagnosticSession[] }>()
const kind = ref<'current' | 'temperature'>('current')
const data = computed(() =>
  props.sessions
    .slice(0, 8)
    .reverse()
    .map((s, i) => ({
      x: i,
      value: kind.value === 'current' ? s.measurements.currentA : s.measurements.temperatureC,
      label: s.circuitName,
    })),
)
const max = computed(
  () => Math.max(...data.value.map((d) => d.value), kind.value === 'current' ? 5 : 50) * 1.15,
)
const points = computed(() =>
  data.value
    .map(
      (d, i) =>
        `${data.value.length <= 1 ? 50 : (i / (data.value.length - 1)) * 100},${90 - (d.value / max.value) * 75}`,
    )
    .join(' '),
)
</script>
<template>
  <section
    class="h-full rounded-xl border border-gray-200 bg-white p-5 shadow-xs dark:border-[#2a2d32] dark:bg-[#1a1c1e]"
  >
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-xs font-bold tracking-wider uppercase">Diagnostic Trend</h2>
      <div class="flex rounded-lg bg-gray-100 p-0.5 dark:bg-[#25282d]">
        <button
          v-for="option in ['current', 'temperature'] as const"
          :key="option"
          :class="[
            'rounded-md px-2 py-1 text-[10px] font-semibold capitalize',
            kind === option ? 'bg-white text-blue-600 shadow dark:bg-[#34383f]' : 'text-gray-500',
          ]"
          @click="kind = option"
        >
          <component
            :is="option === 'current' ? Activity : Thermometer"
            class="mr-1 inline size-3"
          />{{ option }}
        </button>
      </div>
    </div>
    <div v-if="data.length" class="relative h-48 rounded-lg bg-gray-50 p-3 dark:bg-[#22252a]">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" class="h-full w-full overflow-visible">
        <line
          v-for="y in [15, 40, 65, 90]"
          :key="y"
          x1="0"
          :y1="y"
          x2="100"
          :y2="y"
          stroke="currentColor"
          class="text-gray-200 dark:text-gray-700"
          stroke-width=".5"
        />
        <polyline
          :points="points"
          fill="none"
          stroke="#2563eb"
          stroke-width="2"
          vector-effect="non-scaling-stroke"
        />
        <circle
          v-for="(d, i) in data"
          :key="i"
          :cx="data.length <= 1 ? 50 : (i / (data.length - 1)) * 100"
          :cy="90 - (d.value / max) * 75"
          r="1.5"
          fill="#2563eb"
        />
      </svg>
      <div
        class="absolute right-3 bottom-2 left-3 flex justify-between font-mono text-[9px] text-gray-400"
      >
        <span v-for="(d, i) in data" :key="i" class="max-w-12 truncate">{{ d.label }}</span>
      </div>
    </div>
    <div v-else class="grid h-48 place-items-center text-xs text-gray-400">No scan data yet</div>
  </section>
</template>
