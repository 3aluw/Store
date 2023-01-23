<template>

</template>
<script setup>
const Deskree = useDeskree()
const userOrders = ref(null)
onMounted(async () => {
    userOrders.value = await Deskree.orders.getOreders()
})


</script>