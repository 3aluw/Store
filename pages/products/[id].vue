<script setup>
import * as marked from "marked";
import { useCartStore } from "~~/stores/cartStore";
const route = useRoute();
const productStore = useProductStore();

const { data: product } = await useAsyncData(
  `product${route.params.id}`,
  async () => {
    if (route.params.id === "undefined") return productStore.singleProduct;
    const productObj = await productStore.fetchProduct(route.params.id);
    console.log('productObj: ', productObj);
    return productStore.singleProduct;
  },
  {
    pick: ["fields", "sys"],
  }
);

const description = computed(() =>
  product.value ? marked.parse(product.value?.fields?.description) : null
);

function handleAddToCart(product) {
  useCartStore().addProduct(product, 1);
  useAlertsStore().success(product.fields.name + " added to cart");
}
</script>
<template>
  <div class="mt-10 max-w-6xl mx-auto">
    <div v-if="product">
      <div class="sm:flex">
        <div class="image-cont flex flex-col pt-8 items-center gap-4 ">
        <img v-if="product?.fields.image.length === 1" class="mr-10 h-80 object-contain sm:w-1/3"
          :src="product?.fields.image[0].fields?.file.url" :alt="product?.fields.image[0].fields?.file.description" />
        <div v-else  class="carousel h-80 object-contain sm:w-1/3 w-full">
  <div :id="`item${index + 1}`"  v-for="(image, index) in product?.fields.image" class="carousel-item w-full">
    <img :src="image.fields?.file.url" />
  </div> 
</div> 
<div class="flex justify-center w-full py-2 gap-2">
  <a v-for="(image, index)  in product?.fields.image" :href="`#item${index + 1}`" class="btn btn-xs">{{ index + 1 }}</a> 

</div></div>
        <div class="px-10 sm:pl-0 sm:w-2/3">
          <h1 class="text-2xl font-bold">{{ product?.fields.name }}</h1>
          <h2 class="text-l  my-2">
            <ProductPrice :price="product.fields.price" />
            <!--    <ProductHeat :heatLevel="product.fields.heatLevel" />-->
          </h2>
          <div class="prose prose-sm">
            <p>{{ product.fields.summary }}</p>
          </div>

          <hr class="my-4" />
          <h3 class="text-xl font-semibold mb-2">{{ $t("ProductPage.productDescription") }} </h3>
          <div class="prose mb-5" v-html="description" />
          <button class="btn btn-primary" @click="handleAddToCart(product)">
            {{ $t("Buttons.addToCart") }}
          </button>

          <ProductReviews :productId="product.sys.id" />
        </div>
      </div>
    </div>
  </div>
</template>
