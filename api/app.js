// Require our dependencies
var express = require('express'),
  exphbs = require('express-handlebars'),
  http = require('http');
  
// Create an express instance and set a port variable
var app = exports.app = express();
app.set('views', 'web/views/');

// Create `ExpressHandlebars` instance with a default layout.
var hbs = exphbs.create({
    defaultLayout: 'main',
    layoutsDir: 'web/views/layouts/',
    partialsDir: 'web/views/partials/',
    compilerOptions: undefined
});

// Register `hbs` as our view engine using its bound `engine()` function.
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');


// Disable etag headers on responses
app.disable('etag');


// Set /public as our static content dir
app.use("/", express.static(__dirname + "/html/"));
