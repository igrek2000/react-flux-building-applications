"use strict";

var Dispatcher = require('../dispatcher/appDispatcher');
var AuthorApi = require('../api/authorApi');
var ActionTypes = require('../constants/actionTypes');

var AuthorActions = {

	createAuthor: function (author) {

		console.log('>>> AuthorActions.createAuthor --- ' + author.firstName);
		//var newAuthor = AuthorApi.saveAuthor(author);

		setTimeout(function () {
			//your code to be executed after 3 second
			var newAuthor = AuthorApi.saveAuthor(author);
			console.log('>>> AuthorActions.createAuthor --- BEFORE Dispatcher.dispatch --- actionType: ActionTypes.CREATE_AUTHOR');

			Dispatcher.dispatch({
				actionType: ActionTypes.CREATE_AUTHOR,
				author: newAuthor
			});

			console.log('>>> AuthorActions.createAuthor --- AFTER Dispatcher.dispatch --- actionType: ActionTypes.CREATE_AUTHOR');
		}, 3000);

		// Hey dispatcher, go tell all the stores that an author was just created!
		// Dispatcher.dispatch({
		// 	actionType: ActionTypes.CREATE_AUTHOR,
		// 	author: newAuthor
		// });
	},

	updateAuthor: function (author) {

		console.log('>>> AuthorActions.updateAuthor --- ' + author.firstName);

		// IGOR
		setTimeout(function () {
			//your code to be executed after 2 second
			var updatedAuthor = AuthorApi.saveAuthor(author);

			Dispatcher.dispatch({
				actionType: ActionTypes.UPDATE_AUTHOR,
				author: updatedAuthor
			});

			console.log('>>> AuthorActions.saveAuthor --- AFTER Dispatcher.dispatch --- actionType: ActionTypes.CREATE_AUTHOR');
		}, 2000);

		// var updatedAuthor = AuthorApi.saveAuthor(author);

		// Dispatcher.dispatch({
		// 	actionType: ActionTypes.UPDATE_AUTHOR,
		// 	author: updatedAuthor
		// });
	},

	deleteAuthor: function (id) {
		AuthorApi.deleteAuthor(id);

		Dispatcher.dispatch({
			actionType: ActionTypes.DELETE_AUTHOR,
			id: id
		});
	}
};

module.exports = AuthorActions;