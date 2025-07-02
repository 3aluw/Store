<template>
    <div class="cont flex justify-center items-center ">
        <div class="card bg-white max-w-3xl text-center p-10">
            <div class="card-actions justify-end mb-8">
                <button class="btn btn-square btn-sm" @click="emitHideConfirmation">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <p class="text-lg">{{ $t('CheckoutConfirmation.disclaimer') }}</p>

            <p class="my-5">
                {{ $t('CheckoutConfirmation.totalPrice') }}
                <strong>
                    <ProductPrice :price="cartStore.total" />
                </strong>
            </p>


            <div class="card-actions gap-4 justify-end items-center w-full flex-col my-10"
                v-if="Deskree.loggedInUser.value">
                <p> {{ $t('UserInfo.name') }} :<strong> {{ Deskree.loggedInUser.value.email ?
                    Deskree.loggedInUser.value.name : "not set"
                        }}</strong></p>
                <p> {{ $t('UserInfo.phoneNumber') }} : <strong> {{
                    Deskree.loggedInUser.value.phone_number.length > 5 ?
                        Deskree.loggedInUser.value.phone_number : "not set"
                }}</strong></p>
                <p> {{ $t('UserInfo.state') }} : <strong> {{
                    Deskree.loggedInUser.value.wilaya ? Deskree.loggedInUser.value.wilaya : "not set"
                }}</strong></p>
                <p> {{ $t('UserInfo.address') }} : <strong> {{
                    Deskree.loggedInUser.value.address ? Deskree.loggedInUser.value.address : "not set"
                }}</strong></p>
                <AppButton class="mx-5 mt-8" @click="handleOrder">{{ $t('CheckoutConfirmation.placeMyOrder') }}
                </AppButton>
            </div>
            <!--if guest buy-->
            <div v-else>
                <FormKit type="form" :config="{ validationVisibility: 'submit' }" :actions="false"
                    @submit="handleGuestOrder">
                    <FormKit type="text" label="full name" name="name" v-model="guestUser.name"
                        placeholder="enter your name" validation="required" />
                    <FormKit type="number" label="Your phone number" name="phone" v-model="guestUser.phone_number"
                        required validation="number|length:10,10" placeholder="enter your phone number" />
                    <FormKit type="select" label="city name" name="city" v-model="guestUser.wilaya" placeholder="wilaya"
                        required :options="cartStore.wilayas" />
                    <FormKit type="text" label="Your address" name="address" v-model="guestUser.address"
                        placeholder="address" required />
                    <AppButton class="mx-5 mt-8">{{ $t('CheckoutConfirmation.placeMyOrder') }}</AppButton>
                </FormKit>

            </div>
            <Invoice :orders="registeredOrders" :user="Deskree.loggedInUser.value ?? guestUser" v-if="showInvoice"
                @hideInvoiceComp="hideInvoiceAndConfirmation" />

        </div>

    </div>
</template>
<script setup>
const { t } = useI18n()
const cartStore = useCartStore();
const Deskree = useDeskree();

const emit = defineEmits(['toggleConformation'])
function emitHideConfirmation() { emit('toggleConformation') }



//logged-in user logic
async function handleOrder() {
    const res = await Deskree.orders.placeOrder(cartStore.products)
    handleOrdersResponse(res)
}


//Guest user logic
const guestUser = ref({
    name: '',
    phone_number: '',
    wilaya: '',
    address: '',
});
async function handleGuestOrder() {
    const productsArray = cartStore.products.map((product) => { return { productId: product.sys.id, price: product.fields.price, count: product.count } })

    const res = await $fetch('/api/guestOrder', {
        method: 'post',
        body: { user: guestUser.value, products: productsArray }
    })

    handleOrdersResponse(res)
}


//generate the invoice and print it
const showInvoice = ref(false)
let registeredOrders = [];

const handleOrdersResponse = async (responseArray) => {
    //check if at least an order is placed
    const isAnOrderPlaced = responseArray.some((response) => response.status === "fulfilled")

    if (isAnOrderPlaced) {
        createRegisteredOrdersObj(responseArray);
        showInvoice.value = true;
        //delete successful orders from the cart
        polishCart(registeredOrders);
        //if the cart is empty = all orders are successful
        if (!cartStore.products.length) {
            useAlertsStore().success(t('CheckoutConfirmation.successfulOrders'));
            await navigateTo('/')
        }
        else {
            registeredOrders.forEach((product) => showOrderAlert(product.product_name, true))
            cartStore.products.forEach((product) => showOrderAlert(product.fields.name, false))

        }
    }
    else {
        useAlertsStore().error("An error occurred...please try again later");
    }
}

//create registeredORders object
const createRegisteredOrdersObj = (responseArray) => {
    responseArray.forEach((response) => {
        if (response.status === "fulfilled") {
            //look for the product details in the cart store
            const productDetails = cartStore.products.find((product) => product.sys.id === response.value.data.product_id)
            const orderObj = {
                "product_id": response.value.data.product_id,
                "count": response.value.data.count,
                "price": productDetails.fields.price,
                "product_name": productDetails.fields.name,
            }
            registeredOrders.push(orderObj)
        }
    })
}

//remove placed order from cart + navigate to the suitable route
const polishCart = (registeredOrders) => {
    const failedOrders = cartStore.products.filter((product) => {
        const isOrderFailed = registeredOrders.every((order) => order.product_id !== product.sys.id)
        return isOrderFailed
    })
    cartStore.products = failedOrders
}
const showOrderAlert = (productName, isSuccess) => {
    isSuccess ? useAlertsStore().success(t('CheckoutConfirmation.successfulOrder'), productName )
        : useAlertsStore().error(t('CheckoutConfirmation.failedOrder') , productName,  )

}
//a function to hide the confirmation and invoice comps
const hideInvoiceAndConfirmation = () => {
    console.log("invoice hidden");
    showInvoice.value = false
    emitHideConfirmation()
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