<template >
    <div class="admin-cont">
        <div class="up-banner w-full"></div>
        <div class="flex w-full">
            <aside>
                <ul>
                    <li class="nav-items flex gap-2"><img src="~/assets/icons/stats.svg" alt=""> stats</li>
                    <li class="nav-items flex gap-2"><img src="~/assets/icons/user.svg" alt=""> users</li>
                    <li class="nav-items flex gap-2"><img src="~/assets/icons/orders.svg" alt=""> orders</li>
                    <li class="nav-items flex gap-2"><img src="~/assets/icons/star.svg" alt=""> reviews</li>
                    <li class="nav-items flex gap-2"><img src="~/assets/icons/cart.svg" alt=""> carts</li>
                </ul>
            </aside>

            <main>
                <AdminStats />
            </main>
        </div>
    </div>
</template >

<script setup>
const Deskree = useDeskree();
const user = computed(() => Deskree.loggedInUser.value)

onMounted(() => {
    //console.log(user.value, user)
})

definePageMeta({

    middleware: () => {
        const Deskree = useDeskree();
        const res = computed(() => Deskree.loggedInUser.value)

    }
})


</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,500&display=swap');

.up-banner {
    height: 2rem;
    border-bottom: solid 1px #68299F;
}

aside>ul {
    padding-inline: 3rem;
    padding-top: 5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.60) 0%, rgba(255, 255, 255, 0.30) 100%);
    box-shadow: 3px 0px 10px 0px rgba(0, 0, 0, 0.10);
    backdrop-filter: blur(110px);
    color: #6D7D93;
}

main {
    padding-left: 1rem;
    width: 100%;
}
</style>