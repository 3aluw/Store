<script lang="ts" setup></script>

<template>
  <div class="hero py-10 px-5 bg-base-200">
    <div class="hero-content flex-col lg:flex-row-reverse">
      <img src="/hero-hotsauce.jpeg" class="max-w-full w-60 rounded-lg shadow-2xl mb-5" />
      <div class="text-center lg:text-left">
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold">
          <span style="transform: scaleX(-1)" class="inline-block">📢</span> {{ $t('HomeHero.getYourHotSauce') }}
        </h1>
        <p class="py-6">
          {{ $t('HomeHero.addSomeHotness') }}
        </p>
        <button class="btn btn-primary"> <a href="/#products">{{ $t('Buttons.discover') }}</a></button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
