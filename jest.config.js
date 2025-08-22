// Jest configuration for debugging
module.exports = {
  testEnvironment: "jsdom",
  maxWorkers: 1,
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/src/__mocks__/fileTransformer.js",
  },
  moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json"],
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}",
    "<rootDir>/src/**/?(*.)(spec|test).{js,jsx,ts,tsx}",
  ],
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/test-utils/**",
    "!src/setupTests.ts",
  ],
  clearMocks: true,
  restoreMocks: true,
  testTimeout: 10000,
};
