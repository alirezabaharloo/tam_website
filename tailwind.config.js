/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Vazirmatn', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        'vazir': ['Vazirmatn', 'sans-serif'],
      },
      spacing: {
        'px': '1px',
        '0': '0',
        '0.5': '2px',    // 0.125rem
        '1': '4px',      // 0.25rem
        '1.5': '6px',    // 0.375rem
        '2': '8px',      // 0.5rem
        '3': '12px',     // 0.75rem
        '4': '16px',     // 1rem
        '5': '20px',     // 1.25rem
        '6': '24px',     // 1.5rem
        '8': '32px',     // 2rem
        '10': '40px',    // 2.5rem
        '12': '48px',    // 3rem
        '16': '64px',    // 4rem
        '20': '80px',    // 5rem
        '24': '96px',    // 6rem
        '28': '112px',   // 7rem
        '32': '128px',   // 8rem
        '36': '144px',   // 9rem
        '40': '160px',   // 10rem
        '44': '176px',   // 11rem
        '48': '192px',   // 12rem
      },
      colors: {
        primary: {
          DEFAULT: '#980B1C',
          '100': '#890A19',
          '200': '#7A0916',
          '300': '#6A0814',
          '400': '#5B0711',
          '500': '#4C060E',
          '600': '#3D040B',
          '700': '#2E0308',
          '800': '#1E0206',
          '900': '#0F0103',
          'tint-100': '#A22333',
          'tint-200': '#AD3C49',
          'tint-300': '#B75460',
          'tint-400': '#C16D77',
          'tint-500': '#CC858E',
          'tint-600': '#D69DA4',
          'tint-700': '#E0B6BB',
          'tint-800': '#EACED2',
          'tint-900': '#F5E7E8',
        },
        secondary: {
          DEFAULT: '#011638',
          '100': '#011432',
          '200': '#01122D',
          '300': '#010F27',
          '400': '#010D22',
          '500': '#010B1C',
          '600': '#000916',
          '700': '#000711',
          '800': '#00040B',
          '900': '#000206',
          'tint-100': '#1A2D4C',
          'tint-200': '#344560',
          'tint-300': '#4D5C74',
          'tint-400': '#677388',
          'tint-500': '#808B9C',
          'tint-600': '#99A2AF',
          'tint-700': '#B3B9C3',
          'tint-800': '#CCD0D7',
          'tint-900': '#E6E8EB',
        },
        tertiary: {
          DEFAULT: '#DDFF03',
          '100': '#C7E603',
          '200': '#B1CC02',
          '300': '#9BB302',
          '400': '#859902',
          '500': '#6F8002',
          '600': '#586601',
          '700': '#424C01',
          '800': '#2C3301',
          '900': '#161900',
          'tint-100': '#E0FF1C',
          'tint-200': '#E4FF35',
          'tint-300': '#E7FF4F',
          'tint-400': '#EBFF68',
          'tint-500': '#EEFF81',
          'tint-600': '#F1FF9A',
          'tint-700': '#F5FFB3',
          'tint-800': '#F8FFCD',
          'tint-900': '#FCFFE6',
        },
        quaternary: {
          DEFAULT: '#DD2C2C',
          '100': '#C72828',
          '200': '#B12323',
          '300': '#9B1F1F',
          '400': '#851A1A',
          '500': '#6F1616',
          '600': '#581212',
          '700': '#420D0D',
          '800': '#2C0909',
          '900': '#160404',
          'tint-100': '#E04141',
          'tint-200': '#E45656',
          'tint-300': '#E76B6B',
          'tint-400': '#EB8080',
          'tint-500': '#EE9696',
          'tint-600': '#F1ABAB',
          'tint-700': '#F5C0C0',
          'tint-800': '#F8D5D5',
          'tint-900': '#FCEAEA',
        },
        quinary: {
          DEFAULT: '#BCE7FD',
          '100': '#A9D0E4',
          '200': '#96B9CA',
          '300': '#84A2B1',
          '400': '#718B98',
          '500': '#5E747F',
          '600': '#4B5C65',
          '700': '#38454C',
          '800': '#262E33',
          '900': '#131719',
          'tint-100': '#C3E9FD',
          'tint-200': '#C9ECFD',
          'tint-300': '#D0EEFE',
          'tint-400': '#D7F1FE',
          'tint-500': '#DEF3FE',
          'tint-600': '#E4F5FE',
          'tint-700': '#EBF8FE',
          'tint-800': '#F2FAFF',
          'tint-900': '#F8FDFF',
        },
      },
    },
  },
  plugins: [],
} 