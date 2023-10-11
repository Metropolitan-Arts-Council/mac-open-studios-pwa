<template>
    <div class="home">
        <header class="home-header">
            <img src="/static/images/logo-2023.png" alt="Greenville Open Studios" />
        </header>
        <div class="home-container">
            <ul class="home-list">
                <li>
                    <router-link to="/artists" class="home-item bg-green">
                        <h3 class="home-item-name">Artists</h3>
                    </router-link>
                </li>
                <li>
                    <router-link to="/map" class="home-item bg-red">
                        <h3 class="home-item-name">Map</h3>
                    </router-link>
                </li>
                <li>
                    <router-link to="/about" class="home-item bg-yellow">
                        <h3 class="home-item-name">About</h3>
                    </router-link>
                </li>
                <li>
                    <router-link to="/sponsors" class="home-item bg-orange">
                        <h3 class="home-item-name">Sponsors</h3>
                    </router-link>
                </li>
            </ul>
        </div>
        <footer class="home-footer">
            <img src="/static/images/door-stack.png" role="presentation" />
        </footer>
    </div>
</template>

<script>

</script>
