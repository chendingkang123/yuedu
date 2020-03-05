import Vue from 'vue';
import Router from 'vue-router';
// import Featured from '@/views/featured';
import Category from '@/views/category';
import CatList from '@/views/catlist';
import Rank from '@/views/rank';
import List from '@/views/list';
import Shelf from '@/views/shelf';
import Book from '@/views/book';
import Read from '@/views/read';
import Search from '@/views/search';

Vue.use(Router);

export default new Router({
	mode: 'history',
	routes: [{
			path: '/',
			name: 'shelf',
			component: Shelf
		},
		// {
		// 	path: '/featured',
		// 	name: 'featured',
		// 	component: Featured
		// },
		{
			path: '/category',
			name: 'category',
			component: Category
		},
		{
			path: '/catlist/:major',
			name: 'catlist',
			component: CatList
		},
		{
			path: '/rank',
			name: 'rank',
			component: Rank
		},
		{
			path: '/list/:id',
			name: 'list',
			component: List
		},
		{
			path: '/book/:id',
			name: 'book',
			component: Book
		},
		{
			path: '/read/:id',
			name: 'read',
			component: Read
		},
		{
			path: '/search',
			name: 'search',
			component: Search
		}
	],
	scrollBehavior(to, from, savedPosition) {
		return {
			x: 0,
			y: 0
		}
	}
})
