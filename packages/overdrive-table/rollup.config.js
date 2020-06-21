import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import pkg from './package.json';
const { uglify } = require('rollup-plugin-uglify');

export default [
	// browser-friendly UMD build
	{
		input: 'src/main.js',
		output: {
			name: 'overdrive-table',
			file: pkg.release,
			format: 'umd'
		},
		plugins: [
			resolve(), // so Rollup can find `ms`
			commonjs() // so Rollup can convert `ms` to an ES module
		]
	},
	// minified
	{
		input: 'src/main.js',
		output: {
			name: 'overdrive-table',
			file: pkg.final,
			format: 'umd'
		},
		plugins: [
			resolve(), // so Rollup can find `ms`
			commonjs(), // so Rollup can convert `ms` to an ES module
			uglify() // uglify the built js
		]
	}
];
