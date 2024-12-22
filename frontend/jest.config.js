module.exports = {
  collectCoverage: true,
  coverageDirectory: "coverage",
  testEnvironment: "jsdom",
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest',  // Use Babel for JS and TS files
  },
  transformIgnorePatterns: [
    '/node_modules/(?!axios)/',  // Don't ignore axios in node_modules
  ],
};