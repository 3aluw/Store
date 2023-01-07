<template>
    <p> HI</p>

</template>
<script setup>

definePageMeta({

    middleware: () => {
        const Deskree = useDeskree();
        console.log(Deskree.user.get())
    }
})

</script>