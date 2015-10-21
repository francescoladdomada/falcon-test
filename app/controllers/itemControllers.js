// Both the controllers use the same factory/service that we use to manage all the items

// ItemsController is used for the list of items
itemsApp.controller('ItemsController', function($scope, itemsFactory, $q) {
    $scope.items = [];
    $scope.errorMessage = $scope.confirmMessage = '';

	init();
	
	// update scope of the items when we load the page and when we add a new item
	function updateItemsList(items) {
		$scope.items = items.data;
		return 'New item successfully created!';
	}
	
	function clearMessages() {
		$scope.confirmMessage = '';
		$scope.errorMessage = '';
	}
	
	function showConfirmMessage(confirmMessage) {
		$scope.confirmMessage = confirmMessage;
	}
	
	function showErrorMessage(errorMessage) {
		$scope.errorMessage = "Something went wrong!";
	}

	function init() {
		// get and store inside $scope all the available items
		itemsFactory.getItems()
			.then(updateItemsList)
			.catch(showErrorMessage);
	}

	// create a new empty item when the user writes its id and clicks on "create item"	
	$scope.addItem = function() {
		itemsFactory.insertItem( $scope.newItemId )
			.then(updateItemsList)
			.then(showConfirmMessage)
			.catch(showErrorMessage);
	};
	
	// remove an already created item
	$scope.removeItem = function( itemId ) {
		itemsFactory.deleteItem( itemId )
			.then(updateItemsList)
			.catch(showErrorMessage);
	}
});

// ItemController is used for the update page of single item
itemsApp.controller('ItemController', function($scope, $routeParams, itemsFactory) {

	$scope.itemId = '';
	$scope.item = {};
	$scope.confirmMessage = $scope.errorMessage = '';
	
	init();
	
	function init() {
		//Grab item ID off of the route        
        $scope.itemId = ($routeParams.id) ? $routeParams.id : 0;

        itemsFactory.getItems()
        	.then(searchForItem)
        	.then(updateItemScope)
        	.catch(showErrorMessage);
	}
	
	function searchForItem(items) {
		for (var i = 0; i < items.data.length; i++) {
			if (items.data[i].id === $scope.itemId) {
				return items.data[i];
			}
		}
	}
	
	function updateItemScope(item) {
		$scope.item = item;
	}
	
	// send to the server the item just changed from the user
	$scope.editItem = function() {
		clearMessages();
		itemsFactory.updateItem( $scope.item )
			.then(showConfirmMessage)
			.catch(showErrorMessage)
	}
	
	function clearMessages() {
		$scope.confirmMessage = '';
		$scope.errorMessage = '';
	}
	
	function showConfirmMessage(confirmMessage) {
		$scope.confirmMessage = confirmMessage.data.message;
	}
	
	function showErrorMessage(errorMessage) {
		$scope.errorMessage = 'Something went wrong!';
	}
	
	// all the following functions are called to add/remove a sub-element of a specific item 
	// (only from the $scope, that will be sent to the server when the user clicks on "update")
	$scope.addTag = function() {		
		itemsFactory.insertTag( $scope.item, $scope.newTag );
		$scope.newTag = null;
	};
	
	$scope.addChannel = function() {
		itemsFactory.insertChannel( $scope.item, $scope.newChannel.name, $scope.newChannel.id );
		$scope.newChannel.name = $scope.newChannel.id = null;
	};
	
	$scope.addCountry = function() {
		itemsFactory.insertCountry( $scope.item, $scope.newCountry.value, $scope.newCountry.key );
		$scope.newCountry.value = $scope.newCountry.key = null;
	};
	
	$scope.addLanguage = function() {
		itemsFactory.insertLanguage( $scope.item, $scope.newLanguage.value, $scope.newLanguage.key );
		$scope.newLanguage.value = $scope.newLanguage.key = null;
	};
	
	$scope.addCity = function() {
		itemsFactory.insertCity( $scope.item, $scope.newCity );
		$scope.newCity = null;
	};
	
	$scope.addRegion = function() {		
		itemsFactory.insertRegion( $scope.item, $scope.newRegion );
		$scope.newRegion = null;
	};
	
	$scope.removeTag = function(tag) {		
		itemsFactory.deleteElement( $scope.item.tags, tag );
	}
	
	$scope.removeChannel = function(channel) {
		itemsFactory.deleteElement( $scope.item.channels, channel );	
	}
	
	$scope.removeCountry = function(country) {
		itemsFactory.deleteElement( $scope.item.geo.countries, country );	
	}
	
	$scope.removeLanguage = function(language) {
		itemsFactory.deleteElement( $scope.item.geo.languages, language );	
	}
	
	$scope.removeCity = function(city) {
		itemsFactory.deleteElement( $scope.item.geo.cities, city );	
	}
	
	$scope.removeRegion = function(region) {
		itemsFactory.deleteElement( $scope.item.geo.regions, region );	
	}
	


});
