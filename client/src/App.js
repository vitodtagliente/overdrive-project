import React, { Fragment } from 'react';

import Authentication from './services/authentication';
import moduleLoader from './services/moduleLoader';

import { Dashboard } from 'overdrive-dashboard';
import 'overdrive-dashboard/dist/index.css'

import Web from './web/Web';

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
					<Web />
				}
			</Fragment>
		);
	}
}
