angular.module('starter.services', [])
	.service('Users', function (){
		this.users = [
			{id: 1, name: 'Alice', contacts: [2], image: 'img/alice.png'},
			{id: 2, name: 'Bob', contacts: [1,3], image: 'img/bob.png'},
			{id: 3, name: 'Carol', contacts: [1,2], image: 'img/carol.png'}
		];
		this.all = function () {
			return this.users;

		};
		this.get = function (id) {
			for (var i= 0, len = this.users.length; i<len; i++){
				if (id === this.users[i].id){

					return this.users[i];
				}
			}
		};
		this.getUserByName = function (name) {
		      for (var i = 0, len = this.users.length; i < len; i++){
		              if (name === this.users[i])
		              {
		                      return this.users[i];
		              }
		      }
		    };

	})
	.service('Chats', function () {
	    this.conversations = [
	      {id: 1, participants: [1, 2], messages: [{from: 1, to: 2, contents: "hi"}, {from: 2, to: 1, contents: "wassup"}]},
	      {id: 2, participants: [2, 3], messages: [{from: 2, to: 3, contents: "yo!"}, {from: 3, to: 2, contents: "yo!!!"}]}
	    ];
	    this.lastConvoId = 2;
	    this.getConversation = function (id){
	       for (var j = 0, len = this.conversations.length; j < len; j++) {
	         if (id === this.conversations[j].id) {
	           return this.conversations[j];
	         }
	       }
	    };
	    this.getConversationByParticipantIds = function (participantIds) {
	            var allParticipantsFound = true;
	            for (var i = 0, len = this.conversations.length; i < len; i++) {
	        for (var j = 0, ids_len = this.conversations.length; j < ids_len; j++) {
	          if (!(participantIds[j] in this.conversations[i].participants)) {
	                  allParticipantsFound = false;
	                  break;
	          }
	        }
	        if (allParticipantsFound) {
	                return this.conversations[i];
	        }
	      }
	    };
	    this.addMessage = function(id, senderId, receiverIds, contents){
	      var convo = this.getConversation(id);
	      var newMsg = {from: senderId, to: receiverIds, contents: contents};
	      convo.messages.push(newMsg);
	      return newMsg;
	    };
	  }); 