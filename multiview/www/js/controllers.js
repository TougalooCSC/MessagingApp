angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})
.controller('NewChatCtrl', function($scope, $stateParams, Friends, Chats, Base){
  $scope.participants = [];
  $scope.friends = Friends.all();
  $scope.searchText = "";
  $scope.messageText = "";
  $scope.Chats = Chats;

  $scope.addParticipant = function(participant) {
    $scope.participants.push(participant);
  };

  $scope.removeParticipant = function(idx){
    console.log(idx);
    var deleted = $scope.participants.splice(idx, 1);
    console.log(deleted);
  }

  $scope.createConversationMetadata = function() {
    //collect all the participants in array
    var ids = [];
    for (var i=0; i < $scope.participants.length; i++){
      ids.push($scope.participants[i].uid)
    }
    var myUid = Base.getAuthData().uid;
    ids.push(myUid);
    ids.sort();
    var convoId = ids.join();
    console.log(convoId);
    return { id: convoId, idArray: ids };
    //sort all the participantIds
    //create string by joining ids
  }
  $scope.createConversation = function() {
    var convoMetadata = $scope.createConversationMetadata();
    $scope.Chats.add({id: convoMetadata.id, participants: convoMetadata.idArray, messages: [$scope.messageText]});
  };


})
.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('FriendsCtrl', function($scope, Friends, Directory, $ionicPopover) {
  $scope.friends = Friends.all();
  $scope.directory = Directory.all();
  

  $ionicPopover.fromTemplateUrl('templates/add-contact.html', {scope: $scope})
    .then(function(popover){
      $scope.popover = popover;
    });
  $scope.openAddContactPopover = function($event){
    $scope.popover.show($event);
  };
  $scope.closeAddContactPopover = function(){
    scope.popover.hide();
  };
  $scope.$on('$destroy', function(){
    $scope.popover.remove();
  });
  $scope.addContact = function(contact){
    Friends.add(contact);
  };
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

  var ref = new Firebase ("https://corntoole.firebaseio.com/v2");
  $scope.authObj = $firebaseAuth(ref);
  $scope.authObj.$onAuth(function(authData){
      if (authData) {
        console.log("logged in as:", authData.uid);
        $scope.settings.loggedIn = true;
        var user = $scope.users.get(authData.uid);
        console.log(user);
        if (user.$value == null) {
          $scope.users.add(authData); //TODO; ONLY ADD IF NEW
        }
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
