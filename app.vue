<template>
  <div>
    <NuxtLoadingIndicator color="#f04f43" />
    <TheNavbar />
    <NuxtLayout>
      <NuxtPage v-if="loadPage" />
    </NuxtLayout>
    <TheAlerts />
  </div>
</template>
<script setup>
const Deskree = useDeskree();
const route = useRoute();

const isLoginCompleted = ref(false)

const routesNeedsLogin = ["/user", "/cart", "/admin"]

//check the route and if it needs to await the login in onMounted
const loadPage = computed(() => {
  if (!routesNeedsLogin.find((routeName) => route.fullPath.includes(routeName))) return true;
  else { return isLoginCompleted.value === true ? true : false }
})


onMounted(async () => {

  await Deskree.loginUserUsingLocalS();
  isLoginCompleted.value = true
console.log("user logged in", isLoginCompleted.value );
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
