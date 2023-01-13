<template>

  <div class="cont max-w-screen-md mx-auto my-10 flex  flex-col items-center">

    <div v-if="user" class="min-w-full">
      <h1>YOUR PROFILE </h1>
      <FormKit type="text" label="Your name" name="name" :value="user.email" placeholder="enter your name" />
      <FormKit type="text" label="Your number" name="phone" :value="user.phone_number"
        placeholder="enter your phone number" />
      <FormKit type="text" label="city name" name="name" :value="user.wilaya" placeholder="wilaya" />
      <FormKit type="text" label="Your adress" name="adress" :value="user.adress" placeholder="adress" />


    </div>
    <div v-else>...Loading</div>
    <div class="flex gap-9">
      <AppButton class="max-w-min px-10 mt-5">save</AppButton>
      <AppButton class="max-w-min px-10 mt-5 bg-gray-400 hover:bg-gray-600 border-0"> back </AppButton>
    </div>

  </div>

</template>

<script setup>


const Deskree = useDeskree();
const userGet = Deskree.user.get();
let user = ref(null);


onMounted(async () => {
  await Deskree.loginUserUsingLocalS();
  user.value = Object.assign({}, userGet.value)
})





</script>