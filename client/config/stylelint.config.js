module.exports = {
  plugins: ['stylelint-order', 'stylelint-config-rational-order/plugin'],
  extends: [
    'stylelint-config-sass-guidelines',
    'stylelint-config-rational-order',
  ],
  rules: {
    'color-hex-length': 'long',
    'max-nesting-depth': 3,
    'selector-max-id': 2,
    'shorthand-property-no-redundant-values': null,
    'order/properties-order': [],
    'order/properties-alphabetical-order': null,
    'plugin/rational-order': [
      true,
      {
        'border-in-box-model': false,
        'empty-line-between-groups': false,
      },
    ],
  },
};
