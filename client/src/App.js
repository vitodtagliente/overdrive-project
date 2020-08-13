import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Dashboard, Module } from 'overdrive-dashboard';
//import 'overdrive-dashboard/dist/index.css'
//import Dashboard from './components/Dashboard';

import './components/Dashboard.css';
import './components/Sidebar.css';

import TestModule from './modules/test';

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.modules = [
			new TestModule('/test'),
			new Module('/ttt')
		];
	}

	render() {
		return (
			<Dashboard
				modules={this.modules}
			/>
		);
	}
}
