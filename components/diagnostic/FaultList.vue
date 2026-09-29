<script setup lang="ts">
import type { DiagnosticFault } from '~/app/types/diagnostic'
import { AlertTriangle, CheckCircle2 } from 'lucide-vue-next'
defineProps<{ faults: DiagnosticFault[]; circuitName: string }>()
</script>
<template>
  <div
    v-if="!faults.length"
    class="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300"
  >
    <CheckCircle2 class="mt-0.5 size-5" />
    <div>
      <h2 class="text-xs font-bold uppercase">No electrical faults detected</h2>
      <p class="mt-1 text-xs">{{ circuitName }} operates within all reference parameters.</p>
    </div>
  </div>
  <section
    v-else
    class="space-y-3 rounded-xl border border-red-200 bg-white p-5 dark:border-red-900 dark:bg-[#1a1c1e]"
  >
    <h2 class="flex items-center gap-2 text-xs font-bold text-red-700 uppercase dark:text-red-300">
      <AlertTriangle class="size-4" />Detected faults ({{ faults.length }})
    </h2>
    <div
      v-for="fault in faults"
      :key="fault.id"
      class="rounded-lg border border-red-100 bg-red-50/60 p-4 dark:border-red-900 dark:bg-red-950/20"
    >
      <div class="font-bold text-red-900 dark:text-red-200">
        {{ fault.title }}
      </div>
      <p class="mt-1 text-xs text-gray-600 dark:text-gray-300">
        {{ fault.description }}
      </p>
      <ul class="mt-2 list-inside list-disc text-xs text-gray-500">
        <li v-for="cause in fault.possibleCauses" :key="cause">{{ cause }}</li>
      </ul>
    </div>
  </section>
</template>
