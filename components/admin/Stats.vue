<template>
    <div>
        <p class="text-xl stats-title"> monthly Metrics </p>
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

        <div class="flex md:mx-8 flex-wrap justify-center gap-2 py-4">
            <div class="flex gap-2 ">
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
            </div>
            <div class="flex gap-2 ">
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
        </div>

        <div class="charts-cont flex flex-wrap ">
            <div>
                <ClientOnly>
                    <apexchart width="500" type="line" :options="ordersChartOptions" :series="orderSeries"></apexchart>
                </ClientOnly>
            </div>
            <div>
                <ClientOnly>
                    <apexchart width="500" type="line" :options="usersChartOptions" :series="usersSeries"></apexchart>
                </ClientOnly>
            </div>
        </div>
    </div>
</template>
<script setup>


//orders charts
const ordersChartOptions = ref({
    colors: ['#009DFF'],
    chart: {
        id: "vuechart-example",
    },
    xaxis: {
        type: "datetime"
    },
    stroke: {
        curve: 'smooth',
    },
    markers: {
        size: 5,
    },
    title: {
        text: "new orders by days",
    },
    fill: {
        colors: ['black', '#E91E63', '#9C27B0']
    }
})


const orderSeries = ref([
    {
        name: "Series 1",
        data: [
            {
                x: "02-10-2017 GMT",
                y: 34
            },
            {
                x: "02-11-2017 GMT",
                y: 43
            },
            {
                x: "02-12-2017 GMT",
                y: 31
            },
            {
                x: "02-13-2017 GMT",
                y: 43
            },
            {
                x: "02-14-2017 GMT",
                y: 33
            },
            {
                x: "02-15-2017 GMT",
                y: 52
            }
        ]
    }
])



//users charts
const usersChartOptions = ref({
    colors: ['#00FF78'],
    chart: {
        id: "vuechart-example",
    },
    xaxis: {
        type: "datetime"
    },
    stroke: {
        curve: 'smooth',
    },
    markers: {
        size: 5,
    },
    title: {
        text: "new orders by days",
    },
})


const usersSeries = ref([
    {
        name: "Series 1",
        data: [
            {
                x: "02-10-2017 GMT",
                y: 34
            },
            {
                x: "02-11-2017 GMT",
                y: 43
            },
            {
                x: "02-12-2017 GMT",
                y: 31
            },
            {
                x: "02-13-2017 GMT",
                y: 43
            },
            {
                x: "02-14-2017 GMT",
                y: 33
            },
            {
                x: "02-15-2017 GMT",
                y: 52
            }
        ]
    }
])

</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,500&display=swap');

.stats-title {
    margin-block: 1rem;
    font-weight: 500;
    font-family: 'DM Sans';
}

.big-cards {
    padding-block: 1.5rem;
    padding-inline: 1rem;

    aspect-ratio: 4 / 3;
    min-height: 10.6rem;
    border-radius: 0.625rem;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
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
    font-size: 4rem;
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
    box-sizing: content-box;
    border: 0.2px solid var(--light, #6D7D93);
    background: #FFF;
    max-width: 8rem;
    flex: 1 1 0;
    min-width: 8rem;
    width: 0;
    padding: 1rem;
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