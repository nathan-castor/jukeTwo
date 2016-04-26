var express     = require('express');
var app         =  express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var dotenv      = require('dotenv').load({silent: true})
var apiRoutes   = require('./routes/api.js')

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var User   = require('./models/user'); // get our mongoose model

// =======================
// configuration =========
// =======================
var port = process.env.PORT || 8080; // used to create, sign, and verify tokens
mongoose.connect(config.database); // connect to database
app.set('superSecret', process.env.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')))

// use morgan to log requests to the console
app.use(morgan('dev'));
// =======================
// routes ================
// =======================
// basic route

app.get('/', function(req,res){
	res.sendFile(path.join(__dirname, 'public/index.html'))
})
// app.get('/', function(req, res) {
//     res.send('Hello! The API is at http://localhost:' + port + '/api');
// });

// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);

// =======================
// start the server ======
// =======================
app.listen(port, function(){
   console.log('Magic happens at http://localhost:' + port);
});
