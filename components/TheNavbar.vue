<script setup>
import { useCartStore } from '~~/stores/cartStore';


const deskree = useDeskree();
const loggedInUser = computed(() => deskree.loggedInUser.value);
const cartStore = useCartStore();

</script>
<template>
  <div class="navbar bg-base-100 shadow-md">
    <div class="flex-1">
      <NuxtLink class="btn btn-ghost normal-case text-xl" to="/">My store</NuxtLink>
    </div>
    <!-- Right Side -->
    <div class="flex-none">
      <div class="dropdown dropdown-end">
        <CartIcon :loading="cartStore.loading" :count="cartStore.count" />
        <div tabindex="0" class="mt-3 card card-compact dropdown-content w-52 bg-base-100 shadow">
          <div class="card-body">
            <span class="font-bold text-lg"> N of items : {{ cartStore.count }} </span>
            <span class="text-info">Subtotal:
              <ProductPrice :price="cartStore.subtotal" />
            </span>
            <div class="card-actions">
              <NuxtLink :to="{ name: 'cart' }">
                <button class="btn btn-primary btn-block">View cart</button>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!--Buttons for UN-logged In Users-->
      <div v-if="!loggedInUser">
        <NuxtLink to="/login" class="btn btn-ghost border-2 border-gray-100 btn-sm ml-5">Login</NuxtLink>
        <NuxtLink to="/register" class="btn btn-primary btn-sm ml-2">Register</NuxtLink>
      </div>

      <!--UI for logged In Users-->
      <div v-else class="dropdown dropdown-end">
        <label tabindex="0" class="btn btn-sm ml-5">
          <button>{{ loggedInUser.email }}</button>
        </label>
        <ul tabindex="0" class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
          <li>
            <NuxtLink to="user/profile" class="justify-between">
              Profile
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/logout">Logout</NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
