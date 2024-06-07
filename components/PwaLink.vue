<template>
  <NuxtLink v-if="online" :to :exact><slot></slot></NuxtLink>
  <a v-else :href="to"><slot></slot></a>
</template>

<script setup>
import {useOnline} from "@vueuse/core";

defineProps({
  to: String,
  exact: {
    type: Boolean,
    default: false,
  }
});

const online = useOnline();
</script>
