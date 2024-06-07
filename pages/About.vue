<template>
  <div class="page-info">
    <img v-if="image" class="limit-image center-image" :src="image" alt="Greenville Open Studios">
    <div v-html="page?.page_content"></div>
  </div>
</template>
<script setup lang="ts">
import {useAppStore} from "~/stores/app";

const appStore = useAppStore();

const page = computed(() => appStore.about);
const image = computed(() => appStore.data?.header_image);
</script>

<style>
.page-info h3 {
  padding-right: 30px;
  font-family: "Bebas";
  color: var(--orange);
}
</style>
