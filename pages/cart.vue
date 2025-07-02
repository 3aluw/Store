<template>
  <div>
    <Transition name="fade">
      <CheckoutConfirmation v-if="showConfirmation" @toggleConformation="showConfirmation = !showConfirmation" />
    </Transition>
    <div class="m-10" v-if="cartStore.count">


      <h1 class="text-3xl mb-5 font-bold">{{ $t('CartPage.yourCart') }}</h1>

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
                    <th>{{ $t('CartPage.product') }}</th>
                    <th>{{ $t('CartPage.price') }}</th>
                    <th>{{ $t('CartPage.numberOfItems') }}</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  
                  <tr v-for="product in cartStore.fullCartProducts" :key="product.sys.id">
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
                      <input class="input input-bordered w-20" type="number" :value="product.count"  @input="cartStore.updateCount(product.sys.id, $event.target.value)" />
                    </td>
                    <th>
                      <NuxtLink :to="{
                        name: 'products-id',
                        params: { id: product.sys.id },
                      }">
                        <button class="btn btn-ghost btn-xs">{{ $t('Buttons.details') }}</button>
                      </NuxtLink>
                    </th>
                  </tr>
                </tbody>
              </table>
              <button v-if="selected.length" class="text-sm text-red-500" @click="
                cartStore.removeProducts(selected);
              selected = [];
              ">
                {{ $t('Buttons.removeSelected') }}
              </button>
            </div>
          </div>
        </div>

        <div class="md:w-1/4 pl-5">
          <div class="card bg-slate-50">
            <div class="card-body">
              <ul>
                <li>
                  <strong>{{ $t('CartPage.subtotal') }}</strong>:
                  <ProductPrice :price="cartStore.subtotal" />
                </li>
                <li>
                  <strong>{{ $t('CartPage.shippingCost') }} </strong>:
                  <ProductPrice :price="cartStore.taxTotal" />
                </li>
                <li>
                  <strong>{{ $t('CartPage.total') }}</strong>:
                  <ProductPrice :price="cartStore.total" />
                </li>
              </ul>

              <div class="card-actions justify-end w-full flex-col my-10" v-if="Deskree.loggedInUser.value">
                <p> {{ $t('UserInfo.name') }} : {{ Deskree.loggedInUser.value.email ? Deskree.loggedInUser.value.name :
                  "not set" }}</p>
                <p> {{ $t('UserInfo.phoneNumber') }} : <strong> {{
                  Deskree.loggedInUser.value.phone_number.length > 5 ?
                    Deskree.loggedInUser.value.phone_number : "not set"
                }}</strong></p>
                <p> {{ $t('UserInfo.state') }} : <strong> {{
                  Deskree.loggedInUser.value.wilaya ? Deskree.loggedInUser.value.wilaya : "not set"
                }}</strong></p>
                <p> {{ $t('UserInfo.address') }} : <strong> {{
                  Deskree.loggedInUser.value.address ? Deskree.loggedInUser.value.address : "not set"
                }}</strong></p>

                <button class="btn btn-primary w-full" @click="handleBuyClick">
                  {{ $t('Buttons.buy') }}
                </button>
                <NuxtLink to="user/profile" class="btn btn-primary w-full"> <button>
                    {{ $t('Buttons.editMyInfo') }}
                  </button></NuxtLink>
              </div>
              <div v-else class="card-actions justify-end w-full flex-col my-10">
                <NuxtLink to="" class="btn btn-primary w-full" @click="handleGuestOrder"> <button>
                    {{ $t('Buttons.buyAsAGuest') }}
                  </button></NuxtLink>
                <NuxtLink to="login" class="btn  w-full"> <button>
                    {{ $t('Buttons.login') }}
                  </button></NuxtLink>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
    <div class="italic text-center text-3xl pt-10" v-else>
      {{ $t('CartPage.cartIsEmpty') }}...
    </div>
  </div>
</template>
<script setup>
const { t } = useI18n()
const cartStore = useCartStore();
const Deskree = useDeskree();
const selected = ref([]);
const checkAll = ref();
const showConfirmation = ref(false)


const user = ref(Deskree.loggedInUser);

function handleBuyClick() {

  if (user.value.email && user.value.address && user.value.wilaya && user.value.phone_number) { showConfirmation.value = !showConfirmation.value }
  else { useAlertsStore().warning(t("CartPage.completeProfile")) }
}
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
