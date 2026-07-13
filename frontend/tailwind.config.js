export default {
  theme: {
    extend: {
      colors: {
        brand: { 50: 'oklch(.97 .03 260)', 400: 'oklch(.67 .22 260)', 500: 'oklch(.55 .24 260)', 700: 'oklch(.37 .19 260)', 900: 'oklch(.22 .10 260)' },
        surface: { 950: 'oklch(.09 .02 260)', 900: 'oklch(.13 .03 260)', 700: 'oklch(.25 .04 260)', 600: 'oklch(.44 .04 260)', 400: 'oklch(.58 .03 260)' },
      },
      borderRadius: { sm: '.375rem', md: '.5rem', lg: '.75rem', xl: '1rem', '2xl': '1.5rem' },
      boxShadow: { sm: '0 1px 3px oklch(0 0 0 / .4)', md: '0 4px 12px oklch(0 0 0 / .35)', lg: '0 8px 28px oklch(0 0 0 / .45)' },
      spacing: { 18: '4.5rem', 22: '5.5rem' },
      fontSize: { display: '3.5rem', h1: '2.25rem', h2: '1.5rem', h3: '1.125rem', caption: '.75rem' },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
        heading: ['Syne', 'sans-serif'],
      },
    },
  },
};
