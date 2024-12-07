module.exports = {
    collectCoverage: true,
    coverageDirectory: 'coverage',
    testEnvironment: 'jsdom', // Ensure this is explicitly set
    transform: {
        "^.+\\.tsx?$": "babel-jest",
    },
    transformIgnorePatterns: ["/node_modules/(?!axios)/"],
    moduleNameMapper: {
        "\\.(css|scss)$": "identity-obj-proxy",
    },
};