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

	});