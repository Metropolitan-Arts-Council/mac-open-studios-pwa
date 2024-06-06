<template>
  <div class="page-info">
    <img class="limit-image center-image" src="/images/logo-2023.png" alt="Greenville Open Studios">

    <div v-html="page?.page_content"></div>

    <template v-for="sponsor_list in sponsor_lists" :key="sponsor_list.id">
      <h3 class="page-title">{{sponsor_list.title}}</h3>
      <div class="sponsor-list flex-grid flex-grid-pad">
        <div v-for="logo in sponsor_list.logos" :key="logo"><img :src="logo" /></div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
const { data } = await useFetch(`${config.public.apiDomain}${config.public.apiPages}`);

const page = computed(() => data.value?.sponsorship);
const sponsor_lists = computed(() => {
  if (!page.value?.sponsor_lists) return [];

  return Object.keys(page.value.sponsor_lists).map((id) => {
    const value = page.value.sponsor_lists[id];

    return {
      id: id,
      title: value.title,
      logos: value.logos,
    };
  });
});
</script>

<style>
.page-info h3 {
  padding-right: 30px;
  font-family: "Bebas";
  color: var(--orange);
}
</style>
