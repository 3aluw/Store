<template>
    <div class="flex flex-col md:flex-row my-2 gap-4">
        <input type="text" placeholder="enter your query" class="input w-full max-w-xs" />
        <div class="flex items-stretch">
            <p class="bg-blue-500 text-white flex items-center justify-center  whitespace-nowrap"> select By</p>
            <select class="select w-full m-l4 max-w-xs " v-model="selectedValue">
                <option selected>{{ props.options[0] }}</option>
                <option v-for="option in props.options.slice(1, props.options.length - 1)"> {{ option }}</option>

            </select>
        </div>
    </div>
</template>
<script setup>

const props = defineProps(['options'])
const emit = defineEmits(['select'])
const selectedValue = ref('')
</script>
<style></style>