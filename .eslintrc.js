module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'next/core-web-vitals',
  ],
  'rules': {
    indent: [
      'error',
      2,
      { ignoredNodes: ['TemplateLiteral'] }
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    semi: [
      'error',
      'always'
    ],
    quotes: [
      'error',
      'single'
    ]
  }
};
