<template>
    <nav class="tabbar">
        <ul>
            <li>
                <NuxtLink to="/map" class="link">
                    <img src="~/assets/icons/map-white.png" alt="Map" class="icon-default" />
                    <img src="~/assets/icons/map-orange.png" alt="Map" class="icon-active" />
                </NuxtLink>
            </li>
            <li>
                <NuxtLink to="/artists" class="link">
                    <img src="~/assets/icons/artists-white.png" alt="Artists" class="icon-default" />
                    <img src="~/assets/icons/artists-orange.png" alt="Artists" class="icon-active" />
                </NuxtLink>
            </li>
            <li>
                <NuxtLink to="/" class="link" exact>
                    <img src="~/assets/icons/home-white.png" alt="Home" class="icon-default" />
                    <img src="~/assets/icons/home-orange.png" alt="Home" class="icon-active" />
                </NuxtLink>
            </li>
            <li>
                <NuxtLink to="/about" class="link">
                    <img src="~/assets/icons/info-white.png" alt="Info" class="icon-default" />
                    <img src="~/assets/icons/info-orange.png" alt="Info" class="icon-active" />
                </NuxtLink>
            </li>
        </ul>
    </nav>
</template>

<script>

</script>
