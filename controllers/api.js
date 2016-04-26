var
	User = require('../models/User.js'),
	jwt = require('jsonwebtoken')//,
  //Stock = require('../models/Stock.js')

module.exports = {

  // register
  register: function(req, res) {
    console.log(req.body);
    // create a new user
    var newUser = new User({
      name: req.body.name,
      password: req.body.password,
      // admin: true
    });

    // save the new user
    newUser.save(function(err) {
      if (err) throw err;

      console.log('User saved successfully');
      var token = jwt.sign(newUser, app.get('superSecret'), {
        expiresInMinutes: 1440 //24 hours
      });

      res.json({
        success: true,
        message: 'Successfully registered and you get a token!',
        token: token
      });
    });
  },

	// list all users
	index: function(req, res) {
    User.find({}, function(err, users) {
      res.json({success: true, message: users});
    });
  },

	// show specific user
	show: function(req,res){
		User.findOne({_id: req.params.id}, '-password').populate('portfolio').exec(function(err, user){
			if(err) return console.log(err)
			res.json(user)
		})
	},

	// update a user
	update: function(req,res){
		User.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, function(err, user){
			if(err) return console.log(err)
			res.json({success: true, message: "User updated!", user: user})
		})
	},

	// update a user
	removeStock: function(req,res){
		// {'_id': ObjectId(req.params.id)},
    // { $pull: { "portfolio" : { id: req.body.portfolio } } }
		User.findOne({_id: req.params.id}, function(err, user){
			if(err) return console.log(err)
			user.portfolio.splice(user.portfolio.indexOf(req.body.portfolio),1)
			res.json(user)
		})
	},

	// delete a user
	delete: function(req,res){
		User.findOneAndRemove({_id: req.params.id}, function(err){
			if(err) return console.log(err)
			res.json({success: true, message: "User Deleted!"})
		})
	},

	authenticate: function(req, res){
    console.log(req.body);
    // Find the user
    User.findOne({name: req.body.name}, function(err, user){
      if (err) throw err;
      // User not found
      if (!user){
        res.json({success: false, message: 'User not found'});
      } else if (user) {
        // password doesn't match
        if (user.password != req.body.password){
          res.json({success: false, message: 'Wrong password'});
        } else {
          // It means we found the user and the passwords match
          var token = jwt.sign(user, app.get('superSecret'), {
            expiresInMinutes: 1440 //24 hours
          });

          res.json({
            success: true,
            message: 'Enjoy your token!',
            token: token
          });

        }
      }
    });
  },

	protect: function(req, res, next){
    // check header or url parameters or post parameters for a token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (!token){
      res.json({
        success: false,
        message: 'you need a token to play at ChuckeCheese'});
    } else {
      jwt.verify(token, app.get('superSecret'), function(err, decoded) {
        if (err){
          return res.json({
            success: false,
            message: 'That token is not legit'
          });
        } else {
          // everything is good with the token, then save it to the req in other routes
          req.decoded = decoded;
          next();
        }
      });
    }
  }
}
