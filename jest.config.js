const { createJestConfig } = require("@craco/craco");

module.exports = {
  // Use Create React App's Jest configuration as base
  ...createJestConfig({
    jest: {
      configure: {
        // Handle ES modules properly
        extensionsToTreatAsEsm: [".ts", ".tsx"],

        // Transform ES modules from node_modules
        transformIgnorePatterns: [
          "node_modules/(?!(axios|@testing-library|react-chessboard)/)",
        ],

        // Module name mapping for better imports
        moduleNameMapper: {
          "^src/(.*)$": "<rootDir>/src/$1",
          "^@/(.*)$": "<rootDir>/src/$1",
          // Handle axios ES module imports
          "^axios$": "<rootDir>/node_modules/axios/dist/node/axios.cjs",
        },

        // Setup files
        setupFilesAfterEnv: [
          "<rootDir>/src/setupTests.ts",
          "<rootDir>/src/test-utils/globalSetup.ts",
        ],

        // Test environment
        testEnvironment: "jsdom",

        // Global setup for browser APIs
        setupFiles: ["<rootDir>/src/test-utils/jestSetup.ts"],

        // Timeout for async tests
        testTimeout: 10000,

        // Clear mocks between tests
        clearMocks: true,
        restoreMocks: true,

        // Use separate TypeScript config for tests
        globals: {
          "ts-jest": {
            tsconfig: "tsconfig.test.json",
          },
        },

        // Coverage settings
        collectCoverageFrom: [
          "src/**/*.{ts,tsx}",
          "!src/**/*.d.ts",
          "!src/test-utils/**",
          "!src/setupTests.ts",
        ],
      },
    },
  }),
};
