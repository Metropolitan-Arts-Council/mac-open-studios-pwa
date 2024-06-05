<template>
    <nav class="tabbar">
        <ul>
            <li>
                <NuxtLink to="/map" class="link">
                    <img src="/icons/map-white.png" alt="Map" class="icon-default" />
                    <img src="/icons/map-orange.png" alt="Map" class="icon-active" />
                </NuxtLink>
            </li>
            <li>
                <NuxtLink to="/artists" class="link">
                    <img src="/icons/artists-white.png" alt="Artists" class="icon-default" />
                    <img src="/icons/artists-orange.png" alt="Artists" class="icon-active" />
                </NuxtLink>
            </li>
            <li>
                <NuxtLink to="/" class="link" exact>
                    <img src="/icons/home-white.png" alt="Home" class="icon-default" />
                    <img src="/icons/home-orange.png" alt="Home" class="icon-active" />
                </NuxtLink>
            </li>
            <li>
                <NuxtLink to="/about" class="link">
                    <img src="/icons/info-white.png" alt="Info" class="icon-default" />
                    <img src="/icons/info-orange.png" alt="Info" class="icon-active" />
                </NuxtLink>
            </li>
        </ul>
    </nav>
</template>

<script>

</script>
