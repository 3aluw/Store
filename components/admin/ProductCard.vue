<script setup lang="ts">
defineProps<{
    product: any;
}>();
const emit = defineEmits(["open-fields-modal","open-assets-modal"])

const emitProductUid = (id: string, modalType:"fields"|"assets") => {

   modalType=== "fields" ?  emit("open-fields-modal", id) : emit("open-assets-modal", id);
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
                <span class="w-4/5"> {{ product.fields.name }} </span>
            </h2>

            <div class="card-actions justify-end mt-3">
                <button class="btn btn-circle btn-outline border-gray-500 p-2" @click="emitProductUid(product.sys.id, 'fields')">
                    <img src="~/assets/icons/pencil.svg" class="w-full h-full" alt="">
                </button>
                <button class="btn btn-circle btn-outline border-gray-500 p-2" @click="emitProductUid(product.sys.id, 'assets')">
                    <img src="~/assets/icons/image.svg" class="w-full h-full" alt="">
                </button>
                <NuxtLink class="product-card" :to="{ name: 'products-id', params: { id: product.sys.id } }"> <button
                        class="btn btn-circle btn-outline border-gray-500 p-2">
                        <img src="~/assets/icons/external-link.svg" class="w-full h-full" alt="">
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
</style>
