import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Dashboard } from 'overdrive-dashboard';
import 'overdrive-dashboard/dist/index.css'

import TestModule from './modules/test';
import FooModule from './modules/foo';

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.modules = [
			new TestModule('/test'),
			new FooModule('/foo')
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
