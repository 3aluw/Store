<template>
    <p class="text-xl my-4">Your loyal costumers:</p>
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

    <p class="text-xl my-4">manage users</p>
    <section class="table-section">
        <searchInput :options="['user', 'uid', 'date joined', 'wilaya']" />
        <table class="table table-compact w-full">
            <!-- head -->
            <thead>
                <tr>
                    <th v-for="column in columns">{{ column }}</th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="item in queryData">
                    <td v-for="column in columns">{{ item.attributes[column] }} </td>
                </tr>
            </tbody>

        </table>
    </section>
</template>
<script setup>

const columns = ['rating', 'text', 'title']
const columnToOmit = []


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

* {
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
</style>