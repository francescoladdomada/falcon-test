var express = 			require("express");
var bodyParser = 		require("body-parser");
var fs = 				require("fs");

// config
var dataFolder = 		"./data/";
var jsonSchemaFile = 	dataFolder+"schema.json";
var itemsFile = 		dataFolder+"items.json";
var serverPort = 		3000;

var app = express();
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true
})); 

// apply this rule to all requests accessing any URL/URI
// (used to fix the problem of the OPTIONS request)
app.all('*', function(req, res, next) {
    // add details of what is allowed in HTTP request headers to the response headers
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Credentials', false);
    res.header('Access-Control-Max-Age', '86400');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    // the next() function continues execution and will move onto the requested URL/URI
    next();
});


// routes
app.post('/getItems', function(req, res) {
	// read the items file and returns its content
	fs.readFile(itemsFile, 'utf8', function(err, data) {
		if(err) throw err;
		res.contentType("application/json");
		res.send(data);
	});
});

app.post('/createItem', function(req, res) {
	// read json schema file
	fs.readFile(jsonSchemaFile, 'utf8', function(err, data) {
		if(err) throw err;
		// create the new item with the new id
		var newItem = JSON.parse(data);
		newItem.id = req.body.id;
		// read items file
		fs.readFile(itemsFile, 'utf8', function(err, data) {
			if(err) throw err;
			var itemsJSON = JSON.parse(data);
			// append the new item at the end of the items that we already have
			itemsJSON.push(newItem);
			var newContentString = JSON.stringify(itemsJSON);
			// update the items file
			fs.writeFile(itemsFile, newContentString, function(err) {
				if(err) throw err;
				res.contentType("application/json");
				res.send(newContentString);
			});
		});
	});
	
});

app.post('/updateItem', function(req, res) {
	// req.body contains the whole object that we are going to replace
	var updatedItem = req.body;
	var found = false;
	
	// read items file
	fs.readFile(itemsFile, 'utf8', function(err, data) {
		if(err) throw err;
		var itemsJSON = JSON.parse(data);
		for (var i = itemsJSON.length-1; i >= 0; i--) {
			// find the item that we want to update and replace it totally
			if(itemsJSON[i].id === updatedItem.id) {
				itemsJSON[i] = updatedItem;
				found = true;
			}
		}
		// update only if the element is found
		if(found) {
			var newContentString = JSON.stringify(itemsJSON);
			fs.writeFile(itemsFile, newContentString, function(err) {
				if(err) throw err;
				res.contentType("application/json");
				res.send('{"message": "Item updated!"}');
			});
		}

	});
});

app.post('/deleteItem', function(req, res) {
	// read the items file
	fs.readFile(itemsFile, 'utf8', function(err, data) {
		if(err) throw err;
		var itemsJSON = JSON.parse(data);
		for (var i = itemsJSON.length-1; i >= 0; i--) {
			// find the element in the list
			if( itemsJSON[i].id === req.body.id) {
				// remove element from the list
				itemsJSON.splice(i, 1);
				var newContentString = JSON.stringify(itemsJSON);
				// update again the file
				fs.writeFile(itemsFile, newContentString, function(err) {
					if(err) throw(err);
					res.contentType("application/json");
					res.send(newContentString);
				});
				break;
			}
		}
	});
});

app.listen(serverPort);
