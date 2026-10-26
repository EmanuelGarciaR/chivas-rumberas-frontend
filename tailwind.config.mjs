/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        amarillo: 'var(--color-amarillo)',
        rojo: 'var(--color-rojo)',
        crema: {
          claro: 'var(--color-crema-claro)',
          calido: 'var(--color-crema-calido)',
        },
        blanco: 'var(--color-blanco)',
        negro: {
          profundo: 'var(--color-negro-profundo)',
          DEFAULT: 'var(--color-negro)',
        },
        gris: {
          oscuro: 'var(--color-gris-oscuro)',
          medio: 'var(--color-gris-medio)',
          claro: 'var(--color-gris-claro)',
        },
        primary: 'var(--bg-primary)',
        secondary: 'var(--bg-secondary)',
        card: 'var(--bg-card)',
        'dark-panel': 'var(--bg-dark-panel)',
        'txt-primary': 'var(--text-primary)',
        'txt-secondary': 'var(--text-secondary)',
        borde: 'var(--border-color)',
      },
      fontFamily: {
        primary: ['var(--font-space-grotesk)', 'sans-serif'],
        secondary: ['var(--font-libre-baskerville)', 'serif'],
      },
      fontSize: {
        xs: 'var(--font-size-xs, 0.75rem)',
        sm: 'var(--font-size-sm)',
        base: 'var(--font-size-base)',
        md: 'var(--font-size-md)',
        lg: 'var(--font-size-lg)',
        '2xl': 'var(--font-size-2xl, 3rem)',
      },
    },
  },
  plugins: [],
}

export default config
