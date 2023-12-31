<template>
    <div class="invoice-cont flex flex-col justify-center px-4 ">
        <div class="userInfos self-start py-6">
            <p> Name : </p>
            <p> phone number : <strong> </strong></p>
            <p> wilaya :<strong></strong> </p>
            <p> address : <strong> </strong></p>
        </div>
        <div class="orders py-6">
            <div class="overflow-x-auto w-full">
                <table class="table w-full">
                    <!-- head -->
                    <thead>
                        <tr>
                            <th>name</th>
                            <th>picture</th>
                            <th>id</th>
                            <th>count</th>
                            <th>price</th>
                        </tr>
                    </thead>
                    <tbody>

                        <tr v-for="order in props.orders">

                            <td>
                                <div class="flex items-center space-x-3"> {{ order.product_name }}<div>

                                    </div>
                                </div>
                            </td>
                            <td>
                                <div class="flex items-center space-x-3">
                                    <div class="avatar">
                                        <div class="mask mask-squircle w-12 h-12">
                                            <img :src="order.picture" />
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div class="font-bold">{{ order.product_id }}</div>
                            </td>
                            <td>
                                <div class="font-bold">{{ order.count }}</div>
                            </td>
                            <td>
                                <div class="text-sm opacity-50">{{ order.price }}</div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="contact">
            <p class="thank-text"> We are working on your order, Thank you for your trust !</p>
            <p>If you needed any support please contact us on :</p>
            <p>phone : 0557923990</p>
            <p>facebook : Falafel</p>
        </div>
    </div>
</template>
<script setup>
const cartStore = useCartStore();
const props = defineProps(["user", "orders"])

const emit = defineEmits(['hidePdfGenerator'])


</script>

<style scoped>
.invoice-cont {
    background-color: rgb(252, 249, 249);
}
</style>