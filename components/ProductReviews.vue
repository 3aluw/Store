<template>
  <div>


    <hr class="my-10" />
    <p>{{ $t("ProductReviews.productReviews") }} </p>

    <div class="overview flex items-center justify-around">
      <div class="final-mark p-6 border border-black rounded-lg text-center">
        <p> <span class="text-2xl font-semibold"> {{ avregeRating }}</span> {{ $t('ProductReviews.outOf') }} <span
            class="text-2xl font-semibold">
            5 </span></p>
        <p> {{ res?.data.length }} {{ $t('ProductReviews.reviews') }} </p>
      </div>
      <div class="stars -distribution flex flex-col gap-5 ">

        <div class="progress-cont flex items-center gap-2" v-for="(reviewsNum, starsNum, index) in starsGrouped">
          <span>{{ starsNum }} </span>
          <progress class="progress  progress-warning w-56" :value="reviewsNum" :max="res?.data.length"></progress>
        </div>
      </div>
    </div>
    <div>


      <div class="write-review " v-if="allowWriting">

        <div class="collapse  border border-base-300 bg-base-100 rounded-box">
          <input type="checkbox" />
          <div class="collapse-title text-xl font-medium">
            {{ $t("ProductReviews.writeAReview") }}
          </div>
          <div class="collapse-content flex flex-col  items-center justify-evenly">
            <div class=" rating"><input type="radio" name="rating-2" v-model="stars" value="0"
                class=" hidden mask mask-star-2 bg-orange-400" checked />
              <input type="radio" name="rating-2" v-model="stars" value="1" class="mask mask-star-2 bg-orange-400" />
              <input type="radio" name="rating-2" v-model="stars" value="2" class="mask mask-star-2 bg-orange-400" />
              <input type="radio" name="rating-2" v-model="stars" value="3" class="mask mask-star-2 bg-orange-400" />
              <input type="radio" name="rating-2" v-model="stars" value="4" class="mask mask-star-2 bg-orange-400" />
              <input type="radio" name="rating-2" v-model="stars" value="5" class="mask mask-star-2 bg-orange-400 " />
            </div>
            <div class="w-full ">
              <input class="border-gray-400 border-2 rounded-md my-3 p-2 bord w-1/2 focus:outline-none" type="text"
                v-model="reviewTitle" placeholder="write a title" maxlength="100">
              <textarea v-model="reviewText" class="textarea textarea-bordered w-full" rows="5"
                placeholder="insert details "></textarea>
            </div>
            <button class="btn btn-primary my-2" @click="postReview">{{ $t("Buttons.submit") }} </button>
          </div>
        </div>
      </div>
      <div v-else class="text-xl font-medium text-center my-5"> {{ $t("ProductReviews.thankYou") }} </div>


      <div class="past-reviews my-8">

        <h2 class="text-xl font-medium">{{ $t("ProductReviews.costumersReviews") }}</h2>
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

const avregeRating = computed(() => { return res.value ? (res.value.data.reduce((past, current) => past += current.attributes.rating, 0) / res.value.data.length).toFixed(1) : "..." })

//Grouping reviews' stars to show then organized
const starsGrouped = computed(() => {
  let obj = ref({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  })

  if (!res.value) return obj.value;

  for (let starsNumber in obj.value) {

    let result = res.value.data.reduce((past, current) => {

      if (current.attributes.rating != starsNumber) { return past; }
      else { return past += 1; }

    }, 0);

    obj.value[starsNumber] = result;
  }

  return obj.value
}
)


//User review
const allowWriting = ref(true)
let stars = ref(0);
let reviewTitle = ref("")
let reviewText = ref("")


const postReview = () => {
  Deskree.reviews.submit({
    rating: parseInt(stars.value),
    title: reviewTitle.value,
    text: reviewText.value,
    product_id: props.productId
  });
  allowWriting.value = false

}







</script>