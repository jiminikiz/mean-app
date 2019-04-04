angular
  .module('module.auth', []) // declaring an angular module
  .controller('module.auth.controller', Auth); // chaining a controller

Auth.$inject = ['$http']; // injecting the $http service

function Auth($http) { // auth controller constructor function
  console.info("[auth.controller.initialized]");

  this.payload = {};

  this.login = {
    submit: function() {
      $http.post('/login', auth.payload)
      .then(auth.login.success, auth.login.failure);
    },
    success: function(res) {
      // when login is successful, redirect them into the dashboard
      console.info('[auth.login.success]');
      location.href = "/dashboard";
    },
    failure: function(err) {
      console.error('[auth.login.error]:', err);
    }
  };

  auth.register = {
    submit: function($event) {
      $http.post('/register', this.payload)
      .then(this.register.success, this.register.failure);
    },
    success: function(res) {
      // when register is successful, also redirect them into the dashboard (already logged in, [req.session.user] on the backend)
      console.info('[auth.register.success]');
      location.href = "/dashboard";
    },
    failure: function(err) {
      console.error('Register:error', err);
    }
  };
}
