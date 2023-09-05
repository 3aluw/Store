<template >
    <div class="admin-cont">
        <div class="up-banner w-full py-2 flex gap-4 pl-4">
            <div class="hamburger  float-left hidden" @click="toggleAsideClass"> <span></span></div>
            <p class="text-xl md:xl-16">Dashboard</p>
        </div>
        <div class="flex w-full">
            <aside>
                <ul @click="changeComponent">
                    <li class="nav-items flex gap-2" data-component="stats"
                        :class="{ 'aside-active': componentToShow === 'stats' }">
                        stats</li>

                    <li class="nav-items flex gap-2" data-component="users"
                        :class="{ 'aside-active': componentToShow === 'users' }">users
                    </li>
                    <li class="nav-items flex gap-2" data-component="orders"
                        :class="{ 'aside-active': componentToShow === 'orders' }">
                        orders</li>
                    <li class="nav-items flex gap-2" data-component="products"
                        :class="{ 'aside-active': componentToShow === 'products' }">
                        products</li>

                </ul>
            </aside>

            <main>

                <AdminStats v-if="componentToShow === 'stats'" />
                <AdminUsers v-if="componentToShow === 'users'" />
                <AdminOrders v-if="componentToShow === 'orders'" />
                <AdminProducts v-if="componentToShow === 'products'" />
            </main>
        </div>
    </div>
</template >

<script setup>
//const Deskree = useDeskree();
//const user = computed(() => Deskree.loggedInUser.value)
const adminStore = useAdminStore()

onMounted(async () => {
    //console.log(user.value, user)
    await adminStore.generateMonthlyMetrics();
})
/*
definePageMeta({

    middleware: () => {
        const Deskree = useDeskree();
        const res = computed(() => Deskree.loggedInUser.value)

    }
})
*/

const componentToShow = ref('products')
const changeComponent = (e) => {
    e = e.target
    //check if the user clicked on img to change it to li tag
    const target = e.tagName.toLowerCase() === 'li' ? e : e.parentNode;
    componentToShow.value = target.dataset.component;

}



const toggleAsideClass = () => {
    document.querySelector(".hamburger").classList.toggle('active')
    document.querySelector("aside").classList.toggle('to-right')
}

</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,500&display=swap');


@media (max-width: 768px) {
    aside {
        position: absolute;
        transform: translateX(-100%);
        height: 100%;
        transition: all 0.5s ease-out;
    }

    .to-right {
        transform: translate(0%);
    }

    .hamburger {
        display: block;
    }

}

.up-banner {

    border-bottom: solid 1px #68299F;
}



aside>ul {
    padding-inline: 2rem;
    width: max-content;
    height: 100%;
    padding-top: 5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.60) 0%, rgba(255, 255, 255, 0.30) 100%);
    box-shadow: 3px 0px 10px 0px rgba(0, 0, 0, 0.10);
    backdrop-filter: blur(110px);
    color: #6D7D93;
}

.nav-items {
    cursor: pointer;
}

.aside-active {
    color: #43A6DD;
    filter: invert(61%) sepia(80%) saturate(1185%) hue-rotate(172deg) brightness(91%) contrast(89%);
}

main {
    padding-left: 1rem;
    width: 100%;
    background: #EFF3F4;
    min-height: 100vh;
}


/*hamburger icon */
.hamburger {
    height: 32px;
    width: 40px;
    cursor: pointer;
}

.hamburger span,
.hamburger span::before,
.hamburger span::after {
    background: #43A6DD;
    content: '';
    position: absolute;
    width: 40px;
    height: 6px;
    margin-top: 13px;

    -webkit-transform: rotate(180deg);
    -moz-transform: rotate(180deg);
    -o-transform: rotate(deg);
    transform: rotate(180deg);

    -webkit-transition: .5s ease-in-out;
    -moz-transition: .5s ease-in-out;
    -o-transition: .5s ease-in-out;
    transition: .5s ease-in-out;
}

.hamburger span::before {
    margin-top: -12px;
}

.hamburger span::after {
    margin-top: 12px;
}

.hamburger.active span {
    background: transparent;
}

.hamburger.active span::before {
    margin-top: 0;

    -webkit-transform: rotate(45deg);
    -moz-transform: rotate(45deg);
    -o-transform: rotate(45deg);
    transform: rotate(45deg);
}

.hamburger.active span::after {
    transform: rotate(-45deg);
    margin-top: 0;
}
</style>