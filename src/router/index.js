import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/pages/Home'
import Sponsors from '@/components/pages/Sponsors'
import Artists from '@/components/pages/Artists'
import Map from '@/components/pages/Map'
import About from '@/components/pages/About'
import ArtistDetails from '@/components/map/ArtistDetails'
import LocationList from '@/components/map/LocationList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/sponsors',
      name: 'Sponsors',
      component: Sponsors
    },
    {
      path: '/artists',
      name: 'Artists',
      component: Artists
    },
    {
      path: '/map',
      name: 'Map',
      component: Map,
      children: [
        {
          path: 'show/:id',
          component: ArtistDetails,
          name: 'map.artist.show'
        },
        {
          path: 'list/:ids',
          component: LocationList,
          name: 'map.artists.list'
        }
      ]
    },
    {
      path: '/about',
      name: 'About',
      component: About
    }
  ]
})
