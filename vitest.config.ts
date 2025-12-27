import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		environment: "node",
		globals: true,
		clearMocks: true,
		sequence: { concurrent: false },
		setupFiles: ["./vitest.setup.ts"],
		coverage: {
			provider: "v8", // or 'istanbul'
		},
	},
	resolve: {
		alias: {
			"@": resolve(__dirname, "src"),
		},
	},
});
