<template>
    <!--
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
-->

    <p class="text-xl my-4 title">search for a specific user</p>
    <section class="table-section pb-12">
        <searchInput :options="searchOptions" @new-query="handleQuery" />
        <table class="table table-compact w-full">
            <!-- head -->
            <thead>
                <tr>
                    <th v-for="column in columns">{{ column.name }}</th>
                </tr>
            </thead>

            <tbody v-if="queryData">
                <tr v-for="(item, index) in queryData" :key="item.uid">
                    <td v-for="column in columns">{{ item.attributes[column.value] }} </td>

                    <td><button class="btn btn-circle btn-infos btn-sm " @click="toggleModal(index)"><img
                                src="~/assets/icons/info.svg" alt="">
                        </button></td>
                </tr>
            </tbody>


        </table>
        <p class="text-red-900 text-sm text-center" v-if="queryData?.length === 0">No results</p>


    </section>
    <div class="modal" :class="{ 'modal-open': showModal }" v-if="showModal">
        <div class="modal-box">
            <table class="table table-compact w-full">
                <tbody>
                    <tr v-for="property in modalProperties">
                        <td>{{ property.name }}</td> {{ modalObject[property.value] }}<td></td>
                    </tr>
                </tbody>
            </table>
            <div class="modal-action">
                <button class="btn" @click="showModal = false">
                    close
                </button>
                <button class="btn  btn-error" @click="deleteUser(currentUid)">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M10 11V17M14 11V17M4 7H20M19 7L18.133 19.142C18.0971 19.6466 17.8713 20.1188 17.5011 20.4636C17.1309 20.8083 16.6439 21 16.138 21H7.862C7.35614 21 6.86907 20.8083 6.49889 20.4636C6.1287 20.1188 5.90292 19.6466 5.867 19.142L5 7H19ZM15 7V4C15 3.73478 14.8946 3.48043 14.7071 3.29289C14.5196 3.10536 14.2652 3 14 3H10C9.73478 3 9.48043 3.10536 9.29289 3.29289C9.10536 3.48043 9 3.73478 9 4V7H15Z"
                            stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <span class="pl-2">delete user</span>
                </button>
            </div>
        </div>
    </div>
</template>
<script setup>
const { t } = useI18n()
const Deskree = useDeskree();
const adminStore = useAdminStore()
//change columns,searchOptions,modalProperties values according to user table in deskree
const columns = [{ name: "name", value: "wilaya" },
{ name: "phone number", value: "wilaya" },
{ name: "wilaya", value: "wilaya" }]



const searchOptions = [
    { name: "name", value: "name" },
    { name: "uid", value: "uid" },
    { name: "wilaya", value: "wilaya" }
]






const queryData = ref()

const handleQuery = async (query, searchBy) => {
    const reqQuery = adminStore.generateQueryObject(searchBy, query)
    const res = await Deskree.handleQuery("/users", reqQuery)
    queryData.value = res.data ?? []
}

//modal logic -- 
const showModal = ref(false);
const modalProperties = [
    { name: "name", value: "name" },
    { name: "address", value: "address" },
    { name: "wilaya", value: "wilaya" },
    { name: "phone number", value: "phone_number" },
]

const modalObject = ref()
const currentUid = ref()
//it is better to change index to uid and pass it directly from the template 
function toggleModal(index) {
    currentUid.value = queryData.value[index].uid
    modalObject.value = Object.assign({}, queryData.value[index].attributes)
    showModal.value = !showModal.value;

}

const deleteUser = (uid) => {
    showModal.value = false;
    try {
        Deskree.user.deleteUser(uid);
        const orderIndex = queryData.findIndex((user) => user.uid === uid)
        adminStore.ordersObject.data.splice(orderIndex, 1)
    }
    catch (err) {
        console.log(err)
        useAlertsStore().error(t('AdminUsers.failedDeleting'))
    }
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



/*2nd section*/
.btn-infos {
    background-color: #FFE99A;
}

.btn-infso:hover {
    filter: contrast(1.2);
}
</style>