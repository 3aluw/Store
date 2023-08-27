<template>
    <div class="flex flex-col md:flex-row my-2 gap-4">
        <input type="text" placeholder="enter your query" class="input w-full max-w-sm input-sm w-full"
            v-model="queryText" />
        <div class="flex items-stretch">
            <p class="bg-blue-500 text-white flex items-center justify-center  whitespace-nowrap px-3"> select By</p>
            <select class="select w-full m-l4 max-w-xs  select-sm w-full ml-1" v-model="selectedOption">

                <option v-for="option in props.options" :key="option.value" :value="option.value"> {{ option.name }}
                </option>


            </select>
        </div>

    </div>
</template>
<script setup>
import { debouncedWatch } from "@vueuse/core"
const props = defineProps(['options'])
const emit = defineEmits(['newQuery'])

const queryText = ref('')

const selectedOption = ref(props.options[0].name)


debouncedWatch(queryText, () => {
    emit("newQuery", queryText, selectedOption.value)
}, { debounce: 300 })
</script>
<style></style>