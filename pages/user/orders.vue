<template>

    <div class="cont flex flex-col  gap-4 mt-8">

        <h1 class="text-3xl font-semibold"> My last orders : </h1>
        <div class="orders-cont flex">
            <div class="order-item flex flex-col p-2 bg-base-100 shadow-xl gap-2"
                v-for=" order, index in OrdersStore.orders">
                <div class="product-pic "> <img :src="order.fields.image[0].fields?.file.url" :alt="order.fields.name">
                </div>
                <p class="product-name  text-xl font-semibold">{{ order.fields.name }}</p>
                <div class="details flex justify-around my-5">
                    <p class="count"> number of pieces <span class="block  text-xl font-semibold">{{
                        deskreeOrders.data[index].attributes.count
                    }}</span> </p>
                    <p class="price">total price <span class="block text-xl font-semibold">{{
                        deskreeOrders.data[index].attributes.preice
                    }}</span></p>
                    <p class="is-delivered"> Delivery started ?<span class="block text-xl font-semibold">{{
                        deskreeOrders.data[index].attributes.is_delivered ? "✔️" : "❌"
                    }}</span></p>
                </div>


            </div>
        </div>

    </div>

</template>
<script setup>


const Deskree = useDeskree();
const OrdersStore = useOrdersStore();


const deskreeOrders = ref(null)
onMounted(async () => {
    deskreeOrders.value = await Deskree.orders.getOreders();
    //fetch orders details using contentful
    deskreeOrders.value.data.forEach(async (el) => { await OrdersStore.fetchOrder(el.attributes.product_id) })
})


</script>

<style scoped>
.order-item {
    min-width: 25rem;
}

img {
    width: 100%;
    height: 300px;
    object-fit: contain;
}
</style>