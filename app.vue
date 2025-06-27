<template>
  <div>
    <NuxtLoadingIndicator color="#f04f43" />
    <TheNavbar />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <TheAlerts />
  </div>
</template>
<script setup>
const Deskree = useDeskree();
const productStore = useProductStore();
//start listening to locale changes in products store
productStore.initLocaleListener()

/*
const routesNeedsLogin = ["/user", "/cart", "/admin"]

//check the route and if it needs to await the login in onMounted
const loadPage = computed(() => {
  if (!routesNeedsLogin.find((routeName) => route.fullPath.includes(routeName))) return true;
  else { return isLoginCompleted.value === true ? true : false }
})
*/

onMounted(async () => {
  await Deskree.loginUserUsingLocalS();

})
</script>
<style>
@media (max-width:640px) {
  html {
    font-size: 14px;
  }
}

html {
  scroll-behavior: smooth;
}
</style>
