import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import globals from "globals";

export default [
  eslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        configuration: "writable",
        UnauthorizedError: "writable",
      },
    },
  },
  {
    ignores: ["dist/"],
  },
  eslintConfigPrettier,
];

// export default [
//   configs.recommended,
//   {
//     languageOptions: {
//       globals: {
//         ...node,
//         configuration: "writable",
//         UnauthorizedError: "writable",
//       },
//     },
//   },
//   {
//     ignores: ["dist/"],
//   },
//   eslintConfigPrettier,
// ];
