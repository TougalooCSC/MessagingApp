angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('FriendsCtrl', function($scope, $ionicPopover, Friends, Directory) {
  $scope.friends = Friends.all();
	$scope.directory = Directory.all();

  $ionicPopover.fromTemplateUrl('templates/addContactPopover.html', {scope: $scope})
    .then(function(popover) {
      $scope.popover = popover;
    });
  $scope.openAddContactPopover = function($event){
    $scope.popover.show($event);
  };
  $scope.closeAddContactPopover = function () {
    $scope.popover.hide();
  };
  $scope.$on('$destroy', function(){
    $scope.popover.remove();
  });
  $scope.addContact = function(contact) {
		Friends.add(contact);		
  };
  $scope.findContact = function (searchFields) {
    var friendResult;
    if (searchFields.hasOwnProperty('email')) {
      friendResult = Friends.findByEmail();
    }
  };
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope, $firebase, $firebaseAuth, Users, Directory) {
  $scope.settings = {
    enableFriends: true,
    loggedIn: false
  };

  $scope.userData = null;
  $scope.email = "ccapri90@yahoo.com";
  $scope.password = "asdf1234";
  $scope.directory = Directory.all();

  var ref = new Firebase ("https://corntoole.firebaseio.com");
  $scope.authObj = $firebaseAuth(ref);
  $scope.authObj.$onAuth(function(authData){
      if (authData) {
        console.log(authData);
        console.log("logged in as:", authData.uid);
        // console.log(userData);
        // if (userData === null) {
        //   Users.add(authData);
        // }
        //Users.add(authData);

        var userRecord = $firebase(ref.child('users').child(authData.uid)).$asObject();
        userRecord.$loaded().then(function() {
          console.log("record: ", userRecord.$id);
          //Directory.add({'displayName': userRecord.displayName, 'uid': userRecord.uid})//TODO:fix hack
          var directoryEntry = Directory.get(userRecord.displayName);
          console.log(directoryEntry);
        });
        $scope.userData = userRecord;


        $scope.settings.loggedIn = true;
       } else {
        console.log("Logged out");
        $scope.settings.loggedIn = false;
       }
  });

  $scope.logon = function (provider){

    if (provider == "facebook") {
      $scope.authObj.$authWithOAuthPopup("facebook").then(function(authData){
        console.log("Logged in as:", authData.uid);
      }).catch(function(error){
        console.error("Authentication failed:", error);
      });
    } else if (provider == "password") {
      $scope.loginWithPassword();
    }

  };
  $scope.loginWithPassword = function() {
    $scope.authObj.$authWithPassword({
      "email": $scope.email,
      "password": $scope.password
      }, function(error, authData){
        if (authData) {
          console.log("logged in as:", authData.uid);
        } else {
          console.log("Login failed!", error);
        }
      }
    );
  };
  $scope.logoff = function (){
    $scope.authObj.$unauth();

   };

});
