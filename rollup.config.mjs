// rollup.config.mjs

const rollupConfig = [{
		input: 'src/RuleToAction.js',
		output: [
			{
				file: 'dist/RuleToAction.js',
				format: 'cjs'
			}
		]
}];

export default rollupConfig;