<script setup lang="ts">
import type { TestMetricResult } from '~/app/types/diagnostic'
defineProps<{ results: TestMetricResult[]; circuitName: string }>()
</script>
<template>
  <section
    class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs dark:border-[#2a2d32] dark:bg-[#1a1c1e]"
  >
    <div
      class="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-5 py-3.5 dark:border-[#2f3238] dark:bg-[#22252a]"
    >
      <div>
        <h2 class="text-xs font-bold tracking-wider uppercase">
          Electrical Diagnostic Test Parameters
        </h2>
        <p class="text-[11px] text-gray-400">Automated sensor acquisitions for {{ circuitName }}</p>
      </div>
      <span class="font-mono text-[10px] text-gray-500">{{ results.length }} PARAMETERS</span>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs">
        <thead
          class="border-b border-gray-200 bg-gray-50 text-[10px] text-gray-500 uppercase dark:border-[#2f3238] dark:bg-[#22252a]"
        >
          <tr>
            <th class="p-3">Parameter</th>
            <th class="p-3">Expected</th>
            <th class="p-3">Measured</th>
            <th class="p-3 text-center">Status</th>
            <th class="p-3">Notes</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-[#25282d]">
          <tr v-for="result in results" :key="result.testName">
            <td class="p-3 font-semibold">{{ result.testName }}</td>
            <td class="p-3 font-mono text-gray-500">{{ result.expectedValue }}</td>
            <td class="p-3 font-mono font-bold">{{ result.measuredValue }}</td>
            <td class="p-3 text-center"><CommonStatusBadge :status="result.status" size="sm" /></td>
            <td class="p-3 text-gray-500">{{ result.notes || '—' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
