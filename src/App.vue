<template>
    <div id="container">
        <div class="scrollview">
            <keep-alive>
                <router-view></router-view>
            </keep-alive>
        </div>
        <TabBar/>
    </div>
</template>

<script>
    import TabBar from './components/TabBar';

    const fetchInitialData = (store) => {
        store.dispatch(`getArtists`)
        store.dispatch('getFavorites')
    };

    export default {
        components: { TabBar },
        name: 'app',

        mounted() {
            fetchInitialData(this.$store)
        }
    }
</script>
