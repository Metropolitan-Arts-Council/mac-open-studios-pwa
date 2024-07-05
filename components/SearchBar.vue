<template>
    <nav class="search">
        <div class="search-box">
            <input class="search-input" placeholder="Search by Name" v-model="artistStore.filters.query" />
            <button class="search-input-icon button-blank">
                <img src="~/assets/icons/search.png" alt="Search" />
            </button>
        </div>
        <ul class="search-filters">
            <li>
                <button
                    class="button-circle access-icon-bg bg-yellow"
                    :class="{ active: artistStore.getFilter('accessible') }"
                    @click="artistStore.toggleFilter('accessible')"
                >
                    Accessible
                    <img src="~/assets/icons/accessible-white.png" alt="Accessible" />
                </button>
            </li>
            <li v-if="data.useFilterAppointmentOnly">
                <button
                    class="button-circle appointment-icon-bg bg-orange"
                    :class="{ active: artistStore.getFilter('appointment_only') }"
                    @click="artistStore.toggleFilter('appointment_only')"
                >
                    By Appointment Only
                    <img src="~/assets/icons/appointment-filter.png" alt="By Appointment Only" />
                </button>
            </li>
            <li>
              <button
                  class="button-circle preview-icon-bg bg-orange"
                  :class="{ active: artistStore.getFilter('preview_day') }"
                  @click="artistStore.toggleFilter('preview_day')"
              >
                By Preview Day
                <img src="~/assets/icons/preview-filter.png" alt="Preview Day" />
              </button>
            </li>
            <!-- <li>
                <button
                    class="button-circle friday-icon-bg bg-green"
                    :class="{ active: open_friday }"
                    @click="filter('OpenFriday')"
                >
                    Open Friday
                    <img src="~/assets/icons/friday-white.png" alt="Open Friday" />
                </button>
            </li> -->
            <li>
                <button
                    class="button-circle fav-icon-bg bg-red"
                  :class="{ active: artistStore.getFilter('favorited') }"
                  @click="artistStore.toggleFilter('favorited')"
                >
                    Favorited
                    <img src="" alt="Favorited" />
                </button>
            </li>
        </ul>
    </nav>
</template>

<script setup>

import {useArtistsStore} from "~/stores/artists.js";

const artistStore = useArtistsStore();

const data = reactive({
  useFilterAppointmentOnly: false,
});
</script>
