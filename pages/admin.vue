<template >
    <div class="admin-cont">
        <div class="up-banner w-full"></div>
        <div class="flex">
            <aside>
                <ul>
                    <li class="nav-items">stats</li>
                    <li class="nav-items">users</li>
                    <li class="nav-items">orders</li>
                    <li class="nav-items">reviews</li>
                    <li class="nav-items">carts</li>
                </ul>
            </aside>
            <main>
                <p class="text-xl"> monthly Metrics </p>
                <div class="flex justify-evenly ">
                    <div class="big-cards">
                        <p class="c-title"> sales amount (units)</p>
                        <p class="card-value text-center  text-4xl">80k</p>
                    </div>
                    <div class="big-cards">
                        <p class="c-title">orders </p>
                        <p class="card-value text-center text-4xl">300</p>
                    </div>
                    <div class="big-cards">
                        <p class="c-title">number of users </p>
                        <p class="card-value text-center text-4xl">200</p>
                    </div>
                </div>
            </main>
        </div>
    </div>
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
<style scoped>
.up-banner {
    height: 2rem;
    border-bottom: solid 1px #68299F;
}

aside {
    width: max(20%, 20rem);
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.60) 0%, rgba(255, 255, 255, 0.30) 100%);
    box-shadow: 3px 0px 10px 0px rgba(0, 0, 0, 0.10);
    backdrop-filter: blur(110px);
}

main {
    padding-left: 1rem;
    width: 100%;
}

.big-cards {
    padding: 1rem;
    min-width: 12rem;
    min-height: 7rem;
    border-radius: 0.625rem;
}

.big-cards:nth-child(1) {
    background: #CDC3FF;
}

.big-cards:nth-child(2) {
    background: #43A6DD;
}

.big-cards:nth-child(3) {
    background: #92E3B8;
}

.big-cards>.card-value {
    color: #000;
    text-align: center;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    text-transform: capitalize;
}
</style>