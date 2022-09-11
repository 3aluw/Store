<script setup>
  import { useCartStore } from '~~/stores/cartStore';
const selected = ref([]);
const checkAll = ref();

async function handleCheckout() {
  console.log("checking out");
}
</script>
<template>
  <div class="m-10">
    <h1 class="text-3xl mb-5 font-bold">Your Cart</h1>
    <div class="md:flex w-full">
      <div class="md:w-3/4">
        <!-- Use this markup to display an empty cart -->
        <!-- <div  class="italic text-center pt-10">
          Cart is empty
        </div> -->
        <div class="overflow-x-auto">
          <div class="table w-full">
            <table class="w-full">
              <!-- head -->
              <thead>
                <tr>
                  <th>
                    <label>
                      <input type="checkbox" class="checkbox" ref="checkAll" />
                    </label>
                  </th>
                  <th></th>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Number of Items</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in useCartStore().cartItems" :key="item.sys.id">
                  <th>
                    <label>
                      <input
                        v-model="selected"
                        type="checkbox"
                        class="checkbox"
                        @change="checkAll.checked = false"
                        value="5ijmFfTSEqj0G8h73g3CrI"
                      />
                    </label>
                  </th>
                  <td>
                    <div class="flex items-center space-x-3">
                      <div class="avatar">
                        <div class="mask mask-squircle w-12 h-12">
                          <img
                            :src="item.fields.image[0].fields?.file.url"
                            :alt="item.fields.image[0].fields?.file.description"
                          />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="font-bold">
                     {{item.fields.name}}
                    </div>
                    <ProductHeat :heat-level="item.fields.heatLevel" />
                  </td>
                  <td>
                    <ProductPrice :price="item.fields.price" />
                  </td>

                  <td>
                    <input
                    
                      class="input input-bordered w-20"
                      type="number"
                      v-model="item.fields.count"
                      
                      @change="useCartStore().changeCount(item.sys.id , item.fields.count)"
                    />
                  </td>
                  <th>
                    <NuxtLink
                      :to="{
                        name: 'products-id',
                        params: { id: item.sys.id },
                      }"
                    >
                      <button class="btn btn-ghost btn-xs">details</button>
                    </NuxtLink>
                  </th>
                </tr>
              </tbody>
            </table>
            <button v-if="selected.length" class="text-sm text-red-500">
              Remove Selected
            </button>
          </div>
        </div>
      </div>

      <div class="md:w-1/4 pl-5">
        <div class="card bg-slate-50">
          <div class="card-body">
            <ul>
              <li><strong>Subtotal</strong>: ${{useCartStore().subtotal}}</li>
              <li><strong>Estimated Taxes </strong>: ${{useCartStore().taxes}}</li>
              <li><strong>Total</strong>: ${{useCartStore().totalCost}}</li>
            </ul>
            <div class="card-actions justify-end w-full">
              <button class="btn btn-primary w-full" @click="handleCheckout">
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
