<template>
    {{ OrdersStore.orders }}
</template>
<script setup>
const Deskree = useDeskree();
const OrdersStore = useOrdersStore();


const userOrders = ref(null)
onMounted(async () => {
    userOrders.value = await Deskree.orders.getOreders();
    //fetch orders details using contentful
    userOrders.value.data.forEach(async (el) => { await OrdersStore.fetchOrder(el.attributes.product_id) })
})


</script>