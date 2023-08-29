<template>
    <div class="flex flex-col md:flex-row my-2 gap-4 justify-center flex-wrap">
        <input type="text" placeholder="enter your query" class="input l max-w-sm input-sm " v-model="queryText" />
        <div class="flex items-stretch">
            <p class="bg-blue-500 text-white flex items-center justify-center  whitespace-nowrap px-3"> search by</p>
            <select class="select m-l4 max-w-xs  select-sm ml-1" v-model="selectedOption">

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

const selectedOption = ref(props.options[0].value)


debouncedWatch(queryText, () => {
    emit("newQuery", queryText.value, selectedOption.value)
}, { debounce: 500 })
</script>
<style scoped></style>