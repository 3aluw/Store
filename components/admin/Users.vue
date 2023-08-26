<template>
    <p>Your loyal costumers:</p>
    <div class="big-cards-cont flex gap-2 justify-around flex-wrap">
        <div class="big-card">
            <p>lorem2</p>
            <p class="text-4xl text-center">500$</p>
            <p class="text-xs">Lorem, ipsum.</p>
        </div>
        <div class="big-card">
            <p>Lorem, ipsum.</p>
            <p class="text-4xl text-center">400$</p>
            <p class="text-xs">Lorem, ipsum.</p>
        </div>
        <div class="big-card">
            <p>Lorem, ipsum.</p>
            <p class="text-4xl text-center">400$</p>
            <p class="text-xs">Lorem, ipsum.</p>
        </div>
    </div>
</template>
<script setup></script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,500&display=swap');

* {
    font-family: "DM Sans;";
    font-weight: 500;
}

.big-card {
    color: black;
    background-color: #FFFFFF;
    border-radius: 0.625rem;
    border: 0.2px solid #6D7D93;
    padding-inline: 1rem;
    padding-block: 0.5rem;
    min-width: 11rem;
    aspect-ratio: 3 / 2;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-position: center top !important;
    background-repeat: no-repeat !important;
    background-size: contain !important;

}

.big-card:nth-child(1) {
    background-image: url("~/assets/svg/gold-medal.svg");


}

.big-card:nth-child(2) {
    background-image: url("~/assets/svg/silver-medal.svg");
}

.big-card:nth-child(3) {
    background-image: url("~/assets/svg/bronze-medal.svg");
}
</style>