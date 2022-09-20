<template>
    <nav class="search">
        <div class="search-box">
            <input class="search-input" placeholder="Search by Name" v-model="searchString" />
            <button class="search-input-icon button-blank">
                <img src="/static/icons/search.png" alt="Search" />
            </button>
        </div>
        <ul class="search-filters">
            <li>
                <button
                    class="button-circle access-icon-bg bg-yellow"
                    :class="{ active: filterAccessible }"
                    @click="filter('Accessible')"
                >
                    Accessible
                    <img src="/static/icons/accessible-white.png" alt="Accessible" />
                </button>
            </li>
            <li v-if="useFilterAppointmentOnly">
                <button
                    class="button-circle appointment-icon-bg bg-orange"
                    :class="{ active: filterAppointmentOnly }"
                    @click="filter('AppointmentOnly')"
                >
                    By Appointment Only
                    <img src="/static/icons/appointment-filter.png" alt="By Appointment Only" />
                </button>
            </li>
            <li>
              <button
                  class="button-circle preview-icon-bg bg-orange"
                  :class="{ active: filterPreviewDay }"
                  @click="filter('PreviewDay')"
              >
                By Preview Day
                <img src="/static/icons/preview-filter.png" alt="Preview Day" />
              </button>
            </li>
            <!-- <li>
                <button
                    class="button-circle friday-icon-bg bg-green"
                    :class="{ active: filterOpenFriday }"
                    @click="filter('OpenFriday')"
                >
                    Open Friday
                    <img src="/static/icons/friday-white.png" alt="Open Friday" />
                </button>
            </li> -->
            <li>
                <button
                    class="button-circle fav-icon-bg bg-red"
                    :class="{ active: filterFavorited }"
                    @click="filter('Favorited')"
                >
                    Favorited
                    <img src="" alt="Favorited" />
                </button>
            </li>
        </ul>
    </nav>
</template>

<script>
    export default {
      data() {
        return {
          searchString: '',
          filterAccessible: false,
          filterOpenFriday: false,
          filterAppointmentOnly: false,
          useFilterAppointmentOnly: false,
          filterPreviewDay: false,
          filterFavorited: false
        }
      },

      watch: {
        searchString(val) {
          this.$emit('search', val);
        }
      },

      methods: {
        filter(key) {
          let prop = 'filter' + key;
          this[prop] = !this[prop];

          this.$emit('filter', prop, this[prop]);
        }
      }
    }
</script>
