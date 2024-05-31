<template>
  <div class="page-info">
    <img class="limit-image center-image" src="/images/logo-2023.png" alt="Greenville Open Studios">
    <div v-html="page?.page_content"></div>
    <img class="limit-image center-image" src="/images/mac-logo.png" alt="Metropolitan Arts Council">
  </div>
</template>
<script setup lang="ts">
const config = useRuntimeConfig();
const url = `${config.public.apiDomain}${config.public.apiPages}`;
const { data } = useFetch(url);

const page = computed(() => data.value?.about);
</script>
