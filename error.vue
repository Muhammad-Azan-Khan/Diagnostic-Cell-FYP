<script setup lang="ts">
defineProps<{ error: { statusCode?: number; message?: string } }>()
</script>

<template>
  <div class="grid min-h-screen place-items-center bg-gray-50 p-6 dark:bg-[#111315]">
    <div class="text-center">
      <div class="text-6xl font-black text-blue-600">{{ error.statusCode || 404 }}</div>
      <h1 class="mt-3 text-xl font-bold dark:text-white">Page not found</h1>
      <p class="mt-2 text-sm text-gray-500">{{ error.message }}</p>
      <NuxtLink
        to="/dashboard"
        class="mt-6 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white"
        >Back to dashboard</NuxtLink
      >
    </div>
  </div>
</template>
