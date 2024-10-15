<template>
  <div class="home">
    <header class="home-header">
      <img v-if="app?.data?.header_image" :src="app.data.header_image" alt="Greenville Open Studios" />
    </header>
    <div class="home-container">
      <ul class="home-list">
        <li>
          <PwaLink to="/artists" class="home-item bg-green">
            <h3 class="home-item-name">Artists</h3>
          </PwaLink>
        </li>
        <li>
          <PwaLink to="/map" class="home-item bg-red">
            <h3 class="home-item-name">Map</h3>
          </PwaLink>
        </li>
        <li>
          <PwaLink to="/about" class="home-item bg-yellow">
            <h3 class="home-item-name">About</h3>
          </PwaLink>
        </li>
        <li>
          <PwaLink to="/sponsors" class="home-item bg-orange">
            <h3 class="home-item-name">Sponsors</h3>
          </PwaLink>
        </li>
      </ul>
    </div>
    <footer class="home-footer">
      <img src="/images/door-stack.png" role="presentation" />
    </footer>
  </div>
</template>

<script setup>
import {useAppStore} from "~/stores/app.js";

const app = useAppStore();
</script>
