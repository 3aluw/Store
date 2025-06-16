<script setup lang="ts">
defineProps<{
    product: any;
}>();
const emit = defineEmits(["open-fields-modal", "open-assets-modal"])

const emitProductUid = (id: string, modalType: "fields" | "assets") => {

    modalType === "fields" ? emit("open-fields-modal", id) : emit("open-assets-modal", id);
}
</script>

<template>
    <div class="card h-full bg-base-100 shadow-xl relative">

        <figure>
            <img class="product-img" :src="product.fields.image[0].fields?.file.url"
                :alt="product.fields.image[0].fields?.file.description" />
        </figure>
        <div class="card-body justify-between">
            <h2>
                <span class="w-4/5 font-bold"> {{ product.fields.name }} </span>
            </h2>

            <div class="card-actions justify-end mt-3">
                <button class="btn btn-circle btn-outline btn-primary border-gray-200 p-2 product-card-action-btn"
                    @click="emitProductUid(product.sys.id, 'fields')">
                    <svg class="w-full h-full" width="15" height="14" stroke="#959393" viewBox="0 0 15 14" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M9.38533 3.05195L11.448 5.11461M10.2603 2.17695C10.5339 1.90342 10.9048 1.74976 11.2917 1.74976C11.6785 1.74976 12.0495 1.90342 12.323 2.17695C12.5965 2.45047 12.7502 2.82146 12.7502 3.20828C12.7502 3.59511 12.5965 3.96609 12.323 4.23961L4.29167 12.2709H2.25V10.1873L10.2603 2.17695Z"
                            stroke-linecap="round" stroke-linejoin="round" />
                    </svg>

                </button>
                <button class="btn btn-circle btn-outline btn-primary border-gray-200 p-2 product-card-action-btn"
                    @click="emitProductUid(product.sys.id, 'assets')">
                    <svg class="w-full h-full" width="20" height="19" viewBox="0 0 25 25" fill="none" stroke="#959393"
                        stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        xmlns="http://www.w3.org/2000/svg">
                        <rect width="19" height="18" x="3" y="3" rx="2" ry="2"></rect>
                        <path d="M8.5 7a1.5 1.5 0 1 0 0 3 1.5 1.5 0 1 0 0-3z"></path>
                        <path d="m21 15-5-5L5 21"></path>
                    </svg>
                </button>
                <NuxtLink class="product-card" :to="{ name: 'products-id', params: { id: product.sys.id } }" target="_blank"> <button
                        class="btn btn-circle btn-outline btn-primary border-gray-200 p-2 product-card-action-btn">
                        <svg class="w-full h-full" stroke="#959393" width="20" height="19" viewBox="0 0 20 19"
                            fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M8.41663 4.75008H5.24996C4.83003 4.75008 4.42731 4.9169 4.13037 5.21383C3.83344 5.51076 3.66663 5.91349 3.66663 6.33341V14.2501C3.66663 14.67 3.83344 15.0727 4.13037 15.3697C4.42731 15.6666 4.83003 15.8334 5.24996 15.8334H13.1666C13.5866 15.8334 13.9893 15.6666 14.2862 15.3697C14.5831 15.0727 14.75 14.67 14.75 14.2501V11.0834M11.5833 3.16675H16.3333M16.3333 3.16675V7.91675M16.3333 3.16675L8.41663 11.0834"
                                stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" />
                        </svg>
                    </button>
                </NuxtLink>


            </div>
        </div>
    </div>
</template>


<style scoped>
.product-img {
    width: 100%;
    height: 200px;
    object-fit: contain;
}

.product-card-action-btn:hover>svg {
    stroke: white;
}
</style>
