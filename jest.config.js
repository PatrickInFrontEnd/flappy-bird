const path = require("path");

module.exports = {
    clearMocks: true,
    coverageDirectory: path.resolve(__dirname, "src/coverage/"),

    coveragePathIgnorePatterns: ["\\\\node_modules\\\\"],

    coverageProvider: "babel",

    coverageReporters: ["json", "text"],

    collectCoverage: true,
    collectCoverageFrom: ["src/JS/**/*.js"],

    rootDir: path.resolve(__dirname),

    testEnvironment: "node",

    testMatch: ["**/?(*.)+(spec|test).[tj]s?(x)"],
};
