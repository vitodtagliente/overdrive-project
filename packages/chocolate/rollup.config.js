import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import pkg from './package.json';
import compiler from 'rollup-plugin-closure-compiler';

export default [
	// browser-friendly UMD build
	{
		input: 'src/main.js',
		output: {
			name: 'chocolate',
			file: pkg.release,
			format: 'es'
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
			name: 'chocolate',
			file: pkg.final,
			format: 'es'
		},
		plugins: [
			resolve(), // so Rollup can find `ms`
			commonjs(), // so Rollup can convert `ms` to an ES module
			compiler()
		]
	}
];
