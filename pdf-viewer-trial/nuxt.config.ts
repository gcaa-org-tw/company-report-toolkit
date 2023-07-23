import ViteYaml from '@modyfi/vite-plugin-yaml';
// https://nuxt.com/docs/api/configuration/nuxt-config

const PDFJS_BASE = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.14.305'

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/eslint-module'
  ],
  css: [
    'tachyons/css/tachyons.css'
  ],
  app: {
    head: {
      script: [
        // load in global scope to avoid pdf.js init error
        { hid: 'pdf-js', src: `${PDFJS_BASE}/build/pdf.js` },
        { hid: 'pdf-viewer-js', src: `${PDFJS_BASE}/web/pdf_viewer.js` }
      ]
    }
  },
  vite: {
    plugins: [
      ViteYaml()
    ]
  }
})
