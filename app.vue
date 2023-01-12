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

onMounted(() => {
  Deskree.loginUserUsingLocalS();

})
</script>
