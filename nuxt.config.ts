//requireEnvVars();


// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  css: ["~/assets/main.css", "@formkit/themes/genesis"],
  routeRules: {
    "/admin": { ssr: false },
    "/cart": { ssr: false },
    "/profile": { ssr: false },
  },
  imports: {
    dirs: ["stores"],
  },
  modules: [
    "@formkit/nuxt",
    '@nuxtjs/i18n',


    [
      "@pinia/nuxt",
      {
        autoImports: ["defineStore", "acceptHMRUpdate"],
      },
    ],
  ],
  i18n: {
    strategy: 'no_prefix',
    locales: [
      {
        code: 'en',
        name: 'English',
        iso: 'en-US',
        file: 'en-US.ts',
        dir: "ltr"
      },
      {
        code: 'ar',
        name: 'Arabic',
        iso: 'ar-SA',
        file: 'ar.ts',
        dir: "rtl",

      }
    ],
    lazy: true,
    langDir: 'lang',


  },
  runtimeConfig: {
    stripeSecret: process.env.STRIPE_SECRET,
    public: {
      contentfulSpace: process.env.NUXT_CONTENTFUL_SPACE,
      contentfulCMAccessToken: process.env.NUXT_CONTENTFUL_CM_ACCESS_TOKEN,
      contentfulPublicAccessToken: process.env.NUXT_CONTENTFUL_PUBLIC_ACCESS_TOKEN,
      deskreeBaseUrl: process.env.NUXT_DESKREE_BASE_URL,
    },
  },
  build: {
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

});

/*
function requireEnvVars() {
  const map = {
    "Deskree Project URL": process.env.NUXT_DESKREE_BASE_URL,
    "Stripe secret token": process.env.STRIPE_SECRET,
  };
  let ready = true;
  for (const label in map) {
    if (!map[label]) {
      ready = false;
      console.error(
        `You must provide a ${label} in .env to start the project (see the Setup Guide for more instructions: https://vueschool.notion.site/Preparation-Guide-cf256a7352704d27bb7946c47907d40e)`
      );
    }
  }

  if (!ready) process.exit();
}
*/