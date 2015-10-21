var appFolder = 'app/';
var partialsFolder = appFolder+'partials/';

// structure of the angular app
// it calls the right controller and the right partial, depending on the route
var itemsApp = angular.module('itemsApp', ['ngRoute'])
.config(function ($routeProvider) {
	$routeProvider
		.when('/',
			{
				controller: 'ItemsController',
				templateUrl: partialsFolder+'items.html'
			})
		.when('/item/:id',
			{
				controller: 'ItemController',
				templateUrl: partialsFolder+'item.html'
			})
		.otherwise({ redirectTo: '/' });
})
