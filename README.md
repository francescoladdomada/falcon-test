# falcon-test
1. HOW TO RUN ------------------------------------------------------------------------
- Run "node app.js" from the root
- Open the index.html file from the browser



2. STRUCTURE --------------------------------------------------------------------------

On the client side (written with AngularJS and stored in the app/ folder) there are:
- one service/factory
	- services/itemsFactory
- 2 controllers:
	- controllers/itemsControllers (for the list)
	- controllers/itemController (for the single element)
- 2 partials:
	- partials/items.html
	- partials/item.html
	
The angular index file is all inside app/app.js, and for each possible route it connects controllers and partials.

The two controllers create the $scope that is used from the partials to show the data.
The data stored in the $scope is taken from the itemsFactory service, that makes POST request sending JSON data to the CRUD endpoints.
Since the POST requests are all asynchronous, it is necessary to wait for the server response before showing data or feedback to the user.
To do this, I used a promises-system between the controllers and the factory every time I had to make a POST request.
In this way, the $scope was updated only from the controller and only when the factory returned data from the server.

On the backend (written with NodeJS) there is one file (app.js, in the root folder) that creates the listening server and has 4 endpoints:
- getItems
- createItem
- updateItem
- deleteItem

They all receive POST requests sent from the itemFactory file, then read and (eventually) write the JSON file (data/items.json).
The createItem endpoint reads another file (data/schema.json) as well, to get the structure of the item and replace its id with the one
written/sent by the user.



This is an example of how the list page is rendered with its data:
1 - The controller itemsController calls from the itemsFactory service the asynchronous function getItems()
2 - The factory makes a POST request (without parameters) to the server through $http and generating a promise.
3 - The server reads the json file and returns it to the client
4 - When the data returns to the client, the promise is fullfilled and the controller can make his next step (storing the information inside the scope)
5 - If the data is not returned and/or the promise is not fullfilled, the controller updates the error message in the scope
6 - The scope is rendered in the partial of that controller



3. KNOWN ISSUES / REFLECTIONS --------------------------------------------------------------------------

- There should be a validation on the items, especially on the id that has to be unique 
(otherwise the server will update only the first element that it finds in the list)
Because of this reason, it's also not possible to change the id of an already-created item (that is used to recognize the item in the list).

- Since the application works with files, there would be synchronization problems with multiple access at the same time.

- It is necessary to create an empty element only with an id, before inserting other information.
This choice was made to save some time, but it would have been enough to change the controller's functions called from the partial, depending on the fact that was a create/update page. 

- When updating the sub-elements of an item (i.e. tags, cities, languages, etc.) they are not saved on the server until the user clicks on "Update" at the end of the page. The solution to this problem was to update the whole element every time that the user typed a character in the input fields, but it was probably too much and also not clear for the user that had to click anyway on the final button to update the other fields.
