import {createRouter, createWebHashHistory} from 'vue-router'
import search from "../components/search.vue"
import buyticket from "../components/buyticket.vue"
import stations from "../components/stations.vue"
import blank from "../components/blank.vue"
 
const routerHistory = createWebHashHistory()
 
export default createRouter({
    history: routerHistory,
	linkActiveClass: 'active',
	routes: [
		{
			path: "/",
			redirect: "/search"
		},
		{
			path: "/search",
			name: "search",
			component: search,
			meta: {
				index: 0
			}
		},
		{
			path: "/buyticket",
			name: "buyticket",
			component: buyticket,
			meta: {
				index: 1
			}
		},
		{
			path: "/stations",
			name: "stations",
			component: stations,
			meta : {
				index: 2
			}
		},
		{
			path: "/blank",
			name: "blank",
			component: blank,
			meta : {
				index: 100
			}
		}
	]
})