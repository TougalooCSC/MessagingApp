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
.factory('Base', function($firebaseAuth){
  var url = "https://corntoole.firebaseio.com/v2";
  var ref = new Firebase(url);
  var authObj = $firebaseAuth(ref);
  console.log(authObj);
  var authData = authObj.$getAuth();
  var userRef = ref.child('users').child(authData.uid);
  authObj.$onAuth(function(authenticationData){
    if (authenticationData) {
      authData = authenticationData;
      userRef = ref.child(authData.uid);
    }
  });
  return {
    getURL: function() {
      return url;
    },
    getAuthData: function() {
      return authData;
    },
    getUserRef: function() {
      return userRef;
    }

  };
})
.factory('Directory', function($firebaseObject, $firebaseArray){
 var url = "https://corntoole.firebaseio.com/v2";
  var ref = new Firebase(url);
  var _directoryRef = ref.child('directory');
  var directorySync = $firebaseObject(_directoryRef);
  var directoryAsArray = $firebaseArray(_directoryRef);
  directoryAsArray.$loaded().then(function(a){
      console.log(a);
    })
    .catch(function(error){
      console.log("Error: ", error);
    });

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
  var url = "https://corntoole.firebaseio.com/v2";
  var ref = new Firebase(url);
  var usersRef = ref.child("users");
  // var authObject = $firebaseAuth(ref);
  // var authData = authObject.$getAuth();
  // if (authData) {
  //   usersRef = $firebase(ref.child(authData.uid));
  // }
  var userAdded = function(userId, success) {
    if (!success) {
      console.log('user ' + userId + ' already exists!');
    } else {
      console.log('User added ' + userId);
    }
  }
  return {
    add: function(authData) {
      usersRef.child(authData.uid)
        .transaction(function(currentUserData){
          if (currentUserData === null) {
            return {
              uid: authData.uid,
              displayName: getName(authData),
              contacts: []
            };
          }
        }, function(error, committed) {
          userAdded(authData.uid, committed);
        });
    },
    get: function(uid){
      return $firebaseObject(ref.child("users").child(uid));
    } 
  }
  // var userData = 
})
// .factory('friends',function($firebaseObject, $firebaseAuth){
//   var url = "https://corntoole.firebaseio.com/v2";
//   var ref = new Firebase(url);
//   var _friendsRef = ref.child('users').child(authData.uid).child('contacts');
//   var friendsSync = $firebaseObject(ref);
//   var friends = $firebaseArray(ref);

//   return{
//     all: function(){
//      return friends;

//     },
//     get: function(uid){
//       var result = null;
//       friends.forEach(function(element){
//         if (uid == element.uid){
//           result = element;
//           return;
//         }

//       });
//       return result;
//     },
//     add: function(friend){
//       _friendsRef.child(friend.displayName).set({
//         displayName: friend.displayName, 
//         uid: friend.uid
//       })
//     }

//   };
//  })
.factory('Chats', function(Base, $firebaseObject, $firebaseArray) {
  // Might use a resource here that returns a JSON array
  var url = Base.getURL();
  var authData = Base.getAuthData();
  // Some fake testing data
  var ref = new Firebase(url);
  var conversationsRef = ref.child('conversations');
  var chatsRef = Base.getUserRef().child('conversations');
  var chats = $firebaseArray(chatsRef);
  // var chats = [{
  //   id: 0,
  //   name: 'Ben Sparrow',
  //   lastText: 'You on your way?',
  //   face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  // }];

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
    },
    add: function(newConvo) {
      conversationsRef.child(newConvo.id).set(newConvo);
      chats.append(newConvo.id);
    }
  }
})

/**
 * A simple example service that returns some data.
 */
.factory('Friends', function($firebaseObject, $firebaseAuth, $firebaseArray) {
  // Might use a resource here that returns a JSON array

  var url = "https://corntoole.firebaseio.com/v2";
  var ref = new Firebase(url);
  var authData = $firebaseAuth(ref).$getAuth();
  var friendsRef = ref.child('users').child(authData.uid).child('contacts');
  var friendsSync = $firebaseObject(friendsRef);
  var friends = $firebaseArray(friendsRef);
  friends.$loaded()
    .then(function(x){
      friends.forEach(function(element){
        console.log(element);
      })
    })

  return{
    all: function(){
     return friends;

    },
    get: function(uid){
      var result = null;
      friends.forEach(function(element){
        if (uid == element.uid){
          result = element;
          return;
        }

      });
      return result;
    },
    add: function(friend){
      function onComplete(error) {

        if (error) {
          console.log('Synchronization failed');
        } else {
          friendsRef.child(friend.displayName).set({
            displayName: friend.displayName, 
            uid: friend.uid
          });
        }
        friendsRef.child(friend.displayName).set({
          displayName: friend.displayName, 
          uid: friend.uid
        })
      }
      friendsRef.set(friend.displayName, onComplete)
      // friendsSync.$save();
    }

  };
  // [{
  //   id: 0,
  //   name: 'Ben Sparrow',
  //   notes: 'Enjoys drawing things',
  //   face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  // }, {
  //   id: 1,
  //   name: 'Max Lynx',
  //   notes: 'Odd obsession with everything',
  //   face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  // }, {
  //   id: 2,
  //   name: 'Andrew Jostlen',
  //   notes: 'Wears a sweet leather Jacket. I\'m a bit jealous',
  //   face: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
  // }, {
  //   id: 3,
  //   name: 'Adam Bradleyson',
  //   notes: 'I think he needs to buy a boat',
  //   face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  // }, {
  //   id: 4,
  //   name: 'Perry Governor',
  //   notes: 'Just the nicest guy',
  //   face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
  // }];

});
