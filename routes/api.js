var
	express = require('express'),
  apiRouter = express.Router(),
	apiCtrl = require('../controllers/api.js')//,
	//scrapeCtrl = require('../controllers/scrape.js')



// API ROUTES -------------------
// get an instance of the router for api routes

// This route will allow users to register
apiRouter.post('/authenticate', apiCtrl.authenticate)

apiRouter.route('/register')
  .post(apiCtrl.register)

// route to show a message (GET /api)
apiRouter.route('/', function(req, res) {
  res.json({ message: 'Welcome to ChuckeCheese' });
});

// route middleware to verify token
apiRouter.use(apiRouter.protect);

// route to return all users (GET /api/users)
apiRouter.route('/users')
  .get(apiCtrl.index)

apiRouter.route('/users/:id')
  .get(apiCtrl.show)

module.exports = apiRouter
