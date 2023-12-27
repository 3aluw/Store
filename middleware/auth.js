
export default defineNuxtRouteMiddleware(  async(to, from) => {
  if(process.server) return
const deskree = useDeskree();

let user = deskree.user.get();
if(user) return;
if(!user){
  await deskree.loginUserUsingLocalS();
   user = deskree.user.get();
}

//you can use setTimeout as a solution of hydration mismatch https://github.com/nuxt/nuxt/issues/13328#issuecomment-1477062924
//but I used the routeRules in nuxtConfig.ts to prevent the error

    if (!user) {
      useAlertsStore().warning("please login first")

      return navigateTo('/')
      } 

}
)