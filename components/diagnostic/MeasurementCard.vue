<script setup lang="ts">
import type { Component } from 'vue'
import type { TestResultStatus } from '~/app/types/diagnostic'
const props = defineProps<{
  title: string
  value: string
  unit: string
  expected: string
  status: TestResultStatus
  icon: Component
  description?: string
}>()
const color = computed(() =>
  props.status === 'PASS'
    ? 'bg-emerald-500'
    : props.status === 'WARNING'
      ? 'bg-amber-500'
      : 'bg-red-500',
)
</script>
<template>
  <div
    class="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-xs sm:p-5 dark:border-[#2a2d32] dark:bg-[#1a1c1e]"
  >
    <div>
      <div class="mb-3 flex items-start justify-between">
        <div class="flex items-center gap-2">
          <span
            class="rounded-lg border border-gray-100 bg-gray-50 p-2 dark:border-[#2f3238] dark:bg-[#25282d]"
            ><component :is="icon" class="size-4 text-blue-600"
          /></span>
          <div>
            <span class="block text-xs font-semibold text-gray-500">{{ title }}</span
            ><span class="font-mono text-[10px] text-gray-400">Ref: {{ expected }}</span>
          </div>
        </div>
        <CommonStatusBadge :status="status" size="sm" />
      </div>
      <div class="flex items-baseline gap-1">
        <span class="font-mono text-3xl font-bold tracking-tight dark:text-white">{{ value }}</span
        ><span class="text-sm text-gray-400">{{ unit }}</span>
      </div>
      <div class="mt-3 h-1 overflow-hidden rounded bg-gray-100 dark:bg-[#2a2d32]">
        <div :class="['h-full w-full', color]" />
      </div>
    </div>
    <div
      v-if="description"
      class="mt-2.5 truncate border-t border-gray-100 pt-2.5 font-mono text-[10px] text-gray-400 dark:border-[#25282d]"
    >
      {{ description }}
    </div>
  </div>
</template>
