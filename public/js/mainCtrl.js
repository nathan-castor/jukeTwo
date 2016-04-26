(function(){
  angular.module('app', [])
    .factory('authInterceptor', authInterceptor)
    .service('user', userService)
    .service('auth', authService)
    .config(function($httpProvider){
      $httpProvider.interceptors.push('authInterceptor');
    })
    .controller('Main', MainCtrl);

  MainController.$inject = ['$state', '$scope', '$window']

  function MainCtrl(user, auth, $state, $scope, $window){
    var self = this;

    function handleRequest(res){
      var token = res.data ? res.data.token : null;
      console.log(res);

      if (token){
        // console.log('JWT:', token);
        // auth.saveToken(token);
      };
      self.message = res.data.message;
    }

    vm.title = "Main Controller"
    vm.newUser = {}

    userService.index().success(function(results){
      vm.users = results
    })

    self.create = function(){
      // run the userService create method here.
      userService.create(vm.newUser).success(function(response){
        $state.go('detail', {id: response.user._id})
      })
    }

    self.destroy = function(id, index){
      userService.destroy(id).success(function(response){
        console.log(response)
        vm.users.splice(index, 1)
      })
    }

    self.update = function(data) {
      console.log("mainCtrl data",data);
      userService.update(data).success(function(response) {
        //console.log("response from mainCtrl update",response);
        $window.localStorage['userPortfolio'] = response.portfolio
        $state.go('home')
      })
    }

    self.login = function() {
      user.login(self.name, self.password)
        .then(handleRequest, handleRequest);
    }

    self.register = function() {
      user.register(self.name, self.password)
        .then(handleRequest, handleRequest);
    }
    self.getUsers = function() {
      user.getUsers()
        .then(handleRequest, handleRequest);
    }
    self.logout = function() {
      auth.logout && auth.logout();
      self.message = 'You are logout now';
    }
    self.isAuthed = function() {
      return auth.isAuthed ? auth.isAuthed() : false;
    }


  }

  function userService($http){
    var self = this;

    self.login = function(name, password){
      return $http.post('api/authenticate', {
        name: name,
        password: password
      });
    };

    self.register = function(name, password){
      return $http.post('api/register', {
        name: name,
        password: password
      });
    };
    self.getUsers = function(name, password){
      return $http.get('api/users');
    };
  }

  function authService($window){
    var self = this;
    self.parseJwt = function(token) {
      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace('-', '+').replace('_', '/');
      return JSON.parse($window.atob(base64));
    };

    self.saveToken = function(token){
      $window.localStorage['jwtToken'] = token;
    };

    self.getToken = function() {
      return $window.localStorage['jwtToken'];
    };

    self.isAuthed = function() {
      var token = self.getToken();
      if(token) {
        var params = self.parseJwt(token);
        return Math.round(new Date().getTime() / 1000) <= params.exp;
      } else {
        return false;
      }
    };
    self.logout = function() {
      $window.localStorage.removeItem('jwtToken');
    };
  }

  function authInterceptor(auth){
    return {
      request: function(config) {
        var token = auth.getToken();
        if(token) {
          config.headers['x-access-token'] = token;
        }
        return config;
      },

      response: function(res){
        if(res.data.token){auth.saveToken(res.data.token)};
        return res;
      }
    }
  }
})()
