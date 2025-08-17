
export default defineNuxtRouteMiddleware(  (to, from) => {
  if (process.server) return;
const { t } = useI18n()
        const Deskree = useDeskree();
        const loggedInUser = computed(() => Deskree.loggedInUser.value)
        const isModOrAdmin = computed(() => loggedInUser.value?.roles.some((role) => Deskree.roles.includes(role)))

//you can use setTimeout as a solution of hydration mismatch https://github.com/nuxt/nuxt/issues/13328#issuecomment-1477062924
//but I used teh routeRules in nuxtConfig.ts to prevent the error
       
        if (!isModOrAdmin.value) {
useAlertsStore().error(t('Generic.cantAccess'))
return navigateTo('/')
        }
})