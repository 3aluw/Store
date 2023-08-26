<template>
    <div class="overflow-x-auto">
        <table class="table">
            <!-- head -->
            <thead>
                <tr>
                    <th v-for="column in props.columns">{{ column }}</th>
                </tr>
            <tbody>
                <tr v-for="item in object">
                    <th v-for="column in columns">{{ object[column] }} </th>
                </tr>
            </tbody>
            </thead>
        </table>
    </div>
</template>
<script setup>
//object to use, columns : properties that we need to populate, omit: properties to remove in sm screens
const props = defineProps(['object', 'columns', 'omit', 'fastActionBtn'])

//emit to use on button press, It will send two value actiontype : fastAction(if the fastActionBtn is pressed) modify(if the cog byn is pressed) 
const emit = defineEmits(['modify'])
</script>
<style scoped></style>