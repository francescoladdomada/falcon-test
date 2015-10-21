itemsApp.factory('itemsFactory', function( $http, $q ) {
	var urlBase = 'http://localhost:3000';
	var items = [];
	var emptyItem = {};
	var factory = {};
	
	// it returns the items list and stores it inside the $scope
	factory.getItems = function() {
		return $http.post( urlBase+'/getItems' );
	};

	// make a post request to create a new item on the server
	factory.insertItem = function ( id ) {
		return $http.post( urlBase+'/createItem', {"id": id} );
	}
	
	// make a post request to update an already created item on the server
	factory.updateItem = function( item ) {
		return $http.post ( urlBase+'/updateItem', item );
	}

	// make a post request to delete an item with a specific id
	factory.deleteItem = function(id) {
		return $http.post( urlBase+'/deleteItem', {"id": id} );
	};
	
	// it adds one tag to the scope
	// the tag elements are updated in the scope but not on the server
	// because they are sent to the server only when the user clicks on the "update" button
	factory.insertTag = function(currentItem, tag) {
		var tags = currentItem.tags;
		tags.push(tag);
	}
	
	factory.insertChannel = function(currentItem, channelName, channelId) {
		var channels = currentItem.channels;
		channels.push({"name": channelName, "id": channelId});
	}
	
	factory.insertCountry = function(currentItem, countryValue, countryKey) {
		var countries = currentItem.geo.countries;
		countries.push({"value": countryValue, "key": countryKey});
	}
	
	factory.insertLanguage = function(currentItem, languageValue, languageKey) {
		var languages = currentItem.geo.languages;
		languages.push({"value": languageValue, "key": languageKey});
	}
	
	// it adds one city to the scope
	factory.insertCity = function(currentItem, city) {
		var cities = currentItem.geo.cities;
		cities.push(city);
	}
	
	// it adds one region to the scope
	factory.insertRegion = function(currentItem, region) {
		var regions = currentItem.geo.regions;
		regions.push(region);
	}
	
	// it deletes one sub-element (tags, channels, countries, languages, cities, regions)
	// the sub-elements are updated in the scope but not on the server
	// because they are updated to the server only when the user clicks on the "update" button
	factory.deleteElement = function(arrayOfElements, element) {		
		for (var i = 0; i < arrayOfElements.length; i++) {
			if (arrayOfElements[i] === element) {
				arrayOfElements.splice(i, 1);
				break;
			}
		}
		return null;
	}

	return factory;
})
