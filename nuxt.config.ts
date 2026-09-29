import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  srcDir: '.',
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  vite: { plugins: [tailwindcss()] },
  app: {
    head: {
      title: 'Diagnostic Cell',
      meta: [
        { name: 'description', content: 'Tractor electrical diagnostic and reporting system' },
      ],
    },
  },
  typescript: { strict: true, typeCheck: false },
})
