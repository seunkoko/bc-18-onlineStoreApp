
  var express = require('express'),
   bodyParser = require('body-parser'),
         path = require('path');
         port = 3000,
          app = express();

  // middlewares && static files --> /public
  app.use(express.static(__dirname + '/public'));
  app.use(bodyParser.urlencoded({ extended: false }));

  // setting up the login/signup page
  app.get('/', function(req, res) {
    console.log(req.url);
    res.sendFile(path.join(__dirname + '/views/login.html'));
  });

  app.get('/managestore/:id', function(req, res) {
    console.log(req.url);
    res.sendFile(path.join(__dirname + '/views/managestore.html'));
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

  