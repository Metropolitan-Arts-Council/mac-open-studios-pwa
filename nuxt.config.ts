// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  ssr: true,
  modules: ['@pinia/nuxt', "@vite-pwa/nuxt", '@nuxt/scripts'],
  scripts: {
    registry: {
      googleTagManager: {
        id: 'GTM-PJFMQD2C'
      }
    }
  },

  alias: {
    pinia: "/node_modules/@pinia/nuxt/node_modules/pinia/dist/pinia.mjs"
  },

  runtimeConfig: {
    public: {
      apiDomain: 'https://www.greenvillearts.com',
      apiArtists: '/wp-json/artists-api/v1/artists',
      apiPages: '',
      googleMapsKey: '',
      vapidKey: '',
      apiNotificationsPush: '',
      apiNotificationsEmail: '',
    }
  },

  app: {
    head: {
      viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
    },
  },

  pwa: {
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 20,
    },
    filename: 'service-worker.ts',
    strategies: 'injectManifest',
    registerType: 'prompt',
    manifest: {
      name: 'Greenville Arts',
      short_name: 'Greenville Arts',
      description: 'Openstudios',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      start_url: '/',
      scope: '/',
      display: 'standalone',
      icons: [
        {
          src: "/img/icons/favicon-32x32.png",
          sizes: "32x32",
          type: "image/png"
        },
        {
          src: "/img/icons/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png"
        },
        {
          src: "/img/icons/android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png"
        },
      ],
    },
    injectManifest: {
      globPatterns: [
        '**/*.{js,css,html,png,jpg,jpeg,json,svg,ttf,otf}',
      ],
    },
    devOptions: {
      enabled: false,
      type: 'module',
    }
  },
})