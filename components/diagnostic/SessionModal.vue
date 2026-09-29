<script setup lang="ts">
import { X, Printer, FileText, Zap, AlertTriangle, CheckCircle2 } from 'lucide-vue-next'
const { selectedSessionForModal, setSelectedSessionForModal } = useDiagnostic()
function openReport() {
  const id = selectedSessionForModal.value?.id
  setSelectedSessionForModal(null)
  if (id) navigateTo(`/reports?sessionId=${id}`)
}
function printReport() {
  if (import.meta.client) window.print()
}
</script>
<template>
  <Teleport to="body"
    ><div
      v-if="selectedSessionForModal"
      class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-xs"
      @click.self="setSelectedSessionForModal(null)"
    >
      <div
        class="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-[#2a2d32] dark:bg-[#1a1c1e]"
      >
        <div
          class="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-6 py-4 dark:border-[#2a2d32] dark:bg-[#22252a]"
        >
          <div class="flex items-center gap-3">
            <span class="grid size-8 place-items-center rounded-lg bg-blue-50 text-blue-600"
              ><Zap class="size-4"
            /></span>
            <div>
              <h2 class="flex items-center gap-2 text-sm font-bold">
                <span>{{ selectedSessionForModal.circuitName }} Diagnostic Results</span
                ><CommonStatusBadge :status="selectedSessionForModal.overallStatus" size="sm" />
              </h2>
              <p class="font-mono text-[11px] text-gray-400">{{ selectedSessionForModal.id }}</p>
            </div>
          </div>
          <button @click="setSelectedSessionForModal(null)"><X class="size-4" /></button>
        </div>
        <div class="space-y-5 overflow-y-auto p-6">
          <div
            class="grid grid-cols-2 gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3.5 text-xs sm:grid-cols-4 dark:border-[#2f3238] dark:bg-[#22252a]"
          >
            <div>
              <span class="block text-[10px] text-gray-400 uppercase">Tractor</span
              ><b>{{ selectedSessionForModal.tractorModel }}</b>
            </div>
            <div>
              <span class="block text-[10px] text-gray-400 uppercase">Chassis</span
              ><b class="font-mono">{{ selectedSessionForModal.chassisNumber }}</b>
            </div>
            <div>
              <span class="block text-[10px] text-gray-400 uppercase">Technician</span
              ><b>{{ selectedSessionForModal.technicianName }}</b>
            </div>
            <div>
              <span class="block text-[10px] text-gray-400 uppercase">Date</span
              ><b>{{ selectedSessionForModal.formattedDate }}</b>
            </div>
          </div>
          <DiagnosticResultsTable
            :results="selectedSessionForModal.testResults"
            :circuit-name="selectedSessionForModal.circuitName"
          /><DiagnosticFaultList
            :faults="selectedSessionForModal.faults"
            :circuit-name="selectedSessionForModal.circuitName"
          />
        </div>
        <div
          class="flex justify-between border-t border-gray-100 bg-gray-50 px-6 py-3.5 dark:border-[#2a2d32] dark:bg-[#22252a]"
        >
          <button
            class="rounded-lg px-3.5 py-1.5 text-xs font-semibold"
            @click="setSelectedSessionForModal(null)"
          >
            Close
          </button>
          <div class="flex gap-2">
            <button
              class="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold dark:bg-[#1a1c1e]"
              @click="printReport"
            >
              <Printer class="size-3.5" />Print</button
            ><button
              class="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white"
              @click="openReport"
            >
              <FileText class="size-3.5" />Full Report
            </button>
          </div>
        </div>
      </div>
    </div></Teleport
  >
</template>
