<template>
  <div class="cont max-w-screen-md mx-auto my-10 flex  flex-col items-center">

    <div v-if="user" class="max-w-full">
      <h1>YOUR PROFILE </h1>
      <FormKit type="text" label="Your name" name="name" :disabled="disableForm ? true : false" :value="user.email"
        placeholder="enter your name" />
      <FormKit type="text" label="Your number" name="phone" :disabled="disableForm ? true : false"
        :value="user.phone_number" placeholder="enter your phone number" />
      <FormKit type="text" label="city name" name="name" :disabled="disableForm ? true : false" :value="user.wilaya"
        placeholder="wilaya" />
      <FormKit type="text" label="Your adress" name="adress" :disabled="disableForm ? true : false" :value="user.adress"
        placeholder="adress" />


    </div>
    <AppButton class="max-w-min px-10 mt-5" @click="toggleForm">Edit </AppButton>

  </div>
</template>

<script setup>
const disableForm = ref(true)

const Deskree = useDeskree();
const user = ref(Deskree.user.get());

onMounted(async () => {
  const res = await Deskree.initUser();
  console.log(user?.value, Deskree.user.get().value)
})


const toggleForm = () => {
  const newUserObj = { ...user.value }
  console.log(newUserObj)
}

</script>