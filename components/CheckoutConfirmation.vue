<script setup>
const cartStore = useCartStore();
const Deskree = useDeskree();

</script>
<template>

    <div class="cont flex justify-center items-center ">
        <div class="card bg-white max-w-3xl text-center p-10">
            <p>Please read the following infos carefully before placing your order:</p>

            <p class="my-5">
                <strong>Total price: </strong>
                <ProductPrice :price="cartStore.total" />
            </p>


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


            </div>
            <div class="btns">
                <AppButton class="mx-5">place my order</AppButton>
                <AppButton class="mx-5">back</AppButton>
            </div>

        </div>

    </div>
</template>

<style scoped>
.cont {
    z-index: 20;
    position: absolute;
    background: rgba(189, 168, 168, 0.452);
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
}
</style>