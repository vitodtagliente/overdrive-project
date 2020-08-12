import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Dashboard, Module } from 'overdrive-dashboard';
//import 'overdrive-dashboard/dist/index.css'
//import Dashboard from './components/Dashboard';

import './components/Dashboard.css';
import './components/Sidebar.css';

import TestModule from './modules/test';

export default function App(props) {
	return (
		<Dashboard
			modules={[
				new TestModule(),
				new Module()
			]}
		/>
	);
}
