<template>
    <nav class="search">
        <div class="search-box">
            <input class="search-input" placeholder="Search by Name" v-model="data.searchString" />
            <button class="search-input-icon button-blank">
                <img src="/icons/search.png" alt="Search" />
            </button>
        </div>
        <ul class="search-filters">
            <li>
                <button
                    class="button-circle access-icon-bg bg-yellow"
                    :class="{ active: data.filterAccessible }"
                    @click="filter('Accessible')"
                >
                    Accessible
                    <img src="/icons/accessible-white.png" alt="Accessible" />
                </button>
            </li>
            <li v-if="data.useFilterAppointmentOnly">
                <button
                    class="button-circle appointment-icon-bg bg-orange"
                    :class="{ active: data.filterAppointmentOnly }"
                    @click="filter('AppointmentOnly')"
                >
                    By Appointment Only
                    <img src="/icons/appointment-filter.png" alt="By Appointment Only" />
                </button>
            </li>
            <li>
              <button
                  class="button-circle preview-icon-bg bg-orange"
                  :class="{ active: data.filterPreviewDay }"
                  @click="filter('PreviewDay')"
              >
                By Preview Day
                <img src="/icons/preview-filter.png" alt="Preview Day" />
              </button>
            </li>
            <!-- <li>
                <button
                    class="button-circle friday-icon-bg bg-green"
                    :class="{ active: filterOpenFriday }"
                    @click="filter('OpenFriday')"
                >
                    Open Friday
                    <img src="/icons/friday-white.png" alt="Open Friday" />
                </button>
            </li> -->
            <li>
                <button
                    class="button-circle fav-icon-bg bg-red"
                    :class="{ active: data.filterFavorited }"
                    @click="filter('Favorited')"
                >
                    Favorited
                    <img src="" alt="Favorited" />
                </button>
            </li>
        </ul>
    </nav>
</template>

<script setup>
const emit = defineEmits(['search', 'filter']);

const data = reactive({
  searchString: '',
  filterAccessible: false,
  filterOpenFriday: false,
  filterAppointmentOnly: false,
  useFilterAppointmentOnly: false,
  filterPreviewDay: false,
  filterFavorited: false,
});

const filter = (key) => {
  let prop = 'filter' + key;
  data[prop] = !data[prop];

  emit('filter', prop, data[prop]);
};

watch(() => data.searchString, () => {
  emit('search', data.searchString);
});
</script>
