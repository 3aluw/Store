<template>
    <div>
        <div v-if="productStore.products"
            class="gap-7 p-10 sm:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 flex-wrap justify-items-stretch items-stretch">
            <TransitionGroup name="products">
                <AdminProductCard v-for="product in productStore.products" :product="product" :key="product.sys.id"
                    class="mb-5" @open-fields-modal="handleFieldsModal" @open-assets-modal="handleAssetsModal" />
            </TransitionGroup>
        </div>

        <!--fields modal-->
        <div class="modal" :class="{ 'modal-open': showFieldsModal }" v-if="showFieldsModal">
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
                <!--upload an image (only available for new products)-->
                <label class="block pt-4 pb-2" v-if="!existingProduct">Chose an image for the product
                    <input id="product-pic-input" type="file"
                        class="file-input file-input-success w-full max-w-xs mt-2" /></label>

                <div class="modal-action">
                    <button class="btn" @click="showFieldsModal = false">
                        cancel
                    </button>
                    <!--existingProduct buttons-->
                    <button v-if="existingProduct" class="btn" @click="handlePatch(selectedProduct)">

                        <span class="pl-2">apply changes</span>
                    </button>
                    <button v-if="existingProduct" class="btn  btn-error" @click="handleDelete">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M10 11V17M14 11V17M4 7H20M19 7L18.133 19.142C18.0971 19.6466 17.8713 20.1188 17.5011 20.4636C17.1309 20.8083 16.6439 21 16.138 21H7.862C7.35614 21 6.86907 20.8083 6.49889 20.4636C6.1287 20.1188 5.90292 19.6466 5.867 19.142L5 7H19ZM15 7V4C15 3.73478 14.8946 3.48043 14.7071 3.29289C14.5196 3.10536 14.2652 3 14 3H10C9.73478 3 9.48043 3.10536 9.29289 3.29289C9.10536 3.48043 9 3.73478 9 4V7H15Z"
                                stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <span class="pl-2">delete product</span>
                    </button>
                    <!--newProducts buttons-->
                    <button v-if="!existingProduct" class="btn" @click="createProduct">
                        <span class="pl-2">create product</span>
                    </button>
                </div>
            </div>
        </div>

        <!--assets modal-->
        <div class="modal" :class="{ 'modal-open': showAssetsModal }" v-if="showAssetsModal">
            <div class="modal-box ">
                <div
                    class="pictures-cont gap-7 p-10 sm:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 flex-wrap justify-items-stretch items-stretch">
                    <div v-for="asset in productAssets" class="card w-full bg-base-100 shadow-xl">
                        <figure class="px-10 pt-10">
                            <img class="product-img rounded-xl " :src="asset.fields.file.url"
                                :alt="asset.fields.file.title" />
                        </figure>
                        <div class="card-body items-center text-center">
                            <div class="card-actions">
                                <button class="btn btn-primary" @click="unlinkAsset(asset.sys.id)">delete</button>
                            </div>
                        </div>
                    </div>
                    <div class="card w-full bg-base-100 shadow-xl">
                        <figure class="px-10 pt-10">
                            <img class="product-img rounded-xl " src="~/assets/icons/image.svg" alt="upload an image" />
                        </figure>
                        <div class="card-body items-center text-center">
                            <div class="card-actions">
                                <label class="btn btn-primary" for="add-product-pic-input">upload new</label>
                                <input id="add-product-pic-input" type="file" accept="image/*" @input="addNewImage"
                                    class="file-input file-input-primary w-full max-w-xs " style="display: none" />
                            </div>
                        </div>
                    </div>


                </div>
                <div class="modal-action">
                    <button class="btn" @click="showAssetsModal = false">
                        cancel
                    </button>
                </div>
            </div>

        </div>

        <!--dropdown button -- add a product / manage categories-- -->
        <div class="dropdown dropdown-hover dropdown-top dropdown-end fixed">
            <label tabindex="0" class="btn m-1 bg-white shadow-xl border-red-400 btn-circle"><img
                    src="~/assets/icons/cog.svg"></label>
            <ul tabindex="0"
                class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 border border-slate-300">
                <li><a @click="handleFieldsModal(undefined)">Add a product</a></li>
                <li><a @click="openCategoriesModal">manage categories</a></li>
            </ul>
        </div>

        <!--categories modal-->
        <div class="modal" :class="{ 'modal-open': showCategoriesModal }" v-if="showCategoriesModal">
            <div class="modal-box">
                <div class="categories flex flex-wrap gap-2">
                    <div v-for="(category, index) in categories"
                        class="btn btn-sm  btn-outline normal-case gap-2 cursor-default ">
                        {{ category }}
                        <button class="badge badge-sm badge-error" @click="categories.splice(index, 1)">X</button>
                    </div>
                </div>
                <input type="text" placeholder="add a new category" class="input input-bordered max-w-xs my-4"
                    @keyup.enter="(e) => { categories.push(e.target.value); e.target.value = '' }" />
                <div class="modal-action">
                    <button class="btn" @click="showCategoriesModal = false">
                        Cancel
                    </button>
                    <button class="btn" @click="patchCategories"><span class="pl-2">apply changes</span></button>

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


//fields modal logic
const showFieldsModal = ref(false)
const modalProperties = [
    { name: "name", value: "name" },
    { name: "summary", value: "summary" },
    { name: "description", value: "description" },
    { name: "price", value: "price" },

]


//product editing
const selectedProduct = ref()
const existingProduct = ref(true)

const handleFieldsModal = async (id) => {
    //selectedId.value = id;
    // const findProductById = productStore.products.find((product) => product.sys.id === id)
    if (id) { selectedProduct.value = await $contentfulManager.entry.get({ entryId: id }); existingProduct.value = true }
    else {
        existingProduct.value = false
        selectedProduct.value = {}
        selectedProduct.value.fields = {}

        modalProperties.forEach((property) => Object.defineProperty(selectedProduct.value.fields, property.name, {
            value: {
                'en-US': null
            },
            writable: true,
            enumerable: true,

        }))
    }
    showFieldsModal.value = true

}

const handlePatch = async (productObj) => {

    try {
        //update the entry
        productObj = await $contentfulManager.entry.update({
            entryId: productObj.sys.id
        }, productObj)
        //publish it
        const res = await $contentfulManager.entry.publish({
            entryId: productObj.sys.id
        }, productObj)

        useAlertsStore().success("product updated!")
    }
    catch (err) {
        console.log(err);
        useAlertsStore().error("An error occurred, please contact the dev team")
    }
    finally {
        showFieldsModal.value = false;
        showAssetsModal.value = false;
        productStore.products = []
        productStore.fetchProducts()
    }
}

const validateProductForm = (obj) => {
    const allPropertiesHaveContent = Object.values(obj).every(item => {
        const value = item['en-US'];
        const length = typeof value === "string" ? value.replace(/ /g, "").length : Math.ceil(Math.log10(value + 1))
        return value !== null && length > 0;
    })
    return allPropertiesHaveContent
}

// assets modal logic

const showAssetsModal = ref(false)
const productAssets = ref([])
const selectedProductId = ref()

const handleAssetsModal = async (id) => {
    selectedProductId.value = id;
    if (id) {
        const selectedProduct = productStore.products.find((product) => product.sys.id === id)
        productAssets.value = selectedProduct.fields.image
    }
    showAssetsModal.value = true
}



const unlinkAsset = async (assetId) => {
    const assetsArray = productStore.products.find((product) => product.sys.id === selectedProductId.value).fields.image
    if (assetsArray.length === 1) {
        useAlertsStore().warning("You can't delete the last asset")
        return
    }

    const selectedProduct = await $contentfulManager.entry.get({ entryId: selectedProductId.value });
    const newAssetsArray = selectedProduct.fields.image['en-US'].filter(asset => asset.sys.id !== assetId)
    selectedProduct.fields.image['en-US'] = newAssetsArray;
    await handlePatch(selectedProduct)
    deleteAsset(assetId)
}

const deleteAsset = async (assetId) => {
    const assetLinks = await $contentfulManager.entry.getMany({ query: { links_to_asset: assetId } })
    if (assetLinks.total > 0) return
    try {
        await $contentfulManager.asset.unpublish({ assetId })
        await $contentfulManager.asset.delete({ assetId })
    }

    catch (err) {
        console.log(err);
        useAlertsStore().error("An error occurred while deleting the asset")
    }

}


const addNewImage = async () => {
    const picture = document.getElementById("add-product-pic-input").files[0];

    if (picture) {
        try {
            const asset = await handleImageUploading(picture)
            publishAssetOrEntry(asset.sys.id)
            const selectedProduct = await $contentfulManager.entry.get({ entryId: selectedProductId.value });
            const newAssetsArray = selectedProduct.fields.image['en-US'] || [];
            newAssetsArray.push({
                sys: {
                    id: asset.sys.id,
                    linkType: 'Asset',
                    type: 'Link',
                }
            })
            selectedProduct.fields.image['en-US'] = newAssetsArray;
            await handlePatch(selectedProduct)
            useAlertsStore().success("Image added successfully")
        }
        catch (err) {
            useAlertsStore().error("An error occurred while adding the image")
        }
    }
}
//new product logic

const createProduct = async () => {
    //upload picture > create asset & process it fot all locales
    const picture = document.getElementById("product-pic-input").files[0];
    //check if all fields are written then upload then create the entry and upload the image  
    if (picture && validateProductForm(selectedProduct.value.fields)) {

        try {
            const asset = await handleImageUploading(picture)
            const entry = await createEntry(asset.sys.id);
            publishAssetOrEntry(asset.sys.id, entry.sys.id)
            useAlertsStore().success("Product created successfully")
            showFieldsModal.value = false;
        }
        catch (err) {
            useAlertsStore().warning("A problem occurred while creating the product")
        }

    } else {
        useAlertsStore().warning("All fields are required")
    }
}


const handleImageUploading = async (image) => {
    const uploadId = await uploadPicture(image)
    const asset = await createAsset(uploadId, image)
    return asset
}

const uploadPicture = async (picture) => {
    const upload = await $contentfulManager.upload.create(null, {
        file: picture
    })
    return upload.sys.id
}
const createAsset = async (uploadId, picture) => {
    const asset = await $contentfulManager.asset.create({ environmentId: "master" }, {
        "fields": {
            "title": {
                "en-US": picture.name
            },
            "file": {
                "en-US": {
                    "contentType": picture.type,
                    "fileName": picture.name,
                    "uploadFrom": {
                        "sys": {
                            "type": "Link",
                            "linkType": "Upload",
                            "id": uploadId
                        }
                    }
                }
            }
        }

    })
    await $contentfulManager.asset.processForAllLocales({ environmentId: "master" }, asset)
    return asset
}
const createEntry = async (assetId) => {
    selectedProduct.value.fields.image = {
        'en-US': [{
            sys: {
                id: assetId,
                linkType: 'Asset',
                type: 'Link',
            }

        }]
    }

    const entry = await $contentfulManager.entry.create({ contentTypeId: "product" }, selectedProduct.value)
    return entry
}
const publishAssetOrEntry = async (assetId, entryId) => {
    if (assetId) {
        const asset = await $contentfulManager.asset.get({ assetId })
        $contentfulManager.asset.publish({ assetId: asset.sys.id }, asset)
    }

    if (entryId) {
        const entry = await $contentfulManager.entry.get({ entryId })
        $contentfulManager.entry.publish({ entryId: entry.sys.id }, entry)
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
        showFieldsModal.value = false;
        productStore.fetchProducts()
    }
}



//categories logic
const showCategoriesModal = ref(false);
const categories = ref([])
const contentType = ref()
const openCategoriesModal = async () => {
    contentType.value = await $contentfulManager.contentType.get({ "contentTypeId": "product" })
    categories.value = [...contentType.value.fields.find(field => field.id === "category").items.validations[0].in]
    showCategoriesModal.value = !showCategoriesModal.value;
}
const patchCategories = () => {
    console.log(categories.value)
    contentType.value.fields.find(field => field.id === "category").items.validations[0].in = categories.value
    try {
        $contentfulManager.contentType.update({ "contentTypeId": "product" }, contentType.value)
        useAlertsStore().success("categories are updated")
        showCategoriesModal.value = false
    }
    catch (err) {
        console.log(err);
        useAlertsStore().error("categories didn't get updated")
    }
}

</script>
<style scoped>
.product-card {
    transition: all 0.5s ease-in-out;
}

.product-img {
    width: 100%;
    height: 200px;
    object-fit: contain;
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

.dropdown {
    bottom: 2rem;
    right: 0.5rem;
}
</style>