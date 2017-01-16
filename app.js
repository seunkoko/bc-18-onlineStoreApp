
  var express = require('express'),
   bodyParser = require('body-parser'),
         port = 3000,
          app = express();

  // setting up the view engine --> ejs
  app.set('view engine', 'ejs');

  // middlewares && static files --> /public
  app.use(express.static(__dirname + '/public'));
  app.use(bodyParser.urlencoded({ extended: false }));

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

  