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
        <FormKit type="text" label="Your address" name="address" v-model="user.address" placeholder="address" required />

        <AppButton class="max-w-min px-10 mt-5" :loading="loading">save</AppButton>

      </FormKit>
      <AppButton class="max-w-min px-10 mt-5 bg-gray-400 hover:bg-gray-600 border-0" @click.prevent="$router.back()">
        back </AppButton>
    </div>

    <div v-else>...Loading</div>


  </div>
</template>

<script setup>


const Deskree = useDeskree();

const CartStore = useCartStore();
const wilayas = CartStore.wilayas;

let user = ref(null);
let loading = ref(false)



onMounted(() => {
  //update the user object if the user signed up
  if (Deskree.user.get()) { user.value = Object.assign({}, Deskree.user.get()); }
  //if there is no user redirect to login page
  else if (user.value === null) { return navigateTo("/login") }

})




async function handleSubmit() {
  loading.value = true
  try {
    await Deskree.user.updateUser(user.value)
    useAlertsStore().success("your infos has been updated")
    useRouter().push("/")
  }
  catch {
    useAlertsStore().error("changes didn't take effect")
  }
  finally {
    loading.value = false
  }
}




</script>