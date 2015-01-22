angular.module('starter.controllers', [])
  .controller('ChatController',function($scope, Users, Chats, $ionicScrollDelegate)
  {
  	$scope.messages = ["Hi", "Hello"];
  	$scope.users = Users.all();
  	$scope.imgUrls = {};
  	$scope.users.forEach(function(element){
  		$scope.imgUrls[element.id] = element.image;
  	});
  	$scope.currUser = Users.get(2);
  	$scope.currConversation = Chats.getConversation(2);
  	$scope.messages = $scope.currConversation.messages;
  	$scope.messageText = "";
  	$scope.sendMessage = function(msg){
  	     // $scope.messages.push({from:$scope.currUser.id, contents: msg, fromUser: true, avatar: $scope.currUser.image});
  	     var msgData = Chats.addMessage($scope.currConversation.id, $scope.currUser.id, $scope.participants, msg);
  	     msgData["fromUser"] = true;
  	     msgData["avatar"]   = $scope.currUser.image;
  	     $scope.msgText = "";
  	     $ionicScrollDelegate.scrollBottom(true);
  	   };

  });