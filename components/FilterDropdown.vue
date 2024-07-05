<template>
    <nav class="filters">
        <header class="filters-header">
            <div class="filter-buttons">
                <button v-if="useDateFilter" class="pill button-blank" :class="{blue: data.showDateFilter}" @click="toggleDateFilter">
                    <svg viewBox="0 0 512.228 512.228" xmlns="http://www.w3.org/2000/svg"><g>
                        <path d="m413.333 39.447h-19.106v-19.333c0-11.046-8.954-20-20-20s-20 8.954-20 20v19.333h-196.227v-19.333c0-11.046-8.954-20-20-20s-20 8.954-20 20v19.333h-19.105c-54.531 0-98.895 44.364-98.895 98.894v274.878c0 54.531 44.364 98.895 98.895 98.895h314.439c54.53 0 98.894-44.364 98.894-98.895v-274.878c0-54.53-44.364-98.894-98.895-98.894zm-314.438 40h19.105v39c0 11.046 8.954 20 20 20s20-8.954 20-20v-39h196.228v39c0 11.046 8.954 20 20 20s20-8.954 20-20v-39h19.106c32.474 0 58.894 26.42 58.894 58.894v19.106h-432.228v-19.106c0-32.474 26.42-58.894 58.895-58.894zm314.438 392.667h-314.438c-32.475 0-58.895-26.42-58.895-58.895v-215.772h432.228v215.772c0 32.475-26.42 58.895-58.895 58.895zm-235.666-196c0 11.046-8.954 20-20 20h-39.333c-11.046 0-20-8.954-20-20s8.954-20 20-20h39.333c11.045 0 20 8.954 20 20zm236.228 0c0 11.046-8.954 20-20 20h-39.333c-11.046 0-20-8.954-20-20s8.954-20 20-20h39.333c11.045 0 20 8.954 20 20zm-118.228 0c0 11.046-8.954 20-20 20h-39.333c-11.046 0-20-8.954-20-20s8.954-20 20-20h39.333c11.045 0 20 8.954 20 20zm-118 118c0 11.046-8.954 20-20 20h-39.333c-11.046 0-20-8.954-20-20s8.954-20 20-20h39.333c11.045 0 20 8.954 20 20zm236.228 0c0 11.046-8.954 20-20 20h-39.333c-11.046 0-20-8.954-20-20s8.954-20 20-20h39.333c11.045 0 20 8.954 20 20zm-118.228 0c0 11.046-8.954 20-20 20h-39.333c-11.046 0-20-8.954-20-20s8.954-20 20-20h39.333c11.045 0 20 8.954 20 20z"/>
                    </g></svg>
                    Filter by Date
                </button>
                <button class="pill button-blank" :class="{blue: data.showMediumFilter}" @click="toggleMediumFilter">
                    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><g>
                        <path d="m151 421c0-17.284-7.356-32.875-19.09-43.833l.006-.083c1.063-14.686 1.924-30.168 2.578-46.143 30.713 5.786 52.476 17.431 64.796 34.728 15.886 22.302 11.655 48.495 9.98 55.991-5.584 24.991 9.215 50.308 34.285 55.124 14.49 2.783 28.95 4.173 43.314 4.173 50.36 0 100.864-17.212 142.556-51.648 52.459-43.33 82.557-106.497 82.574-173.304.036-126.622-110.09-229.925-225.096-225.796-62.835 2.257-119.305 33.211-158.24 67.283-.498-4.643-1.019-9.164-1.564-13.548-2.856-22.982-6.23-41.2-10.028-54.149-2.614-8.916-8.738-29.795-26.071-29.795s-23.457 20.879-26.071 29.795c-3.798 12.949-7.171 31.167-10.028 54.149-5.74 46.185-8.901 107.289-8.901 172.056 0 42.314 1.412 84.184 4.084 121.083l.006.084c-11.734 10.958-19.09 26.549-19.09 43.833v31c0 16.262-14.196 30-31 30v30h61c49.55 0 90-41.067 90-91zm136.979-360.81c96.651-3.468 194.052 84.771 194.021 195.806-.016 57.831-26.142 112.57-71.679 150.183-45.002 37.17-103.726 52.165-161.106 41.144-8.352-1.604-12.552-10.684-10.666-19.121 3.023-13.532 7.632-48.412-14.823-79.938-17.618-24.735-47.273-40.72-88.256-47.619.348-14.693.527-45.763.527-46.323 5.845 6.811 13.587 11.714 22.444 14.087 24.021 6.437 48.706-7.907 55.114-31.82 6.422-23.968-7.853-48.691-31.82-55.113-18-4.823-35.97 1.971-46.646 15.164-.667-21.309-1.694-41.749-3.054-60.855 33.943-35.861 91.33-73.274 155.944-75.595zm-132.379 160.869c2.146-8.008 10.362-12.753 18.371-10.607 7.989 2.141 12.748 10.382 10.607 18.371-2.141 7.99-10.386 12.748-18.372 10.607-8.007-2.145-12.752-10.361-10.606-18.371zm-72.406-120.617c2.591-24.144 5.363-40.509 7.806-51.524 2.443 11.015 5.215 27.38 7.806 51.524 4.639 43.231 7.194 98.476 7.194 155.558 0 5.01-.021 10.012-.061 15h-29.878c-.04-4.988-.061-9.99-.061-15 0-57.082 2.555-112.327 7.194-155.558zm-6.649 200.548h28.91c-.514 21.183-1.389 41.784-2.604 61.191-3.833-.771-7.795-1.181-11.851-1.181s-8.018.41-11.851 1.181c-1.214-19.407-2.089-40.007-2.604-61.191zm-15.545 151.01v-31c0-16.542 13.458-30 30-30s30 13.458 30 30c0 33.635-26.916 61-60 61h-8.256c5.386-9.041 8.256-19.314 8.256-30z"/><path d="m402.673 202.967c17.586-17.585 17.59-46.051 0-63.64-17.544-17.545-46.094-17.546-63.64 0-17.586 17.585-17.59 46.051 0 63.64 17.545 17.545 46.094 17.546 63.64 0zm-42.427-42.426c5.849-5.848 15.364-5.849 21.214 0 5.863 5.863 5.863 15.35 0 21.213-5.851 5.849-15.365 5.848-21.214 0-5.862-5.863-5.863-15.351 0-21.213z"/><path d="m266.588 183.556c23.967-6.422 38.243-31.146 31.821-55.113-6.424-23.967-31.148-38.242-55.114-31.82-23.967 6.422-38.242 31.146-31.82 55.114 6.437 24.022 31.087 38.256 55.113 31.819zm-15.528-57.956c8.006-2.145 16.235 2.636 18.372 10.606 2.141 7.989-2.618 16.231-10.607 18.371-8.007 2.145-16.225-2.597-18.371-10.606-2.142-7.989 2.616-16.23 10.606-18.371z"/><path d="m273.591 383.559c6.414 23.932 31.112 38.251 55.115 31.819 23.967-6.422 38.241-31.146 31.819-55.113-6.437-24.019-31.082-38.258-55.114-31.82-23.967 6.422-38.242 31.146-31.82 55.114zm39.586-26.137c8.022-2.15 16.23 2.614 18.37 10.606 2.141 7.99-2.617 16.231-10.606 18.372-7.99 2.141-16.23-2.619-18.371-10.606-2.141-7.99 2.617-16.231 10.607-18.372z"/><path d="m358.444 275.412c-6.422 23.968 7.853 48.691 31.82 55.114 24.004 6.432 48.671-7.778 55.113-31.82 6.436-24.022-7.794-48.676-31.819-55.113-24.021-6.44-48.675 7.793-55.114 31.819zm57.955 15.529c-2.143 8.006-10.362 12.753-18.37 10.607-7.989-2.141-12.747-10.382-10.606-18.372 2.14-7.991 10.346-12.756 18.37-10.606 7.988 2.14 12.747 10.381 10.606 18.371z"/>
                    </g></svg>
                    Filter by Medium
                </button>
                <button class="pill button-blank" :class="{blue: data.showNameFilter}" @click="toggleNameFilter">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2 22C2 17.5817 5.58172 14 10 14C14.4183 14 18 17.5817 18 22H16C16 18.6863 13.3137 16 10 16C6.68629 16 4 18.6863 4 22H2ZM10 13C6.685 13 4 10.315 4 7C4 3.685 6.685 1 10 1C13.315 1 16 3.685 16 7C16 10.315 13.315 13 10 13ZM10 11C12.21 11 14 9.21 14 7C14 4.79 12.21 3 10 3C7.79 3 6 4.79 6 7C6 9.21 7.79 11 10 11ZM18.2837 14.7028C21.0644 15.9561 23 18.752 23 22H21C21 19.564 19.5483 17.4671 17.4628 16.5271L18.2837 14.7028ZM17.5962 3.41321C19.5944 4.23703 21 6.20361 21 8.5C21 11.3702 18.8042 13.7252 16 13.9776V11.9646C17.6967 11.7222 19 10.264 19 8.5C19 7.11935 18.2016 5.92603 17.041 5.35635L17.5962 3.41321Z"></path>
                  </svg>
                    Filter by Name
                </button>

                <button v-if="artistStore.isFiltering" class="filters-close filters-clear button-blank" alt="Expand" @click="clear">
                    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g id="_30" data-name="30">
                        <path d="m16 30a14 14 0 1 1 14-14 14 14 0 0 1 -14 14zm0-26a12 12 0 1 0 12 12 12 12 0 0 0 -12-12z"/><path d="m21 22a1 1 0 0 1 -.71-.29l-5-5a1 1 0 0 1 1.42-1.42l5 5a1 1 0 0 1 0 1.42 1 1 0 0 1 -.71.29z"/><path d="m11 22a1 1 0 0 1 -.71-.29 1 1 0 0 1 0-1.42l5-5a1 1 0 0 1 1.42 1.42l-5 5a1 1 0 0 1 -.71.29z"/><path d="m16 17a1 1 0 0 1 -.71-.29 1 1 0 0 1 0-1.42l5-5a1 1 0 0 1 1.42 1.42l-5 5a1 1 0 0 1 -.71.29z"/><path d="m16 17a1 1 0 0 1 -.71-.29l-5-5a1 1 0 0 1 1.42-1.42l5 5a1 1 0 0 1 0 1.42 1 1 0 0 1 -.71.29z"/>
                    </g></svg>
                    Clear
                </button>
            </div>

            <h5 class="flex-col text-right filters-count">
                <em v-if="artistStore.isFiltering">
                    <template v-if="artistStore.filters.dates.length">
                        {{artistStore.filters.dates.length}} <span>{{resultsDateWording}}</span>
                    </template>
                    <span v-if="artistStore.filters.dates.length && artistStore.filters.mediums.length">and</span>
                    <template v-if="artistStore.filters.mediums.length">
                        {{artistStore.filters.mediums.length}} <span>{{resultsMediumWording}}</span>
                    </template>
                    <span> with</span>
                </em>
                {{ resultsCount }} <span>{{ resultsWording }}</span>
            </h5>
        </header>
        <div class="mediums-filter-list" :class="{ hide: !data.showMediumFilter }">
            <FiltersClose @click="data.showMediumFilter = false" />
            <ul class="buttons-list">
                <li v-for="medium in mediums">
                    <button
                        :class="{ active: artistStore.filters.mediums.includes(medium) }"
                        @click.stop="toggleItem('mediums', medium)"
                        v-html="medium"
                    ></button>
                </li>
            </ul>
        </div>
        <div v-if="useDateFilter" class="calendar" :class="{ hide: !data.showDateFilter }">
            <FiltersClose @click="data.showDateFilter = false" />
            <h3>November</h3>
            <div class="days-of-week">
                <div class="day">
                    <div class="value">SUN</div>
                </div>
                <div class="day">
                    <div class="value">MON</div>
                </div>
                <div class="day">
                    <div class="value">TUE</div>
                </div>
                <div class="day">
                    <div class="value">WED</div>
                </div>
                <div class="day">
                    <div class="value">THU</div>
                </div>
                <div class="day">
                    <div class="value">FRI</div>
                </div>
                <div class="day">
                    <div class="value">SAT</div>
                </div>
            </div>

            <div class="month">
                <div v-for="day in dates" :key="day.value" class="day">
                    <div v-if="day.disabled">
                        <div class="value disabled">{{ day.value }}</div>
                    </div>
                    <a v-else href="#" @click.prevent="toggleItem('dates',day.value)">
                        <div class="value" :class="{active: artistStore.filters.dates.includes(day.value)}">{{ day.value }}</div>
                    </a>
                </div>
            </div>
        </div>
        <div class="names-filter-list" :class="{ hide: !data.showNameFilter }">
          <FiltersClose @click="data.showNameFilter = false" />
          <ul class="buttons-list">
            <li v-for="name in names">
              <button
                :class="{ active: artistStore.filters.names.includes(name) }"
                @click.stop="toggleItem('names', name)"
                v-html="name"
              ></button>
            </li>
          </ul>
        </div>
    </nav>
</template>

<script setup>
import moment from 'moment';
import {useArtistsStore} from "~/stores/artists.js";

const artistStore = useArtistsStore();
const props = defineProps([
  'mediums', 'resultsCount', 'useDateFilter'
]);

const data = reactive({
  showDateFilter: false,
  showMediumFilter: false,
  showNameFilter: false,
});

const dates = computed(() => {
  const date = moment();
  const beforeNovember = date.month() < 10;
  const firstAvailable = Math.max(7, beforeNovember ? 0 : date.date());

  return [...Array(30).keys()].map(i => {
    const value = i + 1;

    return {value, disabled: value < firstAvailable};
  });
});
const resultsWording = computed(() => {
  return props.resultsCount === 1 ? 'Artist' : 'Artists';
});
const resultsDateWording = computed(() => {
  return artistStore.filters.dates.length === 1 ? 'Date' : 'Dates';
});
const resultsMediumWording = computed(() => {
  return artistStore.filters.mediums.length === 1 ? 'Medium' : 'Mediums';
});
const resultsNameWording = computed(() => {
  return artistStore.filters.mediums.length === 1 ? 'Name' : 'Names';
});
const names = computed(() => {
  const last_names = artistStore.artists.map(a => a.last_name);

  return [...new Set(last_names)].sort();
});

const toggleDateFilter = () => {
  data.showMediumFilter = false;
  data.showNameFilter = false;
  data.showDateFilter = !data.showDateFilter;
};
const toggleMediumFilter = () => {
  data.showDateFilter = false;
  data.showNameFilter = false;
  data.showMediumFilter = !data.showMediumFilter;
};
const toggleNameFilter = () => {
  data.showDateFilter = false;
  data.showMediumFilter = false;
  data.showNameFilter = !data.showNameFilter;
};
const toggleItem = (key, item) => {
  if (artistStore.filters[key].includes(item)) {
    artistStore.filters[key].splice(artistStore.filters[key].indexOf(item), 1)
  } else {
    artistStore.filters[key].push(item);
  }
};
const clear = () => {
  artistStore.filters.dates = [];
  artistStore.filters.mediums = [];
  artistStore.filters.names = [];
  data.showDateFilter = false;
  data.showMediumFilter = false;
};
</script>
