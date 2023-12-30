<template>
    <div class="cont flex justify-center items-center ">
        <div class="card bg-white max-w-3xl text-center p-10">
            <div class="card-actions justify-end mb-8">
                <button class="btn btn-square btn-sm" @click="emitToggleConfirmation">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <p class="text-lg">Please read the following infos carefully before placing your order:</p>

            <p class="my-5">
                <strong>Total price: </strong>
                <ProductPrice :price="cartStore.total" />
            </p>


            <div class="card-actions justify-end w-full flex-col my-10" v-if="Deskree.loggedInUser.value">
                <p> Name : {{ Deskree.loggedInUser.value.email ? Deskree.loggedInUser.value.name : "not set" }}</p>
                <p> phone number : <strong> {{
                    Deskree.loggedInUser.value.phone_number.length > 5 ?
                    Deskree.loggedInUser.value.phone_number : "not set"
                }}</strong></p>
                <p> wilaya : <strong> {{
                    Deskree.loggedInUser.value.wilaya ? Deskree.loggedInUser.value.wilaya : "not set"
                }}</strong></p>
                <p> address : <strong> {{
                    Deskree.loggedInUser.value.address ? Deskree.loggedInUser.value.address : "not set"
                }}</strong></p>
                <AppButton class="mx-5 mt-8" @click="handleOrder">place my order</AppButton>
            </div>
            <!--if guest buy-->
            <div v-else>
                <FormKit type="form" :config="{ validationVisibility: 'submit' }" :actions="false"
                    @submit="handleGuestOrder">
                    <FormKit type="text" label="full name" name="name" v-model="guestUser.name"
                        placeholder="enter your name" validation="required" />
                    <FormKit type="number" label="Your phone number" name="phone" v-model="guestUser.phone_number" required
                        validation="number|length:10,10" placeholder="enter your phone number" />
                    <FormKit type="select" label="city name" name="city" v-model="guestUser.wilaya" placeholder="wilaya"
                        required :options="cartStore.wilayas" />
                    <FormKit type="text" label="Your address" name="address" v-model="guestUser.address"
                        placeholder="address" required />
                    <AppButton class="mx-5 mt-8">place my order</AppButton>
                </FormKit>

            </div>


        </div>

    </div>
</template>
<script setup>
const cartStore = useCartStore();
const Deskree = useDeskree();

const emit = defineEmits(['toggleConformation'])
function emitToggleConfirmation() { emit('toggleConformation') }


//logged-in user logic
async function handleOrder() {
    try {
        cartStore.products.forEach(async (product) => await Deskree.orders.placeOrder(product));
        useAlertsStore().success("orders placed successfully")
        cartStore.products = [];
        await navigateTo('/')
    } catch {
        useAlertsStore().error("an error occurred. please try again or re-login")
    }
}

//Guest user logic
const guestUser = ref({
    name: '',
    phone_number: '',
    wilaya: '',
    address: '',
});
async function handleGuestOrder() {
    const productsArray = cartStore.products.map((product) => { return { productId: product.sys.id, price: product.fields.price * product.count, count: product.count } })

    const res = await $fetch('/api/guestOrder', {
        method: 'post',
        body: { user: guestUser.value, products: productsArray }
    })
}
</script>

<style scoped>
.cont {
    z-index: 20;
    position: absolute;
    background: rgba(189, 168, 168, 0.452);
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
}
</style>