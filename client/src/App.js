import React, { Fragment } from 'react';

import Authentication from './services/authentication';
import moduleLoader from './services/moduleLoader';

import { Dashboard } from 'overdrive-dashboard';
import 'overdrive-dashboard/dist/index.css'

import Router from './components/Router';
import Home from './components/Home';
import Login from './components/Login';

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			authentication: new Authentication()
		}
	}

	get auth() {
		return this.state.authentication;
	}

	render() {
		return (
			<Fragment>
				{
					this.auth.isAuthenticated() &&
					<Dashboard
						modules={moduleLoader()}
					/>
				}
				{
					!this.auth.isAuthenticated() &&
					<Router>
						<Router.Route url="/login">
							<Login />
						</Router.Route>
						<Router.Route url="/">
							<Home />
						</Router.Route>
					</Router>
				}
			</Fragment>
		);
	}
}
