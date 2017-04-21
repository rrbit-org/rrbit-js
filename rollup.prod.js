import resolve from 'rollup-plugin-node-resolve'
import cleanup from 'rollup-plugin-cleanup'
import babel from 'rollup-plugin-babel';

export default  {
	entry: 'src/index.js',
	plugins: [

		resolve({
			module: true,
			main: false
		}),
		babel(),
		cleanup()
	],
	format: 'cjs',
	dest: 'lib/rrbit.js'
}