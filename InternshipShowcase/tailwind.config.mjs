/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				primary: "#FF0029",
				secondary: "",
				tertiary: "",
				quaternary: "",
				quinary: "",
				"black-100": "#100D25",
				"black-200": "#090325",
				"white-100": "#F3F3F3",
			},
			boxShadow: {
				card_dark: "0px 35px 120px -15px #211e35",
				card_lightPink: "0px 35px 120px -15px #BD6778",
			},
			screens: {
				xs: "450px",
			},
		},
	},
	plugins: [],
}
