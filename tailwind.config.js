/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.hbs',
    './app/**/*.js',
    './app/**/*.ts',
    './public/index.html',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities(
        {
          '.text-shadow': {
            'text-shadow': '1px 1px 2px rgba(0, 0, 0, 0.7)', // Customize shadow as needed
          },
        },
        ['responsive', 'hover'],
      );
    },
  ],
};
