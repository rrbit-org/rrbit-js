import buble from 'rollup-plugin-buble';
import resolve from 'rollup-plugin-node-resolve'
import cleanup from 'rollup-plugin-cleanup'

export default  {
	entry: 'src/index.js',
	plugins: [

		resolve({
			module: true,
			main: false
		}),

		buble({
			objectAssign: 'Object.assign',
			transforms:{
				// dangerousForOf: true
				forOf: false
			}
		}),
		cleanup()
	],
	format: 'cjs',
	dest: 'lib/index.cjs.js'
}