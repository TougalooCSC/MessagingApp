angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope, $firebaseAuth, Users, Directory) {
  $scope.settings = {
    enableFriends: true, 
    loggedIn: false
  };
  $scope.users = Users;
  $scope.directory = Directory;

  var ref = new Firebase ("https://glaring-torch-9527.firebaseio.com");
  $scope.authObj = $firebaseAuth(ref);
  $scope.authObj.$onAuth(function(authData){
      if (authData) {
        console.log("logged in as:", authData.uid);
        $scope.settings.loggedIn = true;
        $scope.users.add(authData); //TODO; ONLY ADD IF NEW
        var entry = $scope.directory.get(authData.uid);
        if (entry === null ){
          $scope.directory.add({
            displayName: getName(authData),
            uid: authData.uid
          });
        }

       } else {
        console.log("Logged out");
        $scope.settings.loggedIn = false;
       }
  });




  $scope.logon = function (){
    $scope.authObj.$authWithOAuthPopup("facebook").then(function(authData){
      console.log("Logged in as:", authData.uid);
    }).catch(function(error){
      console.error("Authentication failed:", error);
    });

  };
  $scope.logoff = function (){
    $scope.authObj.$unauth();

   };

});
