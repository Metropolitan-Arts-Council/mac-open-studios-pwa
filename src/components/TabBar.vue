<template>
    <nav class="tabbar">
        <ul>
            <li>
                <router-link to="/map" class="link">
                    <img src="/static/icons/map-white.png" alt="Map" class="icon-default" />
                    <img src="/static/icons/map-orange.png" alt="Map" class="icon-active" />
                </router-link>
            </li>
            <li>
                <router-link to="/artists" class="link">
                    <img src="/static/icons/artists-white.png" alt="Artists" class="icon-default" />
                    <img src="/static/icons/artists-orange.png" alt="Artists" class="icon-active" />
                </router-link>
            </li>
            <li>
                <router-link to="/" class="link" exact>
                    <img src="/static/icons/home-white.png" alt="Home" class="icon-default" />
                    <img src="/static/icons/home-orange.png" alt="Home" class="icon-active" />
                </router-link>
            </li>
            <li>
                <router-link to="/about" class="link">
                    <img src="/static/icons/info-white.png" alt="Info" class="icon-default" />
                    <img src="/static/icons/info-orange.png" alt="Info" class="icon-active" />
                </router-link>
            </li>
        </ul>
    </nav>
</template>

<script>

</script>
