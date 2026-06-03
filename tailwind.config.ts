import preset from './src/assets/styles/tailwind-preset'
import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        "./src/components/**/*.{js,vue,ts}",
        "./src/layouts/**/*.vue",
        "./src/pages/**/*.vue",
        "./src/plugins/**/*.{js,ts}",
        "./src/app.vue",
        "./src/error.vue",
        // monorepo - TODO: migrate this to its own package
        "../../packages/**/*.{js,vue,ts}",
    ],
    presets: [preset]
};

export default config;
