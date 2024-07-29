<template>
  <Html :lang="head.htmlAttrs.lang" :dir="head.htmlAttrs.dir">

  </Html>
  <div>
    <slot></slot>
  </div>
</template>
<script setup>
const head = useLocaleHead({
  addDirAttribute: true,
  identifierAttribute: 'id',
  addSeoAttributes: true
})
</script>
