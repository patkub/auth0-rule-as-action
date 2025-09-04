const globals = require("globals");
const js = require("@eslint/js");

module.exports = [
    js.configs.recommended,
    {
        languageOptions: {
            globals: {
                ...globals.node,
                "configuration": "writable",
                "UnauthorizedError": "writable"
            }
        }
    },
    {
        ignores: [
            "dist/"
        ]
    }
];
