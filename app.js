
	var express = require('express'),
				 path = require('path'),
				 port = 3000,
					app = express();

	// middlewares && static files --> /public
	app.use(express.static(__dirname + '/public'));

	// setting up the login/signup page
	app.get('/', function(req, res) {
		res.sendFile(path.join(__dirname + '/views/login.html'));
	});

	// setting up the manage store page for unique users
	app.get('/managestore/:id', function(req, res) {
		res.sendFile(path.join(__dirname + '/views/managestore.html'));
	});

	// setting up the shared url
	app.get('/:id', function(req, res) {
		res.sendFile(path.join(__dirname + '/views/sharedurl.html'));
	});

	// Handle 404
	app.use(function(req, res) {
		res.status(404).send('404: Page not Found');
	});
	
	// Handle 500
	app.use(function(error, req, res, next) {
		res.status(500).send('500: Internal Server Error');
	});

	// server listening on port 3000
	app.listen(port);
	console.log('server running on port ' + port);

	