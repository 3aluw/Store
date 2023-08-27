<template>
    <section class="waiting-delivery-cont">
        <p class="text-xl my-4 title">orders waiting delivery</p>
        <table class="table table-compact w-full ">
            <!-- head -->
            <thead>
                <tr>
                    <th class="w-2/6" v-for="column in columns">{{ column.name }}</th>
                    <th class=" hidden sm:block w-2/6">move to <br> delivering</th>
                    <th class="w-2">Edit <br> order</th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="(item, index) in waitingObj" :key="item.uid">
                    <td v-for="column in columns" class="w-2/6">{{ item.attributes[column.value] }} </td>

                    <td class="hidden sm:block "><button class="btn-truck btn btn-circle btn-outline btn-sm "
                            @click="handlePatch(item.uid, { 'delivery_status': 'delivering' })"><img
                                src="~/assets/icons/truck.svg" alt="">
                        </button></td>
                    <td class="w-2"><button class="btn-cog btn btn-circle btn-outline btn-sm "
                            @click="toggleModal(item.uid)"><img src="~/assets/icons/cog-full.svg" alt="">
                        </button></td>
                </tr>
            </tbody>

        </table>
    </section>

    <section class="query-table">
        <div class="text-xl my-4 title">search orders</div>
        <SearchInput :options="searchOptions" />
        <table class="table table-compact w-full ">
            <!-- head -->
            <thead>
                <tr>
                    <th class="w-2/6" v-for="column in columns">{{ column.name }}</th>
                    <th class=" hidden sm:block w-2/6">move to <br> delivering</th>
                    <th class="w-2">Edit <br> order</th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="(item, index) in queryData" :key="item.uid">
                    <td v-for="column in columns" class="w-2/6">{{ item.attributes[column.value] }} </td>

                    <td class="hidden sm:block "><button class="btn-truck btn btn-circle btn-outline btn-sm "
                            @click="handlePatch(item.uid, { ' delivery_status': 'delivering' })"><img
                                src="~/assets/icons/truck.svg" alt="">
                        </button></td>
                    <td class="w-2"><button class="btn-cog btn btn-circle btn-outline btn-sm "
                            @click="toggleModal(item.uid)"><img src="~/assets/icons/cog-full.svg" alt="">
                        </button></td>
                </tr>
            </tbody>

        </table>

    </section>
</template>
<script setup>
const columns = [{ name: "to", value: "rating" },
{ name: "value", value: "title" },
{ name: "order date", value: "text" }]
const { data: waitingObj } = {
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


//query logic
const searchOptions = [
    { name: "buyer name", value: "buyer_name" },
    { name: "uid", value: "uid" },
    { name: "delivery status", value: "delivery_status" },
    { name: "order value", value: "price" },
    { name: "wilaya", value: "wilaya" }
]


const toggleModal = (uid) => {
    console.log(uid)
}


const handlePatch = (uid, reqBody) => { }
const handleDelete = (uid) => { }
</script>
<style scoped>
.title {
    font-family: "DM Sans;";
    font-weight: 500;
}

.table-compact :where(th, td) {
    white-space: pre-line;
}

.btn-cog {
    background-color: #FFE99A;
}

.btn-cog:hover {
    filter: contrast(1.2);
}

.btn-truck {
    background-color: #9FA9FF;
}

.btn-truck>img {
    margin: 0 auto;
}

.btn-truck:hover {
    filter: contrast(1.2);
}
</style>