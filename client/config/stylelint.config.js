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
    /*
     * Stylelint misparses concatenated BEM `&` selectors: for a nested rule
     * inside `&__edit_button`, it resolves `&` to the bare `__edit_button`
     * fragment and parses it as a type selector, then falsely reports it as
     * a qualifying type. Allow class qualifiers so these rules stay valid.
     */
    'selector-no-qualifying-type': [true, { ignore: ['class'] }],
    'plugin/rational-order': [
      true,
      {
        'border-in-box-model': false,
        'empty-line-between-groups': false,
      },
    ],
  },
};

