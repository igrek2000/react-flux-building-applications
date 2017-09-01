"use strict";

var Dispatcher = require('../dispatcher/appDispatcher');
var ActionTypes = require('../constants/actionTypes');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var _ = require('lodash');
var CHANGE_EVENT = 'change';

var _authors = [];

var AuthorStore = assign({}, EventEmitter.prototype, {
	addChangeListener: function(callback) {
		console.log('@@@ AuthorStore.addChangeListener()');
		this.on(CHANGE_EVENT, callback);
	},

	removeChangeListener: function(callback) {
		console.log('@@@ AuthorStore.removeChangeListener()');
		this.removeListener(CHANGE_EVENT, callback);
	},

	emitChange: function() {
		console.log('@@@ AuthorStore.emitChange()');
		this.emit(CHANGE_EVENT);
	},

	getAllAuthors: function() {
		console.log('@@@ AuthorStore.getAllAuthors()');
		return _authors;
	},

	getAuthorById: function(id) {
		console.log('@@@ AuthorStore.getAuthorById() -->' + id);
		return _.find(_authors, {id: id});
	}
});

Dispatcher.register(function(action) {
	switch(action.actionType) {
		case ActionTypes.INITIALIZE:
			console.log('### Store Dispatcher - ActionTypes.INITIALIZE');
			_authors = action.initialData.authors;
			AuthorStore.emitChange();
			break;
		case ActionTypes.CREATE_AUTHOR:
			console.log('### Store Dispatcher - ActionTypes.CREATE_AUTHOR');
			_authors.push(action.author);
			AuthorStore.emitChange();
			break;
		case ActionTypes.UPDATE_AUTHOR:
			var existingAuthor = _.find(_authors, {id: action.author.id});
			var existingAuthorIndex = _.indexOf(_authors, existingAuthor); 
			_authors.splice(existingAuthorIndex, 1, action.author);
			AuthorStore.emitChange();
			break;	
		case ActionTypes.DELETE_AUTHOR:
			_.remove(_authors, function(author) {
				return action.id === author.id;
			});
			AuthorStore.emitChange();
			break;
		default:
			// no op
	}
});

module.exports = AuthorStore;