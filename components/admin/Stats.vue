<template>
    <div class="stats-cont">
        <!--section 1-->
        <p class="text-xl stats-title"> monthly Metrics </p>
        <section class="flex justify-evenly gap-2 flex-wrap pb-4 pt-2" v-if="adminStore.ordersObject">
            <div class="big-cards">
                <p class="c-title"> sales amount (units) </p>
                <p class="card-value text-center">{{ adminStore.monthlyMetrics.salesUnits }} </p>
            </div>
            <div class="big-cards">
                <p class="c-title">revenue</p>
                <p class="card-value text-center"> {{ adminStore.monthlyMetrics.revenue }} DA</p>
            </div>
            <div class="big-cards">
                <p class="c-title">new users </p>
                <p class="card-value text-center ">{{ adminStore.monthlyMetrics.newUsers }}</p>
            </div>
        </section>
        <div v-else class="loader-cont">
            <div id="loader"></div>
        </div>

        <!--section 2-->
        <p class="text-xl stats-title"> orders Metrics </p>
        <section class="flex md:mx-2 flex-wrap  gap-4 py-4 justify-center items-center" v-if="adminStore.ordersObject">

            <div class="flex gap-2 items-stretch flex-grow">
                <div class="order-box flex flex-col">
                    <div class="order-icons"><img src="~/assets/icons/total.svg" alt=""></div>
                    <p class="order-number">{{ adminStore.monthlyMetrics.orders }}</p>
                    <p>total orders</p>
                </div>
                <div class="order-box flex flex-col">
                    <div class="order-icons"><img src="~/assets/icons/waiting.svg" alt=""></div>
                    <p class="order-number">{{ adminStore.monthlyMetrics.ordersWaiting }}</p>
                    <p>waiting shipping</p>
                </div>
                <div class="latest-orders-cont p-4 text-center justify-around">
                    <p>latest orders</p>
                    <div class="flex gap-8 justify-around">
                        <div class="flex flex-col">
                            <p v-for="index in 5" :key="index">{{ adminStore.ordersObject?.data[index].attributes.buyer_name
                            }}</p>

                        </div>
                        <div class="flex flex-col order-value">
                            <p v-for="index in 5" :key="index">{{ adminStore.ordersObject?.data[index].attributes.price }}
                                DA
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex gap-2 flex-grow">
                <div class="order-box flex flex-col">
                    <div class="order-icons"><img src="~/assets/icons/delivering.svg" alt=""></div>
                    <p class="order-number">{{ adminStore.monthlyMetrics.ordersDelivering }}</p>
                    <p>shipping...</p>
                </div>
                <div class="order-box flex flex-col">
                    <div class="order-icons"><img src="~/assets/icons/delivered.svg" alt=""></div>
                    <p class="order-number">{{ adminStore.monthlyMetrics.ordersDelivered }}</p>
                    <p>Orders delivered</p>
                </div>
            </div>
        </section>
        <div v-else class="loader-cont">
            <div id="loader"></div>
        </div>

        <!--section 3-->
        <section class="charts-cont flex flex-wrap gap-2 justify-center pt-4">
            <div v-if="ordersChartObj" class="w-full md:w-5/12">
                <ClientOnly>
                    <apexchart width="100%" type="line" :options="ordersChartOptions" :series="orderSeries"></apexchart>
                </ClientOnly>
            </div>
            <div v-if="usersChartObj" class="w-full md:w-5/12">
                <ClientOnly>
                    <apexchart width="100%" type="line" :options="usersChartOptions" :series="usersSeries"></apexchart>
                </ClientOnly>
            </div>
        </section>
    </div>
</template>

<script setup>
const deskree = useDeskree();
const adminStore = useAdminStore()




//task 2
const pastWeekDays = useTimer().getPastWeekDays();
const chartDates = useTimer().getDatesWithoutTime(pastWeekDays.map(date => date.start))



const ordersChartObj = ref()
const usersChartObj = ref()

const generateChartsObjects = async () => {
    const orderPromises = []
    const usersPromises = []
    pastWeekDays.forEach((day) => {
        const queryObject = adminStore.generateRangeQueryObject(day.start, day.end)
        const orderReq = deskree.handleQuery("/orders", queryObject, "&limit=1")
        const userReq = deskree.handleQuery("/users", queryObject, "&limit=1")
        orderPromises.push(orderReq)
        usersPromises.push(userReq)
    })
    const ordersRes = await Promise.allSettled(orderPromises)
    const usersRes = await Promise.allSettled(usersPromises)
    console.log(ordersRes, usersRes)
    //generate charts
    ordersChartObj.value = chartDates.map((day, index) => {
        return { x: day, y: ordersRes[index].status === "fulfilled" ? ordersRes[index].value.meta.total : 0 }
    })
    usersChartObj.value = chartDates.map((day, index) => {
        return { x: day, y: usersRes[index].status === "fulfilled" ? usersRes[index].value.meta.total : 0 }
    })
}
generateChartsObjects()

//orders charts
const ordersChartOptions = ref({
    colors: ['#009DFF'],
    chart: {
        id: "orders-chart",
        toolbar: {
            show: false,
        }
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
        name: "orders",
        data: ordersChartObj,
    }
])



//users charts
const usersChartOptions = ref({
    colors: ['#00FF78'],
    chart: {
        id: "users-chart",
        toolbar: {
            show: false,
        },
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
        name: "new users",
        data: usersChartObj
    }
])

</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,500&display=swap');

.section {
    min-height: 10rem;
}

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
    flex: 1 1 0;
    min-width: 5rem;
    width: 0;
    padding: 0.5rem;

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

.latest-orders-cont {
    border-radius: 0.625rem;
    background: #F9F9F9;
    font-family: 'DM Sans';
    color: #000;
    padding-block: 0.5rem;
    padding-inline: 1rem;
    border: 0.2px solid #6D7D93;
}

.order-value {
    color: #3FC500;
    font-family: inherit;
}

/**loader */

.loader-cont {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 2rem;
    align-items: center;
    justify-content: center;
    background: var(--bg-ltr);
}



#loader {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    animation: load 1s ease-in-out infinite alternate;
}

@keyframes load {
    0% {
        transform: translateX(-100px);
        offset: 10px 0px;
        background: #92E3B8;
    }

    100% {
        transform: translateX(100px);
        background: #43A6DD;
    }
}
</style>