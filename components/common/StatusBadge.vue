<script setup lang="ts">
import { CheckCircle2, AlertTriangle, XCircle, CircleHelp } from 'lucide-vue-next'

const props = withDefaults(defineProps<{ status: string; size?: 'sm' | 'md' }>(), { size: 'md' })
const normalized = computed(() => props.status.toUpperCase())
const config = computed(
  () =>
    ({
      PASS: {
        icon: CheckCircle2,
        label: 'Pass',
        css: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
      },
      WARNING: {
        icon: AlertTriangle,
        label: 'Warning',
        css: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
      },
      FAIL: {
        icon: XCircle,
        label: 'Fail',
        css: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800',
      },
    })[normalized.value] || {
      icon: CircleHelp,
      label: props.status,
      css: 'bg-gray-50 text-gray-600 border-gray-200',
    },
)
</script>

<template>
  <span
    :class="[
      'inline-flex items-center rounded-md border font-bold tracking-wide uppercase',
      config.css,
      size === 'sm' ? 'gap-1 px-1.5 py-0.5 text-[9px]' : 'gap-1.5 px-2 py-1 text-[10px]',
    ]"
  >
    <component :is="config.icon" :class="size === 'sm' ? 'size-3' : 'size-3.5'" />{{ config.label }}
  </span>
</template>
