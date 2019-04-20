module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "amd": true,
        "node": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:import/errors",
        "plugin:import/warnings"
    ],
    "plugins": [
        "import"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaVersion": 2016,
        "sourceType": "module"
    },
    "ecmaFeatures": {
        "classes": true
    },
    "rules": {
        "semi": ["error", "always"],
        "quotes": ["error", "single"],
        "indent": ["error", 4],
        "no-console": "off",
        "import/first": "error",
        "import/no-duplicates": "error",
        "import/no-named-default": "error",
        "import/no-webpack-loader-syntax": "error",
        "import/no-unresolved": [2, {commonjs: true, amd: true}],
        "import/named": 2,
        "import/namespace": 2,
        "import/default": 2,
        "import/export": 2
    },
    "settings": {
        "import/resolver": {
            "node": {
            }
        }
    }
};