import { createRouter, createWebHistory } from 'vue-router'

const routes = [	
	{
		path: '/',
		name: 'home',
		redirect: '/lots',
	},		
	{
		path: '/start',
		name: 'start',		
		component: () => import('../views/Start.vue'),		
	},
	{
		path: '/lot/:id',
		name: 'lot',
		component: () => import('../views/Lot.vue')//
	},
	{
		path: '/faq',
		name: 'faq',
		component: () => import('../views/Faq.vue')//
	},
	{
		path: '/lots',
		name: 'lots',		
		component: () => import('../views/Lots.vue'),		
	},	
	{ 	
		path: "/:pathMatch(.*)*", 
		redirect: '/lots', 
	}	
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

export default router