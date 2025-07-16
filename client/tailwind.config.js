module.exports = {
    theme: {
      extend: {
        animation: {
        glow: 'glowMove 6s linear infinite',
      },
       keyframes: {
        glowMove: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
        colors: {
          primary: 'var(--primary-color)',
          secondary: 'var(--secondary-color)',
          thirdly: 'var( --thirdly-color)',
        },
      },
    },
    
  }