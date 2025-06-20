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
            <div class="modal-box text-center">

                <select class="select max-w-xs shadow bg-base-100 rounded-box w-52 mt-2 mb-8" v-model="selectedLocale">
                    <option disabled selected>Select language</option>
                    <option v-for="locale in manageLocale.availableLocalesCodes" :key="locale" :value="locale">{{
                        manageLocale.localeNames[locale] }}</option>
                </select>
                <table class="table table-compact w-full">
                    <tbody>
                        <tr v-for="property in modalProperties">
                            <td>{{ property.name }}</td>
                            <input v-if="property.HTMLElement === 'input'" placeholder="Type here"
                                class="input input-bordered w-full max-w-xs input-sm my-2"
                                :type="property.type === 'number' ? 'number' : 'text'"
                                v-model="modalBind(property).value" />
                            <textarea v-else-if="property.HTMLElement === 'textarea'" placeholder="Type here" rows="6"
                                class="textarea textarea-bordered textarea-md w-full max-w-xs"
                                v-model="modalBind(property).value"></textarea>
                            <select class="select select-bordered w-full max-w-xs"
                                v-else-if="property.HTMLElement === 'dropdown'" v-model="modalBind(property).value[0]"
                                :id="property.name">
                                <option disabled value="">{{ $t('Buttons.select') }}</option>
                                <option v-for="item in property.items" :key="item" :value="item">{{ item }}</option>
                            </select>

                            <div v-else-if="property.HTMLElement === 'chips'"
                                class="categories flex flex-col flex-wrap gap-2">
                                <div class="flex flex-wrap gap-2">
                                    <div v-for="(item, index) in modalBind(property).value"
                                        class="btn btn-sm  btn-outline normal-case gap-2 cursor-default ">
                                        {{ item }}
                                        <button class="badge badge-sm badge-error"
                                            @click="selectedProduct.fields[property.value][property.localized ? selectedLocale : defaultLocale].splice(index, 1)">X</button>
                                    </div>
                                </div>
                                <input type="text" :placeholder="`add new ${property.name}`"
                                    class="input input-bordered max-w-xs my-4"
                                    @keyup.enter="(e) => { selectedProduct.fields[property.value][property.localized ? selectedLocale : defaultLocale].push(e.target.value); e.target.value = '' }" />
                            </div>
                            <!--upload an image (only available for new products)-->
                            <label class="block pt-4 pb-2"
                                v-else-if="!existingProduct && property.HTMLElement === 'imageInput'">
                                <input id="product-pic-input" type="file" multiple accept="image/*"
                                    class="file-input file-input-success w-full max-w-xs mt-2" /></label>
                            <td></td>
                        </tr>
                    </tbody>
                </table>


                <div class="modal-action">
                    <button class="btn" @click="showFieldsModal = false">
                        {{ $t('Buttons.cancel') }}
                    </button>
                    <!--existingProduct buttons-->
                    <button :disabled="disableModalActions" v-if="existingProduct" class="btn" @click="handlePatch()">

                        <span class="pl-2">{{ $t('Buttons.applyChanges') }}</span>
                    </button>
                    <button :disabled="disableModalActions" v-if="existingProduct" class="btn  btn-error"
                        @click="handleDelete">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M10 11V17M14 11V17M4 7H20M19 7L18.133 19.142C18.0971 19.6466 17.8713 20.1188 17.5011 20.4636C17.1309 20.8083 16.6439 21 16.138 21H7.862C7.35614 21 6.86907 20.8083 6.49889 20.4636C6.1287 20.1188 5.90292 19.6466 5.867 19.142L5 7H19ZM15 7V4C15 3.73478 14.8946 3.48043 14.7071 3.29289C14.5196 3.10536 14.2652 3 14 3H10C9.73478 3 9.48043 3.10536 9.29289 3.29289C9.10536 3.48043 9 3.73478 9 4V7H15Z"
                                stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <span class="pl-2">{{ $t('Buttons.deleteProduct') }}</span>
                    </button>
                    <!--newProducts buttons-->
                    <button :disabled="disableModalActions" v-if="!existingProduct" class="btn" @click="createProduct">
                        <span class="pl-2">{{ $t('Buttons.createProduct') }}</span>
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
                                <button class="btn btn-primary" @click="unlinkAsset(asset.sys.id)">{{
                                    $t('Buttons.delete') }}</button>
                            </div>
                        </div>
                    </div>
                    <div class="card w-full bg-base-100 shadow-xl">
                        <figure class="px-10 pt-10">
                            <img class="product-img rounded-xl " src="~/assets/icons/image.svg" alt="upload an image" />
                        </figure>
                        <div class="card-body items-center text-center">
                            <div class="card-actions">
                                <label class="btn btn-primary max-w-full" for="product-pic-input">{{
                                    $t('Buttons.uploadImage') }}</label>
                                <input id="product-pic-input" type="file" accept="image/*" multiple @input="addNewImage"
                                    class="file-input file-input-primary w-full max-w-xs " style="display: none" />
                            </div>
                        </div>
                    </div>


                </div>
                <div class="modal-action">
                    <button class="btn" @click="showAssetsModal = false">
                        {{ $t('Buttons.cancel') }}
                    </button>
                </div>
            </div>

        </div>

        <!--dropdown button -- add a product / manage categories-- -->
        <div class="dropdown dropdown-hover dropdown-top dropdown-end fixed">
            <label tabindex="0" class="dropdown-btn btn btn-primary m-1 bg-white shadow-xl border-gray-200 btn-circle">
                <svg width="51" height="42" viewBox="0 0 51 42" stroke="#3F3F46" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M29.4028 7.69796C28.5117 4.66871 23.2865 4.66871 22.3954 7.69796C21.8181 9.65593 19.0988 10.584 17.0154 9.53518C13.7858 7.9136 10.0918 10.9618 12.058 13.6236C12.3536 14.0234 12.5305 14.4751 12.5744 14.942C12.6183 15.4088 12.5279 15.8776 12.3106 16.3102C12.0933 16.7428 11.7552 17.1269 11.3238 17.4314C10.8925 17.7358 10.38 17.952 9.82822 18.0623C6.15512 18.7972 6.15512 23.1064 9.82822 23.8413C10.3795 23.9519 10.8914 24.1682 11.3223 24.4726C11.7532 24.777 12.0909 25.161 12.3079 25.5933C12.525 26.0257 12.6153 26.4941 12.5715 26.9606C12.5277 27.4272 12.3511 27.8786 12.0559 28.2782C10.0897 30.9417 13.7858 33.9882 17.0134 32.3667C17.4981 32.1229 18.0458 31.977 18.6119 31.9408C19.178 31.9046 19.7464 31.9791 20.2709 32.1584C20.7955 32.3376 21.2613 32.6164 21.6304 32.9722C21.9996 33.3279 22.2617 33.7505 22.3954 34.2056C23.2865 37.2349 28.5117 37.2349 29.4028 34.2056C29.5368 33.7509 29.7991 33.3288 30.1682 32.9734C30.5374 32.6181 31.003 32.3396 31.5272 32.1606C32.0514 31.9816 32.6194 31.9071 33.1851 31.9432C33.7508 31.9793 34.2981 32.125 34.7827 32.3684C38.0124 33.99 41.7064 30.9417 39.7401 28.2799C39.4446 27.8801 39.2676 27.4285 39.2238 26.9616C39.1799 26.4948 39.2703 26.026 39.4876 25.5934C39.7049 25.1608 40.043 24.7766 40.4743 24.4722C40.9057 24.1677 41.4181 23.9516 41.9699 23.8413C45.643 23.1064 45.643 18.7972 41.9699 18.0623C41.4186 17.9517 40.9067 17.7354 40.4759 17.431C40.045 17.1265 39.7073 16.7426 39.4902 16.3102C39.2732 15.8779 39.1829 15.4095 39.2267 14.9429C39.2704 14.4764 39.4471 14.025 39.7422 13.6254C41.7085 10.9618 38.0124 7.91532 34.7848 9.5369C34.3 9.78066 33.7523 9.92658 33.1863 9.96277C32.6202 9.99897 32.0518 9.92442 31.5272 9.7452C31.0027 9.56598 30.5369 9.28714 30.1677 8.9314C29.7986 8.57565 29.5365 8.15304 29.4028 7.69796Z"
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path
                        d="M30.3363 24.6112C31.5132 23.6407 32.1743 22.3243 32.1743 20.9517C32.1743 19.5792 31.5132 18.2628 30.3363 17.2923C29.1595 16.3217 27.5634 15.7765 25.8991 15.7765C24.2348 15.7765 22.6386 16.3217 21.4618 17.2923C20.285 18.2628 19.6238 19.5792 19.6238 20.9517C19.6238 22.3243 20.285 23.6407 21.4618 24.6112C22.6386 25.5817 24.2348 26.127 25.8991 26.127C27.5634 26.127 29.1595 25.5817 30.3363 24.6112Z"
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>

            </label>
            <ul tabindex="0"
                class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 border border-slate-300">
                <li><a @click="handleFieldsModal(undefined)">{{ $t('AdminProducts.addProduct') }}</a></li>
                <li><a @click="openCategoriesModal">{{ $t('AdminProducts.manageCategories') }}</a></li>
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

const { t } = useI18n()
const { $contentfulManager } = useNuxtApp();
const Contentful = useContentful();
const alertsStore = useAlertsStore()
const manageContentType = Contentful.management.contentType
const manageLocale = Contentful.management.locale
const manageEntry = Contentful.management.entry
const manageAsset = Contentful.management.asset

//check if the products hadn't been fetched yet. if so fetch them
const productStore = useProductStore();
if (productStore.products.length === 0) useAsyncData("products", async () => productStore.fetchProducts());

//fields modal logic
const showFieldsModal = ref(false)
const modalProperties = ref([])

onMounted(async () => {
    if (!manageContentType.object?.fields) await manageContentType.set("product")
    //generate the modal properties from the contentful content type
    modalProperties.value = generateModalProperties(manageContentType.object?.fields);
})


const types = [
    { TypeName: 'Text', defaultValue: '', HTMLElement: 'textarea' },
    { TypeName: 'Symbol', defaultValue: '', HTMLElement: 'input' },
    { TypeName: 'Number', defaultValue: 0, HTMLElement: 'input' },
    { TypeName: 'Integer', defaultValue: 0, HTMLElement: 'number' },
    { TypeName: 'Boolean', defaultValue: false, HTMLElement: 'checkbox' },
    { TypeName: 'Object', defaultValue: {}, HTMLElement: 'json-editor' },
    { TypeName: 'Date', defaultValue: '', HTMLElement: 'date' },
    { TypeName: 'Array', defaultValue: [], HTMLElement: 'inputOrDropdown' }  // if type is Array, HTMLElement will be : input if(!items); dropdown  if(items & max = 1); multiselect if(items & max >= 1)   
];

const generateModalProperties = (fields) => {
    const typeMap = Object.fromEntries(types.map(t => [t.TypeName, t]));

    return fields.map(field => {
        const { id, type, localized, required, validations, items } = field;

        const typeInfo = typeMap[type] || {
            defaultValue: null,
            HTMLElement: 'input'
        };

        const prop = {
            name: id,
            value: id,
            localized,
            required,
            type: type.toLowerCase(),
            HTMLElement: typeInfo.HTMLElement
        };

        // Special handling for Array
        if (type === 'Array') {

            const validationItems = items?.validations?.find(v => v.in)?.in;
            const max = validations?.find(v => v.size?.max)?.size?.max;
            if (validationItems) prop.items = validationItems;

            if (id === "image") {
                prop.HTMLElement = 'imageInput';
            }
            else if (max === 1 && validationItems) {
                prop.size = max;
                prop.HTMLElement = 'dropdown'; // single select
            } else if (validationItems && (!max || max > 1)) {
                prop.HTMLElement = 'multiselect'; // multiple select
            }
            else if (!validationItems) {
                prop.HTMLElement = 'chips'; // multiple select
            }
        }

        return prop;
    });
}


const createBlankProductEntry = () => {
    const locales = manageLocale.availableLocalesCodes
    const defaultLocale = manageLocale.defaultLocale
    const typeMap = Object.fromEntries(types.map(t => [t.TypeName.toLowerCase(), t.defaultValue]));
    const entry = {};

    for (const prop of modalProperties.value) {
        // Get default value from types map (falling back to empty string)
        const defaultValue = typeMap[prop.type] ?? '';

        // Assign value per localization
        if (prop.localized) {
            entry[prop.name] = Object.fromEntries(
                locales.map(locale => [locale, Array.isArray(defaultValue) ? [...defaultValue] : defaultValue])
            );
        } else {
            entry[prop.name] = {
                [defaultLocale]: Array.isArray(defaultValue) ? [...defaultValue] : defaultValue
            };
        }
    }

    return entry;
};
//product editing
const selectedProduct = ref()
const existingProduct = ref(true)
const selectedLocale = ref("en-US")
const defaultLocale = manageLocale.defaultLocale
const handleFieldsModal = async (id) => {
    //if the id is provided, it means we are editing an existing product
    //if not, we are creating a new product

    const blankEntry = createBlankProductEntry()

    if (id) {
        existingProduct.value = true
        //blank properties are not returned from contentful; SO we add them from the blank entry
        selectedProduct.value = await $contentfulManager.entry.get({ entryId: id });
        for (const key in blankEntry) {
            if (!(key in selectedProduct.value.fields)) {
                selectedProduct.value.fields[key] = blankEntry[key];
            }
        }

    }
    else {
        existingProduct.value = false
        selectedProduct.value = { fields: {} }
        selectedProduct.value.fields = blankEntry
    }

    showFieldsModal.value = true

}
// function uses a writable computed property to bind the modal inputs to the selected product fields
function modalBind(property) {
    return computed({
        get() {
            const field = selectedProduct.value.fields[property.value];
            const locale = property.localized ? selectedLocale.value : defaultLocale;
            return field?.[locale];
        },
        set(newValue) {
            const locale = property.localized ? selectedLocale.value : defaultLocale;
            selectedProduct.value.fields[property.value][locale] = newValue;
        }
    });
}

const handlePatch = async () => {
    const isFormValidOrError = validateProductForm();
    if (isFormValidOrError !== true) {
        alertsStore.warning(isFormValidOrError)
        return
    }
    try {

        //update the entry
        const productObj = await $contentfulManager.entry.update({
            entryId: selectedProduct.value.sys.id
        }, selectedProduct.value)
        //publish it
        const res = await $contentfulManager.entry.publish({
            entryId: productObj.sys.id
        }, productObj)

        alertsStore.success(t("AdminProducts.alertProductUpdated"));
    }
    catch (err) {
        alertsStore.error(t("AdminProducts.alertTypicalError"))
    }
    finally {
        showFieldsModal.value = false;
        productStore.products = []
        productStore.fetchProducts()
    }
}

// Helper function to check if a value is empty
function isValueEmpty(val) {
    if (val == null) return true;
    if (typeof val === 'string') return val.trim() === '';
    if (Array.isArray(val)) return val.length === 0;
    if (typeof val === 'object' && !Array.isArray(val)) return Object.keys(val).length === 0;
    return false;
}

// checks the product form for validity Except for image which is validated separately
//returns true if the product form is valid, otherwise returns an error message (string)
const validateProductForm = () => {
    const availableLocales = manageLocale.availableLocalesCodes
    const requiredLocales = manageLocale.requiredLocales
    const typesMap = Object.fromEntries(types.map(t => [t.TypeName.toLowerCase(), t.defaultValue]));
    const propertiesExcludingImage = modalProperties.value.filter(p => p.HTMLElement !== 'imageInput')
    for (const property of propertiesExcludingImage) {
        const { value: fieldName, required, localized, type, items, validations = [] } = property;
        const localesToCheck = localized ? availableLocales : [defaultLocale];
        const fieldData = selectedProduct.value.fields[fieldName];
        const inValidation = items?.validations?.find(v => v.in);
        const sizeValidation = validations.find(v => v.size?.max);
        const expectedType = type !== 'array' ? typeof typesMap[type] : null;

        for (const locale of localesToCheck) {
            const val = fieldData?.[locale];

            // 1. Required
            if (required && requiredLocales.includes(locale) && isValueEmpty(val)) {
                return `${fieldName} field is required (${locale})`;
            }

            // 2. "in" validation
            if (inValidation && Array.isArray(val)) {
                const invalid = val.filter(item => !inValidation.in.includes(item));
                if (invalid.length > 0) {
                    return inValidation.message || `${fieldName} has invalid value(s): ${invalid.join(', ')}`;
                }
            }

            // 3. size.max
            if (sizeValidation && Array.isArray(val) && val.length > sizeValidation.size.max) {
                return sizeValidation.message || `${fieldName} must have at most ${sizeValidation.size.max} item(s)`;
            }

            // 4. Type check (optional)
            if (expectedType && val != null && typeof val !== expectedType) {
                return `${fieldName} must be of type ${expectedType}`;
            }
        }
    }

    return true; // ✅ All valid
}

// assets modal logic
const disableModalActions = ref(false)
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
        alertsStore.warning(t("AdminProducts.alertLastAssetDeletionError"))
        return
    }

    selectedProduct.value = await $contentfulManager.entry.get({ entryId: selectedProductId.value });
    const newAssetsArray = selectedProduct.value.fields.image['en-US'].filter(asset => asset.sys.id !== assetId)
    selectedProduct.value.fields.image[defaultLocale] = newAssetsArray;
    await handlePatch()
    deleteAsset(assetId)
    //update product Assets
    await productStore.fetchProducts()
    const updatedProduct = productStore.products.find((product) => product.sys.id === selectedProductId.value)
    productAssets.value = updatedProduct.fields.image
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
        alertsStore.error(t("AdminProducts.alertAssetDeletionError"))
    }

}


const addNewImage = async () => {
    const pictures = Array.from(document.getElementById("product-pic-input").files);

    if (pictures.length !== 0) {
        try {
            alertsStore.info(t("AdminProducts.alertUploadingImage"))
            const assets = await handleAssetsUploading(pictures)
            showAssetsModal.value = false
            selectedProduct.value = await $contentfulManager.entry.get({ entryId: selectedProductId.value });
            assets.forEach((asset) => { linkAssetToEntry(asset.sys.id) })
            await handlePatch()
            alertsStore.success(t("AdminProducts.alertImageAdded"))
        }
        catch (err) {
            alertsStore.error(t("AdminProducts.alertImageAddError"))
        }
    }
}
//new product logic

const createProduct = async () => {
    //upload picture > create asset & process it fot all locales
    const isFormValidOrError = validateProductForm();
    const pictures = Array.from(document.getElementById("product-pic-input").files);

    if (isFormValidOrError !== true) {
        alertsStore.warning(isFormValidOrError)
        return
    }
    else if (!pictures || pictures.length === 0) {
        alertsStore.warning(t("AdminProducts.alertImageRequired"))
        return
    }
    //check if all fields are written then upload then create the entry and upload the image  
    else if (isFormValidOrError === true && pictures.length) {

        try {
            disableModalActions.value = true;
            alertsStore.info(t("AdminProducts.alertUploadingImage"))
            const assets = await handleAssetsUploading(pictures)
            assets.forEach((asset) => { linkAssetToEntry(asset.sys.id) })
            const entry = await createEntry();
            await publishEntry(entry)
            alertsStore.success(t("AdminProducts.alertProductCreated"));
            showFieldsModal.value = false;
            productStore.fetchProducts()
        }
        catch (err) {
            alertsStore.warning(t("AdminProducts.alertProductCreateError"))
        } finally {
            disableModalActions.value = false
        }

    }
}

//uploads the images and creates assets for them then publishes the asset
const handleAssetsUploading = async (pictures) => {


    // Step 1: Upload all pictures in parallel
    const uploadIds = await Promise.all(
        pictures.map((picture, index) =>
            uploadPicture(picture).then((uploadId) => {
                alertsStore.info(`${t("AdminProducts.alertImageUploaded")} ${index + 1}`);
                return uploadId;
            })
        )
    );
    // Step 2: Create and process assets in parallel
    const assets = await Promise.all(uploadIds.map((uploadId, i) =>
        createAsset(uploadId, pictures[i])
    ));
    assets.forEach(asset => {
        publishAsset(asset).catch(err => {
            console.error(`Failed to publish asset ${asset.sys.id}:`, err);
        })
    });

    return assets
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
const publishAsset = async (asset) => {
    //somehow you need to increase the version of the asset by 1 to publish it
    asset.sys.version = asset.sys.version + 1;
    const assetId = asset.sys.id
    await $contentfulManager.asset.publish({ assetId }, asset)

}
const linkAssetToEntry = (assetId) => {
    selectedProduct.value.fields.image[defaultLocale].push(
        {
            sys: {
                id: assetId,
                linkType: 'Asset',
                type: 'Link',
            }

        })

}

const createEntry = async () => await $contentfulManager.entry.create({ contentTypeId: "product" }, selectedProduct.value)
const publishEntry = async (entry) => {
    const entryId = entry.sys.id;
    await $contentfulManager.entry.publish({ entryId }, entry)
}



const handleDelete = async () => {
    try {
        disableModalActions.value = true;
        await $contentfulManager.entry.unpublish({
            entryId: selectedProduct.value.sys.id
        })
        await $contentfulManager.entry.delete({
            entryId: selectedProduct.value.sys.id
        })
        const entryAssetsIds = selectedProduct.value.fields.image[defaultLocale].map(asset => asset.sys.id)
        entryAssetsIds.forEach(assetId => { deleteAsset(assetId) })
        alertsStore.success(t("AdminProducts.alertProductDeleted"))
        showFieldsModal.value = false;
        productStore.fetchProducts()
    }
    catch (err) {
        alertsStore.error(t("AdminProducts.alertProductDeletionError"))
    } finally {
        disableModalActions.value = false
    }
}
/*  Since An APi call is made to fetch the product, I chose to fetch all products instead 
const updateProductLocally = async (productId, isNewProduct) => {
    const productIndex = productStore.products.findIndex(product => product.sys.id === productId);
     const productObj = await productStore.fetchProduct(productId, 'en-Us')
    if (productIndex !== -1 && !isNewProduct) {
        productStore.products.splice(productIndex, 1, productObj);
    } else {
        productStore.products.push(productObj);
    }
}
 */
//categories logic
const showCategoriesModal = ref(false);
const categories = ref([])

const openCategoriesModal = async () => {
    const contentType = manageContentType.object
    const field = contentType?.fields.find(field => field.id === "category");

    if (field?.items?.validations?.[0]) {
        categories.value = field.items.validations[0].in
    }
    showCategoriesModal.value = !showCategoriesModal.value;
}
const patchCategories = async () => {
    let contentType = manageContentType.object;

    try {
        contentType = manageContentType.object = await $contentfulManager.contentType.update(
            { contentTypeId: "product" },
            contentType
        );
        modalProperties.value = generateModalProperties(contentType?.fields);
        alertsStore.success(t("AdminProducts.alertCategoriesUpdated"));
        showCategoriesModal.value = false;
    } catch (err) {
        alertsStore.error(t("AdminProducts.alertCategoriesNotUpdated"));
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

.dropdown-btn:hover>svg {
    stroke: white;
}
</style>