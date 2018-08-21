module.exports = {
    root: true,
    parserOptions: {
      sourceType: 'module'
    },
    // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
    extends: 'standard',
    parser: "babel-eslint",
    // required to lint *.vue files
    plugins: [
      'html'
    ],
    // add your custom rules here
    'rules': {
      "no-eval": 0,
      // allow paren-less arrow functions
      'arrow-parens': 0,
      // allow debugger during development
      'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
      "eqeqeq": 0,//必须使用全等
      "no-multi-spaces":0,
      "indent":0,
      "comma-dangle": [2, "only-multiline"],            //定义数组或对象最后多余的逗号
      "no-unused-expressions": [2, { "allowShortCircuit": true, "allowTernary": true, "allowTaggedTemplates": true }]
    }
  }
  