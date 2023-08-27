<template>
    <p class="text-xl my-4 title">Your loyal costumers:</p>
    <section class="big-cards-cont flex gap-2 justify-around flex-wrap">
        <div class="big-card">
            <p>lorem2</p>
            <p class="text-4xl text-center">500$</p>
            <p class="text-xs">Lorem, ipsum.</p>
        </div>
        <div class="big-card">
            <p>Lorem, ipsum.</p>
            <p class="text-4xl text-center">400$</p>
            <p class="text-xs">Lorem, ipsum.</p>
        </div>
        <div class="big-card">
            <p>Lorem, ipsum.</p>
            <p class="text-4xl text-center">400$</p>
            <p class="text-xs">Lorem, ipsum.</p>
        </div>
    </section>

    <p class="text-xl my-4 title">manage users</p>
    <section class="table-section">
        <searchInput :options="searchOptions" @new-query="handleQuery" />
        <table class="table table-compact w-full">
            <!-- head -->
            <thead>
                <tr>
                    <th v-for="column in columns">{{ column.name }}</th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="item in queryData" :key="item.uid">
                    <td v-for="column in columns">{{ item.attributes[column.value] }} </td>
                    <td><button class="btn btn-circle btn-outline btn-sm hover:!bg-blue-600"><svg width="20" height="20"
                                viewBox="0 0 51 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M29.4028 7.69796C28.5117 4.66871 23.2865 4.66871 22.3954 7.69796C21.8181 9.65593 19.0988 10.584 17.0154 9.53518C13.7858 7.9136 10.0918 10.9618 12.058 13.6236C12.3536 14.0234 12.5305 14.4751 12.5744 14.942C12.6183 15.4088 12.5279 15.8776 12.3106 16.3102C12.0933 16.7428 11.7552 17.1269 11.3238 17.4314C10.8925 17.7358 10.38 17.952 9.82822 18.0623C6.15512 18.7972 6.15512 23.1064 9.82822 23.8413C10.3795 23.9519 10.8914 24.1682 11.3223 24.4726C11.7532 24.777 12.0909 25.161 12.3079 25.5933C12.525 26.0257 12.6153 26.4941 12.5715 26.9606C12.5277 27.4272 12.3511 27.8786 12.0559 28.2782C10.0897 30.9417 13.7858 33.9882 17.0134 32.3667C17.4981 32.1229 18.0458 31.977 18.6119 31.9408C19.178 31.9046 19.7464 31.9791 20.2709 32.1584C20.7955 32.3376 21.2613 32.6164 21.6304 32.9722C21.9996 33.3279 22.2617 33.7505 22.3954 34.2056C23.2865 37.2349 28.5117 37.2349 29.4028 34.2056C29.5368 33.7509 29.7991 33.3288 30.1682 32.9734C30.5374 32.6181 31.003 32.3396 31.5272 32.1606C32.0514 31.9816 32.6194 31.9071 33.1851 31.9432C33.7508 31.9793 34.2981 32.125 34.7827 32.3684C38.0124 33.99 41.7064 30.9417 39.7401 28.2799C39.4446 27.8801 39.2676 27.4285 39.2238 26.9616C39.1799 26.4948 39.2703 26.026 39.4876 25.5934C39.7049 25.1608 40.043 24.7766 40.4743 24.4722C40.9057 24.1677 41.4181 23.9516 41.9699 23.8413C45.643 23.1064 45.643 18.7972 41.9699 18.0623C41.4186 17.9517 40.9067 17.7354 40.4759 17.431C40.045 17.1265 39.7073 16.7426 39.4902 16.3102C39.2732 15.8779 39.1829 15.4095 39.2267 14.9429C39.2704 14.4764 39.4471 14.025 39.7422 13.6254C41.7085 10.9618 38.0124 7.91532 34.7848 9.5369C34.3 9.78066 33.7523 9.92658 33.1863 9.96277C32.6202 9.99897 32.0518 9.92442 31.5272 9.7452C31.0027 9.56598 30.5369 9.28714 30.1677 8.9314C29.7986 8.57565 29.5365 8.15304 29.4028 7.69796Z"
                                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                <path
                                    d="M30.3363 24.6112C31.5132 23.6407 32.1743 22.3243 32.1743 20.9517C32.1743 19.5792 31.5132 18.2628 30.3363 17.2923C29.1595 16.3217 27.5634 15.7765 25.8991 15.7765C24.2348 15.7765 22.6386 16.3217 21.4618 17.2923C20.285 18.2628 19.6238 19.5792 19.6238 20.9517C19.6238 22.3243 20.285 23.6407 21.4618 24.6112C22.6386 25.5817 24.2348 26.127 25.8991 26.127C27.5634 26.127 29.1595 25.5817 30.3363 24.6112Z"
                                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </button></td>
                </tr>
            </tbody>

        </table>
    </section>
</template>
<script setup>


const columns = [{ name: "name", value: "rating" },
{ name: "n of orders", value: "title" },
{ name: "wilaya", value: "text" }]

const columnToOmit = []

const searchOptions = [
    { name: "name", value: "name" },
    { name: "uid", value: "uid" },
    { name: "wilaya", value: "wilaya" }
]



const handleQuery = (query, searchBy) => {

}

const { data: queryData } = {
    "meta": {
        "total": 3,
        "limit": 50,
        "page": 1,
        "includesCount": 0
    },
    "data": [
        {
            "uid": "1ylR1rxK9z1o21j2u9QP",
            "attributes": {
                "createdAt": "2023-01-04T16:57:19+01:00",
                "author": "",
                "product_id": "4tPjlVZyKcM2IVosy4E4Ly",
                "rating": 4,
                "text": "good product but expected more",
                "updatedAt": "2023-01-04T16:57:19+01:00",
                "title": "wow"
            }
        },
        {
            "uid": "KIZ6k0drd3wV3FXBKQ0c",
            "attributes": {
                "createdAt": "2023-01-05T09:17:28+01:00",
                "author": "",
                "product_id": "4tPjlVZyKcM2IVosy4E4Ly",
                "rating": 4,
                "text": "didn't expect to be this good",
                "title": "Fast delivery is what i love",
                "updatedAt": "2023-01-05T09:17:28+01:00"
            }
        },
        {
            "uid": "Mm90GGvyP6uocnROiv97",
            "attributes": {
                "createdAt": "2023-01-04T16:56:29+01:00",
                "author": "",
                "product_id": "4tPjlVZyKcM2IVosy4E4Ly",
                "rating": 5,
                "text": "good product",
                "updatedAt": "2023-01-04T16:56:29+01:00",
                "title": "wow"
            }
        }
    ]
}


</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,500&display=swap');

.title,
.big-cards-cont {
    font-family: "DM Sans;";
    font-weight: 500;
}


table {
    font-family: unset;
    font-weight: unset;
}

.table :where(th, td) {
    white-space: pre-wrap !important;
}

.big-card {
    color: black;
    background-color: #FFFFFF;
    border-radius: 0.625rem;
    border: 0.2px solid #6D7D93;
    padding-inline: 1rem;
    padding-block: 0.5rem;
    min-width: 11rem;
    aspect-ratio: 3 / 2;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-position: center top !important;
    background-repeat: no-repeat !important;
    background-size: contain !important;

}

.big-card:nth-child(1) {
    background-image: url("~/assets/svg/gold-medal.svg");


}

.big-card:nth-child(2) {
    background-image: url("~/assets/svg/silver-medal.svg");
}

.big-card:nth-child(3) {
    background-image: url("~/assets/svg/bronze-medal.svg");
}



/*2ns section*/
.btn-circle>svg {
    stroke: #3F3F46
}

.btn-circle:hover>svg {
    stroke: white !important;
}
</style>