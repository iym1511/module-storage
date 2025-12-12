/// <reference types="vitest" />

export default {
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "./vitest.setup.ts",
        css: false,
    },
} as any;
