<script setup lang="ts">
import { Cpu, Zap, Activity, Thermometer, Cable, Wifi } from 'lucide-vue-next'
const { hardwareStatus } = useDiagnostic()
const items = computed(() => [
  { label: 'ESP32 Controller', online: hardwareStatus.value.esp32, icon: Cpu },
  { label: 'Voltage Sensor', online: hardwareStatus.value.voltageSensor, icon: Zap },
  { label: 'Current Sensor', online: hardwareStatus.value.currentSensor, icon: Activity },
  { label: 'Temperature Probe', online: hardwareStatus.value.tempSensor, icon: Thermometer },
  { label: 'Continuity Module', online: hardwareStatus.value.continuityModule, icon: Cable },
])
</script>
<template>
  <section
    class="rounded-xl border border-gray-200 bg-white p-4 shadow-xs sm:p-5 dark:border-[#2a2d32] dark:bg-[#1a1c1e]"
  >
    <div class="mb-4 flex items-center justify-between">
      <h2 class="flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
        <Wifi class="size-4 text-blue-600" />Telemetry Hardware Status
      </h2>
      <span class="font-mono text-[10px] text-gray-400"
        >{{ hardwareStatus.comPort }} · {{ hardwareStatus.baudRate }} baud</span
      >
    </div>
    <div class="grid grid-cols-2 gap-3 md:grid-cols-5">
      <div
        v-for="item in items"
        :key="item.label"
        class="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-[#2f3238] dark:bg-[#22252a]"
      >
        <component :is="item.icon" class="size-4 text-gray-500" />
        <div>
          <div class="text-[11px] font-semibold">{{ item.label }}</div>
          <div
            :class="['text-[10px] font-bold', item.online ? 'text-emerald-600' : 'text-red-600']"
          >
            ● {{ item.online ? 'ONLINE' : 'OFFLINE' }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
