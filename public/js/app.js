(function(){
	angular.module('app', ['ui.router'])
		.config(function($stateProvider, $urlRouterProvider){

			// $httpProvider.interceptors.push('authInterceptor');

			// handle any attempts to routes other than what's listed below:
			$urlRouterProvider.otherwise('/')

			// my established routes
			$stateProvider
				.state('home', {
					url: '/',
					templateUrl: 'partials/home.html',
					controller: 'MainController as main'
				})
				.state('users', {
					url: '/users',
					templateUrl: 'partials/users.html',
					controller: 'MainController as main'
				})
				.state('register', {
					url: '/users/new',
					templateUrl: 'partials/register.html',
					controller: 'MainController as main'
				})
				// .state('detail', {
				// 	url: '/users/:id',
				// 	templateUrl: 'partials/detail.html',
				// 	controller: 'DetailController as detail'
				// })
				// .state('stockdetail', {
				// 	url: '/scrape/stock/:id',
				// 	templateUrl: 'partials/stockdetail.html',
				// 	controller: 'StockController as sc'
				// })
				.state('login', {
					url: '/login',
					templateUrl: 'partials/login.html'
				})
		})
})()
