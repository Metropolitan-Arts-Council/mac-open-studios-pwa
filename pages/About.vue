<template>
  <div class="page-info">
    <img v-if="image" class="limit-image center-image" :src="image" alt="Greenville Open Studios">
    <div v-html="page?.page_content"></div>
  </div>
</template>
<script setup lang="ts">
const { data } = useNuxtData('apiData');

console.log('about', data);

const page = computed(() => data.value?.about);
const image = computed(() => data.value?.data?.header_image);
</script>

<style>
.page-info h3 {
  padding-right: 30px;
  font-family: "Bebas";
  color: var(--orange);
}
</style>
