    export default {
  testEnvironment: "jsdom",
  transform: {},
  extensionsToTreatAsEsm: [".js", ".jsx"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
};
