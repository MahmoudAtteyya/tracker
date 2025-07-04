import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: '#FFFFFF',
				foreground: '#4A4A4A',
				primary: {
					DEFAULT: '#C7CEEA',
					foreground: '#fff',
				},
				secondary: {
					DEFAULT: '#C7CEEA',
					foreground: '#fff',
				},
				accent: {
					DEFAULT: '#C7CEEA',
					foreground: '#fff',
				},
				card: {
					DEFAULT: '#fff',
					foreground: '#4A4A4A',
				},
				muted: {
					DEFAULT: '#E0E0E0',
					foreground: '#4A4A4A',
				},
				success: {
					DEFAULT: '#28C76F',
					foreground: '#fff',
				},
				error: {
					DEFAULT: '#EA5455',
					foreground: '#fff',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				lavender: {
					50: '#F5F6FA',
					100: '#C7CEEA',
					200: '#FFFFFF',
					300: '#E0E0E0',
					400: '#9D6BCE',
					500: '#A393EB',
				},
				'dark-background': '#1E1E2F',
				'dark-card': '#2A2B3C',
				'dark-foreground': '#F1F1F1',
				'gradient-purple': '#3C2A4D',
				'shadow-soft': 'rgba(0,0,0,0.2)',
			},
			fontFamily: {
				'cairo': ['Cairo', 'sans-serif'],
				'poppins': ['Poppins', 'sans-serif'],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'pulse-glow': {
					'0%, 100%': {
						boxShadow: '0 0 5px rgba(148, 103, 255, 0.5)'
					},
					'50%': {
						boxShadow: '0 0 20px rgba(148, 103, 255, 0.8)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
