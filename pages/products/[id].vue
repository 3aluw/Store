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
    return productStore.singleProduct;
  },
  {
    pick: ["fields", "sys"],
  }
);
console.log("Product data:", product.value);
const description = computed(() =>
  product.value ? marked.parse(product.value?.fields?.description) : null
);

function handleAddToCart(product) {
  useCartStore().addProduct(product, 1);
  useAlertsStore().success(product.fields.name + " added to cart");
}

//product images carousel 
const productImagesToShow = computed(() => {
  const imagesArray = product.value?.fields.image
  return imagesArray.length > 4 ? imagesArray.slice(1,5) : imagesArray;
}); 
const carousel = ref(null);
const slideTo = (index) => {
    const carouselElement = carousel.value;
    const slideWidth = carouselElement.clientWidth ;
carouselElement.scrollTo({
      left: slideWidth * index,
      behavior: 'smooth'
    });
  };

  // similar products
  const fetchProducts = useAsyncData("products", async () => productStore.fetchProducts());
  const similarProducts = computed(() => {
    if( !productStore.products) fetchProducts();
let productsArray = productStore.products;
console.log('productsArray: ', productStore.products);
   productsArray= excludeCurrentProduct(productsArray);
  const categoryMatches = getCategoryMatches(productsArray, product.value?.fields?.category[0]);
  const tagMatches = getTagMatches(productsArray, product.value?.fields?.tags );
 return tagMatches 

})
//exclude the current product from the similar products
const excludeCurrentProduct = (productsArray) => {
  return productsArray.filter(
    (p) => p.sys.id !== product.value?.sys.id
  );
}
  // 1. Candidates from same category
  const getCategoryMatches = (productsArray, category)  =>  productsArray.filter(p => p.fields?.category[0] === category);

  // 2. Candidates with shared tags
  const getTagMatches = (productsArray, tags)  => productsArray.filter(p => 
    p.fields?.tags.some(tag => tags.includes(tag))
  );

  function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
} 
</script>
<template>
  <div class="mt-10 " v-if="product">

    <div  class="max-w-6xl mx-auto">
      <div class="sm:flex">
      <!--product image template-->
      <!--if there is one image show it / multiple images : a slider / no image : show the fallback image-->
        <img v-if="product?.fields.image.length === 1" class="mr-10 h-80 object-contain max-w-2xl"
          :src="product?.fields.image[0].fields?.file.url" :alt="product?.fields.image[0].fields?.file.description" />
        <div v-else-if="product?.fields.image.length > 1" class="carousel-cont flex flex-col items-center gap-4 max-w-2xl">
          <div dir="ltr" class="carousel h-80 object-contain  w-full" ref="carousel">
            <div  class="carousel-item w-full justify-center" 
              v-for="(image, index) in productImagesToShow">
              <img :src="image.fields?.file.url" />
            </div>
          </div>
          <div dir="ltr" class="flex justify-center w-full py-2 gap-2">
            <a v-for="(image, index) in productImagesToShow" @click="slideTo(index)" class="btn btn-xs">{{ index
              + 1 }}</a>

          </div>
        </div>
          <div v-else class="flex items-center justify-center">
          <img class="h-80 object-contain max-w-2xl" src="https://ibb.co/VWRcxQRK" alt="No image available" /></div>
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
       <!-- Product reviews component Deprecated  -->
         <!--  <ProductReviews :productId="product.sys.id" />  -->
        </div>
      </div>
    </div>
    <div v-if="similarProducts.length" class="similar-products-cont" >
    <div id="products" v-if="productStore.products"
      class="gap-7 p-10 sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-wrap justify-items-stretch items-stretch">
      <TransitionGroup name="products">
        <ProductCard v-for="product in productStore.products" :product="product" :key="product.sys.id" class="mb-5" />
      </TransitionGroup>
    </div>
    
    </div>
  </div>
</template>
