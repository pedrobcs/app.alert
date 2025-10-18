import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: '#9945FF',
          dark: '#7533E0',
        },
        secondary: {
          DEFAULT: '#14F195',
          dark: '#0FC87F',
        },
      },
    },
  },
  plugins: [],
}
export default config
