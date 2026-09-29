<script setup lang="ts">
import { Activity, Cable, Gauge, Info, Shield, Zap } from 'lucide-vue-next'
import type { CircuitReference } from '~/app/types/diagnostic'

defineProps<{ reference: CircuitReference }>()
</script>

<template>
  <section
    class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-[#2a2d32] dark:bg-[#1a1c1e]"
  >
    <div
      class="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-700 px-5 py-5 text-white"
    >
      <div class="absolute -top-12 -right-8 size-32 rounded-full bg-white/10" />
      <div class="relative">
        <div class="mb-2 flex items-center justify-between">
          <span class="text-[9px] font-black tracking-[0.18em] text-blue-100 uppercase">
            Engineering reference
          </span>
          <span
            class="rounded-md border border-white/20 bg-white/10 px-2 py-0.5 font-mono text-[9px]"
          >
            12V DC
          </span>
        </div>
        <h2 class="text-xl font-black tracking-tight">{{ reference.name }}</h2>
        <p class="mt-1 text-[11px] leading-5 text-blue-100">{{ reference.description }}</p>
      </div>
    </div>

    <div class="p-5">
      <div class="grid grid-cols-2 gap-2.5">
        <div
          v-for="item in [
            { label: 'Rated power', value: `${reference.powerW}`, unit: 'W', icon: Zap },
            {
              label: 'Nominal current',
              value: reference.currentA.toFixed(2),
              unit: 'A',
              icon: Activity,
            },
            {
              label: 'Load resistance',
              value: reference.resistanceOhm.toFixed(2),
              unit: 'Ω',
              icon: Gauge,
            },
            {
              label: 'Fuse rating',
              value: reference.fuseRatingA.toFixed(2),
              unit: 'A',
              icon: Shield,
            },
          ]"
          :key="item.label"
          class="rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-[#2f3238] dark:bg-[#22252a]"
        >
          <div class="flex items-center justify-between">
            <component :is="item.icon" class="size-3.5 text-blue-600 dark:text-blue-400" />
            <span class="text-[8px] font-bold text-gray-400 uppercase">Nominal</span>
          </div>
          <div class="mt-2 flex items-baseline gap-1">
            <span class="font-mono text-lg font-black tracking-tight">{{ item.value }}</span>
            <span class="font-mono text-[10px] font-bold text-gray-400">{{ item.unit }}</span>
          </div>
          <div class="mt-0.5 text-[9px] font-semibold text-gray-500">{{ item.label }}</div>
        </div>
      </div>

      <div class="mt-3 space-y-2 rounded-xl border border-gray-100 p-3 dark:border-[#2f3238]">
        <div class="flex items-center justify-between text-[10px]">
          <span class="flex items-center gap-1.5 text-gray-400">
            <Cable class="size-3.5" />Wire identification
          </span>
          <span class="font-semibold">{{ reference.nominalWireColor || 'Not specified' }}</span>
        </div>
        <div
          class="flex items-center justify-between border-t border-gray-100 pt-2 text-[10px] dark:border-[#2f3238]"
        >
          <span class="flex items-center gap-1.5 text-gray-400">
            <Shield class="size-3.5" />Protection type
          </span>
          <span class="max-w-40 truncate font-semibold">{{ reference.fuseType }}</span>
        </div>
      </div>

      <div
        class="mt-3 flex items-start gap-2 rounded-lg bg-blue-50 p-2.5 text-[9px] leading-4 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300"
      >
        <Info class="mt-0.5 size-3.5 shrink-0" />
        Fuse specification uses the engineering rule I<sub>fuse</sub> = 1.25 × I<sub>load</sub>.
      </div>
    </div>
  </section>
</template>
