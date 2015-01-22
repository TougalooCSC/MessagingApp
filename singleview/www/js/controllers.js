angular.module('starter.controllers', [])
  .controller('ChatController',function($scope, Users)
  {
  	$scope.messages = ["Hi", "Hello"];
  	$scope.users = Users.all();

  });