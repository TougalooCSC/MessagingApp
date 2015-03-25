angular.module('starter.services', [])
  .factory('Users', function($firebase){
    var fbase = new Firebase("https://corntoole.firebaseio.com/users");
    var users = $firebase(fbase);
    // var usersArray = users.$asArray();
    // usersArray.$loaded()
    //   .then(function(x){
    //     if (x == usersArray) {
    //       console.log(usersArray);
    //     }
    //
    //   })
    //   .catch(function(error){
    //     console.log("Error:", error);
    //   });

    var matchesUid = function(element, index, array){
      return element.uid == this.uid;
    };

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

    return {
      get: function(uid) {
        //TODO fix if rules on /users changes
        var userEntry = $firebase(fbase.child('users').child(uid)).$asObject();
        userEntry.$loaded().then(function() {
        console.log("loaded record:", userEntry.$id, userEntry.displayName, userEntry.provider);

       // To iterate the key/value pairs of the object, use angular.forEach()
       angular.forEach(userEntry, function(value, key) {
          console.log(key, value);
       });
     });
        console.log(userEntry.name);
        console.log(userEntry.uid);
        return userEntry;

      },
      findByEmail: function(email){
        var result;
        function setResult (snap) {
          result = snap;
        }
        fbase
          .startAt(email)
          .endAt(email)
          .once('value', setResult);
        return result;
      },
      findByName: function(name) {
        var result;
        function setResult (snap) {
          result = snap;
        }
        fbase
          .startAt(name)
          .endAt(name)
          .once('value', setResult);
        return result;
      },
      // all: function () {
      //   return usersArray;
      // },
    add: function (authData) {
        users.$set(authData.uid, {
          uid: authData.uid,
          provider: authData.provider,
          displayName: getName(authData) //firebase objs have an attr called name
        });
        // console.log(usersArray);

      }
    };
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
          if (chats[i].id == parseInt(chatId)) {
            return chats[i];
          }
        }
        return null;
      }
    };
  })

  /**
   * A simple example service that returns some data.
   */
  .factory('Friends', function(Users, $firebase, $firebaseAuth) {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    // Some fake testing data
    // {
    //   id: 0,
    //   name: 'Ben Sparrow',
    //   notes: 'Enjoys drawing things',
    //   face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
    // },
    var friends = [];
		var ref = new Firebase("https://corntoole.firebaseio.com");
		var authObj = $firebaseAuth(ref);
		var authData = authObj.$getAuth();
		
		var friendsSync = $firebase(ref.child('users').child(authData.uid).child('contacts'));

		friends = friendsSync.$asArray();
		friends.$loaded().then(function(){
			console.log("loaded: " + friends.length+ " friends loaded ");
		});

		
    return {
      all: function() {
        return friends;
      },
      get: function(friendId) {
        // Simple index lookup
        return friendsSync[friendId];
      },
			add: function(friend) {
				friendsSync.$push({
					displayName: friend.displayName,
					uid: friend.uid//,
					//imgUrl: friend.imgUrl
				});
			}
    };
  })
  .factory('Directory', function($firebase){
    var ref = new Firebase("https://corntoole.firebaseio.com/directory");
    var _directory = $firebase(ref);
    var directorySync = $firebase(ref).$asObject();
    var directoryAsArray = $firebase(ref).$asArray();
    return {
      all: function() {
        return directoryAsArray;
      },
      get: function(key) {
        return directorySync[key];
      },
      add: function(entry) {
        if (!entry.hasOwnProperty('displayName')) {
          throw "Entry must have attr: displayName!"
        }
        if (!entry.hasOwnProperty('uid')) {
          throw "Entry must have attr: uid!"
        }
        _directory.$set(entry.displayName, {
					displayName: entry.displayName,
					uid: entry.uid//,
					//imgUrl: entry.imgUrl
				})
          .then(function(ref){ //TODO: factor this promise out
            console.log(ref.key());
          }, function(error) {
            console.log("Error:", error);
          });
      }
    };
  });
