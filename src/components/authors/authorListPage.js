"use strict";

var React = require('react');
var Router = require('react-router');
var Link = require('react-router').Link;
var AuthorStore = require('../../stores/authorStore');
var AuthorActions = require('../../actions/authorActions');
var AuthorList = require('./authorList');

var AuthorListPage = React.createClass({
	
	getInitialState: function() {
		console.log('--- AuthorListPage --- getInitialState()');
		return {
			authors: AuthorStore.getAllAuthors()
		};
	},

	componentWillMount: function() {
		console.log('--- AuthorListPage --- componentWillMount() --- AuthorStore.addChangeListener(this._onChange)');
		AuthorStore.addChangeListener(this._onChange);
	},

	//Clean up when this component is unmounted
	componentWillUnmount: function() {
		console.log('--- AuthorListPage --- componentWillUnmount()');
		AuthorStore.removeChangeListener(this._onChange);
	},

	_onChange: function() {
		console.log('--- AuthorListPage --- _onChange() ');
		this.setState({ authors: AuthorStore.getAllAuthors() });
	},

	render: function() {
		return (
			<div>
				<h1>Authors</h1>
				<Link to="author" className="btn btn-default">Add Author</Link>
				<AuthorList authors={this.state.authors} />
			</div>
		);
	}
});

module.exports = AuthorListPage;