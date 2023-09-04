<template>
    <div>
        <div v-if="productStore.products"
            class="gap-7 p-10 sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-wrap justify-items-stretch items-stretch">
            <TransitionGroup name="products">
                <AdminProductCard v-for="product in productStore.products" :product="product" :key="product.sys.id"
                    class="mb-5" @open-modal="handleModal" />
            </TransitionGroup>
        </div>

        <!--modal-->
        <div class="modal" :class="{ 'modal-open': showModal }" v-if="showModal">
            <div class="modal-box">
                <table class="table table-compact w-full">
                    <tbody>
                        <tr v-for="property in modalProperties">
                            <td>{{ property.name }}</td>
                            <input v-if="property.name !== 'description'" placeholder="Type: here"
                                class="input input-bordered w-full max-w-xs input-sm my-2"
                                :type="property.name === 'price' ? 'number' : 'text'"
                                v-model="selectedProduct.fields[property.value]['en-US']" />
                            <textarea v-else placeholder="Type here"
                                class="textarea textarea-bordered textarea-md w-full max-w-xs"
                                v-model="selectedProduct.fields[property.value]['en-US']"></textarea>
                            <td></td>
                        </tr>
                    </tbody>
                </table>

                <div class="modal-action">
                    <button class="btn" @click="showModal = false">
                        close
                    </button>
                    <button class="btn  " @click="handlePatch">

                        <span class="pl-2">apply changes</span>
                    </button>

                    <button class="btn  btn-error" @click="handleDelete">
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
    </div>
</template>
<script setup>
const { $contentfulManager } = useNuxtApp();
//check if the products hadn't been fetched yet. if so fetch them
const productStore = useProductStore();
if (productStore.products.length === 0) useAsyncData("products", async () => productStore.fetchProducts());


//modal logic
const showModal = ref(false)
const modalProperties = [
    { name: "name", value: "name" },
    { name: "summary", value: "summary" },
    { name: "description", value: "description" },
    { name: "price", value: "price" },

]


//product editing
//const selectedId = ref('')
const selectedProduct = ref()

const handleModal = async (id) => {
    //selectedId.value = id;
    // const findProductById = productStore.products.find((product) => product.sys.id === id)
    selectedProduct.value = await $contentfulManager.entry.get({ entryId: id })
    console.log(selectedProduct.value)
    showModal.value = true

}

const handlePatch = async () => {
    try {
        //update the entry
        selectedProduct.value = await $contentfulManager.entry.update({
            entryId: selectedProduct.value.sys.id
        }, selectedProduct.value)
        //publish it
        const res = await $contentfulManager.entry.publish({
            entryId: selectedProduct.value.sys.id
        }, selectedProduct.value)

        useAlertsStore().success("Done!")
    }
    catch (err) {
        console.log(err);
        useAlertsStore().error("An error occurred, please contact teh dev team")
    }
    finally {
        showModal.value = false;
        productStore.fetchProducts()
    }
}



const handleDelete = async () => {
    try {
        await $contentfulManager.entry.delete({
            entryId: selectedProduct.value.sys.id
        })
    }
    catch (err) {
        console.log(err)
    }
    finally {
        showModal.value = false;
        productStore.fetchProducts()
    }
}
</script>
<style >
.product-card {
    transition: all 0.5s ease-in-out;
}

.products-enter-from {
    transform: scale(0.5) translateY(-80px);
    opacity: 0;
}

.products-leave-to {
    transform: translateY(30px);
    opacity: 0;
}

.products-leave-active {
    position: absolute;
    z-index: -1;
}
</style>