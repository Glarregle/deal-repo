'use strict';

module.exports = {
  useTabs: true,
  tabWidth: 2,
  overrides: [
    {
      files: '*.{js,ts}',
      options: {
        singleQuote: true,
      },
    },
  ],
};
