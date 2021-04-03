module.exports = {
	root: true,
	parserOptions: { 
		ecmaVersion: 6,
		sourceType: 'module'
	},
	env: {
		es6: true,
		browser: true
	},
    extends: [
		'eslint:recommended'
	],
	parser: "babel-eslint",
	rules: {}
}
