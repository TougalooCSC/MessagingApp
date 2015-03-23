var getName = function (authData) {
    switch(authData.provider) {
       case 'password':
         return authData.password.email.replace(/@.*/, '');
       case 'twitter':
         return authData.twitter.displayName;
       case 'facebook':
         return authData.facebook.displayName;
    }
};
angular.module('starter.services', [])
.factory('Directory', function($firebaseObject, $firebaseArray){
 var url = "https://glaring-torch-9527.firebaseio.com";
  var ref = new Firebase(url);
  var _directoryRef = ref.child('directory');
  var directorySync = $firebaseObject(ref);
  var directoryAsArray = $firebaseArray(ref);

  return {
    all: function(){
      return directoryAsArray;
    },
    get: function(key){
      return directoryAsArray.$getRecord(key);
    },
    add: function(entry){
      if (!entry.hasOwnProperty('displayName')){
        throw "Entry must have attr: displayName"
      }
      if (!entry.hasOwnProperty('uid')){
        throw "Entry must have attr: uid!"
      }
      _directoryRef.child(entry.displayName).set({displayName: entry.displayName, uid:entry.uid});
    }
  };
})
.factory('Users', function($firebaseObject, $firebaseAuth){
  var url = "https://glaring-torch-9527.firebaseio.com";
  var ref = new Firebase(url);
  var usersRef = ref.child("users");
  // var authObject = $firebaseAuth(ref);
  // var authData = authObject.$getAuth();
  // if (authData) {
  //   usersRef = $firebase(ref.child(authData.uid));
  // }
  
  return {
    add: function(authData) {
      usersRef.child(authData.uid).set({
        uid: authData.uid,
        displayName: getName(authData),
        contacts: []
      })
    },
    get: function(uid){
      return $firebaseObject(ref.child("users").child(uid));
    } 
  }
  // var userData = 
})
.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Andrew Jostlin',
    lastText: 'Did you get the ice cream?',
    face: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
  }, {
    id: 3,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 4,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  }
})

/**
 * A simple example service that returns some data.
 */
.factory('Friends', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  // Some fake testing data
  var friends = [{
    id: 0,
    name: 'Ben Sparrow',
    notes: 'Enjoys drawing things',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    notes: 'Odd obsession with everything',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Andrew Jostlen',
    notes: 'Wears a sweet leather Jacket. I\'m a bit jealous',
    face: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
  }, {
    id: 3,
    name: 'Adam Bradleyson',
    notes: 'I think he needs to buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 4,
    name: 'Perry Governor',
    notes: 'Just the nicest guy',
    face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
  }];


  return {
    all: function() {
      return friends;
    },
    get: function(friendId) {
      // Simple index lookup
      return friends[friendId];
    }
  }
});
