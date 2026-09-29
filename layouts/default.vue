<script setup lang="ts">
const mobileOpen = ref(false)
const { hydrate } = useDiagnostic()
onMounted(hydrate)
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-[#f8f9fa] dark:bg-[#121316]">
    <div class="hidden lg:block"><LayoutAppSidebar /></div>
    <Teleport to="body"
      ><div v-if="mobileOpen" class="fixed inset-0 z-40 lg:hidden">
        <button
          class="absolute inset-0 bg-black/50"
          aria-label="Close menu"
          @click="mobileOpen = false"
        />
        <div class="relative h-full w-64">
          <LayoutAppSidebar mobile @close="mobileOpen = false" />
        </div></div
    ></Teleport>
    <div class="flex min-w-0 flex-1 flex-col">
      <LayoutAppHeader @menu="mobileOpen = true" />
      <main class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div class="mx-auto max-w-7xl"><slot /></div>
      </main>
    </div>
    <DiagnosticSessionModal />
  </div>
</template>
