/** @type {import('tailwindcss').Config} */
module.exports = {
  // Update this to include the paths to all of your component files.
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}", // Include all component files
    "./hooks/**/*.{js,jsx,ts,tsx}",
    "./services/**/*.{js,jsx,ts,tsx}",
    "./constants/**/*.{js,jsx,ts,tsx}",
],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f7fc',
          100: '#cceefa',
          200: '#99ddf5',
          300: '#66cbef',
          400: '#33baea',
          500: '#0a7ea4', // Main primary color
          600: '#086583',
          700: '#064c62',
          800: '#043241',
          900: '#021921',
        },
        secondary: {
          50: '#f5f7fa',
          100: '#ebeef5',
          200: '#d8deeb',
          300: '#c4cee0',
          400: '#b1bed6',
          500: '#9daecb',
          600: '#8a9ec1',
          700: '#768eb6',
          800: '#637eac',
          900: '#506ea1',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        }
      },
      borderRadius: {
        '2xl': '16px',
      },
      spacing: {
        '128': '32rem',
      },
    },
  },
  plugins: [],
}

