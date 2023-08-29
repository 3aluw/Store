<template>
    <section class="waiting-delivery-cont px-4 md:px-12 ">

        <p class="text-xl mt-4 title">orders waiting delivery</p>
        <table class="table table-compact w-full ">
            <!-- head -->
            <thead>
                <tr>
                    <th class="w-2/6" v-for="column in columns">{{ column.name }}</th>
                    <th class=" hidden sm:table-cell w-2/6">move to <br> delivering</th>
                    <th class="w-2">Edit <br> order</th>
                </tr>
            </thead>
            <tbody v-if="waitingOrdersObj">
                <tr v-for="(item, index) in waitingOrdersObj" :key="item.uid">
                    <td v-for="column in columns" class="w-2/6">{{ item.attributes[column.value] }} </td>

                    <td class="hidden sm:table-cell "><button class="btn-truck btn btn-circle btn-outline btn-sm "
                            @click="handlePatch(item.uid, { 'delivery_status': 'delivering' })"><img
                                src="~/assets/icons/truck.svg" alt="">
                        </button></td>
                    <td class="w-2"><button class="btn-cog btn btn-circle  btn-sm "
                            @click="toggleModal(index, 'waitingOrdersObj')"><img src="~/assets/icons/cog-full.svg" alt="">
                        </button></td>
                </tr>
            </tbody>
        </table>
        <p class="text-red-900 text-sm text-center" v-if="waitingOrdersObj?.length === 0">No items are waiting for delivery
        </p>
    </section>
    <!--2ns section/table-->
    <section class="delivering-cont px-4 md:px-12">
        <p class="text-xl mt-4 title">delivering orders</p>
        <table class="table table-compact w-full ">
            <!-- head -->
            <thead>
                <tr>
                    <th class="w-2/6" v-for="column in columns">{{ column.name }}</th>
                    <th class=" hidden sm:table-cell w-2/6">move to <br> delivered</th>
                    <th class="w-2">Edit <br> order</th>
                </tr>
            </thead>
            <tbody v-if="deliveringOrdersObj">
                <tr v-for="(item, index) in deliveringOrdersObj" :key="item.uid">
                    <td v-for="column in columns" class="w-2/6">{{ item.attributes[column.value] }} </td>

                    <td class="hidden sm:table-cell "><button class="btn-check btn btn-circle  btn-sm "
                            @click="handlePatch(item.uid, { 'delivery_status': 'delivered' })"><img
                                src="~/assets/icons/green-check.svg" alt="">
                        </button></td>
                    <td class="w-2"><button class="btn-cog btn btn-circle  btn-sm "
                            @click="toggleModal(index, 'deliveringOrdersObj')"><img src="~/assets/icons/cog-full.svg"
                                alt="">
                        </button></td>
                </tr>
            </tbody>
        </table>
        <p class="text-red-900 text-sm text-center" v-if="deliveringOrdersObj?.length === 0">No items are currently being
            delivered</p>
    </section>

    <section class="query-table px-4 md:px-12">
        <div class="text-xl mt-4 title">search orders</div>
        <SearchInput :options="searchOptions" @new-query="handleQuery" />
        <table class="table table-compact w-full ">
            <!-- head -->
            <thead>
                <tr>
                    <th class="w-2/6" v-for="column in columns">{{ column.name }}</th>

                    <th class="w-2">Edit <br> order</th>
                </tr>
            </thead>
            <tbody v-if="queryData">
                <tr v-for="(item, index) in queryData" :key="item.uid">
                    <td v-for="column in columns" class="w-2/6">{{ item.attributes[column.value] }} </td>

                    <td class="w-2"><button class="btn-cog btn btn-circle  btn-sm "
                            @click="toggleModal(index, 'queryData')"><img src="~/assets/icons/cog-full.svg" alt="">
                        </button></td>
                </tr>
            </tbody>


        </table>
    </section>

    <!--modal-->
    <div class="modal" :class="{ 'modal-open': showModal }" v-if="showModal">
        <div class="modal-box">
            <table class="table table-compact w-full">
                <tbody>
                    <tr v-for="property in modalProperties">
                        <td>{{ property.name }}</td> <input type="text" placeholder="Type here"
                            class="input w-full max-w-xs input-sm" v-model="modalObject[property.value]" />
                        <td></td>
                    </tr>
                </tbody>
            </table>

            <div class="modal-action">
                <button class="btn" @click="showModal = false">
                    close
                </button>
                <button class="btn  " @click="handlePatch(currentUid, modalObject)">

                    <span class="pl-2">apply changes</span>
                </button>

                <button class="btn  btn-error" @click="handleDelete(currentUid)">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M10 11V17M14 11V17M4 7H20M19 7L18.133 19.142C18.0971 19.6466 17.8713 20.1188 17.5011 20.4636C17.1309 20.8083 16.6439 21 16.138 21H7.862C7.35614 21 6.86907 20.8083 6.49889 20.4636C6.1287 20.1188 5.90292 19.6466 5.867 19.142L5 7H19ZM15 7V4C15 3.73478 14.8946 3.48043 14.7071 3.29289C14.5196 3.10536 14.2652 3 14 3H10C9.73478 3 9.48043 3.10536 9.29289 3.29289C9.10536 3.48043 9 3.73478 9 4V7H15Z"
                            stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <span class="pl-2">delete order</span>
                </button>
            </div>
        </div>
    </div>
</template>
<script setup>
const deskree = useDeskree();
const adminStore = useAdminStore()
//tables logic
const columns = [{ name: "to", value: "wilaya" },
{ name: "value (DA)", value: "price" },
{ name: "order date", value: "createdAt" }]
const waitingOrdersObj = computed(() => adminStore.ordersObject?.data.filter((order) => order.attributes.delivery_status === "waiting").slice(0, 4))
const deliveringOrdersObj = computed(() => adminStore.ordersObject?.data.filter((order) => order.attributes.delivery_status === "delivering").slice(0, 4))



//query logic
const searchOptions = [
    { name: "buyer name", value: "buyer_name" },
    { name: "uid", value: "uid" },
    { name: "delivery status", value: "delivery_status" },
    { name: "order value", value: "price" },
    { name: "wilaya", value: "wilaya" }
]
const queryData = ref()
const handleQuery = async (queryText, queryParameter) => {
    console.log('queryText, queryParameter: ', queryText, queryParameter);
    const queryObject = adminStore.generateQueryObject(queryParameter, queryText)
    const res = await deskree.handleQuery("/orders", queryObject)
    queryData.value = res.data
}



//modal logic
const showModal = ref(false);
const modalProperties = [
    { name: "name", value: "buyer_name" },
    { name: "address", value: "address" },
    { name: "wilaya", value: "wilaya" },
    { name: "delivery status", value: "delivery_status" },
    { name: "product id", value: "product_id" },
    { name: "order value", value: "price" },
]

const modalObject = ref()
const currentUid = ref()
const ObjToUse = ref()
let currentIndex = ref()
function toggleModal(index, selectedObj) {
    currentIndex.value = index
    ObjToUse.value = selectedObj === 'queryData' ? queryData.value : 'waitingOrdersObj' ? waitingOrdersObj.value : deliveringOrdersObj.value
    currentUid.value = ObjToUse.value[index].uid
    modalObject.value = Object.assign({}, ObjToUse.value[index].attributes)
    showModal.value = !showModal.value;

}


const handlePatch = async (uid, reqBody) => {

    try {
        console.log(adminStore.ordersObject.data)
        const newObj = await deskree.orders.editOrder(uid, reqBody)
        adminStore.ordersObject.data.find((order) => order.uid === uid).attributes = newObj.data;
        useAlertsStore().success("done successfully")
    }
    catch (err) {
        console.log(err)
        useAlertsStore().error("an error occurred, please contact the dev team")
    }
}

const handleDelete = async (uid) => {
    try {
        await deskree.orders.deleteOrder(uid);
        const orderIndex = adminStore.ordersObject.data.findIndex((order) => order.uid === uid)
        adminStore.ordersObject.data.splice(orderIndex, 1)


    } catch (err) {
        console.log(err);
    }
}
//TASK 3
/*
const editUserOrders = async (userUid) => {
    console.log("its", userUid)
    const user = await deskree.user.getByUid(userUid)

}*/
</script>
<style scoped>
section {
    margin-block: 2rem;
}

.title {
    font-family: "DM Sans;";
    font-weight: 500;
    font-size: 1.375rem;
    color: #228B22
}

.table {
    font-family: "DM Sans"
}

.table-compact :where(th, td) {
    white-space: pre-line;
}

tbody {
    box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
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

.btn-truck>img,
.btn-check>img {
    margin: 0 auto;
}

.btn-truck:hover,
.btn-check:hover {
    filter: contrast(1.2);
}

.btn-check {
    background-color: #BFFAD0;
}
</style>