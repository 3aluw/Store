<template>

  <div class="cont max-w-screen-md mx-auto my-10 flex  flex-col items-center">

    <div v-if="user" class="min-w-full">
      <h1>YOUR PROFILE </h1>
      <FormKit type="form" :config="{ validationVisibility: 'submit' }" @submit="handleSubmit" :actions="false">
        <FormKit type="text" label="full name" name="name" v-model="user.name" placeholder="enter your name"
          validation="required" />
        <FormKit type="number" label="Your phone number" name="phone" v-model="user.phone_number" required
          validation="number|length:10,10" placeholder="enter your phone number" />
        <FormKit type="select" label="city name" name="city" v-model="user.wilaya" placeholder="wilaya" required
          :options="wilayas" />
        <FormKit type="text" label="Your address" name="address" v-model="user.address" placeholder="address"
          required />

        <AppButton class="max-w-min px-10 mt-5">save</AppButton>

      </FormKit>
      <AppButton class="max-w-min px-10 mt-5 bg-gray-400 hover:bg-gray-600 border-0"> back </AppButton>
    </div>

    <div v-else>...Loading</div>


  </div>

</template>

<script setup>


const Deskree = useDeskree();
const userGet = Deskree.user.get();
const CartStore = useCartStore();
const wilayas = CartStore.wilayas;

let user = ref(null);


onMounted(async () => {
  await Deskree.loginUserUsingLocalS();
  user.value = Object.assign({}, userGet.value);

})

function handleSubmit() {
  Deskree.user.updateUser(user.value)
}




</script>