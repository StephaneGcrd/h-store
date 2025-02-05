import formsPlugin from '@tailwindcss/forms';
import typographyPlugin from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 48s linear infinite',
      },
      fontFamily: {
        avenir: ['Albert Sans', 'serif'],
        garamond: 'adobe-garamond-pro',
      },
      height: {
        128: '32rem',
        144: '36rem',
        160: '40rem',
      },
      width: {
        128: '32rem',
        144: '36rem',
      },
      colors: {
        comptoir: {
          blue: '#269ABE',
          bluedarker: '#007fa3',
          lightblue: '#d3e9f0',
          disabled: '#93bac1',
          cream: '#fff6e9',
        },
      },
    },
  },
  plugins: [formsPlugin, typographyPlugin],
};
