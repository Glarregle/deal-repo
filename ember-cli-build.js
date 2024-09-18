'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const postcss = require('postcss');

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    // Add options here
    postcssOptions: {
      compile: {
        plugins: [
          require('postcss-import'),
          require('tailwindcss'),
          require('autoprefixer'),
        ],
      },
    },
  });

  return app.toTree();
};
