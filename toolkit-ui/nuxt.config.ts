import ViteYaml from '@modyfi/vite-plugin-yaml'

// https://nuxt.com/docs/api/configuration/nuxt-config

const PDFJS_BASE = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.9.179'

export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/eslint-module',
    '@vueuse/nuxt',
    'nuxt-snackbar'
  ],
  css: [
    'tachyons/css/tachyons.css',
    '@fortawesome/fontawesome-free/css/all.css'
  ],
  app: {
    head: {
      title: '工人智慧補完計畫 | 透明足跡',
      script: [
        // load in global scope to avoid pdf.js init error
        { hid: 'pdf-js', src: `${PDFJS_BASE}/build/pdf.js` },
        { hid: 'pdf-viewer-js', src: `${PDFJS_BASE}/web/pdf_viewer.js` }
      ]
    }
  },
  snackbar: {
    bottom: true,
    duration: 5000
  },
  vite: {
    plugins: [
      ViteYaml()
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/assets/variables.scss";'
        }
      }
    }
  },
  runtimeConfig: {
    public: {
      // for pdf search
      algoliaAppId: '',
      algoliaSearchApiKey: '',
      algoliaIndexName: '',

      // for crowd source
      airtableBase: '',
      airtableKey: '',

      // for profession login
      auth0Domain: '',
      auth0ClientId: '',
      apiEndpoint: ''
    }
  }
})
