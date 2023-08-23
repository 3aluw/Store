<template>
    <p class="text-xl"> monthly Metrics </p>
    <div class="flex justify-evenly gap-2 flex-wrap py-4">
        <div class="big-cards">
            <p class="c-title"> sales amount (units)</p>
            <p class="card-value text-center ">80k</p>
        </div>
        <div class="big-cards">
            <p class="c-title">orders </p>
            <p class="card-value text-center">300</p>
        </div>
        <div class="big-cards">
            <p class="c-title">number of users </p>
            <p class="card-value text-center ">200</p>
        </div>
    </div>

    <div class="flex md:mx-8 flex-wrap justify-evenly gap-2 py-4">
        <div class="order-box flex flex-col">
            <div class="order-icons"><img src="~/assets/icons/total.svg" alt=""></div>
            <p class="order-number">30</p>
            <p>total orders</p>
        </div>
        <div class="order-box flex flex-col">
            <div class="order-icons"><img src="~/assets/icons/waiting.svg" alt=""></div>
            <p class="order-number">8</p>
            <p>waiting shipping</p>
        </div>
        <div class="order-box flex flex-col">
            <div class="order-icons"><img src="~/assets/icons/delivering.svg" alt=""></div>
            <p class="order-number">7</p>
            <p>shipping...</p>
        </div>
        <div class="order-box flex flex-col">
            <div class="order-icons"><img src="~/assets/icons/delivered.svg" alt=""></div>
            <p class="order-number">15</p>
            <p>Orders delivered</p>
        </div>
    </div>
</template>
<script setup></script>
<style scoped>
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
    font-family: 'DM Sans';
    line-height: normal;
    text-transform: capitalize;
    font-size: 3rem;
}

.c-title {
    color: black;
    font-weight: 500;
    font-family: 'DM Sans';
    font-size: 1rem;
}


/*nd section : orders */
.order-box {
    border-radius: 0.625rem;
    border: 0.2px solid var(--light, #6D7D93);
    background: #FFF;
    max-width: 15rem;
    flex: 1 1 0;
    min-width: 10rem;
    width: 0;
    padding: 1rem
}

.order-box .order-number {
    font-family: 'DM Sans';
    font-size: 2.5rem;
    font-style: normal;
    font-weight: 500;
    color: #6D7D93;

}

.order-box p {
    text-align: center;
}
</style>