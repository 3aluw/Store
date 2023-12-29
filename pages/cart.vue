
<template>
  <div>

    <div class="m-10" v-if="cartStore.count">
      <Transition name="fade">
        <CheckoutConfirmation v-if="showConfirmation" @toggleConformation="showConfirmation = !showConfirmation" />
      </Transition>

      <h1 class="text-3xl mb-5 font-bold">Your Cart</h1>

      <div class="md:flex w-full">
        <div class="md:w-3/4">


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
                  <tr v-for="product in cartStore.products" :key="product.sys.id">
                    <th>
                      <label>
                        <input v-model="selected" type="checkbox" class="checkbox" @change="checkAll.checked = false"
                          :value="product.sys.id" />
                      </label>
                    </th>
                    <td>
                      <div class="flex items-center space-x-3">
                        <div class="avatar">
                          <div class="mask mask-squircle w-12 h-12">
                            <img :src="product.fields.image[0].fields.file.url"
                              :alt="product.fields.image[0].fields.title" />
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div class="font-bold">
                        {{ product.fields.name }}
                      </div>
                      <!-- <ProductHeat :heat-level="product.fields.heatLevel" />-->
                    </td>
                    <td>
                      <ProductPrice :price="product.fields.price" />
                    </td>

                    <td>
                      <input class="input input-bordered w-20" type="number" v-model="product.count" />
                    </td>
                    <th>
                      <NuxtLink :to="{
                        name: 'products-id',
                        params: { id: product.sys.id },
                      }">
                        <button class="btn btn-ghost btn-xs">details</button>
                      </NuxtLink>
                    </th>
                  </tr>
                </tbody>
              </table>
              <button v-if="selected.length" class="text-sm text-red-500" @click="
                cartStore.removeProducts(selected);
              selected = [];
              ">
                Remove Selected
              </button>
            </div>
          </div>
        </div>

        <div class="md:w-1/4 pl-5">
          <div class="card bg-slate-50">
            <div class="card-body">
              <ul>
                <li>
                  <strong>Subtotal</strong>:
                  <ProductPrice :price="cartStore.subtotal" />
                </li>
                <li>
                  <strong>Estimated Taxes </strong>:
                  <ProductPrice :price="cartStore.taxTotal" />
                </li>
                <li>
                  <strong>Total</strong>:
                  <ProductPrice :price="cartStore.total" />
                </li>
              </ul>

              <div class="card-actions justify-end w-full flex-col my-10" v-if="Deskree.loggedInUser.value">
                <p> Name : {{ Deskree.loggedInUser.value.email ? Deskree.loggedInUser.value.name : "not set" }}</p>
                <p> phone number : <strong> {{
                  Deskree.loggedInUser.value.phone_number.length > 5 ?
                  Deskree.loggedInUser.value.phone_number : "not set"
                }}</strong></p>
                <p> wilaya : <strong> {{
                  Deskree.loggedInUser.value.wilaya ? Deskree.loggedInUser.value.wilaya : "not set"
                }}</strong></p>
                <p> address : <strong> {{
                  Deskree.loggedInUser.value.address ? Deskree.loggedInUser.value.address : "not set"
                }}</strong></p>

                <button class="btn btn-primary w-full" @click="handleBuyClick">
                  BUY!
                </button>
                <NuxtLink to="user/profile" class="btn btn-primary w-full"> <button>
                    Edit my infos
                  </button></NuxtLink>
              </div>
              <div v-else class="card-actions justify-end w-full flex-col my-10">
                <NuxtLink to="" class="btn btn-primary w-full" @click="handleGuestOrder"> <button>
                    Buy as a guest
                  </button></NuxtLink>
                <NuxtLink to="login" class="btn  w-full"> <button>
                    login
                  </button></NuxtLink>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
    <div class="italic text-center text-3xl pt-10" v-else>
      Cart is empty...
    </div>
  </div>
</template>
<script setup>
const cartStore = useCartStore();
const Deskree = useDeskree();
const selected = ref([]);
const checkAll = ref();
const showConfirmation = ref(false)


const user = ref(Deskree.loggedInUser);

function handleBuyClick() {

  if (user.value.email && user.value.address && user.value.wilaya && user.value.phone_number) { showConfirmation.value = !showConfirmation.value }
  else { useAlertsStore().warning("please complete your profile infos") }
}
/* To delete
async function handleOrder() {
  try {
    cartStore.products.forEach(async (product) => await Deskree.orders.placeOrder(product));
    useAlertsStore().success("orders placed successfully")
    cartStore.products = [];
    await navigateTo('/')
  } catch {
    useAlertsStore().error("an error occurred. please try again or re-login")
  }

}
*/
function handleGuestOrder() {
  showConfirmation.value = true
}

</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
