<template>

  <div>


    <hr class="my-10" />
    <p>Product Reviews </p>

    <div class="overview flex items-center justify-around">
      <div class="final-mark p-6 border border-black rounded-lg text-center">
        <p> <span class="text-2xl font-semibold"> {{ avregeRating }}</span> out of <span class="text-2xl font-semibold">
            5 </span></p>
        <p> {{ res?.data.length }} reviews </p>
      </div>
      <div class="stars -distribution flex flex-col gap-5 ">

        <div class="progress-cont flex items-center gap-2"> 5 <progress class="progress  progress-warning w-56"
            value="0" max="100"></progress>
        </div>
        <div class="progress-cont flex items-center gap-2"> 4<progress class="progress  progress-warning w-56"
            value="10" max="100">4</progress>
        </div>
        <div class="progress-cont flex items-center gap-2"> 3<progress class="progress  progress-warning w-56"
            value="40" max="100">3</progress>
        </div>
        <div class="progress-cont flex items-center gap-2"> 2 <progress class="progress  progress-warning w-56"
            value="70" max="100">2</progress></div>
        <div class="progress-cont  flex items-center gap-2">1 <progress class="progress  progress-warning w-56"
            value="100" max="100">1</progress></div>
      </div>
    </div>
    <div>


      <div class="writeReview ">
        <div class="collapse  border border-base-300 bg-base-100 rounded-box">
          <input type="checkbox" />
          <div class="collapse-title text-xl font-medium">
            Write a review
          </div>
          <div class="collapse-content flex items-center justify-evenly ">
            <div class="rating"><input type="radio" name="rating-2" v-model="stars" value="0"
                class=" hidden mask mask-star-2 bg-orange-400" checked />
              <input type="radio" name="rating-2" v-model="stars" value="1" class="mask mask-star-2 bg-orange-400" />
              <input type="radio" name="rating-2" v-model="stars" value="2" class="mask mask-star-2 bg-orange-400" />
              <input type="radio" name="rating-2" v-model="stars" value="3" class="mask mask-star-2 bg-orange-400" />
              <input type="radio" name="rating-2" v-model="stars" value="4" class="mask mask-star-2 bg-orange-400" />
              <input type="radio" name="rating-2" v-model="stars" value="5" class="mask mask-star-2 bg-orange-400 " />
            </div>
            <textarea v-model="reviewText" class="textarea textarea-bordered" cols="60" rows="5"></textarea>
            <button>Submit</button>
          </div>
        </div>
      </div>


      <div class="past-review my-8"></div>
      <h2 class="text-xl font-medium">Other costumers' reviews</h2>
      <p v-if="isLoading" class="text-xl font-medium "> Loading...</p>

      <div v-else class="card  bg-base-100 shadow-xl" v-for=" { attributes } in res?.data">
        <div class="card-body">
          <h2 class="card-title">{{ attributes.title }}</h2>
          <div class="rating rating-s pointer-events-none">
            <input type="radio" name="rating-5" class="mask mask-star-2 bg-orange-400"
              v-for="star in attributes.rating" />
            <input type="radio" name="rating-5" class="mask mask-star-2 bg-slate-300"
              v-for="star in (5 - attributes.rating)" />
          </div>
          <p>{{ attributes.text }} </p>
          <div class="card-actions justify-end">

          </div>
        </div>
      </div>
    </div>

  </div>

</template>
<script setup>
import { useAsyncState } from '@vueuse/core';

const props = defineProps({
  productId: String,
})
const Deskree = useDeskree();


//retreive reviews from Deskree
const { state: res, isLoading, execute } = useAsyncState(() => Deskree.reviews.get(props.productId), null, { immediate: false });

onMounted(() => {
  execute().then((res) => console.log(res));
})
//reviews overview
const avregeRating = computed(() => { return res.value ? (res.value.data.reduce((past, current) => past += current.attributes.rating, 0) / res.value.data.length).toFixed(1) : "Laoding.." })


//User review
let stars = ref("")
let reviewText = ref("")
const test = () => console.log(stars.value)








</script>