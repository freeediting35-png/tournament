/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        screens: {
            xs: '320px',
            sm: '375px',
            md: '390px',
            lg: '414px',
            xl: '768px',
            '2xl': '1024px',
            '3xl': '1280px',
            '4xl': '1440px',
        },
        extend: {
            colors: {
                primary: '#FF4500',
                'primary-dark': '#CC3700',
                secondary: '#FFD700',
                accent: '#00E5FF',
                'bg-dark': '#0A0A0F',
                'bg-card': '#12121A',
                'bg-surface': '#1A1A2E',
                'text-primary': '#FFFFFF',
                'text-secondary': '#A0A0B0',
                success: '#00C853',
                warning: '#FFD600',
                danger: '#FF1744',
            },
            fontFamily: {
                display: ['Rajdhani', 'sans-serif'],
                body: ['Nunito', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
                accent: ['Bebas Neue', 'cursive'],
            },
            backgroundImage: {
                'gradient-hero': 'linear-gradient(135deg, #FF4500 0%, #FF8C00 50%, #FFD700 100%)',
                'gradient-card': 'linear-gradient(145deg, #1A1A2E, #12121A)',
                'gradient-glow': 'radial-gradient(ellipse at center, rgba(255,69,0,0.15) 0%, transparent 70%)',
            },
            animation: {
                'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
                'float': 'float 3s ease-in-out infinite',
                'fire': 'fire 0.5s ease-in-out infinite alternate',
                'slide-up': 'slideUp 0.3s ease-out',
                'fade-in': 'fadeIn 0.3s ease-out',
                'count-up': 'countUp 0.5s ease-out',
                'scroll-left': 'scrollLeft 30s linear infinite',
            },
            keyframes: {
                pulseGlow: {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(255,69,0,0.4)' },
                    '50%': { boxShadow: '0 0 40px rgba(255,69,0,0.8), 0 0 80px rgba(255,69,0,0.3)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                fire: {
                    '0%': { transform: 'scale(1) rotate(-2deg)' },
                    '100%': { transform: 'scale(1.05) rotate(2deg)' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                scrollLeft: {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-50%)' },
                },
            },
        },
    },
    plugins: [],
}
