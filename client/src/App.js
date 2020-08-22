import React from 'react';

import { Dashboard } from 'overdrive-dashboard';
import 'overdrive-dashboard/dist/index.css'

/* Modules */
import fooModule from './modules/foo';
import testModule from './modules/test';

const modules = [
	new fooModule(),
	new testModule()
];

export default class App extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Dashboard
				modules={modules}
			/>
		);
	}
}
