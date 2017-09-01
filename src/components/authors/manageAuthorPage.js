"use strict";

var React = require('react');
var ReactRouter = require('react-router');
var withRouter = ReactRouter.withRouter;
var browserHistory = ReactRouter.browserHistory;
var AuthorForm = require('./authorForm');
var AuthorActions = require('../../actions/authorActions');
var AuthorStore = require('../../stores/authorStore');
var toastr = require('toastr');
var Dispatcher = require('../../dispatcher/appDispatcher');
var ActionTypes = require('../../constants/actionTypes');

var ManageAuthorPage = React.createClass({
	componentDidMount: function () {
		console.log('--- ManageAuthorFormPage --- componentDidMount()');
		this.props.router.setRouteLeaveHook(this.props.route, this.routerWillLeave);
	},

	routerWillLeave: function (nextLocation) {
		console.log('--- ManageAuthorFormPage --- routerWillLeave()');
		// Return false to prevent a transition w/o prompting the user,
		// or return a string to allow the user to decide:
		if (this.state.dirty) {
			return 'Leave without saving?';
		}
		return true;
	},

	getInitialState: function () {
		console.log('--- ManageAuthorFormPage --- getInitialState()');
		return {
			author: { id: '', firstName: '', lastName: '' },
			errors: {},
			dirty: false,
			isSaving: false
		};
	},
	dispatcherToken: '',

	componentWillMount: function () {

		console.log('--- ManageAuthorFormPage --- componentWillMount()');

		var authorId = this.props.params.id; //from the path '/author:id'
		if (authorId) {
			var author = AuthorStore.getAuthorById(authorId);
			if (author)
				this.setState({ author: author });
		}
		// IGOR - try to get created confirmation from Dispatcher and redirect to the list page
		this.dispatcherToken = Dispatcher.register(function (action) {

			switch (action.actionType) {
				case ActionTypes.UPDATE_AUTHOR:
				case ActionTypes.CREATE_AUTHOR:
					console.log('!!! ManageAuthorFormPage --- GOT FROM Dispatcher - > ' + action.actionType);
					this.setState({ dirty: false, isSaving: false }, function () {
						console.log('--- ManageAuthorFormPage --- NAVIGATE TO /authors');
						toastr.remove();
						toastr.success('Author saved.');
						browserHistory.push('/authors');
					});
					break;
				default:
				// no op
			}
		}.bind(this));
		console.log('--- ManageAuthorFormPage --- dispatcherToken: ' + this.dispatcherToken);

	},

	//Clean up when this component is unmounted
	componentWillUnmount: function () {
		console.log('--- ManageAuthorFormPage --- componentWillUnmount() -- Dispatcher.unregister ' + this.dispatcherToken);
		Dispatcher.unregister(this.dispatcherToken);
	},

	setAuthorState: function (event) {
		console.log('--- ManageAuthorFormPage --- setAuthorState() ---' + event.target.name + ' -- ' + event.target.value);
		// copy state since it's immutable
		var author = Object.assign({}, this.state.author);
		author[event.target.name] = event.target.value;
		this.setState({ author: author, dirty: true });
	},

	authorFormIsValid: function () {
		var formIsValid = true;
		var errors = {}; //clear any previous errors.

		if (this.state.author.firstName.length < 3) {
			errors.firstName = 'First name must be at least 3 characters.';
			formIsValid = false;
		}

		if (this.state.author.lastName.length < 3) {
			errors.lastName = 'Last name must be at least 3 characters.';
			formIsValid = false;
		}

		this.setState({ errors: errors });
		return formIsValid;
	},

	saveAuthor: function (event) {
		event.preventDefault();

		console.log('--- ManageAuthorFormPage --- saveAuthor() (1)');

		if (!this.authorFormIsValid()) {
			return;
		}

		this.setState({ isSaving: true });

		if (this.state.author.id) {
			AuthorActions.updateAuthor(this.state.author);
		} else {
			AuthorActions.createAuthor(this.state.author);
		}

		console.log('--- ManageAuthorFormPage --- saveAuthor() (2) after AuthorActions.xxxAuthor');

		toastr.info('Saving Author...');
		// IGOR - commented
		// this.setState({ dirty: false }, function () {
		// 	console.log('--- ManageAuthorFormPage --- saveAuthor() (3) before toastr');
		// 	toastr.success('Author saved.');
		// 	browserHistory.push('/authors');
		// });
	},

	render: function () {
		return (
			<AuthorForm
				isSaving={this.state.isSaving}
				author={this.state.author}
				onChange={this.setAuthorState}
				onSave={this.saveAuthor}
				errors={this.state.errors} />
		);
	}
});

// Using withRouter higher order component to wrap ManageAuthorPage
// to notify the user when attempting to navigate away when the form is dirty.
module.exports = withRouter(ManageAuthorPage);