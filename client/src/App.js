import React, { Fragment } from 'react';

import Authentication from './services/authentication';
import moduleLoader from './services/moduleLoader';

import { Dashboard } from 'overdrive-dashboard';
import 'overdrive-dashboard/dist/index.css'

import Route from './components/Route';
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
					<Fragment>
						<Route url="/login">
							<Login />
						</Route>
					</Fragment>
				}
			</Fragment>
		);
	}
}
