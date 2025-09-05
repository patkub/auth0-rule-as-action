// rollup.config.mjs

const rollupConfig = [
  {
    input: "src/RuleToAction.mjs",
    output: [
      {
        file: "dist/RuleToAction.js",
        format: "cjs",
      },
    ],
  },
];

export default rollupConfig;
