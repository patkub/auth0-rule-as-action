// rollup.config.mjs

const rollupConfig = [{
		input: 'src/RuleToAction.js',
		output: [
			{
				file: 'dist/RuleToAction.js',
				format: 'es'
			}
		]
}];

export default rollupConfig;