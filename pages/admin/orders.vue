<template >
    <p> HI {{ res }}</p>

</template >

<script setup>
const Deskree = useDeskree();
const user = computed(() => Deskree.loggedInUser.value)

onMounted(() => {
    console.log(user.value, user)
})

definePageMeta({

    middleware: () => {
        const Deskree = useDeskree();
        const res = computed(() => Deskree.loggedInUser.value)

    }
})


</script>